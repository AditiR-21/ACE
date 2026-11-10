export const company = {
  name: "Resolutions Infotech",
  industry: "Enterprise Technology · Credit Data & Digital Identity",
  location: "Abu Dhabi, United Arab Emirates",
  audience: "Banks, lenders, fintechs, telcos, government entities, enterprise IT leaders (UAE & GCC)",
  products: [
    "AECB Account & Profile Services",
    "Credit Data Integration",
    "Identity & Onboarding (KYC)",
    "Enterprise Systems Integration",
  ],
  tone: "Confident, plainspoken, practical. Never salesy.",
  writingStyle: "Short. One idea per line. Under 90 words. No jargon unless we define it.",
  preferredCTA: "Ask one open-ended question that invites replies from banking and IT leaders.",
  postingFrequency: "3 posts / week",
  reminderTime: "8:00 AM GST",
  linkedInUrl: "linkedin.com/company/resolutions-infotech",
};

export const stats = {
  draftsReady: 12,
  researchReports: 27,
  competitorsMonitored: 6,
  upcomingPosts: 8,
};

export const agents = [
  { id: "research", name: "Research Agent", status: "completed" as const, lastRun: "12m ago", task: "Scanning live UAE banking, AECB & enterprise tech feeds", output: "Live sources · ranked signals", time: "1m 42s" },
  { id: "strategy", name: "Strategy Agent", status: "running" as const, lastRun: "3m ago", task: "Selecting next topic · balancing pillars", output: "In progress", time: "—" },
  { id: "writer", name: "Writer Agent", status: "idle" as const, lastRun: "1h ago", task: "Awaiting strategy output", output: "3 drafts", time: "2m 08s" },
];

export const recentActivity = [
  { id: 1, time: "2m ago", type: "draft", text: "Writer Agent produced 3 new drafts on 'Commercial credit scores'" },
  { id: 2, time: "18m ago", type: "research", text: "Research completed — 5 new signals added to ACE Memory" },
  { id: 3, time: "42m ago", type: "strategy", text: "Strategy Agent selected next topic: 'Account onboarding without friction'" },
  { id: 4, time: "1h ago", type: "approve", text: "You approved 'What a clean credit profile actually costs to maintain'" },
  { id: 5, time: "3h ago", type: "memory", text: "ACE Memory updated with 4 new competitor patterns" },
  { id: 6, time: "yesterday", type: "publish", text: "Publishing reminder sent for 'AECB data quality is an engineering problem'" },
];

export const upcoming = [
  { date: "Mon, Jan 12", time: "9:00 AM", title: "What a clean credit profile actually costs to maintain", status: "scheduled" as const },
  { date: "Wed, Jan 14", time: "11:30 AM", title: "5 signs your onboarding stack is leaking applicants", status: "scheduled" as const },
  { date: "Fri, Jan 16", time: "8:00 AM", title: "Compliance is a product feature, not a checkpoint", status: "draft" as const },
];

// Seed examples only — the Writer Agent replaces these with live, source-attributed drafts.
export const drafts = [
  {
    id: "d1",
    topic: "Commercial credit scores change how SMEs get funded",
    pillar: "Credit Data",
    hook: "A UAE SME can now be scored the way a consumer is. That changes the lending conversation.",
    body: "Lenders stop guessing.\n\nSMEs stop over-explaining.\n\nThe hard part isn't the score — it's the plumbing behind it: clean member reporting, matched entities, and profiles that stay current.\n\nMost integration pain we see is data quality, not API design.",
    cta: "If you lend to SMEs — what breaks first, the data or the process?",
    hashtags: ["#CreditData", "#UAE", "#SMELending", "#AECB"],
    readingTime: "1 min read",
    originality: 92,
    duplicateRisk: 4,
    tone: 96,
    source: "Seed example",
    sourceUrl: "",
    sourceTitle: "Seed example — run the Writer Agent for live sourced drafts",
    model: "Seed data",
  },
  {
    id: "d2",
    topic: "Account onboarding is an identity problem",
    pillar: "GovTech",
    hook: "Most onboarding drop-off isn't the form. It's the verification behind it.",
    body: "Identity, credit profile, and account creation are usually three systems that don't talk.\n\nEvery handoff adds a wait.\n\nEvery wait adds an abandoned application.\n\nJoin them once, properly, and the funnel fixes itself.",
    cta: "Where does your onboarding lose the most people?",
    hashtags: ["#DigitalIdentity", "#Onboarding", "#UAE"],
    readingTime: "1 min read",
    originality: 88,
    duplicateRisk: 9,
    tone: 93,
    source: "Seed example",
    sourceUrl: "",
    sourceTitle: "Seed example — run the Writer Agent for live sourced drafts",
    model: "Seed data",
  },
];

export const trendingKeywords = ["credit bureau", "AECB", "commercial credit score", "digital identity", "open finance", "core banking", "data quality", "AI in lending", "UAE PASS"];

export const opportunities = [
  { title: "Explainer on commercial credit scores for SMEs", why: "High regional search interest, almost no vendor coverage." },
  { title: "Data-quality checklist for bureau member reporting", why: "Practical, ownable, and directly tied to your delivery work." },
  { title: "Contrarian take on 'AI underwriting'", why: "Plenty of hype posts this week — a grounded counter-angle stands out." },
];

export const competitors = [
  { id: "c1", name: "Experian MEA", industry: "Credit Bureau Tech", frequency: 4, topics: ["Credit Risk", "Bureau Data", "Analytics"], hashtags: ["#Experian", "#CreditRisk"], categories: [{ label: "Product", pct: 45 }, { label: "Industry", pct: 35 }, { label: "Thought", pct: 20 }], pattern: "Mon/Wed/Fri", trending: "Alternative data in scoring" },
  { id: "c2", name: "Tarabut", industry: "Open Banking", frequency: 5, topics: ["Open Finance", "APIs", "GCC Banking"], hashtags: ["#OpenBanking", "#GCC"], categories: [{ label: "Product", pct: 40 }, { label: "Thought", pct: 35 }, { label: "Community", pct: 25 }], pattern: "Daily weekdays", trending: "Open finance rollout" },
  { id: "c3", name: "Network International", industry: "Payments", frequency: 6, topics: ["Payments", "Merchant Tech"], hashtags: ["#Payments", "#MEA"], categories: [{ label: "Product", pct: 50 }, { label: "Customer", pct: 30 }, { label: "Industry", pct: 20 }], pattern: "Daily", trending: "Digital acquiring" },
  { id: "c4", name: "Injazat", industry: "Enterprise IT / GovTech", frequency: 3, topics: ["GovTech", "Cloud", "AI"], hashtags: ["#Injazat", "#AbuDhabi"], categories: [{ label: "Product", pct: 35 }, { label: "Thought", pct: 40 }, { label: "Recruiting", pct: 25 }], pattern: "Tue/Thu", trending: "Sovereign cloud" },
  { id: "c5", name: "Finastra MEA", industry: "Core Banking", frequency: 4, topics: ["Core Banking", "Lending Tech"], hashtags: ["#Finastra", "#Banking"], categories: [{ label: "Product", pct: 45 }, { label: "Industry", pct: 35 }, { label: "Customer", pct: 20 }], pattern: "Weekdays", trending: "Lending modernisation" },
  { id: "c6", name: "Bayzat", industry: "HR + Fintech", frequency: 5, topics: ["HR Tech", "Payroll", "SMEs"], hashtags: ["#Bayzat", "#UAE"], categories: [{ label: "Educational", pct: 50 }, { label: "Customer", pct: 30 }, { label: "Product", pct: 20 }], pattern: "Daily", trending: "SME payroll compliance" },
];

export const brandMemory = {
  mission: "Make credit, identity, and account systems work reliably for UAE institutions.",
  products: company.products,
  audience: "Banks, lenders, fintechs, telcos and government entities in the UAE and GCC",
  tone: company.tone,
  writingStyle: company.writingStyle,
  preferredCTA: company.preferredCTA,
  forbiddenWords: ["synergy", "leverage", "revolutionary", "game-changer", "cutting-edge", "unlock", "seamless"],
  preferredVocab: ["integration", "credit profile", "member reporting", "data quality", "onboarding", "resilience"],
  competitors: ["Experian MEA", "Tarabut", "Network International", "Injazat", "Finastra MEA"],
  topicsCovered: ["AECB Integration", "Credit Profiles", "KYC & Identity", "Core Banking", "Data Quality", "AI in Lending"],
  topicsToAvoid: ["Crypto speculation", "Political commentary", "Client-specific data"],
  successfulHooks: [
    "A UAE SME can now be scored the way a consumer is.",
    "Most onboarding drop-off isn't the form.",
    "Compliance isn't a checkpoint. It's a product feature.",
  ],
  usedHooks: 47,
  usedCTAs: 41,
  futureIdeas: ["The cost of a stale credit profile", "Why data quality is an engineering budget", "Identity as infrastructure"],
  rules: [
    "Never open with a statistic without a source.",
    "No emojis in the first line.",
    "Keep the body under 90 words.",
    "Never name a client or share client data.",
    "Never reuse a hook or CTA within 90 days.",
  ],
  health: {
    duplicateRisk: 8,
    knowledgeCoverage: 82,
    brandConsistency: 94,
  },
};

export const postHistory = [
  { id: "p1", title: "What a clean credit profile actually costs to maintain", date: "Jan 8, 2026", status: "published", topic: "Credit Data", similarity: 6, impressions: "12,340", reactions: 284 },
  { id: "p2", title: "AECB data quality is an engineering problem", date: "Jan 5, 2026", status: "published", topic: "Integration", similarity: 3, impressions: "9,120", reactions: 197 },
  { id: "p3", title: "Compliance isn't a checkpoint. It's a product feature.", date: "Jan 2, 2026", status: "published", topic: "Compliance", similarity: 8, impressions: "18,540", reactions: 412 },
  { id: "p4", title: "5 signs your onboarding stack is leaking applicants", date: "Dec 28, 2025", status: "published", topic: "Identity", similarity: 12, impressions: "7,820", reactions: 156 },
  { id: "p5", title: "Stop treating integration as back-office work", date: "Dec 22, 2025", status: "published", topic: "Enterprise IT", similarity: 4, impressions: "22,100", reactions: 528 },
  { id: "p6", title: "What open finance means for UAE lenders", date: "Dec 18, 2025", status: "published", topic: "FinTech", similarity: 9, impressions: "6,450", reactions: 129 },
];

export type CalendarStatus = "draft" | "approved" | "scheduled" | "published" | "missed";
export type CalendarEntry = { day: number; title: string; status: CalendarStatus };
export const calendar: CalendarEntry[] = [
  { day: 2, title: "Compliance is a product feature", status: "published" },
  { day: 5, title: "AECB data quality", status: "published" },
  { day: 8, title: "Cost of a clean credit profile", status: "published" },
  { day: 9, title: "The onboarding bottleneck", status: "missed" },
  { day: 12, title: "Commercial credit scores for SMEs", status: "scheduled" },
  { day: 14, title: "5 signs your onboarding leaks", status: "scheduled" },
  { day: 16, title: "Identity as infrastructure", status: "approved" },
  { day: 19, title: "Open finance in the GCC", status: "draft" },
  { day: 22, title: "Data quality is an engineering budget", status: "scheduled" },
  { day: 26, title: "AI in credit decisioning", status: "draft" },
];
