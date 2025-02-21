import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAuthUser, getUserCompany, registerEmployee } from "@/db/actions"
import { auth } from "@/../auth"

export default async function MembersPage() {

    const session = await auth();
    const user = await getAuthUser(session?.user?.email as string);
    const company = await getUserCompany(user?.id as string);

    const handleCreateEmployee = async (formData: FormData) => {
        "use server";
        registerEmployee(formData, company?.id as string);
    }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Add an employee</CardTitle>
        <CardDescription>Add an employee</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" action={handleCreateEmployee}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstname">First Name</Label>
              <Input id="firstname" name="firstname" placeholder="John" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input id="lastname" name="lastname" placeholder="Doe" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="johndoe@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
            <Button type="submit" className="w-full">
                Sign Up
            </Button>
        </form>
      </CardContent>
    </Card>
  )
}

