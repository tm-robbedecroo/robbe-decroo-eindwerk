import { auth } from "@/../auth";
import { getAuthUser, updateUserProfile } from "@/db/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function CompanySettingsPage() {
    const session = await auth();
    const user = await getAuthUser(session?.user?.email as string);

    if (!user) {
        return <div className="p-6">User not found</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-8">Profile Settings</h1>
            
            <form action={async (formData: FormData) => {
                "use server";
                await updateUserProfile(formData, user.id);
            }}>
                {/* Editable Fields Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                    <div className="grid grid-cols-2 gap-4 max-w-2xl">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                defaultValue={user.firstName}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                defaultValue={user.lastName}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Read-only Fields Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Account Information</h2>
                    <div className="space-y-4 max-w-2xl">
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <div className="p-2 bg-muted rounded-md">
                                {user.email}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <div className="p-2 bg-muted rounded-md">
                                {user.role}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Member Since</Label>
                            <div className="p-2 bg-muted rounded-md">
                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="max-w-2xl">
                    <Button type="submit" className="w-full">
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
