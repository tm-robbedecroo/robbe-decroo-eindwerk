"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { updateEmployee } from "@/db/actions"
import { DialogTrigger } from "@radix-ui/react-dialog"

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
}

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original

      return (
        <div className="flex gap-2">
          <Dialog>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit member</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" action={async (formData: FormData) => {
                updateEmployee(formData, user.id);
              }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstname">First Name</Label>
                    <Input id="firstname" name="firstname" placeholder="John" defaultValue={user.firstName} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname">Last Name</Label>
                    <Input id="lastname" name="lastname" placeholder="Doe" defaultValue={user.lastName} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="johndoe@example.com" defaultValue={user.email} required />
                </div>
                <Button type="submit">Edit member</Button>
                <DialogClose asChild><Button variant="ghost" className="ms-2">Cancel</Button></DialogClose>
              </form>
            </DialogContent>
            <DialogTrigger asChild><Button variant="outline">Edit</Button></DialogTrigger>
          </Dialog>
          <Button variant="destructive" size="sm" onClick={() => console.log("Remove user", user.id)}>
            Remove
          </Button>
        </div>
      )
    },
  },
]

