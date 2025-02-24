import { auth } from "@/../auth";
import { getAuthUser } from "@/db/actions";

export default async function CompanySettingsPage() {

    const session = await auth();
    const user = await getAuthUser(session?.user?.email as string);

    return (<h1>PROFILE SETTINGS</h1>)
}
