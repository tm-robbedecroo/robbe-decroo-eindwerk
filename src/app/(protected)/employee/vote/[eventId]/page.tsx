import { db } from "@/db/client";
import { events, activities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { submitVote, getUserVoteForEvent } from "@/db/actions";
import { auth } from "@/../auth";
import { revalidatePath } from "next/cache";

interface PageProps {
    params: Promise<{ eventId: string }>;
}

export default async function VotePage({ params }: PageProps) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    // Fetch event details
    const { eventId } = await params;
    const [event] = await db.select().from(events).where(eq(events.id, eventId));
    
    if (!event) {
        notFound();
    }

    // Get user's existing vote if any
    const existingVote = await getUserVoteForEvent(eventId, session.user.id);

    // Fetch activities for this event
    const eventActivities = await db.select()
        .from(activities)
        .where(eq(activities.eventId, eventId));

    const handleVoteSubmission = async (formData: FormData) => {
        'use server';

        const activityId = formData.get('activity') as string;
        if (!activityId) {
            throw new Error("Please select an activity");
        }

        try {
            if(!session.user) return;
            await submitVote(eventId, activityId, session.user.id as string);
            revalidatePath('/employee/inbox');
        } catch (error) {
            throw new Error("Failed to submit vote");
        }
    };

    return (
        <div className="container mx-auto py-10 max-w-3xl">
            <Card className="mb-8">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">{event.name}</CardTitle>
                            <CardDescription className="mt-2">{event.description}</CardDescription>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>Event Date: {new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center mt-1">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>Voting closes: {new Date(event.closeVotingDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold">
                    {existingVote ? "Update Your Vote" : "Select Your Preferred Activity"}
                </h2>
                <form action={handleVoteSubmission}>
                    <RadioGroup 
                        name="activity" 
                        className="space-y-4" 
                        required
                        defaultValue={existingVote?.activityId}
                    >
                        {eventActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center space-x-4 rounded-lg border p-4">
                                <RadioGroupItem value={activity.id} id={activity.id} />
                                <Label htmlFor={activity.id} className="flex-1 cursor-pointer">
                                    <div className="font-medium">{activity.name}</div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        {activity.description}
                                    </div>
                                    <div className="text-sm font-medium mt-2">
                                        Price: €{activity.price}
                                    </div>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                    <div className="mt-6 flex justify-end">
                        <Button type="submit">
                            {existingVote ? "Update Vote" : "Submit Vote"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
