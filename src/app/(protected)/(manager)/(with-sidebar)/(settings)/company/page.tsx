import { auth } from "@/../auth";
import { getUserCompany, updateCompanyProfile, getAuthUser } from "@/db/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function CompanySettingsPage() {
    const session = await auth();
    const user = await getAuthUser(session?.user?.email as string);
    
    if (!user) {
        return <div className="p-6">User not found</div>;
    }

    const company = await getUserCompany(user.id);

    if (!company) {
        return <div className="p-6">Company not found</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-8">Company Settings</h1>
            
            <form action={async (formData: FormData) => {
                "use server";
                await updateCompanyProfile(formData, company.id);
            }}>
                {/* Basic Information Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                    <div className="space-y-4 max-w-2xl">
                        <div className="space-y-2">
                            <Label htmlFor="name">Company Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={company.name}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={company.description || ""}
                                placeholder="Tell us about your company..."
                            />
                        </div>
                    </div>
                </div>

                {/* Media Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Company Media</h2>
                    <div className="space-y-4 max-w-2xl">
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Logo URL</Label>
                            <Input
                                id="imageUrl"
                                name="imageUrl"
                                type="url"
                                placeholder="https://example.com/logo.png"
                                defaultValue={company.imageUrl || ""}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bannerImageUrl">Banner Image URL</Label>
                            <Input
                                id="bannerImageUrl"
                                name="bannerImageUrl"
                                type="url"
                                placeholder="https://example.com/banner.png"
                                defaultValue={company.bannerImageUrl || ""}
                            />
                        </div>
                    </div>
                </div>

                {/* Read-only Information */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
                    <div className="space-y-4 max-w-2xl">
                        <div className="space-y-2">
                            <Label>Created At</Label>
                            <div className="p-2 bg-muted rounded-md">
                                {company.created_at ? new Date(company.created_at).toLocaleDateString() : 'N/A'}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Last Updated</Label>
                            <div className="p-2 bg-muted rounded-md">
                                {company.updated_at ? new Date(company.updated_at).toLocaleDateString() : 'N/A'}
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