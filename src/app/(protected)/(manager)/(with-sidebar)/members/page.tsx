import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getAuthUser, getUserCompany, listEmployeesForCompany, registerEmployee } from "@/db/actions"
import { auth } from "@/../auth"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { User } from "./columns"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default async function MembersPage() {

    const session = await auth();
    const user = session?.user;
    const company = await getUserCompany(user?.id as string);
    const members = await listEmployeesForCompany(company?.id as string);

    const handleCreateEmployee = async (formData: FormData) => {
        "use server";
        registerEmployee(formData, company?.id as string);
    }

  return (
    <>
      {/*TODO UPDATE TO MODAL*/}
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new member</DialogTitle>
          </DialogHeader>
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
              <Button type="submit">Sign Up</Button>
              <DialogClose asChild><Button variant="ghost" className="ms-2">Cancel</Button></DialogClose>
          </form>
        </DialogContent>
        <div className="container mx-auto py-10">
          <h1 className="text-2xl font-bold mb-5">Members</h1>
          <DataTable columns={columns} data={members as User[]} />
        </div>
      </Dialog>
    </>
  )
}

