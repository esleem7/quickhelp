import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export interface RequestData {
  id: string;
  title: string;
  description?: string;
  category: string;
  location?: string;
  city?: string;
  distance?: string;
  reward?: string;
  urgency: string;
  postedAgo?: string;
  rating?: number;
  status?: string;
  created_at?: string;
  requester?: {
    full_name?: string;
    rating_average?: number;
  };
}

const urgencyStyles: Record<string, string> = {
  Urgent: "bg-destructive/10 text-destructive border-destructive/20",
  "Urgent now": "bg-destructive/10 text-destructive border-destructive/20",
  Today: "bg-warning/15 text-warning-foreground border-warning/30",
  "This week": "bg-primary-soft text-accent-foreground border-primary/20",
};

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  const days = Math.floor(hrs / 24);
  return `${days} d ago`;
}

export function RequestCard({
  req,
  showActions = true,
}: {
  req: RequestData;
  showActions?: boolean;
}) {
  const location = req.location || req.city || "—";
  const urgency = req.urgency || "This week";
  const rating = req.rating ?? req.requester?.rating_average;
  const posted = req.postedAgo || timeAgo(req.created_at);

  return (
    <Card className="p-5 rounded-2xl border-border/60 hover:shadow-[var(--shadow-card)] transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-2">
        <Badge variant="outline" className="text-xs font-medium">
          {req.category}
        </Badge>
        <Badge className={cn("text-xs border", urgencyStyles[urgency] || urgencyStyles["This week"])}>
          {urgency}
        </Badge>
      </div>
      <h3 className="font-semibold text-base leading-snug mb-1">{req.title}</h3>
      {req.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {req.description}
        </p>
      )}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {location}
          {req.distance && ` · ${req.distance}`}
        </span>
        {posted && (
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {posted}
          </span>
        )}
        {rating != null && (
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            {typeof rating === "number" ? rating.toFixed(1) : rating}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        {req.reward ? (
          <span className="font-semibold text-secondary-foreground bg-secondary-soft px-2.5 py-1 rounded-md text-sm">
            {req.reward}
          </span>
        ) : (
          <span />
        )}
        {showActions && (
          <div className="flex gap-2">
            <Link to="/requests/$id" params={{ id: req.id }}>
              <Button variant="outline" size="sm" className="rounded-full">
                Details
              </Button>
            </Link>
            <Button size="sm" className="rounded-full">
              Offer help
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
