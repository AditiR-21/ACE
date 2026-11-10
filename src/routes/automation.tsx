import { createFileRoute } from "@tanstack/react-router";
import { AppShell, StatusDot } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Newspaper, Compass, PenLine, ArrowDown } from "lucide-react";
import { agents } from "@/lib/mock-data";

export const Route = createFileRoute("/automation")({
  head: () => ({
    meta: [
      { title: "Automation — ACE" },
      { name: "description", content: "The autonomous ACE workflow: Research → Strategy → Writer agents, orchestrated in real time." },
      { property: "og:title", content: "Automation — ACE" },
      { property: "og:description", content: "Workflow orchestration for your autonomous content engine." },
    ],
  }),
  component: AutomationPage,
});

const iconMap = { research: Newspaper, strategy: Compass, writer: PenLine } as const;

function AutomationPage() {
  return (
    <AppShell
      title="Automation"
      description="Your autonomous content pipeline. Research feeds Strategy. Strategy feeds Writer."
      actions={<Button size="sm"><Play className="mr-1.5 h-3.5 w-3.5" /> Run full pipeline</Button>}
    >
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <PipelineStat label="Runs today" value="14" hint="+3 vs yesterday" />
        <PipelineStat label="Avg. cycle time" value="4m 21s" hint="↓ 18% this week" />
        <PipelineStat label="Success rate" value="97%" hint="last 30 runs" />
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">Live pipeline</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-start">
            {agents.map((a, i) => {
              const Icon = iconMap[a.id as keyof typeof iconMap];
              return (
                <div key={a.id} className="flex-1 flex flex-col md:flex-row items-stretch gap-3">
                  <div className="flex-1 rounded-xl border bg-card p-5 relative overflow-hidden">
                    {a.status === "running" && (
                      <div className="absolute inset-x-0 top-0 h-0.5 bg-primary/20 overflow-hidden">
                        <div className="h-full w-1/3 bg-primary animate-[slide-in-right_1.4s_ease-in-out_infinite]" />
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{a.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Stage {i + 1}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] capitalize">
                        <StatusDot status={a.status} /> {a.status}
                      </div>
                    </div>
                    <dl className="space-y-1.5 text-[12px]">
                      <PipelineRow k="Current task" v={a.task} />
                      <PipelineRow k="Last run" v={a.lastRun} />
                      <PipelineRow k="Execution time" v={a.time} />
                      <PipelineRow k="Output" v={a.output} />
                    </dl>
                  </div>
                  {i < agents.length - 1 && (
                    <div className="hidden md:flex items-center justify-center px-1">
                      <ArrowDown className="h-4 w-4 text-muted-foreground rotate-[-90deg]" />
                    </div>
                  )}
                  {i < agents.length - 1 && (
                    <div className="md:hidden flex items-center justify-center">
                      <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Execution log</CardTitle></CardHeader>
        <CardContent>
          <div className="font-mono text-[11px] rounded-lg border bg-muted/30 p-4 space-y-1 text-muted-foreground">
            <p><span className="text-success">[08:42:11]</span> research-agent → fetching live feeds (AECB, UAE banking, fintech, enterprise IT)</p>
            <p><span className="text-success">[08:43:53]</span> research-agent → 27 signals extracted, 5 flagged as high-confidence</p>
            <p><span className="text-info">[08:43:54]</span> strategy-agent → consulting ACE Memory (topics_covered, used_hooks)</p>
            <p><span className="text-info">[08:44:12]</span> strategy-agent → selected pillar: Thought Leadership · topic: Embedded Finance</p>
            <p><span className="text-info">[08:44:13]</span> strategy-agent → diversity check passed · hook uniqueness: 96%</p>
            <p><span className="text-primary">[08:44:14]</span> writer-agent → drafting 3 variants (temperature 0.6, brand-tuned)</p>
            <p><span className="text-primary">[08:46:22]</span> writer-agent → originality checks: 92/87/95 · duplicate risk: 4/11/2</p>
            <p><span className="text-foreground">[08:46:23]</span> pipeline → 3 drafts ready · awaiting founder review</p>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

function PipelineStat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="stat-card p-5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function PipelineRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-t pt-1.5 first:border-t-0 first:pt-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}
