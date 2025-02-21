import AppSidebar from "@/components/page-blocks/sidebar";
import { auth } from "@/../auth";
import { getAuthUser } from "@/db/actions";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const session = await auth();
    const user = await getAuthUser(session?.user?.email as string);

    if(!user) redirect("/login");

    return (
        <SidebarProvider>
            <AppSidebar user={user}/>
            <div className="flex flex-col w-full h-screen mt-4 ms-4">
              {children}
            </div>
        </SidebarProvider>
    );
  }