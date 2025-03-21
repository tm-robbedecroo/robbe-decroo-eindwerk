import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventWithActivities, getEventVoteStatistics, getEventParticipation, selectEventWinner } from "@/db/actions";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SelectWinnerDialog } from "./select-winner-dialog";
import { revalidatePath } from "next/cache";

interface PageProps {
    params: Promise<{ eventId: string }>;
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
    votedActivityId?: string;
    votedActivityName?: string;
}

export default async function EventOverviewPage({ params }: PageProps) {
    const { eventId } = await params;

    try {
        const event = await getEventWithActivities(eventId);
        const voteStats = await getEventVoteStatistics(eventId) as ActivityWithVotes[];
        const participation = await getEventParticipation(eventId) as ParticipationMember[];

        const totalVotes = voteStats.reduce((sum: number, activity: ActivityWithVotes) => sum + activity.voteCount, 0);
        const participationRate = (participation.filter(p => p.hasVoted).length / participation.length) * 100;

        const handleWinnerSelection = async (activityId: string) => {
            'use server';
            await selectEventWinner(eventId, activityId);
            revalidatePath(`/events/${eventId}/overview`);
        };

        return (
            <div className="container mx-auto py-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">{event.name} Overview</h1>
                    {!event.selectedActivityId && (
                        <SelectWinnerDialog
                            activities={voteStats}
                            totalVotes={totalVotes}
                            participationRate={participationRate}
                            onSelectWinner={handleWinnerSelection}
                        />
                    )}
                </div>

                <div className="grid grid-cols-[1fr,300px] gap-6">
                    {/* Main Content */}
                    <div className="space-y-8">
                        {/* Event Details */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Event Details</h2>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Event Date</p>
                                        <p className="text-sm">
                                            {new Date(event.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Voting Opens</p>
                                        <p className="text-sm">
                                            {new Date(event.openVotingDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Voting Closes</p>
                                        <p className="text-sm">
                                            {new Date(event.closeVotingDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Description</p>
                                <p className="text-sm">{event.description}</p>
                            </div>
                        </div>

                        {/* Vote Distribution */}
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Vote Distribution</h2>
                                <p className="text-sm text-muted-foreground">
                                    {Math.round(participationRate)}% of members have voted
                                </p>
                            </div>
                            <div className="space-y-4">
                                {voteStats.map((activity) => (
                                    <div key={activity.id} className="space-y-2">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium">
                                                {activity.name}
                                                {event.selectedActivityId === activity.id && (
                                                    <Badge variant="success" className="ml-2">Winner</Badge>
                                                )}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {activity.voteCount} votes ({totalVotes ? Math.round((activity.voteCount / totalVotes) * 100) : 0}%)
                                            </span>
                                        </div>
                                        <Progress value={totalVotes ? (activity.voteCount / totalVotes) * 100 : 0} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Member List Sidebar */}
                    <div className="border rounded-lg p-6 h-fit">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold">Members</h2>
                            <p className="text-sm text-muted-foreground">
                                {participation.filter(p => p.hasVoted).length} of {participation.length} voted
                            </p>
                        </div>
                        <div className="space-y-2">
                            {participation.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>
                                                {member.firstName[0]}{member.lastName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {member.firstName} {member.lastName}
                                            </p>
                                            {member.hasVoted && member.votedActivityName && (
                                                <p className="text-xs text-muted-foreground">
                                                    Voted for: {member.votedActivityName}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {member.hasVoted ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-red-500" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
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