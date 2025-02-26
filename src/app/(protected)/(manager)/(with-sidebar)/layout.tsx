import AppSidebar from "@/components/page-blocks/sidebar";
import { auth } from "@/../auth";
import { getAuthUser, getUserCompany } from "@/db/actions";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CustomUser } from "@/../auth.config";
export default async function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const session = await auth();
    const company = await getUserCompany(session?.user?.id as string);

    if(!session?.user) redirect("/login");
    if(!company) redirect("/create-company");

    return (
        <SidebarProvider>
            <AppSidebar user={session.user as CustomUser}/>
            <div className="flex flex-col w-full h-screen mt-4 ms-4">
              {children}
            </div>
        </SidebarProvider>
    );
  }