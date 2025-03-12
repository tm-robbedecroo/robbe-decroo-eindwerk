import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventWithActivities, getEventVoteStatistics, getEventParticipation } from "@/db/actions";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PageProps {
    params: {
        eventId: string;
    };
}

interface ActivityWithVotes {
    id: string;
    name: string;
    description: string | null;
    voteCount: number;
}

interface ParticipationMember {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    hasVoted: boolean;
    voteDate?: Date;
}

export default async function EventOverviewPage({ params }: PageProps) {

    const { eventId } = params;

    try {
        const event = await getEventWithActivities(eventId);
        const voteStats = await getEventVoteStatistics(eventId) as ActivityWithVotes[];
        const participation = await getEventParticipation(eventId) as ParticipationMember[];

        const totalVotes = voteStats.reduce((sum: number, activity: ActivityWithVotes) => sum + activity.voteCount, 0);
        const participationRate = (participation.filter(p => p.hasVoted).length / participation.length) * 100;

        return (
            <div className="container mx-auto py-10">
                <h1 className="text-2xl font-bold mb-6">{event.name} Overview</h1>
                
                {/* Event Details */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Event Details</CardTitle>
                        <CardDescription>{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div>
                                <p className="text-sm font-medium">Event Date</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(event.date).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Voting Period</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(event.openVotingDate).toLocaleDateString()} - {new Date(event.closeVotingDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Vote Distribution */}
                <h2 className="text-xl font-semibold mb-4">Vote Distribution</h2>
                <Card className="mb-8">
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {voteStats.map((activity) => (
                                <div key={activity.id}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium">{activity.name}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {activity.voteCount} votes ({totalVotes ? Math.round((activity.voteCount / totalVotes) * 100) : 0}%)
                                        </span>
                                    </div>
                                    <Progress value={totalVotes ? (activity.voteCount / totalVotes) * 100 : 0} />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Participation Overview */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Member Participation</h2>
                    <Badge variant={participationRate === 100 ? "success" : "default"}>
                        {Math.round(participationRate)}% Voted
                    </Badge>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {participation.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>
                                                {member.firstName[0]}{member.lastName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">
                                                {member.firstName} {member.lastName}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {member.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {member.hasVoted ? (
                                            <>
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                <span className="text-sm text-muted-foreground">
                                                    Voted {member.voteDate && new Date(member.voteDate).toLocaleDateString()}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="h-5 w-5 text-red-500" />
                                                <span className="text-sm text-muted-foreground">Not voted yet</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    } catch (error) {
        console.log(error);
        return (
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>
                            Unable to load event overview. The event might not exist or you might not have permission to view it.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }
} 