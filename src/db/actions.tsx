"use server";
import { db } from "./client";
import { companies, users, events, activities } from "./schema";
import { eq } from "drizzle-orm";
import { employees } from "./schema/employee";
import { revalidateTag } from "next/cache";

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