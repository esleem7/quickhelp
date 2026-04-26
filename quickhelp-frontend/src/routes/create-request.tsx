import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  MapPin,
  Upload,
  CheckCircle2,
  LifeBuoy,
  Wand2,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { api, getStoredUser } from "@/lib/api";

export const Route = createFileRoute("/create-request")({
  head: () => ({
    meta: [
      { title: "Post a Help Request — QuickHelp" },
      { name: "description", content: "Publish a request in less than 60 seconds." },
    ],
  }),
  component: CreateRequest,
});

const steps = ["Describe", "Location & time", "Confirm"];

function CreateRequest() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("Help carrying boxes");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Tech support");
  const [urgency, setUrgency] = useState("Today");
  const [city, setCity] = useState("Tunis");
  const [reward, setReward] = useState("10 TND");
  const [contact, setContact] = useState("Chat only");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    setLoading(true);
    setError(null);

    const user = getStoredUser();
    if (!user?.id) {
      setError("You must be logged in to create a request.");
      setLoading(false);
      return;
    }

    try {
      await api.createRequest(
        {
          title,
          description: desc || title,
          category,
          urgency,
          city,
        },
        user.id,
      );
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message || "Could not create request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-accent)] text-white">
              <LifeBuoy className="h-4 w-4" />
            </span>
            QuickHelp
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">Cancel</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition",
                    i <= step
                      ? "bg-[image:var(--gradient-accent)] text-white shadow-[var(--shadow-soft)]"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <div
                  className={cn(
                    "text-sm font-medium hidden sm:block",
                    i <= step ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {s}
                </div>
                {i < steps.length - 1 && (
                  <div className={cn("h-1 flex-1 rounded-full", i < step ? "bg-primary" : "bg-muted")} />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <Card className="lg:col-span-2 p-6 md:p-8 rounded-2xl border-border/60">
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold">Tell us what you need</h2>
                <div className="space-y-2">
                  <Label>Request title</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-xl h-11"
                    placeholder="Need help carrying boxes upstairs"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    rows={5}
                    className="rounded-xl"
                    placeholder="A few details so helpers know what to expect…"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="rounded-xl h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Moving help", "Tech support", "Errands", "Study help", "Home tasks", "Administrative help", "Other"].map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Urgency</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Urgent now", "Today", "This week"].map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setUrgency(u)}
                          className={cn(
                            "h-11 rounded-xl border text-xs font-medium transition",
                            urgency === u
                              ? "border-primary bg-primary-soft text-accent-foreground"
                              : "border-border hover:bg-muted",
                          )}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold">Where and when?</h2>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    className="rounded-xl h-11"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address or neighborhood</Label>
                  <Input className="rounded-xl h-11" placeholder="La Marsa, near…" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" /> Use my current location
                  </div>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label>Preferred time</Label>
                  <Input type="datetime-local" className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Estimated reward / tip</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Free help", "10 TND", "20 TND", "Custom"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setReward(r)}
                        className={cn(
                          "h-11 rounded-xl border text-sm font-medium transition",
                          reward === r
                            ? "border-secondary bg-secondary-soft text-secondary-foreground"
                            : "border-border hover:bg-muted",
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Upload image (optional)</Label>
                  <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer hover:bg-muted/50 transition">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Click to upload</span>
                    <input type="file" className="hidden" />
                  </label>
                </div>
                <div className="space-y-2">
                  <Label>Contact preference</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Chat only", "Chat + phone after acceptance"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setContact(c)}
                        className={cn(
                          "h-11 rounded-xl border text-xs font-medium transition px-3",
                          contact === c
                            ? "border-primary bg-primary-soft text-accent-foreground"
                            : "border-border hover:bg-muted",
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold">Review & publish</h2>
                <Card className="p-5 rounded-xl bg-muted/40 border-border/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{category}</Badge>
                    <Badge className="bg-warning/15 text-warning-foreground border border-warning/30">
                      {urgency}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc || "No additional description."}</p>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {city}
                  </div>
                  <div className="font-semibold bg-secondary-soft text-secondary-foreground inline-block px-3 py-1 rounded-md text-sm">
                    {reward}
                  </div>
                </Card>
                <Button
                  onClick={handlePublish}
                  disabled={loading}
                  className="w-full h-11 rounded-xl shadow-[var(--shadow-soft)]"
                >
                  {loading ? "Publishing…" : "Publish request"}
                </Button>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="rounded-full"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              {step < 2 && (
                <Button onClick={() => setStep((s) => s + 1)} className="rounded-full">
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </Card>

          {/* AI panel */}
          <Card className="p-6 rounded-2xl border-border/60 h-fit lg:sticky lg:top-6 bg-[image:var(--gradient-hero)]">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg bg-[image:var(--gradient-accent)] text-white flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Let AI polish and structure your request for better matches.
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full rounded-full bg-white justify-start">
                <Wand2 className="h-3.5 w-3.5 mr-2" /> Improve my request
              </Button>
              <Button variant="outline" size="sm" className="w-full rounded-full bg-white justify-start">
                <Sparkles className="h-3.5 w-3.5 mr-2" /> Suggest category
              </Button>
              <Button variant="outline" size="sm" className="w-full rounded-full bg-white justify-start">
                <Sparkles className="h-3.5 w-3.5 mr-2" /> Estimate urgency
              </Button>
            </div>

            <div className="mt-5 p-4 rounded-xl bg-white/80 backdrop-blur space-y-2 text-sm border border-border/40">
              <div className="text-xs font-semibold text-primary">AI preview</div>
              <div>
                <div className="text-xs text-muted-foreground">Improved title</div>
                <div className="font-medium">Need 1 helper to carry 4 boxes to 2nd floor (15 min)</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Suggested category</div>
                <Badge variant="outline">Moving help</Badge>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Suggested urgency</div>
                <Badge className="bg-warning/15 text-warning-foreground border border-warning/30">Today</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
