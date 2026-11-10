import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  PenLine,
  Newspaper,
  Building2,
  BrainCircuit,
  CalendarDays,
  Workflow,
  Settings,
  Cpu,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/studio", label: "Content Studio", icon: PenLine },
  { to: "/research", label: "Research Hub", icon: Newspaper },
  { to: "/competitors", label: "Competitor Intelligence", icon: Building2 },
  { to: "/memory", label: "ACE Memory", icon: BrainCircuit },
  { to: "/calendar", label: "Content Calendar", icon: CalendarDays },
  { to: "/automation", label: "Automation", icon: Workflow },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b py-4">
        <div className="flex items-center gap-2.5 px-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Cpu className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight">ACE</span>
            <span className="text-[11px] text-muted-foreground">Autonomous Content Engine</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => {
                const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                      <Link to={item.to} className="flex items-center gap-2.5">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Channels</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 space-y-1.5 group-data-[collapsible=icon]:hidden">
              <div className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs">
                <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> LinkedIn</span>
                <span className="text-[10px] text-muted-foreground">Active</span>
              </div>
              <div className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" /> X / Twitter</span>
                <span className="text-[10px]">Soon</span>
              </div>
              <div className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" /> Newsletter</span>
                <span className="text-[10px]">Soon</span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            FF
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-xs font-medium">Resolutions Infotech</span>
            <span className="text-[10px] text-muted-foreground">Founder plan</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
