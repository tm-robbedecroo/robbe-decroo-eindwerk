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
        <>
            {children}
        </>
    );
  }