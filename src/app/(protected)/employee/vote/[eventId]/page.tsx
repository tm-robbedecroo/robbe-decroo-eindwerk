import { db } from "@/db/client";
import { events, activities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PageProps {
    params: { eventId: string };
}

export default async function VotePage({ params }: PageProps) {
    // Fetch event details
    const [event] = await db.select().from(events).where(eq(events.id, params.eventId));
    
    if (!event) {
        notFound();
    }

    // Fetch activities for this event
    const eventActivities = await db.select()
        .from(activities)
        .where(eq(activities.eventId, params.eventId));

    const handleVoteSubmission = async (formData: FormData) => {
        'use server';
        // TODO: Implement vote submission
        console.log('Selected activity:', formData.get('activity'));
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
                <h2 className="text-xl font-semibold">Select Your Preferred Activity</h2>
                <form action={handleVoteSubmission}>
                    <RadioGroup name="activity" className="space-y-4">
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
                        <Button type="submit">Submit Vote</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
