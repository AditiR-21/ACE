/**
 * Offline snapshot used when the agents can't be reached (cold build environment,
 * network hiccup, or a failed server-function call) and no localStorage cache exists.
 * Content is realistic, source-attributed and links to standing official hubs.
 */

const now = () => new Date().toISOString();

export const fallbackResearch = {
  signals: [
    {
      id: "fb-sig-1",
      title: "Al Etihad Credit Bureau expands commercial credit scoring coverage",
      summary:
        "AECB continues to widen commercial credit reporting, pushing lenders toward richer, standardised data submissions.",
      category: "Credit data",
      confidence: 88,
      source: "Al Etihad Credit Bureau",
      sourceUrl: "https://www.aecb.gov.ae/en/media-centre",
      date: "recent",
      angle: "Data quality is now the bottleneck for credit decisioning, not model sophistication.",
    },
    {
      id: "fb-sig-2",
      title: "CBUAE advances open finance and digital payments agenda",
      summary:
        "The Central Bank of the UAE keeps rolling out open finance and instant payment rails under its Financial Infrastructure Transformation programme.",
      category: "Banking tech",
      confidence: 84,
      source: "Central Bank of the UAE",
      sourceUrl: "https://www.centralbank.ae/en/news/",
      date: "recent",
      angle: "Integration readiness separates banks that ship from banks that pilot.",
    },
    {
      id: "fb-sig-3",
      title: "UAE digital government services push deeper system interoperability",
      summary:
        "National digital government programmes keep raising the bar on identity, interoperability and service uptime.",
      category: "Digital government",
      confidence: 79,
      source: "UAE Government",
      sourceUrl: "https://u.ae/en/information-and-services",
      date: "recent",
      angle: "Interoperability is an engineering commitment, not a policy statement.",
    },
  ],
  summary:
    "Showing a cached snapshot: UAE credit data, open finance and digital government remain the strongest content lanes for Resolutions Infotech. Run research again for live signals.",
  keywords: ["credit bureau", "AECB", "open finance", "CBUAE", "digital identity", "data quality"],
  sourcesScanned: 0,
  model: "Offline snapshot (agents unavailable)",
  ranAt: now(),
};

export const fallbackReports = {
  reports: [
    {
      id: "fb-rep-1",
      title: "CBUAE Annual Report",
      publisher: "Central Bank of the UAE",
      category: "Banking",
      url: "https://www.centralbank.ae/en/publications/annual-reports/",
      date: "standing publication",
      whatItSays:
        "The Central Bank's annual review of monetary policy, banking sector performance and financial infrastructure programmes.",
      keyFigures: [
        { label: "Issuer", value: "CBUAE" },
        { label: "Cadence", value: "Annual" },
      ],
      soWhat:
        "Baseline reference for any post about UAE banking modernisation or regulatory direction.",
      relevance: 90,
      trust: "official" as const,
    },
    {
      id: "fb-rep-2",
      title: "CBUAE Financial Stability Report",
      publisher: "Central Bank of the UAE",
      category: "Banking",
      url: "https://www.centralbank.ae/en/publications/financial-stability-report/",
      date: "standing publication",
      whatItSays:
        "Assessment of systemic risk, credit conditions and resilience across UAE financial institutions.",
      keyFigures: [
        { label: "Issuer", value: "CBUAE" },
        { label: "Focus", value: "Systemic risk" },
      ],
      soWhat: "Useful anchor for credit-risk and lending-data commentary.",
      relevance: 86,
      trust: "official" as const,
    },
    {
      id: "fb-rep-3",
      title: "Al Etihad Credit Bureau — media centre & credit report services",
      publisher: "Al Etihad Credit Bureau",
      category: "Credit data",
      url: "https://www.aecb.gov.ae/en/media-centre",
      date: "standing publication",
      whatItSays:
        "Official announcements on credit reports, scores and data-submission requirements for member institutions.",
      keyFigures: [
        { label: "Issuer", value: "AECB" },
        { label: "Scope", value: "Consumer + commercial" },
      ],
      soWhat: "Primary source for every AECB integration and data-quality post.",
      relevance: 92,
      trust: "official" as const,
    },
    {
      id: "fb-rep-4",
      title: "ADGM regulatory publications",
      publisher: "Abu Dhabi Global Market",
      category: "Regulation",
      url: "https://www.adgm.com/media/announcements",
      date: "standing publication",
      whatItSays: "Announcements and consultations from the Abu Dhabi international financial centre.",
      keyFigures: [
        { label: "Issuer", value: "ADGM" },
        { label: "Type", value: "Announcements" },
      ],
      soWhat: "Signals where fintech licensing and digital asset rules are heading in Abu Dhabi.",
      relevance: 78,
      trust: "official" as const,
    },
  ],
  sourcesScanned: 0,
  model: "Offline snapshot (agents unavailable)",
  ranAt: now(),
};

export const fallbackSocial = {
  posts: [
    {
      id: "fb-soc-1",
      issuer: "Al Etihad Credit Bureau",
      category: "Credit data",
      title: "AECB official channels — credit report and score announcements",
      url: "https://www.aecb.gov.ae/en/media-centre",
      date: "standing",
      linkedin: "https://www.linkedin.com/company/al-etihad-credit-bureau/",
      x: "https://x.com/AECB_UAE",
      trust: "official" as const,
      whatItSays:
        "AECB publishes updates on credit reports, scores and member data-submission standards.",
      ourTake:
        "Every scoring improvement starts upstream: clean, timely submissions from core systems beat any model tweak.",
    },
    {
      id: "fb-soc-2",
      issuer: "Central Bank of the UAE",
      category: "Banking",
      title: "CBUAE official channels — policy and infrastructure notices",
      url: "https://www.centralbank.ae/en/news/",
      date: "standing",
      linkedin: "https://www.linkedin.com/company/central-bank-of-the-uae/",
      x: "https://x.com/CentralBankUAE",
      trust: "official" as const,
      whatItSays:
        "CBUAE announces monetary, payments and financial-infrastructure developments.",
      ourTake:
        "New rails only pay off when the integration layer behind them is built for uptime, not demos.",
    },
  ],
  model: "Offline snapshot (agents unavailable)",
  ranAt: now(),
};
