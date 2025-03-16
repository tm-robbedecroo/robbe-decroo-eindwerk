'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Activity {
    id: string;
    name: string;
    description: string | null;
    voteCount: number;
}

interface SelectWinnerDialogProps {
    activities: Activity[];
    totalVotes: number;
    participationRate: number;
    onSelectWinner: (activityId: string) => Promise<void>;
}

export function SelectWinnerDialog({ activities, totalVotes, participationRate, onSelectWinner }: SelectWinnerDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<string>(() => {
        // Find activity with highest vote count
        const maxVotes = Math.max(...activities.map(a => a.voteCount));
        const defaultActivity = activities.find(a => a.voteCount === maxVotes);
        return defaultActivity?.id || '';
    });

    const handleSubmit = async () => {
        if (!selectedActivity) return;
        await onSelectWinner(selectedActivity);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Select Winner</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Select Winning Activity</DialogTitle>
                    <DialogDescription>
                        {participationRate.toFixed(1)}% of members have voted. Choose the winning activity from the options below.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <RadioGroup value={selectedActivity} onValueChange={setSelectedActivity} className="space-y-4">
                        {activities.map((activity) => (
                            <div key={activity.id} className="space-y-2 border rounded-lg p-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={activity.id} id={activity.id} />
                                    <Label htmlFor={activity.id}>{activity.name}</Label>
                                </div>
                                {activity.description && (
                                    <p className="text-sm text-muted-foreground pl-6">{activity.description}</p>
                                )}
                                <div className="pl-6 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Votes: {activity.voteCount} of {totalVotes}</span>
                                        <span>{totalVotes ? Math.round((activity.voteCount / totalVotes) * 100) : 0}%</span>
                                    </div>
                                    <Progress value={totalVotes ? (activity.voteCount / totalVotes) * 100 : 0} />
                                </div>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>Confirm Selection</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 