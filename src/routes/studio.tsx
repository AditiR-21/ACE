import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, RefreshCw, Check, X, Pencil, Copy, Download, Loader2, ExternalLink, Cpu, Linkedin, Twitter } from "lucide-react";
import { drafts as initialDrafts } from "@/lib/mock-data";
import { runWriter } from "@/lib/agents.functions";
import { usePersistentState } from "@/lib/persist";
import { toast } from "sonner";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Content Studio — ACE" },
      { name: "description", content: "Draft, edit, and approve AI-written LinkedIn posts sourced from live industry news." },
      { property: "og:title", content: "Content Studio — ACE" },
      { property: "og:description", content: "Source-attributed AI drafts with originality and duplicate risk scoring." },
    ],
  }),
  component: Studio,
});

type Draft = (typeof initialDrafts)[number];

function Studio() {
  const [drafts, setDrafts] = usePersistentState<Draft[]>("ace.drafts", initialDrafts);
  const [topic, setTopic] = useState("");
  const writer = useServerFn(runWriter);

  const generate = useMutation({
    mutationFn: (count: number) => writer({ data: { topicSeed: topic || undefined, count } }),
    onSuccess: (res) => {
      setDrafts([...(res.drafts as Draft[]), ...drafts]);
      toast.success(`${res.drafts.length} draft(s) written from ${res.sourcesScanned} live articles`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const approve = (id: string) => { setDrafts(drafts.filter((x) => x.id !== id)); toast.success("Draft approved and moved to calendar"); };
  const reject = (id: string) => { setDrafts(drafts.filter((x) => x.id !== id)); toast("Draft rejected"); };
  const copy = (t: string) => { navigator.clipboard.writeText(t); toast.success("Copied to clipboard"); };

  return (
    <AppShell
      title="Content Studio"
      description="Drafts are written from live news sources and checked against ACE Memory."
    >
      <Card className="mb-6">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Topic seed (optional)</CardTitle>
          <Badge variant="outline" className="text-[10px] gap-1"><Cpu className="h-3 w-3" /> Lovable AI Gateway · google/gemini-3.6-flash</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. What commercial credit scores change for UAE SME lending..."
            className="min-h-24"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => generate.mutate(1)} disabled={generate.isPending}>
              {generate.isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="mr-1.5 h-3.5 w-3.5" />}
              Generate one draft
            </Button>
            <Button size="sm" variant="outline" onClick={() => generate.mutate(3)} disabled={generate.isPending}>
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Generate three drafts
            </Button>
            <span className="ml-auto text-xs text-muted-foreground">
              {generate.isPending ? "Research Agent fetching live sources…" : "Live sources · ACE Memory · brand rules"}
            </span>
          </div>
        </CardContent>
      </Card>


      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {drafts.map((d) => (
          <Card key={d.id} className="stat-card-hover flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant="secondary" className="mb-2">{d.pillar}</Badge>
                  <CardTitle className="text-base leading-snug">{d.topic}</CardTitle>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <ScoreChip label="Originality" value={d.originality} good />
                <ScoreChip label="Duplicate" value={d.duplicateRisk} inverse />
                <ScoreChip label="Tone" value={d.tone} good />
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-3 text-sm">
              <Section label="Hook">{d.hook}</Section>
              <Section label="Body"><div className="whitespace-pre-wrap text-muted-foreground text-[13px] leading-relaxed">{d.body}</div></Section>
              <Section label="CTA">{d.cta}</Section>
              <div className="flex flex-wrap gap-1.5">
                {d.hashtags.map((h) => <Badge key={h} variant="outline" className="text-[10px] font-normal">{h}</Badge>)}
              </div>
              <p className="text-[11px] text-muted-foreground">{d.readingTime} · {d.model}</p>
              <div className="rounded-md border bg-muted/30 px-2.5 py-2 text-[11px]">
                <p className="font-semibold uppercase tracking-wider text-[9px] text-muted-foreground mb-1">Source</p>
                {d.sourceUrl ? (
                  <a href={d.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-start gap-1 hover:text-primary">
                    <span>{d.sourceTitle} — {d.source}</span>
                    <ExternalLink className="h-3 w-3 shrink-0 mt-0.5" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">{d.sourceTitle || d.source}</span>
                )}
              </div>
              {d.duplicateRisk > 10 && (
                <div className="rounded-md border border-warning/30 bg-warning/10 px-2.5 py-1.5 text-[11px] text-warning">
                  Duplicate risk above threshold — consider regenerating.
                </div>
              )}
            </CardContent>
            <div className="border-t p-3 flex flex-wrap items-center gap-1.5">
              <Button size="sm" className="h-7 text-xs" onClick={() => approve(d.id)}><Check className="mr-1 h-3 w-3" /> Approve</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" disabled={generate.isPending} onClick={() => { reject(d.id); generate.mutate(1); }}><RefreshCw className="mr-1 h-3 w-3" /> Regenerate</Button>

              <Button size="sm" variant="ghost" className="h-7 text-xs"><Pencil className="mr-1 h-3 w-3" /> Edit</Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => {
                  copy(`${d.hook}\n\n${d.body}\n\n${d.cta}\n\n${d.hashtags.join(" ")}${d.sourceUrl ? `\n\nSource: ${d.sourceUrl}` : ""}`);
                  window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(d.sourceUrl || window.location.origin)}`,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
              >
                <Linkedin className="mr-1 h-3 w-3" /> Post
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${d.hook}\n\n${d.cta}`)}&url=${encodeURIComponent(d.sourceUrl || window.location.origin)}`,
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                <Twitter className="mr-1 h-3 w-3" /> X
              </Button>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => copy(`${d.hook}\n\n${d.body}\n\n${d.cta}\n\n${d.hashtags.join(" ")}`)}><Copy className="h-3 w-3" /></Button>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Download className="h-3 w-3" /></Button>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 ml-auto text-destructive" onClick={() => reject(d.id)}><X className="h-3 w-3" /></Button>
            </div>
          </Card>
        ))}
      </div>

      {drafts.length === 0 && (
        <div className="grid place-items-center py-24 text-center border rounded-xl bg-muted/20">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary mb-3">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium">No drafts generated yet.</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Give ACE a topic seed above, or let the Strategy Agent pick your next post.
          </p>
        </div>
      )}
    </AppShell>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <div>{children}</div>
    </div>
  );
}

function ScoreChip({ label, value, good, inverse }: { label: string; value: number; good?: boolean; inverse?: boolean }) {
  const positive = inverse ? value < 10 : value >= 80;
  const warning = inverse ? value >= 10 && value < 20 : value >= 60 && value < 80;
  const tone = positive ? "text-success bg-success/10" : warning ? "text-warning bg-warning/10" : "text-destructive bg-destructive/10";
  return (
    <div className={`rounded-md px-2 py-1.5 text-center ${tone}`}>
      <p className="text-[9px] font-medium uppercase tracking-wider opacity-80">{label}</p>
      <p className="text-sm font-semibold">{value}{good || inverse ? "%" : ""}</p>
    </div>
  );
}
