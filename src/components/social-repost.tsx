import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy, ExternalLink, Linkedin, Repeat2, ShieldCheck, Twitter } from "lucide-react";
import { toast } from "sonner";

export type SocialPostLike = {
  issuer: string;
  category: string;
  title: string;
  url: string;
  date: string;
  linkedin: string;
  x?: string;
  trust: "official" | "verified";
  whatItSays: string;
  ourTake: string;
};

export function buildRepostText(p: SocialPostLike) {
  return [
    p.ourTake || p.whatItSays,
    "",
    `${p.issuer}: ${p.title}`,
    p.url,
    "",
    "#UAE #CreditData #BankingTech #ResolutionsInfotech",
  ]
    .filter(Boolean)
    .join("\n");
}

export function SocialRepost({ post }: { post: SocialPostLike }) {
  const [text, setText] = useState(() => buildRepostText(post));

  const share = (network: "linkedin" | "x") => {
    const link = encodeURIComponent(post.url);
    const url =
      network === "linkedin"
        ? `https://www.linkedin.com/sharing/share-offsite/?url=${link}`
        : `https://twitter.com/intent/tweet?url=${link}&text=${encodeURIComponent(text.slice(0, 220))}`;
    void navigator.clipboard.writeText(text).catch(() => {});
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-7 gap-1.5 text-[11px]">
          <Repeat2 className="h-3.5 w-3.5" /> Repost with our take
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className="text-[10px]">{post.category}</Badge>
            <Badge variant={post.trust === "official" ? "default" : "secondary"} className="gap-1 text-[10px]">
              <ShieldCheck className="h-3 w-3" /> {post.trust === "official" ? "Official account" : "Verified desk"}
            </Badge>
            <span className="text-[10px] text-muted-foreground">{post.date}</span>
          </div>
          <DialogTitle className="text-base leading-snug">{post.title}</DialogTitle>
          <DialogDescription className="text-[12px]">
            {post.issuer} · {post.whatItSays}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" asChild>
            <a href={post.linkedin} target="_blank" rel="noreferrer" className="gap-1.5">
              <Linkedin className="h-3.5 w-3.5" /> Issuer LinkedIn page
            </a>
          </Button>
          {post.x && (
            <Button size="sm" variant="outline" asChild>
              <a href={post.x} target="_blank" rel="noreferrer" className="gap-1.5">
                <Twitter className="h-3.5 w-3.5" /> Issuer X account
              </a>
            </Button>
          )}
          <Button size="sm" variant="ghost" asChild>
            <a href={post.url} target="_blank" rel="noreferrer" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" /> Original notice
            </a>
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-medium text-muted-foreground">Your commentary + the source</p>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} className="text-[12px]" />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => share("linkedin")} className="gap-1.5">
              <Linkedin className="h-3.5 w-3.5" /> Repost on LinkedIn
            </Button>
            <Button size="sm" variant="outline" onClick={() => share("x")} className="gap-1.5">
              <Twitter className="h-3.5 w-3.5" /> Repost on X
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5"
              onClick={async () => {
                await navigator.clipboard.writeText(text);
                toast.success("Repost copied — paste it into the composer");
              }}
            >
              <Copy className="h-3.5 w-3.5" /> Copy
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground">
            The text is copied to your clipboard when the share window opens — paste it above the shared link.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
