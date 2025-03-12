import { getUserCompany, getUpcomingEventsForCompany } from "@/db/actions";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
    const session = await auth();

    const company = await getUserCompany(session?.user?.id as string);
    if (!company) {
        redirect('/create-company');
    }

    const upcomingEvents = await getUpcomingEventsForCompany(company.id);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">{company.name}&apos;s dashboard</h1>
            
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                {upcomingEvents.length === 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>No Upcoming Events</CardTitle>
                            <CardDescription>
                                There are no upcoming events scheduled at this time.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {upcomingEvents.map((event) => (
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
                                                <span>
                                                    Voting Period: {new Date(event.openVotingDate).toLocaleDateString()} 
                                                    {" - "} 
                                                    {new Date(event.closeVotingDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-end">
                                        <Button asChild>
                                            <Link href={`/events/${event.id}/overview`}>
                                                View Overview <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}