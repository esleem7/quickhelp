import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  Wallet,
  Banknote,
  Lock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Payments — QuickHelp" },
      {
        name: "description",
        content: "Send rewards and tips for completed help requests, securely.",
      },
    ],
  }),
  component: PaymentsPage,
});

const methods = [
  {
    id: "card",
    label: "Credit card",
    icon: CreditCard,
    desc: "Visa · Mastercard",
  },
  {
    id: "wallet",
    label: "QuickHelp wallet",
    icon: Wallet,
    desc: "Balance: 45 TND",
  },
  {
    id: "cash",
    label: "Cash after completion",
    icon: Banknote,
    desc: "Pay your helper in person",
  },
];

const transactions = [
  {
    id: "TXN-1042",
    title: "Sofa moving · Yassine B.",
    date: "Apr 22, 2026",
    amount: "20 TND",
    status: "Paid",
  },
  {
    id: "TXN-1041",
    title: "Wi-Fi setup · Leila M.",
    date: "Apr 18, 2026",
    amount: "15 TND",
    status: "Paid",
  },
  {
    id: "TXN-1040",
    title: "Groceries · Karim T.",
    date: "Apr 14, 2026",
    amount: "10 TND",
    status: "Pending",
  },
  {
    id: "TXN-1039",
    title: "Cancelled request",
    date: "Apr 10, 2026",
    amount: "20 TND",
    status: "Refunded",
  },
] as const;

const statusStyles: Record<string, string> = {
  Paid: "bg-secondary-soft text-secondary-foreground border-secondary/20",
  Pending: "bg-warning/15 text-warning-foreground border-warning/30",
  Refunded: "bg-muted text-muted-foreground border-border",
};

function PaymentsPage() {
  const [method, setMethod] = useState("card");
  const [tip, setTip] = useState(5);

  const base = 20;
  const fee = 2;
  const total = base + tip + fee;

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground">
            Reward your helpers securely.
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-secondary" /> Secure checkout
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <Card className="p-6 rounded-2xl">
            <h2 className="font-semibold mb-4">Payment summary</h2>
            <div className="space-y-3 text-sm">
              <Row label="Request" value="Help moving a sofa to 3rd floor" />
              <Row label="Helper" value="Yassine Brahim" />
              <Separator />
              <Row label="Base reward" value={`${base} TND`} />
              <Row
                label="Optional tip"
                value={
                  <div className="flex gap-1">
                    {[0, 5, 10].map((v) => (
                      <button
                        key={v}
                        onClick={() => setTip(v)}
                        className={cn(
                          "px-2.5 py-1 rounded-md border text-xs font-medium transition",
                          tip === v
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border hover:bg-muted",
                        )}
                      >
                        +{v}
                      </button>
                    ))}
                  </div>
                }
              />
              <Row label="Platform service fee" value={`${fee} TND`} />
              <Separator />
              <div className="flex justify-between items-center pt-1">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">{total} TND</span>
              </div>
            </div>
          </Card>

          {/* Method */}
          <Card className="p-6 rounded-2xl">
            <h2 className="font-semibold mb-4">Payment method</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {methods.map((m) => {
                const Icon = m.icon;
                const active = method === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      "text-left p-4 rounded-xl border-2 transition",
                      active
                        ? "border-primary bg-primary-soft/40"
                        : "border-border hover:border-primary/30",
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-background border">
                        <Icon className="h-4 w-4 text-primary" />
                      </span>
                      {active && (
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                      )}
                    </div>
                    <p className="font-medium text-sm">{m.label}</p>
                    <p className="text-xs text-muted-foreground">{m.desc}</p>
                  </button>
                );
              })}
            </div>

            {method === "card" && (
              <div className="mt-5 space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Card number
                  </label>
                  <Input
                    placeholder="4242 4242 4242 4242"
                    className="rounded-xl mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Expiry
                    </label>
                    <Input placeholder="MM / YY" className="rounded-xl mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      CVC
                    </label>
                    <Input placeholder="123" className="rounded-xl mt-1" />
                  </div>
                </div>
              </div>
            )}

            <Button className="w-full mt-6 rounded-full shadow-[var(--shadow-soft)]" size="lg">
              <Lock className="h-4 w-4" /> Pay {total} TND securely
            </Button>
            <p className="text-[11px] text-center text-muted-foreground mt-3">
              Payment integration can be connected to Stripe or local payment providers
              in production.
            </p>
          </Card>

          {/* Transactions */}
          <Card className="p-6 rounded-2xl">
            <h2 className="font-semibold mb-4">Transaction history</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono text-xs">{t.id}</TableCell>
                      <TableCell className="max-w-[220px] truncate">
                        {t.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {t.date}
                      </TableCell>
                      <TableCell className="font-medium">{t.amount}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn("border text-xs", statusStyles[t.status])}
                        >
                          {t.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        {/* Side */}
        <aside className="space-y-6">
          <Card className="p-6 rounded-2xl bg-[image:var(--gradient-hero)] border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-secondary" />
              <h3 className="font-semibold">Secure by design</h3>
            </div>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li className="flex gap-2">
                <Lock className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                256-bit encryption on every transaction.
              </li>
              <li className="flex gap-2">
                <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-secondary" />
                Funds released only after you confirm completion.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-secondary" />
                Full refund if a request is cancelled.
              </li>
            </ul>
          </Card>

          <Card className="p-6 rounded-2xl">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Wallet balance
            </p>
            <p className="text-3xl font-bold">45 TND</p>
            <Button variant="outline" className="w-full rounded-full mt-3">
              Top up wallet
            </Button>
          </Card>
        </aside>
      </div>
    </DashboardShell>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
