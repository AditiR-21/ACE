import { chatJSON, ACE_MODEL_LABEL } from "./ai-gateway.server";
import { fetchFeedItems, fetchReportItems, relativeDate, CURATED_OFFICIAL, type FeedItem } from "./feeds.server";

export const BRAND_BRIEF = `Company: Resolutions Infotech (Abu Dhabi, UAE).
What they do: technology partner delivering account & profile systems, credit-data integration and enterprise
platform work — including work with Al Etihad Credit Bureau (AECB) systems in Abu Dhabi: consumer & commercial
credit profiles, account onboarding, KYC/identity, credit report and score APIs, data quality and member reporting.
Audience: banks, lenders, fintechs, telcos, government entities and enterprise IT leaders in the UAE and wider GCC.
Voice: confident, plainspoken, practical. Never salesy, no hype words, no emojis in the first line.
Style: SHORT. Max ~90 words of body. Short lines, one idea per line. Concrete over abstract.
Content horizon is broad: credit data & bureaus, banking tech, fintech, digital government, identity, data
engineering, AI in financial services, cybersecurity and general enterprise technology — not only AECB.`;

export type ResearchSignal = {
  id: string;
  title: string;
  summary: string;
  category: string;
  confidence: number;
  source: string;
  sourceUrl: string;
  date: string;
  angle: string;
};

export type GeneratedDraft = {
  id: string;
  topic: string;
  pillar: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  readingTime: string;
  originality: number;
  duplicateRisk: number;
  tone: number;
  source: string;
  sourceUrl: string;
  sourceTitle: string;
  model: string;
};

export async function researchAgent(categories?: string[]) {
  const items = await fetchFeedItems(categories);
  if (!items.length) throw new Error("No live sources returned results. Try again shortly.");

  const shortlist = items.slice(0, 24);
  const payload = shortlist.map((i, n) => `${n}. [${i.category}] ${i.title} — ${i.source}`).join("\n");

  const out = await chatJSON<{ signals: { index: number; summary: string; confidence: number; angle: string }[]; summary: string; keywords: string[] }>([
    {
      role: "system",
      content: `You are the Research Agent for a B2B content engine.\n${BRAND_BRIEF}\nReturn strict JSON only.`,
    },
    {
      role: "user",
      content: `Here are real headlines pulled from live news feeds just now:\n${payload}\n\nPick the 12 most relevant to the company and return JSON:
{"summary":"2 sentence read on what matters this week","keywords":["..."],"signals":[{"index":0,"summary":"one factual sentence, max 22 words","confidence":0-100,"angle":"one short line on the content angle"}]}
Never invent facts beyond the headline. Confidence reflects relevance to the company.`,
    },
  ]);

  const signals: ResearchSignal[] = (out.signals ?? [])
    .filter((s) => shortlist[s.index])
    .map((s, n) => {
      const item = shortlist[s.index] as FeedItem;
      return {
        id: `sig-${n}-${s.index}`,
        title: item.title,
        summary: s.summary,
        category: item.category,
        confidence: Math.max(1, Math.min(100, Math.round(s.confidence ?? 70))),
        source: item.source,
        sourceUrl: item.url,
        date: relativeDate(item.publishedAt),
        angle: s.angle ?? "",
      };
    });

  return {
    signals,
    summary: out.summary ?? "",
    keywords: out.keywords ?? [],
    sourcesScanned: items.length,
    model: ACE_MODEL_LABEL,
    ranAt: new Date().toISOString(),
  };
}

export async function writerAgent(input: { topicSeed?: string; count?: number; categories?: string[] }) {
  const count = Math.max(1, Math.min(3, input.count ?? 1));
  const research = await researchAgent(input.categories);
  const pool = research.signals.slice(0, 10);

  const out = await chatJSON<{ drafts: { signalId: string; topic: string; pillar: string; hook: string; body: string; cta: string; hashtags: string[]; originality: number; duplicateRisk: number; tone: number }[] }>([
    {
      role: "system",
      content: `You are the Writer Agent producing LinkedIn company-page posts.\n${BRAND_BRIEF}\nReturn strict JSON only.`,
    },
    {
      role: "user",
      content: `Real signals available (use exactly one per draft, cite it by signalId):\n${pool
        .map((s) => `${s.id} | [${s.category}] ${s.title} (${s.source}) — ${s.summary}`)
        .join("\n")}\n\n${input.topicSeed ? `Founder topic seed: ${input.topicSeed}\n` : ""}Write ${count} distinct draft(s) across different categories. Be concise — body under 90 words, no filler.
JSON: {"drafts":[{"signalId":"...","topic":"short title","pillar":"Credit Data|Banking Tech|FinTech|GovTech|Enterprise IT|AI|Cybersecurity|Thought Leadership","hook":"one line","body":"short, line-broken with \\n","cta":"one question","hashtags":["#..."],"originality":0-100,"duplicateRisk":0-100,"tone":0-100}]}`,
    },
  ]);

  const drafts: GeneratedDraft[] = (out.drafts ?? []).slice(0, count).map((d, n) => {
    const sig = pool.find((s) => s.id === d.signalId) ?? pool[n] ?? pool[0];
    const words = `${d.hook} ${d.body} ${d.cta}`.split(/\s+/).length;
    return {
      id: `draft-${Date.now()}-${n}`,
      topic: d.topic,
      pillar: d.pillar ?? "Thought Leadership",
      hook: d.hook,
      body: d.body,
      cta: d.cta,
      hashtags: (d.hashtags ?? []).slice(0, 4),
      readingTime: `${Math.max(1, Math.round(words / 200))} min read`,
      originality: Math.round(d.originality ?? 85),
      duplicateRisk: Math.round(d.duplicateRisk ?? 8),
      tone: Math.round(d.tone ?? 90),
      source: sig?.source ?? "Live feed",
      sourceUrl: sig?.sourceUrl ?? "",
      sourceTitle: sig?.title ?? "",
      model: ACE_MODEL_LABEL,
    };
  });

  if (!drafts.length) throw new Error("Writer Agent returned no drafts. Try again.");
  return { drafts, model: ACE_MODEL_LABEL, sourcesScanned: research.sourcesScanned };
}

export type ReportSummary = {
  id: string;
  title: string;
  publisher: string;
  category: string;
  url: string;
  date: string;
  whatItSays: string;
  keyFigures: { label: string; value: string }[];
  soWhat: string;
  relevance: number;
  trust: "official" | "verified";
  /** Direct link to the underlying PDF / document, when the issuer publishes one. */
  docUrl?: string;
};

export async function reportsAgent() {
  let items: FeedItem[] = [];
  try {
    items = await fetchReportItems();
  } catch {
    items = [];
  }
  if (!items.length) items = CURATED_OFFICIAL;


  const shortlist = items.slice(0, 12);
  const payload = shortlist
    .map((i, n) => `${n}. [${i.category}] (${i.trust === "official" ? "official issuer" : "verified news desk"}) ${i.title} — ${i.source}`)
    .join("\n");

  const base = (item: FeedItem, n: number, index: number) => ({
    id: `rep-${n}-${index}`,
    title: item.title,
    publisher: item.source,
    category: item.category,
    url: item.url,
    date: relativeDate(item.publishedAt),
    trust: (item.trust ?? "verified") as "official" | "verified",
    docUrl: item.docUrl,
  });

  let reports: ReportSummary[] = [];
  try {
    const out = await chatJSON<{
      reports: { index: number; whatItSays: string; keyFigures: { label: string; value: string }[]; soWhat: string; relevance: number }[];
    }>([
      {
        role: "system",
        content: `You are the Reports Agent for a B2B content engine. You visually summarise publications from the Central Bank of the UAE, Al Etihad Credit Bureau, UAE government, regional regulators and verified news desks reporting on them.\n${BRAND_BRIEF}\nReturn strict JSON only.`,
      },
      {
        role: "user",
        content: `Vetted publication headlines pulled live just now:\n${payload}\n\nPick the 8 most relevant (prefer official issuers) and return JSON:
{"reports":[{"index":0,"whatItSays":"one factual sentence, max 24 words","keyFigures":[{"label":"short label","value":"figure or short phrase"}],"soWhat":"one line on why it matters to the company","relevance":0-100}]}
Only use figures actually implied by the headline; if none, return an empty keyFigures array. Never invent numbers.`,
      },
    ]);

    reports = (out.reports ?? [])
      .filter((r) => shortlist[r.index])
      .map((r, n) => ({
        ...base(shortlist[r.index] as FeedItem, n, r.index),
        whatItSays: r.whatItSays,
        keyFigures: (r.keyFigures ?? []).slice(0, 3),
        soWhat: r.soWhat ?? "",
        relevance: Math.max(1, Math.min(100, Math.round(r.relevance ?? 70))),
      }));
  } catch {
    reports = [];
  }

  // Never leave the panel empty: fall back to the vetted headlines themselves.
  if (!reports.length) {
    reports = shortlist.slice(0, 8).map((item, n) => ({
      ...base(item, n, n),
      whatItSays: item.title,
      keyFigures: [],
      soWhat: "",
      relevance: item.trust === "official" ? 80 : 65,
    }));
  }

  return { reports, sourcesScanned: items.length, model: ACE_MODEL_LABEL, ranAt: new Date().toISOString() };
}


export type SocialPost = {
  id: string;
  issuer: string;
  category: string;
  title: string;
  url: string;
  date: string;
  linkedin: string;
  x?: string;
  trust: "official" | "verified";
  /** One-line factual read of the notice. */
  whatItSays: string;
  /** Our own commentary to add on top when reposting. */
  ourTake: string;
};

export async function socialAgent() {
  const { fetchNoticeItems } = await import("./feeds.server");
  let items: Awaited<ReturnType<typeof fetchNoticeItems>> = [];
  try {
    items = await fetchNoticeItems();
  } catch {
    items = [];
  }

  const shortlist = items.slice(0, 12);
  const base = (i: (typeof shortlist)[number], n: number) => ({
    id: `soc-${n}`,
    issuer: i.issuer,
    category: i.category,
    title: i.title,
    url: i.url,
    date: relativeDate(i.publishedAt),
    linkedin: i.linkedin,
    x: i.x,
    trust: (i.trust ?? "official") as "official" | "verified",
  });

  let posts: SocialPost[] = [];
  try {
    const payload = shortlist.map((i, n) => `${n}. [${i.issuer}] ${i.title}`).join("\n");
    const out = await chatJSON<{ posts: { index: number; whatItSays: string; ourTake: string }[] }>([
      {
        role: "system",
        content: `You prepare reposts of official UAE institution announcements for a B2B company page.\n${BRAND_BRIEF}\nReturn strict JSON only.`,
      },
      {
        role: "user",
        content: `Official notices from verified issuer accounts:\n${payload}\n\nReturn JSON:
{"posts":[{"index":0,"whatItSays":"one factual sentence, max 22 words","ourTake":"2 short lines of our own commentary to add when resharing, practical, no hype"}]}
Never invent facts beyond the headline.`,
      },
    ]);
    posts = (out.posts ?? [])
      .filter((p) => shortlist[p.index])
      .map((p, n) => ({ ...base(shortlist[p.index]!, n), whatItSays: p.whatItSays, ourTake: p.ourTake ?? "" }));
  } catch {
    posts = [];
  }

  if (!posts.length) {
    posts = shortlist.map((i, n) => ({ ...base(i, n), whatItSays: i.title, ourTake: "" }));
  }

  return { posts, model: ACE_MODEL_LABEL, ranAt: new Date().toISOString() };
}
