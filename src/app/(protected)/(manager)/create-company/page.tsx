import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createCompany, getAuthUser } from "@/db/actions";
import { auth } from "@/../auth";

export default function CreateCompanyPage() {

    const handleCreate = async (formData: FormData) => {
        "use server";
        const session = await auth();
        const user = await getAuthUser(session?.user?.email as string);
        createCompany(formData, user?.id as string);
    }

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 md:p-8">
                    <h1 className="text-2xl font-bold mb-6">Set up your company</h1>
                    <form className="space-y-4" action={handleCreate}>
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" placeholder="Enter your name" />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" placeholder="Enter a description" />
                        </div>
                        <div>
                            <Label htmlFor="image">Image</Label>
                            <Input id="image" name="image" type="file" accept="image/*" />
                        </div>
                        <div>
                            <Label htmlFor="banner_image">Banner Image</Label>
                            <Input id="banner_image" name="banner_image" type="file" accept="image/*" />
                        </div>
                        <Button type="submit" className="w-full">
                            Set up your company
                        </Button>
                    </form>
                </div>

                <div className="hidden md:flex items-center justify-center bg-gray-100 p-8">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="400"
                        height="400"
                        viewBox="0 0 400 400"
                        className="w-full h-auto max-w-md"
                    >
                        <rect width="400" height="400" fill="#f3f4f6" />
                        <rect x="50" y="50" width="300" height="200" rx="10" fill="#e5e7eb" />
                        <rect x="70" y="70" width="260" height="160" rx="5" fill="#d1d5db" />
                        <circle cx="200" cy="300" r="50" fill="#9ca3af" />
                        <rect x="170" y="270" width="60" height="80" rx="30" fill="#9ca3af" />
                        <path d="M100 170 L140 130 L180 170 L220 130 L260 170" stroke="#4b5563" strokeWidth="4" fill="none" />
                        <circle cx="200" cy="270" r="10" fill="#4b5563" />
                    </svg>
                </div>
            </div>
            </main>
    );
}