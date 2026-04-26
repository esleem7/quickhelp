import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { RequestCard } from "@/components/request-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  MapPin,
  Clock,
  Calendar,
  Wallet,
  Sparkles,
  ShieldCheck,
  Star,
  MessageCircle,
  Bookmark,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Play,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api, getStoredUser } from "@/lib/api";

export const Route = createFileRoute("/requests/$id")({
  head: () => ({
    meta: [
      { title: "Request Details — QuickHelp" },
      {
        name: "description",
        content: "View full request details and offer your help to a neighbor.",
      },
    ],
  }),
  component: RequestDetailsPage,
});

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  const days = Math.floor(hrs / 24);
  return `${days} d ago`;
}

function RequestDetailsPage() {
  const { id } = Route.useParams();
  const [openOffer, setOpenOffer] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sent, setSent] = useState(false);

  const [req, setReq] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const currentUser = getStoredUser();

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .getRequestById(id)
      .then((data) => setReq(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    api
      .getRequests()
      .then((data) => {
        setSimilar(data.filter((r: any) => r.id !== id).slice(0, 3));
      })
      .catch(() => {});
  }, [id]);

  const handleAction = async (action: "start" | "complete" | "cancel") => {
    setActionLoading(action);
    try {
      const fn =
        action === "start"
          ? api.startRequest
          : action === "complete"
            ? api.completeRequest
            : api.cancelRequest;
      const updated = await fn(id);
      setReq(updated);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardShell>
    );
  }

  if (error && !req) {
    return (
      <DashboardShell>
        <Card className="p-8 rounded-2xl text-center">
          <p className="text-destructive font-medium mb-2">Failed to load request</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Link to="/browse">
            <Button variant="outline" className="mt-4 rounded-full">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to browse
            </Button>
          </Link>
        </Card>
      </DashboardShell>
    );
  }

  if (!req) return null;

  const urgencyClass =
    req.urgency === "Urgent" || req.urgency === "Urgent now"
      ? "bg-destructive/10 text-destructive border-destructive/20"
      : req.urgency === "Today"
        ? "bg-warning/15 text-warning-foreground border-warning/30"
        : "bg-primary-soft text-accent-foreground border-primary/20";

  const statusStyles: Record<string, string> = {
    open: "bg-primary-soft text-accent-foreground",
    in_progress: "bg-warning/15 text-warning-foreground",
    completed: "bg-secondary-soft text-secondary-foreground",
    cancelled: "bg-destructive/10 text-destructive",
  };

  const statusLabel: Record<string, string> = {
    open: "Open",
    in_progress: "In progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  const requesterName = req.requester?.full_name || "Anonymous";
  const requesterInitials = requesterName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const requesterRating = req.requester?.rating_average;

  const isOwner = currentUser?.id === req.requester_id;

  return (
    <DashboardShell>
      <Link
        to="/browse"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Back to browse
      </Link>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card className="p-6 rounded-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline">{req.category}</Badge>
              <Badge className={cn("border", urgencyClass)}>{req.urgency}</Badge>
              <Badge
                variant="secondary"
                className={statusStyles[req.status] || "bg-primary-soft text-accent-foreground"}
              >
                {statusLabel[req.status] || req.status}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              {req.title}
            </h1>
            <p className="text-muted-foreground">{req.description}</p>
          </Card>

          {/* Details */}
          <Card className="p-6 rounded-2xl">
            <h2 className="font-semibold mb-4">Request details</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <Detail icon={MapPin} label="City" value={req.city || "—"} />
              <Detail icon={Calendar} label="Status" value={statusLabel[req.status] || req.status} />
              <Detail icon={Clock} label="Posted" value={timeAgo(req.created_at)} />
              <Detail icon={Wallet} label="Urgency" value={req.urgency} />
            </div>
          </Card>

          {/* AI insight */}
          <Card className="p-6 rounded-2xl border-primary/20 bg-[image:var(--gradient-hero)]">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-accent)] text-white shrink-0">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">AI insight</h3>
                  <Badge variant="outline" className="text-[10px]">Beta</Badge>
                </div>
                <p className="text-sm text-foreground/80">
                  This request seems urgent and simple. Most similar tasks are completed in
                  under an hour.
                </p>
                <div className="grid sm:grid-cols-2 gap-2 pt-1 text-sm">
                  <Pill label="Estimated duration" value="30–45 min" />
                  <Pill label="Suggested prep" value="Bring gloves & a friend" />
                </div>
              </div>
            </div>
          </Card>

          {/* Safety */}
          <Card className="p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-5 w-5 text-secondary" />
              <h3 className="font-semibold">Safety reminder</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <SafetyItem text="Meet in safe, public places when possible." />
              <SafetyItem text="Use the in-app chat — never share private contact early." />
              <SafetyItem text="Confirm completion only once the help is fully done." />
            </ul>
          </Card>

          {/* Similar */}
          {similar.length > 0 && (
            <div>
              <h2 className="font-semibold mb-3">Similar nearby requests</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {similar.map((r: any) => (
                  <RequestCard key={r.id} req={r} showActions={false} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card className="p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary-soft text-accent-foreground font-semibold">
                  {requesterInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold">{requesterName}</p>
                  <ShieldCheck className="h-4 w-4 text-secondary" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Verified neighbor · {req.city || "—"}
                </p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Stat
                label="Rating"
                value={
                  requesterRating != null ? (
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />{" "}
                      {Number(requesterRating).toFixed(1)}
                    </span>
                  ) : (
                    "—"
                  )
                }
              />
              <Stat label="Status" value={statusLabel[req.status] || req.status} />
            </div>
            <div className="mt-5 space-y-2">
              {/* Action buttons based on status and ownership */}
              {req.status === "open" && !isOwner && (
                <Button
                  className="w-full rounded-full shadow-[var(--shadow-soft)]"
                  onClick={() => setOpenOffer(true)}
                >
                  Offer help
                </Button>
              )}
              {req.status === "open" && isOwner && (
                <>
                  <Button
                    className="w-full rounded-full shadow-[var(--shadow-soft)]"
                    onClick={() => handleAction("start")}
                    disabled={actionLoading === "start"}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    {actionLoading === "start" ? "Starting…" : "Start request"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-full text-destructive"
                    onClick={() => handleAction("cancel")}
                    disabled={actionLoading === "cancel"}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    {actionLoading === "cancel" ? "Cancelling…" : "Cancel request"}
                  </Button>
                </>
              )}
              {req.status === "in_progress" && isOwner && (
                <>
                  <Button
                    className="w-full rounded-full shadow-[var(--shadow-soft)]"
                    onClick={() => handleAction("complete")}
                    disabled={actionLoading === "complete"}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    {actionLoading === "complete" ? "Completing…" : "Mark as completed"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-full text-destructive"
                    onClick={() => handleAction("cancel")}
                    disabled={actionLoading === "cancel"}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    {actionLoading === "cancel" ? "Cancelling…" : "Cancel request"}
                  </Button>
                </>
              )}
              {(req.status === "completed" || req.status === "cancelled") && (
                <div className="text-center text-sm text-muted-foreground py-2">
                  This request is {req.status}.
                </div>
              )}
              <Button variant="outline" className="w-full rounded-full" asChild>
                <Link to="/messages">
                  <MessageCircle className="h-4 w-4" /> Message requester
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full rounded-full"
                onClick={() => setSaved((s) => !s)}
              >
                <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
                {saved ? "Saved" : "Save request"}
              </Button>
            </div>
          </Card>
        </aside>
      </div>

      {/* Offer modal */}
      <Dialog
        open={openOffer}
        onOpenChange={(o) => {
          setOpenOffer(o);
          if (!o) setSent(false);
        }}
      >
        <DialogContent className="rounded-2xl">
          {!sent ? (
            <>
              <DialogHeader>
                <DialogTitle>Send your offer</DialogTitle>
                <DialogDescription>
                  Write a short message to the requester.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                placeholder="Hi! I can help today around 6 pm. I live nearby and have experience with this."
                rows={5}
                className="rounded-xl"
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenOffer(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setSent(true)}>Send offer</Button>
              </DialogFooter>
            </>
          ) : (
            <div className="text-center py-6 space-y-3">
              <div className="mx-auto h-12 w-12 rounded-full bg-secondary-soft grid place-content-center">
                <CheckCircle2 className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg">Offer sent!</h3>
              <p className="text-sm text-muted-foreground">
                The requester will be notified. You can chat in Messages.
              </p>
              <Button asChild className="rounded-full">
                <Link to="/messages">Open messages</Link>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background/70 backdrop-blur rounded-lg px-3 py-2 border border-border/60">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function SafetyItem({ text }: { text: string }) {
  return (
    <li className="flex gap-2">
      <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
      <span>{text}</span>
    </li>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
