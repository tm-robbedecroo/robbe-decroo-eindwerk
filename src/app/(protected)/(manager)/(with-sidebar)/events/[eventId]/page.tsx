import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { unstable_noStore as noStore, revalidateTag } from 'next/cache';
import { db } from "@/db/client";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto">
                <div className="flex">
                    <h1 className="text-2xl font-bold mb-6 inline">Edit Event</h1>
                    <Dialog>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Activity</DialogTitle>
                            </DialogHeader>
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="activityName">Activity Name</Label>
                                    <Input
                                        id="activityName"
                                        name="activityName"
                                        placeholder="Enter activity name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="activityDescription">Description</Label>
                                    <Textarea
                                        id="activityDescription"
                                        name="activityDescription"
                                        placeholder="Enter activity description"
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
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="closeVotingDate">Close Voting Date</Label>
                                        <Input
                                            id="closeVotingDate"
                                            name="closeVotingDate"
                                            type="datetime-local"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="activityDate">Activity Date & Time</Label>
                                    <Input
                                        id="activityDate"
                                        name="activityDate"
                                        type="datetime-local"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                                    <Button type="submit">Create Activity</Button>
                                </div>
                            </form>
                        </DialogContent>
                        <DialogTrigger asChild><Button variant="default" className="ms-4"><Plus />Add activity</Button></DialogTrigger>
                    </Dialog>
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
        </div>
    );
}
