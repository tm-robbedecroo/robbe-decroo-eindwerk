import { auth } from "@/../auth";
import { getAuthUser } from "@/db/actions";
import { redirect } from "next/navigation";

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