import { Link, useLocation } from "@tanstack/react-router";
import { Activity, AlertCircle, BarChart3, Zap } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">
              Ubie Sentry
            </span>
            <span className="text-xs text-muted-foreground">
              Error Monitoring
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-0">
        <SidebarMenu className="gap-1 px-2">
          <div className="mb-2">
            <p className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Dashboard
            </p>
          </div>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/")}
              className={`rounded-lg transition-colors ${
                isActive("/")
                  ? "bg-red-500/10 text-red-600 hover:bg-red-500/15"
                  : "hover:bg-accent"
              }`}
            >
              <Link to="/" className="flex items-center gap-3 px-2 py-2.5">
                <Activity className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium">Overview</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <div className="my-3 border-t border-border" />

          <div className="mb-2">
            <p className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Testing
            </p>
          </div>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/error-trigger")}
              className={`rounded-lg transition-colors ${
                isActive("/error-trigger")
                  ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/15"
                  : "hover:bg-accent"
              }`}
            >
              <Link
                to="/error-trigger"
                className="flex items-center gap-3 px-2 py-2.5"
              >
                <Zap className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium">Trigger Events</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  Dev
                </Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <div className="flex flex-col gap-3 px-2 py-4">
          <div className="rounded-lg bg-accent/50 p-3">
            <p className="text-xs font-semibold text-foreground mb-1">
              SDK Status
            </p>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                Connected
              </p>
              <p className="text-xs text-muted-foreground">v1.0.0</p>
            </div>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
