import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Sparkles, TrendingUp, ExternalLink, Loader2, Cpu, FileBarChart, ShieldCheck, Megaphone, Linkedin, Twitter } from "lucide-react";
import { trendingKeywords, opportunities } from "@/lib/mock-data";
import { runResearch, runReports, runSocial } from "@/lib/agents.functions";
import { usePersistentState } from "@/lib/persist";
import { fallbackResearch, fallbackReports, fallbackSocial } from "@/lib/fallback-data";

import { PublicationViewer } from "@/components/publication-viewer";
import { SocialRepost } from "@/components/social-repost";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Hub — ACE" },
      { name: "description", content: "Live UAE banking, credit-bureau and enterprise tech signals powering Resolutions Infotech's content strategy." },
      { property: "og:title", content: "Research Hub — ACE" },
      { property: "og:description", content: "Live, source-attributed research signals for Resolutions Infotech." },
    ],
  }),
  component: ResearchHub,
});

type ResearchData = Awaited<ReturnType<typeof runResearch>>;
type ReportsData = Awaited<ReturnType<typeof runReports>>;
type SocialData = Awaited<ReturnType<typeof runSocial>>;

function ResearchHub() {
  const research = useServerFn(runResearch);
  const reports = useServerFn(runReports);
  const social = useServerFn(runSocial);
  const [cachedResearch, setCachedResearch, researchHydrated] = usePersistentState<ResearchData | null>("ace.research", null);
  const [cachedReports, setCachedReports, reportsHydrated] = usePersistentState<ReportsData | null>("ace.reports", null);
  const [cachedSocial, setCachedSocial, socialHydrated] = usePersistentState<SocialData | null>("ace.social", null);

  const run = useMutation({
    mutationFn: () => research({ data: {} }),
    onSuccess: (res) => setCachedResearch(res as ResearchData),
    onError: (e: Error) => toast.error(e.message),
  });
  const reportsRun = useMutation({
    mutationFn: () => reports({ data: {} }),
    onSuccess: (res) => setCachedReports(res as ReportsData),
    onError: (e: Error) => toast.error(e.message),
  });
  const socialRun = useMutation({
    mutationFn: () => social({ data: {} }),
    onSuccess: (res) => setCachedSocial(res as SocialData),
    onError: (e: Error) => toast.error(e.message),
  });

  useEffect(() => {
    if (!researchHydrated || !reportsHydrated || !socialHydrated) return;
    if (!run.data && !run.isPending) run.mutate();
    if (!reportsRun.data && !reportsRun.isPending) reportsRun.mutate();
    if (!socialRun.data && !socialRun.isPending) socialRun.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [researchHydrated, reportsHydrated, socialHydrated]);

  const researchFailed = run.isError && !cachedResearch;
  const reportsFailed = reportsRun.isError && !cachedReports;
  const socialFailed = socialRun.isError && !cachedSocial;

  const data =
    (run.data as ResearchData | undefined) ??
    cachedResearch ??
    (researchFailed ? (fallbackResearch as unknown as ResearchData) : undefined);
  const reportData =
    (reportsRun.data as ReportsData | undefined) ??
    cachedReports ??
    (reportsFailed ? (fallbackReports as unknown as ReportsData) : undefined);
  const socialData =
    (socialRun.data as SocialData | undefined) ??
    cachedSocial ??
    (socialFailed ? (fallbackSocial as unknown as SocialData) : undefined);

  const usingFallback = researchFailed || reportsFailed || socialFailed;


  const chartData = (reportData?.reports ?? [])
    .slice(0, 8)
    .map((r) => ({
      name: r.publisher.length > 18 ? `${r.publisher.slice(0, 18)}…` : r.publisher,
      relevance: r.relevance,
      category: r.category,
    }));


  return (
    <AppShell
      title="Research Hub"
      description="Live signals fetched from public news feeds, ranked by the Research Agent."
      actions={
        <Button size="sm" onClick={() => run.mutate()} disabled={run.isPending}>
          {run.isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-1.5 h-3.5 w-3.5" />}
          {run.isPending ? "Running research..." : "Run research now"}
        </Button>
      }
    >
      {usingFallback && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-dashed bg-muted/40 px-3 py-2 text-[12px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Agents are temporarily unreachable — showing a cached snapshot of official UAE sources.
          <Button
            size="sm"
            variant="outline"
            className="h-6 px-2 text-[11px]"
            onClick={() => {
              run.mutate();
              reportsRun.mutate();
              socialRun.mutate();
            }}
          >
            Retry
          </Button>
        </div>
      )}
      <div className="mb-6 grid gap-4 md:grid-cols-3">

        <Card className="md:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Research summary</CardTitle>
            <Badge variant="outline" className="text-[10px] gap-1">
              <Cpu className="h-3 w-3" /> {data?.model ?? "Lovable AI Gateway · google/gemini-3.6-flash"}
            </Badge>
          </CardHeader>
          <CardContent>
            {run.isPending && !data ? (
              <p className="text-sm text-muted-foreground">Fetching live feeds and ranking signals…</p>
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {data?.summary ?? "Run the Research Agent to pull the latest live signals."}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {(data?.keywords?.length ? data.keywords : trendingKeywords).map((k) => (
                <Badge key={k} variant="secondary" className="text-[11px]">#{k.replace(/\s+/g, "")}</Badge>
              ))}
            </div>
            {data && (
              <p className="mt-4 text-[11px] text-muted-foreground">
                {data.sourcesScanned} live articles scanned · {data.signals.length} signals kept · {new Date(data.ranAt).toLocaleTimeString()}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Opportunities</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {opportunities.map((o) => (
              <div key={o.title} className="rounded-lg border p-3">
                <p className="text-sm font-medium">{o.title}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{o.why}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base flex items-center gap-2">
            <FileBarChart className="h-4 w-4 text-primary" /> Official publications
          </CardTitle>
          <div className="flex items-center gap-2">
            {reportData && (
              <span className="text-[11px] text-muted-foreground">{reportData.sourcesScanned} publications scanned</span>
            )}
            <Button size="sm" variant="outline" onClick={() => reportsRun.mutate()} disabled={reportsRun.isPending}>
              {reportsRun.isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-1.5 h-3.5 w-3.5" />}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-[11px] text-muted-foreground">
            Restricted to government-affiliated issuers — Central Bank of the UAE, Al Etihad Credit Bureau, UAE government,
            WAM and regional regulators — plus verified news desks reporting on them. Unverified publishers are discarded.
          </p>


          {chartData.length > 0 && (
            <div className="mb-5 rounded-lg border bg-muted/20 p-4">
              <p className="mb-3 text-[11px] font-medium text-muted-foreground">
                Relevance by publication
              </p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 4, right: 8, left: -18, bottom: 34 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      stroke="var(--muted-foreground)"
                    />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                    <Tooltip
                      cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                      contentStyle={{
                        background: "var(--popover)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(v: number, _n, p) => [`${v}% relevance`, (p.payload as { category: string }).category]}
                    />
                    <Bar dataKey="relevance" radius={[4, 4, 0, 0]}>
                      {chartData.map((d) => (
                        <Cell key={d.name} fill="var(--primary)" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {reportsRun.isPending && !reportData ? (
            <div className="grid gap-3 md:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-lg border bg-muted/40" />
              ))}
            </div>
          ) : reportData?.reports.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {reportData.reports.map((r) => (
                <div key={r.id} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px]">{r.category}</Badge>
                      <Badge
                        variant={r.trust === "official" ? "default" : "secondary"}
                        className="text-[10px] gap-1"
                      >
                        <ShieldCheck className="h-3 w-3" />
                        {r.trust === "official" ? "Official issuer" : "Verified desk"}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{r.date}</span>
                  </div>

                  <h3 className="text-sm font-semibold leading-snug">{r.title}</h3>
                  <p className="text-[12px] leading-relaxed text-muted-foreground">{r.whatItSays}</p>
                  {!!r.keyFigures.length && (
                    <div className="grid grid-cols-3 gap-2">
                      {r.keyFigures.map((f) => (
                        <div key={f.label} className="rounded-md border bg-muted/30 px-2 py-1.5">
                          <p className="text-[13px] font-semibold leading-tight">{f.value}</p>
                          <p className="text-[10px] leading-tight text-muted-foreground">{f.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {r.soWhat && (
                    <p className="text-[11px] rounded-md bg-primary/5 border border-primary/15 px-2.5 py-1.5">
                      <span className="font-medium">So what:</span> {r.soWhat}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 border-t pt-2">
                    <PublicationViewer publication={r} />
                    <a href={r.docUrl ?? r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground">
                      {r.publisher} <ExternalLink className="h-3 w-3" />
                    </a>
                    <span className="ml-auto text-[10px] text-muted-foreground">{r.relevance}% relevance</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {reportsRun.isError
                  ? "Couldn't reach the publication sources just now."
                  : "No publications loaded yet."}
              </p>
              <Button size="sm" variant="outline" onClick={() => reportsRun.mutate()} disabled={reportsRun.isPending}>
                Retry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-primary" /> Official accounts & notices
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => socialRun.mutate()} disabled={socialRun.isPending}>
            {socialRun.isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-1.5 h-3.5 w-3.5" />}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-[11px] text-muted-foreground">
            Announcements from verified institution accounts — CBUAE, AECB, UAE Government, WAM, ADGM and DFSA — with a
            direct link to each issuer's LinkedIn page and X account, plus an editable repost that leads with our own take.
          </p>

          {socialRun.isPending && !socialData ? (
            <div className="grid gap-3 md:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-lg border bg-muted/40" />
              ))}
            </div>
          ) : socialData?.posts.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {socialData.posts.map((p) => (
                <div key={p.id} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant={p.trust === "official" ? "default" : "secondary"} className="gap-1 text-[10px]">
                        <ShieldCheck className="h-3 w-3" /> {p.issuer}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">{p.category}</Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{p.date}</span>
                  </div>

                  <h3 className="text-sm font-semibold leading-snug">{p.title}</h3>
                  <p className="text-[12px] leading-relaxed text-muted-foreground">{p.whatItSays}</p>
                  {p.ourTake && (
                    <p className="text-[11px] rounded-md bg-primary/5 border border-primary/15 px-2.5 py-1.5">
                      <span className="font-medium">Our take:</span> {p.ourTake}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 border-t pt-2">
                    <SocialRepost post={p} />
                    <a href={p.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground">
                      <Linkedin className="h-3 w-3" /> LinkedIn
                    </a>
                    {p.x && (
                      <a href={p.x} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground">
                        <Twitter className="h-3 w-3" /> X
                      </a>
                    )}
                    <a href={p.url} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground">
                      Source <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">No official notices loaded yet.</p>
              <Button size="sm" variant="outline" onClick={() => socialRun.mutate()} disabled={socialRun.isPending}>
                Retry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>


      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {run.isPending && !data &&
          [0, 1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-5 space-y-3">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-3 w-4/5 rounded bg-muted" />
                <div className="h-3 w-2/3 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}

        {data?.signals.map((r) => (
          <Card key={r.id} className="stat-card-hover">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="outline" className="text-[10px]">{r.category}</Badge>
                <div className="flex items-center gap-1 text-[10px] text-success">
                  <TrendingUp className="h-3 w-3" /> {r.confidence}% relevance
                </div>
              </div>
              <h3 className="text-sm font-semibold leading-snug">{r.title}</h3>
              <p className="text-[12px] leading-relaxed text-muted-foreground">{r.summary}</p>
              {r.angle && (
                <p className="text-[11px] rounded-md bg-primary/5 border border-primary/15 px-2.5 py-1.5">
                  <span className="font-medium">Angle:</span> {r.angle}
                </p>
              )}
              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t">
                <a href={r.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
                  {r.source} <ExternalLink className="h-3 w-3" />
                </a>
                <span>{r.date}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!run.isPending && !data?.signals.length && (
        <div className="grid place-items-center py-24 text-center border rounded-xl bg-muted/20">
          <p className="text-sm font-medium">No live signals yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Run the Research Agent to pull fresh sources.</p>
        </div>
      )}
    </AppShell>
  );
}
