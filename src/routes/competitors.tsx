import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp } from "lucide-react";
import { competitors } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createFileRoute("/competitors")({
  head: () => ({
    meta: [
      { title: "Competitor Intelligence — ACE" },
      { name: "description", content: "Track competitor posting cadence, content mix, and trending topics across LinkedIn." },
      { property: "og:title", content: "Competitor Intelligence — ACE" },
      { property: "og:description", content: "Autonomous competitive tracking for UAE technology and financial-services teams." },
    ],
  }),
  component: CompetitorsPage,
});

const CHART_COLORS = ["oklch(0.55 0.22 258)", "oklch(0.65 0.18 200)", "oklch(0.72 0.16 155)", "oklch(0.75 0.17 75)"];

function CompetitorsPage() {
  const freqData = competitors.map((c) => ({ name: c.name, posts: c.frequency }));

  return (
    <AppShell
      title="Competitor Intelligence"
      description="How your peers are posting, what's landing, and where the gaps are."
      actions={<Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> Track competitor</Button>}
    >
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Posting frequency (posts / week)</CardTitle></CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={freqData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "oklch(0.55 0.22 258 / 0.08)" }}
                  contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid var(--border)", background: "var(--popover)" }}
                />
                <Bar dataKey="posts" fill="oklch(0.55 0.22 258)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Topic distribution — Ramp</CardTitle></CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={competitors[0].categories}
                  dataKey="pct"
                  nameKey="label"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {competitors[0].categories.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid var(--border)", background: "var(--popover)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 -mt-2">
              {competitors[0].categories.map((c, i) => (
                <div key={c.label} className="flex items-center gap-1.5 text-[11px]">
                  <span className="h-2 w-2 rounded-sm" style={{ background: CHART_COLORS[i] }} />
                  <span className="text-muted-foreground">{c.label} · {c.pct}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {competitors.map((c) => (
          <Card key={c.id} className="stat-card-hover">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{c.name}</CardTitle>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{c.industry}</p>
                </div>
                <Badge variant="secondary" className="text-[10px]">{c.frequency}/wk</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <Row label="Recent topics">
                <div className="flex flex-wrap gap-1">
                  {c.topics.map((t) => <Badge key={t} variant="outline" className="text-[10px] font-normal">{t}</Badge>)}
                </div>
              </Row>
              <Row label="Top hashtags"><span className="text-muted-foreground">{c.hashtags.join(" · ")}</span></Row>
              <Row label="Posting pattern"><span className="text-muted-foreground">{c.pattern}</span></Row>
              <Row label="Content mix">
                <div className="space-y-1 pt-1">
                  {c.categories.map((cat, i) => (
                    <div key={cat.label} className="flex items-center gap-2 text-[10px]">
                      <span className="w-16 text-muted-foreground">{cat.label}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${cat.pct}%`, background: CHART_COLORS[i] }} />
                      </div>
                      <span className="w-6 text-right text-muted-foreground">{cat.pct}%</span>
                    </div>
                  ))}
                </div>
              </Row>
              <div className="flex items-center gap-1.5 rounded-md bg-info/10 text-info px-2 py-1.5 text-[11px]">
                <TrendingUp className="h-3 w-3" /> Trending: {c.trending}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      {children}
    </div>
  );
}
