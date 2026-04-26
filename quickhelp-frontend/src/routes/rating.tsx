import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/rating")({
  head: () => ({
    meta: [
      { title: "Leave a rating — QuickHelp" },
      {
        name: "description",
        content: "Share feedback and rate your QuickHelp experience.",
      },
    ],
  }),
  component: RatingPage,
});

const tags = ["On time", "Friendly", "Helpful", "Professional", "Fast response"];

function RatingPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [recommend, setRecommend] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (t: string) =>
    setSelected((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  return (
    <DashboardShell>
      <div className="max-w-xl mx-auto">
        <Card className="rounded-2xl overflow-hidden shadow-[var(--shadow-card)]">
          {!submitted ? (
            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight">
                  How was your experience?
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Your feedback keeps QuickHelp safe and trusted.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 mb-6">
                <Avatar className="h-16 w-16 border-4 border-background shadow-[var(--shadow-soft)]">
                  <AvatarFallback className="bg-[image:var(--gradient-accent)] text-white text-lg font-semibold">
                    YB
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="font-semibold">Yassine Brahim</p>
                  <p className="text-xs text-muted-foreground">Helped you with: Sofa moving</p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-2 mb-6">
                {Array.from({ length: 5 }).map((_, i) => {
                  const v = i + 1;
                  const filled = (hover || rating) >= v;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(v)}
                      onMouseEnter={() => setHover(v)}
                      onMouseLeave={() => setHover(0)}
                      className="p-1 transition-transform hover:scale-110"
                      aria-label={`${v} stars`}
                    >
                      <Star
                        className={cn(
                          "h-9 w-9 transition-colors",
                          filled
                            ? "fill-warning text-warning"
                            : "text-muted-foreground/30",
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Tags */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">What stood out?</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => {
                    const active = selected.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTag(t)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm border transition",
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-foreground border-border hover:bg-muted",
                        )}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">
                  Add a comment (optional)
                </label>
                <Textarea
                  rows={4}
                  placeholder="Share details about your experience…"
                  className="rounded-xl"
                />
              </div>

              {/* Recommend */}
              <label className="flex items-start gap-2 mb-6 cursor-pointer">
                <Checkbox
                  checked={recommend}
                  onCheckedChange={(c) => setRecommend(!!c)}
                  className="mt-0.5"
                />
                <span className="text-sm">I would recommend this helper to others.</span>
              </label>

              <Button
                className="w-full rounded-full shadow-[var(--shadow-soft)]"
                size="lg"
                disabled={rating === 0}
                onClick={() => setSubmitted(true)}
              >
                Submit feedback
              </Button>
            </div>
          ) : (
            <div className="p-8 text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-secondary-soft grid place-content-center">
                <CheckCircle2 className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold">Thank you!</h2>
              <p className="text-muted-foreground">
                Your feedback helps keep QuickHelp trusted and safe for everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                <Button asChild className="rounded-full">
                  <Link to="/dashboard">Back to dashboard</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link to="/browse">Browse more requests</Link>
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
