import { EmployeeSidebar } from "@/components/page-blocks/sidebar";
import { auth } from "@/../auth";
import { getAuthUser } from "@/db/actions";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CustomUser } from "@/../auth.config";
export default async function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const session = await auth();

    if(!session?.user) redirect('/login');
    
    const user = await getAuthUser(session?.user?.email as string);
    if(user?.role !== "EMPLOYEE") redirect('/dashboard');

    return (
        <SidebarProvider>
            <EmployeeSidebar user={session?.user as CustomUser}/>
            <div className="flex flex-col w-full h-screen mt-4 ms-4">
              {children}
            </div>
        </SidebarProvider>
    );
  }