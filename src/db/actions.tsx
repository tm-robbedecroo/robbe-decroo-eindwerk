"use server";
import { db } from "./client";
import { companies, users, events, activities, votes } from "./schema";
import { eq, lte, gt } from "drizzle-orm";
import { employees } from "./schema/employee";
import { revalidateTag } from "next/cache";
import { and } from "drizzle-orm";

// USERS
export async function registerManager(formData: FormData) {
    try {
        const firstName = formData.get("name")?.toString().split(" ")[0];
        const lastName = formData.get("name")?.toString().split(" ")[1];

        const userInput = {
            email: formData.get("email") as string,
            firstName: firstName as string,
            lastName: lastName as string,
            password: formData.get("password") as string,
            role: "MANAGER" as string,
            updated_at: new Date()
        };
        await db.insert(users).values(userInput);
    } catch (error) {
        console.log(error);
    }
}

export async function registerEmployee(formData: FormData, companyId: string) {
    try {
        const firstName = formData.get("firstname");
        const lastName = formData.get("lastname");

        const userInput = {
            email: formData.get("email") as string,
            firstName: firstName as string,
            lastName: lastName as string,
            password: formData.get("password") as string,
            role: "EMPLOYEE" as string,
            updated_at: new Date()
        };
        const [user] = await db.insert(users).values(userInput).returning({id: users.id});
        await db.insert(employees).values({ userId: user.id, companyId });
        
    } catch (error) {
        console.log(error);
    }
}

export async function updateEmployee(formData: FormData, employeeId: string) {
    try {
        const userInput = {
            email: formData.get("email") as string,
            firstName: formData.get("firstname") as string,
            lastName: formData.get("lastname") as string,
        }
        await db.update(users).set({email: userInput.email, firstName: userInput.firstName, lastName: userInput.lastName}).where(eq(users.id, employeeId));
        revalidateTag("users");
    } catch (error) {
        console.log(error);
    }
}

export async function removeEmployee(employeeId: string) {
    try {
        await db.delete(employees).where(eq(employees.userId, employeeId));
        revalidateTag("employees");
    } catch (error) {
        console.log(error);
    }
}

export async function listEmployeesForCompany(companyId: string) {
    try {
        const employeesList = await db.select().from(employees).where(eq(employees.companyId, companyId));
        
        const members = await Promise.all(
            employeesList.map(async (employee) => {
                const [user] = await db.select().from(users).where(eq(users.id, employee.userId as string)); 
                return user;
            })
        );
        

        return members;
    } catch (error) {
        console.log(error);
    }
}

export async function getAuthUser(email: string) {
    try {
        const user = await db.select().from(users).where(eq(users.email, email));
        return user[0];
    } catch (error) {
        console.log(error);
    }
}

export async function updateUserProfile(formData: FormData, userId: string) {
    try {
        const firstName = formData.get("firstName");
        const lastName = formData.get("lastName");

        if (!firstName || !lastName) throw new Error("Required fields are missing");

        await db.update(users)
            .set({
                firstName: firstName as string,
                lastName: lastName as string,
                updated_at: new Date()
            })
            .where(eq(users.id, userId));

        revalidateTag("users");
    } catch (error) {
        console.log(error);
    }
}

// COMPANIES
export async function createCompany(formData: FormData, userId: string) {
    try {
        const companyInput = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            owner: userId as string,
            updated_at: new Date()
        };

        await db.insert(companies).values(companyInput);
        revalidateTag("companies");
    } catch (error) {
        console.log(error);
    }
}

export async function getUserCompany(userId: string) {
    try {
        const company = await db.select().from(companies).where(eq(companies.owner, userId));
        return company[0];
    } catch (error) {
        console.log(error);
    }
}

export async function updateCompanyProfile(formData: FormData, companyId: string) {
    try {
        const name = formData.get("name");
        if (!name) throw new Error("Company name is required");
        
        type CompanyUpdateData = {
            name: string;
            description?: string;
            imageUrl?: string;
            bannerImageUrl?: string;
            updated_at: Date;
        };

        const updateData: CompanyUpdateData = {
            name: name as string,
            updated_at: new Date()
        };

        // Only add optional fields if they exist in the form data
        const description = formData.get("description");
        if (description) updateData.description = description as string;
        

        const imageUrl = formData.get("imageUrl");
        if (imageUrl) updateData.imageUrl = imageUrl as string;
        

        const bannerImageUrl = formData.get("bannerImageUrl");
        if (bannerImageUrl) updateData.bannerImageUrl = bannerImageUrl as string;
        
        await db.update(companies)
            .set(updateData)
            .where(eq(companies.id, companyId));

        revalidateTag("companies");
    } catch (error) {
        console.log(error);
    }
}

// EVENTS
export async function createEvent(formData: FormData, companyId: string) {
    try {
        const eventInput = {
            companyId,
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            openVotingDate: new Date(formData.get("openVotingDate") as string),
            closeVotingDate: new Date(formData.get("closeVotingDate") as string),
            date: new Date(formData.get("date") as string),
            updated_at: new Date()
        };

        await db.insert(events).values(eventInput);
        revalidateTag("events");
        return { success: true };
    } catch (error) {
        console.error("Error creating event:", error);
        return { success: false, error };
    }
}

export async function getEventsForCompany(companyId: string) {
    try {
        return await db.select().from(events).where(eq(events.companyId, companyId));
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
}

export async function removeEvent(eventId: string) {
    try {
        await db.delete(events).where(eq(events.id, eventId));
        revalidateTag("events");
    } catch (error) {
        console.log(error);
    }
}

export async function getOpenForVotingEvents(userId: string) {
    try {
        const now = new Date();

        // First get the user's company
        const [employee] = await db.select()
            .from(employees)
            .where(eq(employees.userId, userId));

        if (!employee?.companyId) {
            throw new Error("Employee not found or has no company");
        }

        // Get all currently open events for the company
        const openEvents = await db.select()
            .from(events)
            .where(
                and(
                    eq(events.companyId, employee.companyId),
                    lte(events.openVotingDate, now),
                    gt(events.closeVotingDate, now)
                )
            );

        // Get all votes by this user
        const userVotes = await db.select()
            .from(votes)
            .where(eq(votes.userId, userId));

        // Filter out events the user has already voted on
        const eventsNeedingVote = openEvents.filter(event => 
            !userVotes.some(vote => vote.eventId === event.id)
        );

        // Sort events by closing date (soonest first)
        return eventsNeedingVote.sort((a, b) => 
            new Date(a.closeVotingDate).getTime() - new Date(b.closeVotingDate).getTime()
        );
    } catch (error) {
        console.error("Error fetching open voting events:", error);
        return [];
    }
}

// activities
export async function createActivity(formData: FormData, eventId: string) {
    try {
        const activityInput = {
            eventId: eventId as string,
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            imageUrl: 'url',
            price: '100',
            updated_at: new Date()
        };

        await db.insert(activities).values(activityInput);
    } catch (error) {
        console.log(error);
    }
}

export async function deleteActivity(activityId: string) {
    'use server';
    try {
        await db.delete(activities).where(eq(activities.id, activityId));
        revalidateTag("activities");
        return { success: true };
    } catch (error) {
        console.error("Error deleting activity:", error);
        return { success: false, error };
    }
}

/* VOTES */
export async function getUserVoteForEvent(eventId: string, userId: string) {
    try {
        const [vote] = await db.select()
            .from(votes)
            .where(
                and(
                    eq(votes.eventId, eventId),
                    eq(votes.userId, userId)
                )
            );
        return vote;
    } catch (error) {
        console.error("Error fetching user vote:", error);
        return null;
    }
}

export async function submitVote(eventId: string, activityId: string, userId: string) {
    try {
        const now = new Date();
        
        // Check if voting is still open
        const [event] = await db.select()
            .from(events)
            .where(eq(events.id, eventId));
            
        if (!event) {
            throw new Error("Event not found");
        }
        
        if (new Date(event.closeVotingDate) < now) {
            throw new Error("Voting is closed for this event");
        }
        
        if (new Date(event.openVotingDate) > now) {
            throw new Error("Voting has not started for this event");
        }
        
        // Check if user has already voted
        const existingVote = await db.select()
            .from(votes)
            .where(
                and(
                    eq(votes.eventId, eventId),
                    eq(votes.userId, userId)
                )
            );
            
        if (existingVote.length > 0) {
            // Update existing vote
            await db.update(votes)
                .set({
                    activityId,
                    updated_at: now
                })
                .where(
                    and(
                        eq(votes.eventId, eventId),
                        eq(votes.userId, userId)
                    )
                );
        } else {
            // Submit new vote
            await db.insert(votes).values({
                eventId,
                userId,
                activityId,
                updated_at: now
            });
        }
        
        return { success: true };
    } catch (error) {
        console.error("Error submitting vote:", error);
        throw error;
    }
}

export async function getUpcomingEventsNeedingVote(userId: string) {
    try {
        // First get the user's company
        const [employee] = await db.select()
            .from(employees)
            .where(eq(employees.userId, userId));

        if (!employee?.companyId) {
            throw new Error("Employee not found or has no company");
        }

        const now = new Date();

        // Get all events for the company that are either:
        // - Currently open for voting
        // - Will be open for voting in the future
        const upcomingEvents = await db.select()
            .from(events)
            .where(
                and(
                    eq(events.companyId, employee.companyId),
                    gt(events.closeVotingDate, now)
                )
            );

        // Get all votes by this user
        const userVotes = await db.select()
            .from(votes)
            .where(eq(votes.userId, userId));

        // Filter out events the user has already voted on
        const eventsNeedingVote = upcomingEvents.filter(event => 
            userVotes.some(vote => vote.eventId === event.id)
        );

        // Sort events by openVotingDate
        return eventsNeedingVote.sort((a, b) => 
            new Date(a.openVotingDate).getTime() - new Date(b.openVotingDate).getTime()
        );
    } catch (error) {
        console.error("Error fetching upcoming events:", error);
        return [];
    }
}

export async function getUpcomingEventsForCompany(companyId: string) {
    try {
        const now = new Date();
        return await db.select()
            .from(events)
            .where(
                and(
                    eq(events.companyId, companyId),
                    gt(events.date, now)
                )
            )
            .orderBy(events.date);
    } catch (error) {
        console.error("Error fetching upcoming events:", error);
        return [];
    }
}

export async function getEventWithActivities(eventId: string) {
    try {
        const [event] = await db.select()
            .from(events)
            .where(eq(events.id, eventId));

        if (!event) {
            throw new Error("Event not found");
        }

        const eventActivities = await db.select()
            .from(activities)
            .where(eq(activities.eventId, eventId));

        return { ...event, activities: eventActivities };
    } catch (error) {
        console.error("Error fetching event details:", error);
        throw error;
    }
}

export async function getEventVoteStatistics(eventId: string) {
    try {
        // Get all votes for this event
        const eventVotes = await db.select()
            .from(votes)
            .where(eq(votes.eventId, eventId));

        // Get all activities for this event
        const eventActivities = await db.select()
            .from(activities)
            .where(eq(activities.eventId, eventId));

        // Calculate votes per activity
        const votesByActivity = eventActivities.map(activity => ({
            ...activity,
            voteCount: eventVotes.filter(vote => vote.activityId === activity.id).length
        }));

        // Sort by vote count descending
        return votesByActivity.sort((a, b) => b.voteCount - a.voteCount);
    } catch (error) {
        console.error("Error fetching vote statistics:", error);
        throw error;
    }
}

export async function getEventParticipation(eventId: string) {
    try {
        // First get the event to get the company ID
        const [event] = await db.select()
            .from(events)
            .where(eq(events.id, eventId));

        if (!event) {
            throw new Error("Event not found");
        }

        // Get all employees for this company
        const companyEmployees = await db.select()
            .from(employees)
            .where(eq(employees.companyId, event.companyId));

        // Get all votes for this event
        const eventVotes = await db.select()
            .from(votes)
            .where(eq(votes.eventId, eventId));

        // Get user details for all employees
        const employeeParticipation = await Promise.all(
            companyEmployees.map(async (employee) => {
                const [user] = await db.select()
                    .from(users)
                    .where(eq(users.id, employee.userId as string));

                const hasVoted = eventVotes.some(vote => vote.userId === employee.userId);
                const vote = hasVoted ? eventVotes.find(v => v.userId === employee.userId) : null;

                return {
                    ...user,
                    hasVoted,
                    voteDate: vote?.created_at,
                };
            })
        );

        // Sort by those who haven't voted first, then by name
        return employeeParticipation.sort((a, b) => {
            if (a.hasVoted === b.hasVoted) {
                return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
            }
            return a.hasVoted ? 1 : -1;
        });
    } catch (error) {
        console.error("Error fetching participation data:", error);
        throw error;
    }
}

