import AppSidebar from "@/components/page-blocks/sidebar";
import { getAuthUser } from "@/db/actions";
import { auth } from "@/../auth";

export default async function DashboardPage() {

    const session = await auth();
    const user = await getAuthUser(session?.user?.email as string);

    return (
        <AppSidebar user={user}/>
    )
}