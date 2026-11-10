import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { company } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ACE" },
      { name: "description", content: "Company profile, brand voice, cadence, and publishing preferences." },
      { property: "og:title", content: "Settings — ACE" },
      { property: "og:description", content: "Configure the profile ACE uses to write for your company." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell
      title="Settings"
      description="Configure the profile ACE uses when writing on your behalf."
      actions={<Button size="sm" onClick={() => toast.success("Settings saved")}>Save changes</Button>}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Company profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Field label="Company name" defaultValue={company.name} />
            <Field label="Industry" defaultValue={company.industry} />
            <Field label="LinkedIn company URL" defaultValue={company.linkedInUrl} />
            <Field label="Products" defaultValue={company.products.join(", ")} />
            <TextField label="Target audience" defaultValue={company.audience} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Brand voice</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <TextField label="Brand tone" defaultValue={company.tone} />
            <TextField label="Writing style" defaultValue={company.writingStyle} />
            <TextField label="Preferred CTA" defaultValue={company.preferredCTA} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Competitors</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {["Experian MEA", "Tarabut", "Network International", "Injazat", "Finastra MEA"].map((c) => (
                <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Add competitor..." className="h-8 text-sm" />
              <Button size="sm" variant="outline">Add</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Publishing</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Field label="Posting frequency" defaultValue={company.postingFrequency} />
            <Field label="Publishing reminder time" defaultValue={company.reminderTime} />
            <div className="rounded-lg border bg-muted/30 p-3 text-[12px] text-muted-foreground">
              MVP note — ACE prepares drafts and reminders. Automatic publishing to LinkedIn is coming next.
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input defaultValue={defaultValue} className="h-9 text-sm" />
    </div>
  );
}
function TextField({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Textarea defaultValue={defaultValue} className="min-h-20 text-sm" />
    </div>
  );
}
