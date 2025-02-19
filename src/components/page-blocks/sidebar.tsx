'use client'

import * as React from 'react'
import { ChevronDown, LayoutDashboard, Calendar, Users, Settings, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

interface SidebarProps {
    user: {
        firstName: string,
        lastName: string,
        email: string,
        role: string,
        id: string,
    } | null | undefined;
};

export default function AppSidebar({ user }: SidebarProps) {
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleLogout = () => {
    signOut({
        redirectTo: '/',
    });
  }

  return (
      <>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center pt-4 ps-4">
              <span className="text-lg font-semibold">TeamSync</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleNavigation('/dashboard')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleNavigation('/events')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Events</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleNavigation('/members')}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Members</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Popover>
              <PopoverTrigger asChild className='py-8'>
                <Button variant="ghost" className="w-full justify-start">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/avatar.png" alt="User" />
                    <AvatarFallback>{user?.firstName.charAt(0)}{user?.lastName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{user?.firstName} {user?.lastName}</span>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="start">
                <div className="grid gap-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/profile-settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/company-settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Company Settings</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </SidebarFooter>
        </Sidebar>
        <SidebarTrigger />
      </>
  )
}