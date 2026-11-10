import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, StatusDot } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  CalendarCheck2,
  Newspaper,
  Building2,
  Sparkles,
  Play,
  BrainCircuit,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { stats, agents, recentActivity, upcoming } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — ACE" },
      { name: "description", content: "Your autonomous content engine. Research, strategy, and drafting agents at a glance." },
      { property: "og:title", content: "ACE — Autonomous Content Engine" },
      { property: "og:description", content: "AI operating system for LinkedIn content, tuned to your brand memory." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const statCards = [
  { label: "Drafts Ready", value: stats.draftsReady, icon: FileText, hint: "+3 today", tone: "text-primary" },
  { label: "Research Reports", value: stats.researchReports, icon: Newspaper, hint: "5 fresh signals", tone: "text-info" },
  { label: "Competitors Monitored", value: stats.competitorsMonitored, icon: Building2, hint: "Ramp +4 this week", tone: "text-warning" },
  { label: "Upcoming Posts", value: stats.upcomingPosts, icon: CalendarCheck2, hint: "Next: Mon 9AM", tone: "text-success" },
];

function Dashboard() {
  return (
    <AppShell
      title="Good morning, Alex"
      description="Here's what ACE did while you were away."
      actions={
        <>
          <Button variant="outline" size="sm"><Play className="mr-1.5 h-3.5 w-3.5" /> Run research</Button>
          <Button size="sm"><Sparkles className="mr-1.5 h-3.5 w-3.5" /> Generate content</Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 animate-fade-in">
        {statCards.map((s) => (
          <div key={s.label} className="stat-card stat-card-hover p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> {s.hint}
                </p>
              </div>
              <div className={`grid h-9 w-9 place-items-center rounded-lg bg-muted ${s.tone}`}>
                <s.icon className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Recent activity</CardTitle>
            <Button variant="ghost" size="sm" className="h-7 text-xs">View all</Button>
          </CardHeader>
          <CardContent>
            <ol className="relative border-l border-border/70 ml-2 space-y-4">
              {recentActivity.map((a) => (
                <li key={a.id} className="ml-4">
                  <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary/20 ring-4 ring-background">
                    <span className="block h-3 w-3 rounded-full bg-primary/70" />
                  </span>
                  <p className="text-sm">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 capitalize">{a.time} · {a.type}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Automation status</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {agents.map((a) => (
                <div key={a.id} className="rounded-lg border p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <StatusDot status={a.status} />
                      <p className="text-sm font-medium">{a.name}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] capitalize">{a.status}</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{a.task}</p>
                  <p className="text-[10px] text-muted-foreground">Ran {a.lastRun} · {a.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Quick actions</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <QuickLink to="/studio" icon={Sparkles} label="Generate content" />
              <QuickLink to="/research" icon={Newspaper} label="Run research" />
              <QuickLink to="/studio" icon={FileText} label="Open drafts" />
              <QuickLink to="/memory" icon={BrainCircuit} label="Open memory" />
              <QuickLink to="/competitors" icon={Building2} label="View competitors" />
              <QuickLink to="/calendar" icon={CalendarCheck2} label="Open calendar" />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Upcoming publishing</CardTitle>
          <Link to="/calendar" className="text-xs text-primary flex items-center gap-1 hover:underline">
            Open calendar <ArrowUpRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {upcoming.map((u) => (
              <div key={u.title} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-4">
                  <div className="w-28 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">{u.date}</p>
                    <p>{u.time}</p>
                  </div>
                  <p className="text-sm">{u.title}</p>
                </div>
                <Badge variant={u.status === "scheduled" ? "default" : "outline"} className="capitalize">{u.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

function QuickLink({ to, icon: Icon, label }: { to: string; icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors hover:border-primary/40 hover:bg-accent/50"
    >
      <Icon className="h-4 w-4 text-primary" />
      <span className="font-medium text-xs">{label}</span>
    </Link>
  );
}
