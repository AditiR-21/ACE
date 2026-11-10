import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { calendar, type CalendarStatus, type CalendarEntry } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Content Calendar — ACE" },
      { name: "description", content: "Biweekly and monthly view of your LinkedIn content pipeline." },
      { property: "og:title", content: "Content Calendar — ACE" },
      { property: "og:description", content: "Draft, approved, scheduled, and published posts at a glance." },
    ],
  }),
  component: CalendarPage,
});

const statusTone: Record<CalendarStatus, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  approved: "bg-info/15 text-info border-info/30",
  scheduled: "bg-primary/15 text-primary border-primary/30",
  published: "bg-success/15 text-success border-success/30",
  missed: "bg-destructive/15 text-destructive border-destructive/30",
};

type DayCell = { date: Date; inMonth: boolean; entry?: CalendarEntry };

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
// Monday-first index
const mondayIndex = (d: Date) => (d.getDay() + 6) % 7;

/** Places the content plan on real publishing weekdays (Tue & Thu) of the given range. */
function buildSchedule(rangeStart: Date, rangeEnd: Date, today: Date): Map<string, CalendarEntry> {
  const map = new Map<string, CalendarEntry>();
  const slots: Date[] = [];
  for (let d = new Date(rangeStart); d <= rangeEnd; d = addDays(d, 1)) {
    if (d.getDay() === 2 || d.getDay() === 4) slots.push(new Date(d));
  }
  slots.forEach((d, i) => {
    const plan = calendar[i % calendar.length];
    const isPast = d < today;
    const isToday = d.getTime() === today.getTime();
    let status: CalendarStatus;
    if (isPast) status = plan.status === "missed" ? "missed" : "published";
    else if (isToday) status = "scheduled";
    else if (i % 5 === 3) status = "draft";
    else if (i % 5 === 4) status = "approved";
    else status = "scheduled";
    map.set(d.toDateString(), { day: d.getDate(), title: plan.title, status });
  });
  return map;
}

function CalendarPage() {
  const [view, setView] = useState<"month" | "biweek">("month");
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<{ date: Date; entry: CalendarEntry } | null>(null);

  const today = useMemo(() => startOfDay(new Date()), []);

  const { cells, label } = useMemo(() => {
    if (view === "month") {
      const first = new Date(today.getFullYear(), today.getMonth() + offset, 1);
      const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
      const gridStart = addDays(first, -mondayIndex(first));
      const gridEnd = addDays(last, 6 - mondayIndex(last));
      const schedule = buildSchedule(gridStart, gridEnd, today);
      const out: DayCell[] = [];
      for (let d = new Date(gridStart); d <= gridEnd; d = addDays(d, 1)) {
        out.push({
          date: new Date(d),
          inMonth: d.getMonth() === first.getMonth(),
          entry: schedule.get(d.toDateString()),
        });
      }
      return {
        cells: out,
        label: first.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
      };
    }

    const base = addDays(today, offset * 14);
    const start = addDays(base, -mondayIndex(base));
    const end = addDays(start, 13);
    const schedule = buildSchedule(start, end, today);
    const out: DayCell[] = [];
    for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
      out.push({ date: new Date(d), inMonth: true, entry: schedule.get(d.toDateString()) });
    }
    const fmt: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
    return {
      cells: out,
      label: `${start.toLocaleDateString(undefined, fmt)} – ${end.toLocaleDateString(undefined, { ...fmt, year: "numeric" })}`,
    };
  }, [view, offset, today]);

  return (
    <AppShell
      title="Content Calendar"
      description="Plan biweekly. Publish weekly. Never repeat."
      actions={
        <div className="flex items-center gap-1 rounded-lg border p-0.5">
          <Button size="sm" variant={view === "month" ? "default" : "ghost"} className="h-7 text-xs" onClick={() => { setView("month"); setOffset(0); }}>Monthly</Button>
          <Button size="sm" variant={view === "biweek" ? "default" : "ghost"} className="h-7 text-xs" onClick={() => { setView("biweek"); setOffset(0); }}>Biweekly</Button>
        </div>
      }
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setOffset((o) => o - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{label}</span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setOffset((o) => o + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          {offset !== 0 && (
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setOffset(0)}>Today</Button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {(Object.keys(statusTone) as CalendarStatus[]).map((s) => (
            <div key={s} className="flex items-center gap-1.5 text-[11px] capitalize text-muted-foreground">
              <span className={`h-2 w-2 rounded-sm border ${statusTone[s]}`} />
              {s}
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="mb-2 grid grid-cols-7 gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="px-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((c) => {
              const isToday = c.date.getTime() === today.getTime();
              return (
                <button
                  key={c.date.toISOString()}
                  onClick={() => c.entry && setSelected({ date: c.date, entry: c.entry })}
                  className={`flex min-h-24 flex-col rounded-lg border p-2 text-left transition-colors hover:border-primary/40 hover:bg-accent/30 ${
                    c.inMonth ? "" : "opacity-40"
                  } ${isToday ? "border-primary ring-1 ring-primary/40" : ""}`}
                >
                  <span className={`text-[11px] font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                    {c.date.getDate()}
                    {isToday && <span className="ml-1 text-[9px] uppercase tracking-wide">Today</span>}
                  </span>
                  {c.entry && (
                    <span className={`mt-auto rounded-md border px-1.5 py-1 text-[10px] leading-tight ${statusTone[c.entry.status]}`}>
                      {c.entry.title}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.entry.title}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <Badge className={statusTone[selected.entry.status] + " capitalize"} variant="outline">
                {selected.entry.status}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {selected.entry.status === "published" ? "Published on" : "Scheduled for"}{" "}
                {selected.date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                . Draft generated by the ACE Writer Agent, approved via Content Studio.
              </p>
              <div className="flex gap-2">
                <Button size="sm">Open draft</Button>
                <Button size="sm" variant="outline">Reschedule</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
