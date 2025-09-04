'use client'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    ChartColumn,
    Clock4,
    Megaphone,
    Play,
    User,
    UserPlus,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navData = [
  {
    title: "General",
    items: [
      {
        title: "Admin Dashboard",
        url: "",
        icon: ChartColumn,
      },
      {
        title: "User Management",
        url: "users",
        icon: Users,
      },
    ],
  },
  {
    title: "Customer Management",
    items: [
      {
        title: "Parents",
        url: "parents",
        icon: User,
      },
      {
        title: "Players",
        url: "players",
        icon: UserPlus,
      },
    ],
  },
  {
    title: "Game Sessions",
    items: [
      {
        title: "Register Player",
        url: "register-player",
        icon: Play,
      },
      {
        title: "Active Games",
        url: "active-games",
        icon: Clock4,
      },
    ],
  },
  {
    title: "Marketing",
    items: [
      {
        title: "Marketing",
        url: "marketing",
        icon: Megaphone,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="font-bold text-xl text-blue-900">JumpHeroez</h1>
      </SidebarHeader>
      <SidebarContent>
        {navData.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => {
                  const itemPath = `/${item.url}`;
                  const isActive =
                    itemPath === "/"
                      ? pathname === itemPath
                      : pathname.startsWith(itemPath);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton isActive={isActive} asChild>
                        <Link href={itemPath}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
