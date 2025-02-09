import Link from "next/link";

import { UserRound, Users } from "lucide-react"
import { Button } from "../ui/button";

export default function Navigation() {
    return (
        <>
            <header className="px-4 lg:px-6 h-14 flex items-center">
                <Link className="flex items-center justify-center" href="#">
                    <Users className="h-6 w-6 mr-2" />
                    <span className="font-bold">TeamSync</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-sm font-medium hover:underline underline-offset-4 my-auto" href="#">Features</Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4 my-auto" href="#">Pricing</Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4 my-auto" href="#">About</Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4 my-auto" href="#">Contact</Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4 my-auto" href="login"><Button><UserRound className="inline h-3"/>Login</Button></Link>
                </nav>
            </header>
        </>
    );
}