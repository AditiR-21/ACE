import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Search, ShieldCheck, ShieldAlert, BookOpen, Sparkles, X } from "lucide-react";
import { brandMemory, postHistory } from "@/lib/mock-data";

export const Route = createFileRoute("/memory")({
  head: () => ({
    meta: [
      { title: "ACE Memory — ACE" },
      { name: "description", content: "The persistent brand knowledge base that powers every ACE-generated post." },
      { property: "og:title", content: "ACE Memory — ACE" },
      { property: "og:description", content: "Searchable brand memory with health, coverage, and consistency scores." },
    ],
  }),
  component: MemoryPage,
});

const filters = ["All", "Profile", "Rules", "Vocabulary", "Topics", "Hooks", "History"];

function MemoryPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const m = brandMemory;

  return (
    <AppShell
      title="ACE Memory"
      description="Everything ACE knows about your brand. Consulted before every generation."
    >
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <HealthCard label="Duplicate Risk" value={m.health.duplicateRisk} inverse icon={ShieldAlert} tone="warning" />
        <HealthCard label="Knowledge Coverage" value={m.health.knowledgeCoverage} icon={BookOpen} tone="info" />
        <HealthCard label="Brand Consistency" value={m.health.brandConsistency} icon={ShieldCheck} tone="success" />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-56 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search memory..." className="pl-8 h-8 text-xs" />
        </div>
        {filters.map((f) => (
          <Button key={f} size="sm" variant={f === filter ? "default" : "outline"} className="h-7 text-xs" onClick={() => setFilter(f)}>{f}</Button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <MemoryBlock title="Company profile">
          <KV k="Mission" v={m.mission} />
          <KV k="Products" v={m.products.join(" · ")} />
          <KV k="Audience" v={m.audience} />
        </MemoryBlock>

        <MemoryBlock title="Brand voice">
          <KV k="Tone" v={m.tone} />
          <KV k="Writing style" v={m.writingStyle} />
          <KV k="Preferred CTA" v={m.preferredCTA} />
        </MemoryBlock>

        <MemoryBlock title="Writing rules">
          <ul className="space-y-1.5 text-sm">
            {m.rules.map((r) => (
              <li key={r} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                <span className="text-muted-foreground">{r}</span>
              </li>
            ))}
          </ul>
        </MemoryBlock>

        <MemoryBlock title="Vocabulary">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Preferred</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {m.preferredVocab.map((w) => <Badge key={w} variant="secondary" className="text-[11px]">{w}</Badge>)}
          </div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Forbidden</p>
          <div className="flex flex-wrap gap-1.5">
            {m.forbiddenWords.map((w) => (
              <Badge key={w} variant="outline" className="text-[11px] text-destructive border-destructive/30">
                <X className="h-2.5 w-2.5 mr-0.5" /> {w}
              </Badge>
            ))}
          </div>
        </MemoryBlock>

        <MemoryBlock title="Topics">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Covered</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {m.topicsCovered.map((t) => <Badge key={t} variant="outline" className="text-[11px]">{t}</Badge>)}
          </div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Avoid</p>
          <div className="flex flex-wrap gap-1.5">
            {m.topicsToAvoid.map((t) => <Badge key={t} variant="outline" className="text-[11px] text-muted-foreground">{t}</Badge>)}
          </div>
        </MemoryBlock>

        <MemoryBlock title="Successful hooks">
          <ul className="space-y-2 text-sm">
            {m.successfulHooks.map((h) => (
              <li key={h} className="rounded-md border p-2.5 text-[13px] italic text-muted-foreground">"{h}"</li>
            ))}
          </ul>
          <p className="text-[11px] text-muted-foreground mt-3">
            {m.usedHooks} hooks · {m.usedCTAs} CTAs used to date — never reused within 90 days.
          </p>
        </MemoryBlock>

        <MemoryBlock title="Future ideas">
          <ul className="space-y-1.5 text-sm">
            {m.futureIdeas.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-3 w-3 text-primary shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </MemoryBlock>

        <MemoryBlock title="Timeline · recent memory events">
          <ol className="relative border-l ml-2 space-y-3">
            {postHistory.slice(0, 5).map((p) => (
              <li key={p.id} className="ml-3">
                <span className="absolute -left-1 h-2 w-2 rounded-full bg-primary/60 ring-2 ring-background" />
                <p className="text-[13px]">{p.title}</p>
                <p className="text-[10px] text-muted-foreground">{p.date} · {p.topic} · {p.reactions} reactions</p>
              </li>
            ))}
          </ol>
        </MemoryBlock>
      </div>
    </AppShell>
  );
}

function MemoryBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
      <CardContent className="text-sm">{children}</CardContent>
    </Card>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
      <p className="text-[13px] mt-0.5">{v}</p>
    </div>
  );
}

function HealthCard({ label, value, icon: Icon, tone, inverse }: { label: string; value: number; icon: React.ComponentType<{ className?: string }>; tone: "success" | "warning" | "info"; inverse?: boolean }) {
  const displayGood = inverse ? value < 15 : value >= 80;
  const toneClass = displayGood ? "text-success" : tone === "warning" ? "text-warning" : "text-info";
  return (
    <div className="stat-card p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <Icon className={`h-4 w-4 ${toneClass}`} />
      </div>
      <p className="text-3xl font-semibold tracking-tight">{value}%</p>
      <Progress value={value} className="mt-3 h-1.5" />
    </div>
  );
}
