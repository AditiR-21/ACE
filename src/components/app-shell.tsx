import { type ReactNode, useEffect, useState } from "react";
import { Moon, Sun, Search, Bell } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AppShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null;
    const dark = saved === "dark";
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md">
            <SidebarTrigger />
            <div className="hidden md:flex items-center gap-2 rounded-lg border bg-muted/40 px-2.5 py-1.5 w-72">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search posts, drafts, research..."
                className="h-6 border-0 bg-transparent p-0 text-xs shadow-none focus-visible:ring-0"
              />
              <kbd className="ml-auto rounded border bg-background px-1.5 text-[10px] text-muted-foreground">⌘K</kbd>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6 md:p-8 max-w-[1400px] w-full mx-auto">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export function StatusDot({ status }: { status: "idle" | "running" | "completed" | "error" }) {
  const map = {
    idle: "bg-muted-foreground/40",
    running: "bg-info pulse-dot",
    completed: "bg-success",
    error: "bg-destructive",
  } as const;
  return <span className={`inline-block h-2 w-2 rounded-full ${map[status]}`} />;
}
