// Real news retrieval — no simulated data. Public RSS feeds fetched at request time.
export type FeedItem = {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
  /** Source trust tier: "official" = government / regulator issued, "verified" = established news desk. */
  trust?: "official" | "verified";
  /** Direct link to the underlying PDF / document, when known. */
  docUrl?: string;
};

const gnews = (q: string, window = "14d") =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q)}${window ? `+when:${window}` : ""}&hl=en-US&gl=US&ceid=US:en`;

export const FEEDS: { category: string; url: string; label: string }[] = [
  { category: "Credit Bureau", label: "Al Etihad Credit Bureau news", url: gnews('"Al Etihad Credit Bureau" OR "AECB" UAE credit score') },
  { category: "UAE Banking", label: "UAE banking & CBUAE", url: gnews("UAE banks OR 'Central Bank of the UAE' lending digital") },
  { category: "FinTech", label: "Gulf fintech", url: gnews("UAE OR Abu Dhabi fintech payments open finance") },
  { category: "GovTech", label: "UAE digital government", url: gnews("UAE digital government OR UAE PASS OR TDRA digital identity") },
  { category: "Enterprise IT", label: "Middle East enterprise IT", url: gnews("Middle East enterprise software OR system integration OR data platform") },
  { category: "AI", label: "AI in financial services", url: gnews("AI in banking OR credit risk AI OR agentic AI enterprise") },
  { category: "Cybersecurity", label: "Regional cybersecurity", url: gnews("UAE cybersecurity OR data protection compliance") },
  { category: "Industry", label: "Finextra headlines", url: "https://www.finextra.com/rss/headlines.aspx" },
  { category: "Industry", label: "Khaleej Times business", url: "https://www.khaleejtimes.com/rss/business" },
  { category: "Technology", label: "TechCrunch", url: "https://techcrunch.com/feed/" },
];

// ---------------------------------------------------------------------------
// Official publications: only government / regulator issuers, or established
// news desks reporting on them. Anything else is discarded.
// ---------------------------------------------------------------------------

// Publishers that ARE the institution (government-affiliated issuers).
const OFFICIAL_PUBLISHERS = [
  "centralbank.ae", "central bank of the uae", "cbuae", "مصرف الإمارات",
  "aecb.gov.ae", "al etihad credit bureau", "الاتحاد للمعلومات الائتمانية",
  "u.ae", "uae government", "المنصة الرسمية", "government.ae",
  "wam", "wam.ae", "emirates news agency", "وكالة أنباء الإمارات",
  "adgm", "abu dhabi global market", "dfsa", "dubai financial services authority",
  "sca.gov.ae", "securities and commodities authority",
  "tdra", "telecommunications and digital government",
  "ministry of", "abu dhabi department", "digital dubai", "dubai government",
  "mohre", "moec.gov.ae", "mof.gov.ae", "adgm.com", "difc",
];

// Established news desks — accepted as secondary, clearly-labelled coverage.
const VERIFIED_MEDIA = [
  "the national", "gulf news", "khaleej times", "zawya", "reuters", "bloomberg",
  "arabian business", "agbi", "arabian gulf business insight", "the banker",
  "finextra", "argaam", "tradearabia", "gulf business", "meed", "s&p global",
  "fitch", "moody's", "pwc", "kpmg", "deloitte", "ey ",
];

function classify(source: string): "official" | "verified" | null {
  const s = source.toLowerCase();
  if (OFFICIAL_PUBLISHERS.some((p) => s.includes(p))) return "official";
  if (VERIFIED_MEDIA.some((p) => s.includes(p))) return "verified";
  return null;
}

export const REPORT_QUERIES: { category: string; label: string; query: string }[] = [
  { category: "CBUAE", label: "Central Bank of the UAE", query: '"Central Bank of the UAE" OR CBUAE report OR bulletin OR circular OR indicators' },
  { category: "CBUAE", label: "CBUAE statistics", query: '"Central Bank of the UAE" monetary statistics OR "banking indicators" OR "statistical bulletin"' },
  { category: "AECB", label: "Al Etihad Credit Bureau", query: '"Al Etihad Credit Bureau" OR AECB credit report OR credit score OR study' },
  { category: "UAE Government", label: "UAE government publications", query: '"UAE government" OR "Ministry of Economy" UAE strategy OR report digital economy OR data' },
  { category: "Regulator", label: "ADGM / DFSA / SCA", query: '"Abu Dhabi Global Market" OR DFSA OR "Securities and Commodities Authority" consultation OR framework OR report' },
  { category: "News Agency", label: "Emirates News Agency (WAM)", query: 'WAM "Emirates News Agency" UAE central bank OR credit OR digital economy' },
];

export const REPORT_FEEDS: { category: string; url: string; label: string }[] = REPORT_QUERIES.map((q) => ({
  category: q.category,
  label: q.label,
  url: gnews(q.query),
}));


function tag(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decode(m[1]) : "";
}

function decode(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
}

function parseFeed(xml: string, category: string, fallbackSource: string): FeedItem[] {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  return blocks
    .map((b) => {
      let title = tag(b, "title");
      let source = tag(b, "source") || fallbackSource;
      // Google News formats titles as "Headline - Publisher"
      const split = title.match(/^(.*)\s+-\s+([^-]{2,40})$/);
      if (split && tag(b, "source")) title = split[1];
      else if (split) {
        title = split[1];
        source = split[2];
      }
      return {
        title,
        url: tag(b, "link"),
        source,
        publishedAt: tag(b, "pubDate"),
        category,
      };
    })
    .filter((i) => i.title && i.url);
}

export async function fetchFeedItems(categories?: string[], perFeed = 4): Promise<FeedItem[]> {
  const feeds = categories?.length
    ? FEEDS.filter((f) => categories.includes(f.category))
    : FEEDS;

  const results = await Promise.all(
    feeds.map(async (f) => {
      try {
        const res = await fetch(f.url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; ACE-ResearchAgent/1.0)" },
          signal: AbortSignal.timeout(7000),
        });
        if (!res.ok) return [] as FeedItem[];
        return parseFeed(await res.text(), f.category, f.label).slice(0, perFeed);
      } catch {
        return [] as FeedItem[];
      }
    }),
  );

  const seen = new Set<string>();
  return results.flat().filter((i) => {
    const k = i.title.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function dedupe(items: FeedItem[]): FeedItem[] {
  const seen = new Set<string>();
  return items.filter((i) => {
    const k = i.title.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

async function fetchOne(url: string, category: string, label: string, perFeed: number): Promise<FeedItem[]> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ACE-ResearchAgent/1.0)" },
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return [];
    return parseFeed(await res.text(), category, label).slice(0, perFeed);
  } catch {
    return [];
  }
}

/** Keep only government/regulator issuers and established news desks, drop noise. */
function vetted(items: FeedItem[]): FeedItem[] {
  return items
    .map((i) => ({ ...i, trust: classify(i.source) }))
    .filter((i): i is FeedItem & { trust: "official" | "verified" } => {
      if (!i.trust) return false;
      // Drop boilerplate / non-substantive headlines.
      const words = i.title.split(/\s+/).filter(Boolean);
      if (words.length < 4) return false;
      if (/^cbuae classification/i.test(i.title)) return false;
      return true;
    });
}

function rank(items: FeedItem[]): FeedItem[] {
  return [...items].sort((a, b) => {
    if (a.trust !== b.trust) return a.trust === "official" ? -1 : 1;
    return (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0);
  });
}

// Curated archive of standing official publications / announcement hubs.
// Every URL below was verified against the live issuer site.
// Used whenever live retrieval is thin or slow, so the panel is never empty.
export const CURATED_OFFICIAL: FeedItem[] = [
  {
    title: "CBUAE Annual Report 2025 (PDF) — banking indicators, credit growth, financial stability",
    url: "https://www.centralbank.ae/en/news-and-publications/publications/cbuae-annual-reports/central-bank-annual-report-2025/",
    docUrl: "https://www.centralbank.ae/media/4qbn11cl/annual-report-2025-en.pdf",
    source: "Central Bank of the UAE",
    publishedAt: "",
    category: "CBUAE",
    trust: "official",
  },
  {
    title: "CBUAE Publications — reports, circulars and regulatory notices",
    url: "https://www.centralbank.ae/en/news-and-publications/publications/",
    source: "Central Bank of the UAE",
    publishedAt: "",
    category: "CBUAE",
    trust: "official",
  },
  {
    title: "CBUAE Financial Stability Report 2024 — household and corporate credit risk",
    url: "https://www.centralbank.ae/en/news-and-publications/publications/financial-stability-report/financial-stability-report-for-the-year-2024/",
    source: "Central Bank of the UAE",
    publishedAt: "",
    category: "CBUAE",
    trust: "official",
  },
  {
    title: "CBUAE Statistical Bulletin — monthly banking & monetary statistics",
    url: "https://www.centralbank.ae/en/research-and-statistics/latest-statistics/statistical-bulletin-banking-monetary-statistics/",
    source: "Central Bank of the UAE",
    publishedAt: "",
    category: "CBUAE",
    trust: "official",
  },
  {
    title: "AECB Credit Report & Credit Score — individual products and data sources",
    url: "https://etihadbureau.ae/Individual/CreditReport",
    source: "Al Etihad Credit Bureau",
    publishedAt: "",
    category: "AECB",
    trust: "official",
  },
  {
    title: "AECB Commercial Credit Report — company profiles and member reporting",
    url: "https://etihadbureau.ae/Business/CreditReport",
    source: "Al Etihad Credit Bureau",
    publishedAt: "",
    category: "AECB",
    trust: "official",
  },
  {
    title: "UAE Government — credit reports for individuals and companies (official service page)",
    url: "https://u.ae/en/information-and-services/business/financial-credibility-for-individuals-and-companies",
    source: "UAE Government",
    publishedAt: "",
    category: "UAE Government",
    trust: "official",
  },
  {
    title: "ADGM public consultations — regulatory frameworks and consultation papers",
    url: "https://www.adgm.com/legal-framework/public-consultations",
    source: "Abu Dhabi Global Market",
    publishedAt: "",
    category: "Regulator",
    trust: "official",
  },
  {
    title: "ADGM announcements — official media releases",
    url: "https://www.adgm.com/media/announcements",
    source: "Abu Dhabi Global Market",
    publishedAt: "",
    category: "Regulator",
    trust: "official",
  },
  {
    title: "DFSA news and regulatory announcements",
    url: "https://www.dfsa.ae/news",
    source: "Dubai Financial Services Authority",
    publishedAt: "",
    category: "Regulator",
    trust: "official",
  },
  {
    title: "Emirates News Agency (WAM) — official UAE government newswire",
    url: "https://www.wam.ae/en",
    source: "Emirates News Agency (WAM)",
    publishedAt: "",
    category: "News Agency",
    trust: "official",
  },
  {
    title: "Securities and Commodities Authority — regulations and disclosures",
    url: "https://www.sca.gov.ae/en/home.aspx",
    source: "Securities and Commodities Authority",
    publishedAt: "",
    category: "Regulator",
    trust: "official",
  },
];

let reportCache: { at: number; items: FeedItem[] } | null = null;
const REPORT_TTL_MS = 10 * 60 * 1000;

// Single parallel sweep across query x time-window (fast), then merge with the
// curated official archive so the panel always has substantive material.
export async function fetchReportItems(perFeed = 6): Promise<FeedItem[]> {
  if (reportCache && Date.now() - reportCache.at < REPORT_TTL_MS) return reportCache.items;

  const windows = ["30d", "1y"];
  const jobs = REPORT_QUERIES.flatMap((f) =>
    windows.map((w) => fetchOne(gnews(f.query, w), f.category, f.label, perFeed)),
  );

  let live: FeedItem[] = [];
  try {
    live = vetted((await Promise.all(jobs)).flat());
  } catch {
    live = [];
  }

  const merged = rank(dedupe(live));
  const officialCount = merged.filter((i) => i.trust === "official").length;
  const result = officialCount >= 4 ? merged : rank(dedupe([...merged, ...CURATED_OFFICIAL]));

  reportCache = { at: Date.now(), items: result };
  return result;
}



export function relativeDate(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "Recent";
  const h = Math.floor((Date.now() - t) / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "Yesterday" : `${d} days ago`;
}

// ---------------------------------------------------------------------------
// Official social accounts & notices
// Verified LinkedIn company pages and X handles of the institutions we track.
// LinkedIn/X have no public post feeds, so we surface each issuer's live
// notices (from their newsroom / official newswire coverage) alongside direct
// links to their verified profiles, ready to repost with our own commentary.
// ---------------------------------------------------------------------------
export type OfficialAccount = {
  name: string;
  category: string;
  linkedin: string;
  x?: string;
  /** Google News query that isolates this issuer's own announcements. */
  query: string;
};

export const OFFICIAL_ACCOUNTS: OfficialAccount[] = [
  {
    name: "Central Bank of the UAE",
    category: "CBUAE",
    linkedin: "https://www.linkedin.com/company/central-bank-of-the-uae/",
    x: "https://x.com/CBUAE",
    query: '"Central Bank of the UAE" OR CBUAE announcement OR circular OR statement',
  },
  {
    name: "Al Etihad Credit Bureau",
    category: "AECB",
    linkedin: "https://www.linkedin.com/company/al-etihad-credit-bureau/",
    x: "https://x.com/AECB_UAE",
    query: '"Al Etihad Credit Bureau" OR AECB announcement OR launch OR credit score',
  },
  {
    name: "UAE Government",
    category: "UAE Government",
    linkedin: "https://www.linkedin.com/company/uaegov/",
    x: "https://x.com/uaegov",
    query: '"UAE government" digital economy OR services OR strategy announcement',
  },
  {
    name: "Emirates News Agency (WAM)",
    category: "News Agency",
    linkedin: "https://www.linkedin.com/company/emirates-news-agency-wam/",
    x: "https://x.com/wamnews",
    query: 'WAM "Emirates News Agency" UAE banking OR credit OR digital',
  },
  {
    name: "Abu Dhabi Global Market",
    category: "Regulator",
    linkedin: "https://www.linkedin.com/company/abu-dhabi-global-market/",
    x: "https://x.com/ADGlobalMarket",
    query: '"Abu Dhabi Global Market" ADGM announcement OR framework OR consultation',
  },
  {
    name: "Dubai Financial Services Authority",
    category: "Regulator",
    linkedin: "https://www.linkedin.com/company/dubai-financial-services-authority/",
    x: "https://x.com/DFSA",
    query: 'DFSA "Dubai Financial Services Authority" notice OR rulebook OR enforcement',
  },
];

export type NoticeItem = FeedItem & { issuer: string; linkedin: string; x?: string };

let noticeCache: { at: number; items: NoticeItem[] } | null = null;

/** Live notices grouped by verified official account, never empty. */
export async function fetchNoticeItems(perAccount = 3): Promise<NoticeItem[]> {
  if (noticeCache && Date.now() - noticeCache.at < REPORT_TTL_MS) return noticeCache.items;

  const results = await Promise.all(
    OFFICIAL_ACCOUNTS.map(async (a) => {
      const items = vetted(await fetchOne(gnews(a.query, "60d"), a.category, a.name, perFeedCap));
      return items.slice(0, perAccount).map((i) => ({ ...i, issuer: a.name, linkedin: a.linkedin, x: a.x }));
    }),
  );

  let items = dedupe(results.flat()) as NoticeItem[];

  // Guarantee every verified account is represented, even with no live notice.
  const covered = new Set(items.map((i) => i.issuer));
  for (const a of OFFICIAL_ACCOUNTS) {
    if (covered.has(a.name)) continue;
    const curated = CURATED_OFFICIAL.find((c) => c.source.toLowerCase().includes(a.name.toLowerCase().slice(0, 12)));
    items.push({
      ...(curated ?? {
        title: `${a.name} — latest official announcements`,
        url: a.linkedin,
        source: a.name,
        publishedAt: "",
        category: a.category,
        trust: "official" as const,
      }),
      issuer: a.name,
      linkedin: a.linkedin,
      x: a.x,
    });
  }

  items = rank(items) as NoticeItem[];
  noticeCache = { at: Date.now(), items };
  return items;
}

const perFeedCap = 6;
