import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { unstable_noStore as noStore, revalidateTag } from 'next/cache';
import { db } from "@/db/client";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createActivity, deleteActivity } from "@/db/actions";
import { activities } from "@/db/schema/activity";

interface PageProps {
    params: Promise<{ eventId: string }>;
}

export default async function EventPage({ params }: PageProps) {
    noStore();
    
    // Await the params
    const { eventId } = await params;

    // Fetch the event details
    const [event] = await db.select().from(events).where(eq(events.id, eventId));
    
    if (!event) {
        notFound();
    }

    // Fetch activities for this event
    const eventActivities = await db.select().from(activities).where(eq(activities.eventId, eventId));

    // Format dates for datetime-local input
    const formatDateForInput = (date: Date) => {
        return new Date(date).toISOString().slice(0, 16);
    };

    const handleUpdateEvent = async (formData: FormData) => {
        'use server';
        try {
            const updateData = {
                name: formData.get("name") as string,
                description: formData.get("description") as string,
                openVotingDate: new Date(formData.get("openVotingDate") as string),
                closeVotingDate: new Date(formData.get("closeVotingDate") as string),
                date: new Date(formData.get("date") as string),
                updated_at: new Date()
            };

            await db.update(events)
                .set(updateData)
                .where(eq(events.id, eventId));
            
            // Revalidate the events data
            revalidateTag("events");
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const handleDeleteActivity = async (activityId: string) => {
        'use server';
        await deleteActivity(activityId);
        revalidateTag("activities");
    };

    return (
        <div className="container mx-auto py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Event Form */}
                <div>
                    <div className="flex items-center mb-6">
                        <h1 className="text-2xl font-bold">Edit Event</h1>
                    </div>
                    <form action={handleUpdateEvent} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Event name</Label>
                            <Input 
                                id="name" 
                                name="name" 
                                defaultValue={event.name}
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea 
                                id="description" 
                                name="description" 
                                defaultValue={event.description}
                                required 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="openVotingDate">Open Voting Date</Label>
                                <Input 
                                    id="openVotingDate" 
                                    name="openVotingDate" 
                                    type="datetime-local"
                                    defaultValue={formatDateForInput(event.openVotingDate)}
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="closeVotingDate">Close Voting Date</Label>
                                <Input 
                                    id="closeVotingDate" 
                                    name="closeVotingDate" 
                                    type="datetime-local"
                                    defaultValue={formatDateForInput(event.closeVotingDate)}
                                    required 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Event Date</Label>
                            <Input 
                                id="date" 
                                name="date" 
                                type="datetime-local"
                                defaultValue={formatDateForInput(event.date)}
                                required 
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Link href="/events">
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Right Column - Activities */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Activities</h2>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="default">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Activity
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Activity</DialogTitle>
                                </DialogHeader>
                                <form className="space-y-4" action={async (formData: FormData) => {
                                    'use server';
                                    await createActivity(formData, eventId);
                                    revalidateTag("activities");
                                }}>
                                    <div className="space-y-2">
                                        <Label htmlFor="activityName">Activity Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Enter activity name"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="activityDescription">Description</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            placeholder="Enter activity description"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                                        <Button type="submit">Create Activity</Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="space-y-4">
                        {eventActivities.map((activity) => (
                            <div key={activity.id} className="border rounded-lg p-4 shadow-sm">
                                <h3 className="font-semibold">{activity.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                <div className="flex justify-end mt-4 gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Delete Activity</DialogTitle>
                                                <DialogDescription>
                                                    Are you sure you want to delete "{activity.name}"? This action cannot be undone.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex justify-end gap-2">
                                                <DialogClose asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </DialogClose>
                                                <form action={async () => {
                                                    'use server';
                                                    await handleDeleteActivity(activity.id);
                                                }}>
                                                    <Button variant="destructive" type="submit">
                                                        Delete Activity
                                                    </Button>
                                                </form>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        ))}
                        {eventActivities.length === 0 && (
                            <div className="text-center text-gray-500 py-8">
                                No activities yet. Click "Add Activity" to create one.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
