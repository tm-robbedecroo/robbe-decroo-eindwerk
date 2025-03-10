import { auth } from "@/../auth";
import { getUpcomingEventsNeedingVote } from "@/db/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Vote } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function EmployeeEventsPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    const events = await getUpcomingEventsNeedingVote(session.user.id);

    if (events.length === 0) {
        return (
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>No Pending Events</CardTitle>
                        <CardDescription>
                            You have voted on all available events. Check back later for new events.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Upcoming events you have voted on</h1>
            <div className="grid gap-6">
                {events.map((event) => {
                    const isVotingOpen = new Date() >= new Date(event.openVotingDate);
                    
                    return (
                        <Card key={event.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{event.name}</CardTitle>
                                        <CardDescription className="mt-2">
                                            {event.description}
                                        </CardDescription>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            <span>Event Date: {new Date(event.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center mt-1">
                                            <Clock className="h-4 w-4 mr-2" />
                                            {isVotingOpen ? (
                                                <span>Voting closes: {new Date(event.closeVotingDate).toLocaleDateString()}</span>
                                            ) : (
                                                <span>Voting opens: {new Date(event.openVotingDate).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-end">
                                    {isVotingOpen ? (
                                        <Button asChild>
                                            <Link href={`/employee/vote/${event.id}`}>
                                                Vote Now
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button variant="outline" disabled>
                                            Voting Not Yet Open
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
} 