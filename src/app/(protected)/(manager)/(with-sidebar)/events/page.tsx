import { auth } from "@/../auth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEvent, getEventsForCompany, getUserCompany } from "@/db/actions";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { redirect } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

// Add noStore to prevent caching
import { unstable_noStore as noStore } from 'next/cache';

export default async function EventsPage() {
    // Prevent caching
    noStore();

    const session = await auth();
    const user = session?.user;
    const company = await getUserCompany(user?.id as string);
    
    if(!company) redirect('/create-company');

    const events = await getEventsForCompany(company.id);

    const handleCreateEvent = async (formData: FormData) => {
        'use server';
        const result = await createEvent(formData, company.id);
        if (!result.success) {
            console.error('Failed to create event:', result.error);
        }
    };

    return (
        <div className="container mx-auto py-10">
            <Dialog>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a new event</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" action={handleCreateEvent}>
                        <div className="space-y-2">
                            <Label htmlFor="name">Event name</Label>
                            <Input id="name" name="name" placeholder="Team Building Event" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea 
                                id="description" 
                                name="description" 
                                placeholder="Describe your event..." 
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
                            <Label htmlFor="date">Event Date</Label>
                            <Input 
                                id="date" 
                                name="date" 
                                type="datetime-local" 
                                required 
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <DialogClose asChild>
                                <Button variant="outline" type="button">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild><Button type="submit">Create Event</Button></DialogClose>
                        </div>
                    </form>
                </DialogContent>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Events</h1>
                    <DialogTrigger asChild>
                        <Button variant="default">Add Event</Button>
                    </DialogTrigger>
                </div>
            </Dialog>

            {/* Display events */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events?.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4 shadow-sm">
                        <h3 className="font-semibold">{event.name}</h3>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <div className="mt-2 text-sm">
                            <p>Voting: {new Date(event.openVotingDate).toLocaleDateString()} - {new Date(event.closeVotingDate).toLocaleDateString()}</p>
                            <p>Event Date: {new Date(event.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}