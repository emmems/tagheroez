import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar"
import { ChartColumn, Clock4, Megaphone, Play, User, UserPlus, Users } from "lucide-react"

// Menu items.
const navData = [
  {
    title: "General",
    items: [
      {
        title: "Admin Dashboard",
        url: "dashboard",
        icon: ChartColumn,
      },
      {
        title: "User Management",
        url: "users",
        icon: Users,
      }
    ]
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
      }
    ]
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
      }
    ]
  },
  {
    title: "Marketing",
    items: [
      {
        title: "Marketing",
        url: "marketing",
        icon: Megaphone,
      },
    ]
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h1>JumpHeroez</h1>
      </SidebarHeader>
      <SidebarContent>
        {/*<SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />*/}
        {/* We create a SidebarGroup for each parent. */}
        {navData.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {/*isActive={item.isActive}*/}
                    <SidebarMenuButton asChild >
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
