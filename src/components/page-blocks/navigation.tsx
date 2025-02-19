"use client";

import Link from 'next/link';

import { useState, useRef, useEffect } from "react";
import { Users, Menu, XIcon, UserRound, LogOut, Settings } from "lucide-react";
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { signOut } from 'next-auth/react';

interface NavbarProps {
    user: {
        firstName: string,
        lastName: string,
        email: string,
        role: string,
        id: string,
    } | null | undefined;
};

const Navbar: React.FC<NavbarProps> = ({ user }) => {

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
        setMenuOpen(prevState => !prevState);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    // Close the menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
            <Link className="flex items-center justify-center" href="#">
                <Users className="h-6 w-6 mr-2" />
                <span className="font-bold">TeamSync</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center">
                <button className="text-gray-600 focus:outline-none" onClick={toggleMenu}>
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="ml-auto flex gap-4 sm:gap-6 hidden lg:flex">
                <Link className="text-sm font-medium hover:underline underline-offset-4 my-auto" href="#">Features</Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4 my-auto" href="#">Pricing</Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4 my-auto" href="#">About</Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4 my-auto" href="#">Contact</Link>
                <UserMenu user={user} />
            </nav>

            {/* Mobile Menu */}
            <div ref={menuRef} className={`lg:hidden fixed top-0 right-0 w-full h-full bg-white shadow-md p-6 transition-transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center">
                    <span className="font-bold"><Users className="h-6 w-6 mr-2 inline" />TeamSync</span>
                    <button onClick={closeMenu} className="text-gray-600">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <nav className="flex flex-col gap-4 mt-6">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">Features</Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">Pricing</Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">About</Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">Contact</Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="login">
                        <Button><UserRound className="inline w-full"/>{user ? user.firstName : "Login"}</Button>
                    </Link>
                </nav>
            </div>
        </header>
    );
};

interface UserMenuProps {
    user: {
        firstName: string,
        lastName: string,
        email: string,
        role: string,
        id: string,
    } | null | undefined;
};

function UserMenu({ user }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
  
    if (!user) {
      return (
        <Link className="text-sm font-medium hover:underline underline-offset-4 my-auto" href="/login">
          <Button>
            <UserRound className="mr-2 h-4 w-4" />
            Login
          </Button>
        </Link>
      )
    }
  
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button>
            <UserRound className="mr-2 h-4 w-4" />
            {user.firstName}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="end" alignOffset={0} side="bottom" sideOffset={5}>
          <div className="grid gap-1">
            <Link href={'/dashboard'}>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />Dashboard
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />Account Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

export default Navbar;
