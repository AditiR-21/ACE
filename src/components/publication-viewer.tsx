import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, FileText, Linkedin, Twitter, Copy, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export type PublicationLike = {
  title: string;
  publisher: string;
  category: string;
  url: string;
  docUrl?: string;
  date: string;
  whatItSays: string;
  soWhat?: string;
  keyFigures?: { label: string; value: string }[];
  trust: "official" | "verified";
};

/** Google News links are redirect wrappers — never embeddable. */
function isEmbeddable(url: string) {
  return /\.pdf($|\?)/i.test(url);
}

export function buildRepostCaption(p: PublicationLike) {
  const figures = (p.keyFigures ?? []).map((f) => `• ${f.label}: ${f.value}`).join("\n");
  return [
    p.title,
    "",
    p.whatItSays,
    figures,
    p.soWhat ? `Why it matters: ${p.soWhat}` : "",
    "",
    `Source: ${p.publisher}`,
    p.docUrl ?? p.url,
    "",
    "#UAE #CreditData #BankingTech #ResolutionsInfotech",
  ]
    .filter(Boolean)
    .join("\n");
}

export function PublicationViewer({ publication }: { publication: PublicationLike }) {
  const [caption, setCaption] = useState(() => buildRepostCaption(publication));
  const target = publication.docUrl ?? publication.url;
  const embeddable = isEmbeddable(target);

  const copy = async () => {
    await navigator.clipboard.writeText(caption);
    toast.success("Caption copied — paste it into your post");
  };

  const share = (network: "linkedin" | "x") => {
    const link = encodeURIComponent(target);
    const url =
      network === "linkedin"
        ? `https://www.linkedin.com/sharing/share-offsite/?url=${link}`
        : `https://twitter.com/intent/tweet?url=${link}&text=${encodeURIComponent(
            `${publication.title} — ${publication.publisher}`,
          )}`;
    void navigator.clipboard.writeText(caption).catch(() => {});
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-7 gap-1.5 text-[11px]">
          <FileText className="h-3.5 w-3.5" />
          {publication.docUrl ? "Open PDF" : "Open document"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className="text-[10px]">{publication.category}</Badge>
            <Badge variant={publication.trust === "official" ? "default" : "secondary"} className="gap-1 text-[10px]">
              <ShieldCheck className="h-3 w-3" />
              {publication.trust === "official" ? "Official issuer" : "Verified desk"}
            </Badge>
            <span className="text-[10px] text-muted-foreground">{publication.date}</span>
          </div>
          <DialogTitle className="text-base leading-snug">{publication.title}</DialogTitle>
          <DialogDescription className="text-[12px]">
            {publication.publisher} · {publication.whatItSays}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/30">
          {embeddable ? (
            <iframe
              title={publication.title}
              src={target}
              className="h-[52vh] w-full rounded-lg"
            />
          ) : (
            <div className="space-y-2 p-5 text-center">
              <FileText className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="text-[12px] text-muted-foreground">
                This issuer blocks in-app embedding. Open the original announcement in a new tab.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" asChild>
            <a href={target} target="_blank" rel="noreferrer" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" /> Open original
            </a>
          </Button>
          {publication.docUrl && publication.docUrl !== publication.url && (
            <Button size="sm" variant="outline" asChild>
              <a href={publication.url} target="_blank" rel="noreferrer" className="gap-1.5">
                Publisher page
              </a>
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-medium text-muted-foreground">Repost in context</p>
          <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={7} className="text-[12px]" />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => share("linkedin")} className="gap-1.5">
              <Linkedin className="h-3.5 w-3.5" /> Repost on LinkedIn
            </Button>
            <Button size="sm" variant="outline" onClick={() => share("x")} className="gap-1.5">
              <Twitter className="h-3.5 w-3.5" /> Repost on X
            </Button>
            <Button size="sm" variant="ghost" onClick={copy} className="gap-1.5">
              <Copy className="h-3.5 w-3.5" /> Copy caption
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground">
            The caption is copied to your clipboard when the share window opens — paste it into the composer.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
