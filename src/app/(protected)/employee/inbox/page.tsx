import { getOpenForVotingEvents } from "@/db/actions"
import { db } from "@/db/client"
import { activities } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function EmployeeInboxPage() {
    const events = await getOpenForVotingEvents()

    // Fetch activities for each event
    const eventsWithActivities = await Promise.all(
        events.map(async (event) => {
            const eventActivities = await db.select()
                .from(activities)
                .where(eq(activities.eventId, event.id))
            return { ...event, activities: eventActivities }
        })
    )

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Events Open for Voting</h1>
            <div className="space-y-6">
                {eventsWithActivities.map((event) => (
                    <Card key={event.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{event.name}</CardTitle>
                                    <CardDescription>{event.description}</CardDescription>
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
                        <CardContent>
                            <div className="mt-4">
                                <h3 className="font-semibold mb-2">Activities</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {event.activities.map((activity) => (
                                        <div 
                                            key={activity.id} 
                                            className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
                                        >
                                            <h4 className="font-medium">{activity.name}</h4>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {activity.description}
                                            </p>
                                            <p className="text-sm font-medium mt-2">
                                                Price: €{activity.price}
                                            </p>
                                        </div>
                                    ))}
                                    {event.activities.length === 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            No activities added yet.
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Link href={'/employee/vote/' + event.id}><Button className="mt-2">Vote</Button></Link>
                        </CardContent>
                    </Card>
                ))}
                {eventsWithActivities.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        No events are currently open for voting.
                    </div>
                )}
            </div>
        </div>
    )
}