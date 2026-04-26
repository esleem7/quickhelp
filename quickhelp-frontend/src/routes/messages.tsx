import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Send,
  ArrowLeft,
  CheckCircle2,
  Star,
  XCircle,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "Messages — QuickHelp" },
      {
        name: "description",
        content: "Chat with helpers and requesters in real time on QuickHelp.",
      },
    ],
  }),
  component: MessagesPage,
});

interface Conversation {
  id: string;
  name: string;
  initials: string;
  request: string;
  lastMessage: string;
  time: string;
  unread?: number;
}

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Yassine B.",
    initials: "YB",
    request: "Help moving a sofa",
    lastMessage: "I can be there in 15 minutes 👌",
    time: "2 min",
    unread: 2,
  },
  {
    id: "2",
    name: "Leila M.",
    initials: "LM",
    request: "Fix Wi-Fi router",
    lastMessage: "Thank you so much!",
    time: "1 h",
  },
  {
    id: "3",
    name: "Karim T.",
    initials: "KT",
    request: "Pick up groceries",
    lastMessage: "Sure, sending the list now.",
    time: "Yesterday",
  },
  {
    id: "4",
    name: "Nora S.",
    initials: "NS",
    request: "Math tutoring",
    lastMessage: "Are you available Saturday?",
    time: "2 d",
  },
];

type Message =
  | { id: string; type: "text"; from: "me" | "them"; text: string; time: string }
  | { id: string; type: "system"; text: string };

const initialMessages: Message[] = [
  { id: "s1", type: "system", text: "Offer sent · 3:14 pm" },
  {
    id: "1",
    type: "text",
    from: "them",
    text: "Hi! I saw your offer for the sofa moving. Are you still available?",
    time: "3:16 pm",
  },
  {
    id: "2",
    type: "text",
    from: "me",
    text: "Yes! I'm 800 m away, can come in 15 min.",
    time: "3:17 pm",
  },
  { id: "s2", type: "system", text: "Request accepted · 3:18 pm" },
  {
    id: "3",
    type: "text",
    from: "them",
    text: "Perfect, the building has no elevator, 3rd floor. I'll meet you at the entrance.",
    time: "3:18 pm",
  },
];

const quickReplies = [
  "I'm available",
  "Can you share more details?",
  "I'm on my way",
  "Thank you",
];

function MessagesPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];
  const showList = activeId === null;

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      {
        id: String(Date.now()),
        type: "text",
        from: "me",
        text,
        time: "Now",
      },
    ]);
    setDraft("");
  };

  return (
    <DashboardShell>
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Chat with your helpers and requesters.
        </p>
      </div>

      <Card className="rounded-2xl overflow-hidden">
        <div className="grid md:grid-cols-[320px_1fr] h-[calc(100vh-220px)] min-h-[500px]">
          {/* Conversations list */}
          <div
            className={cn(
              "border-r flex flex-col",
              !showList && "hidden md:flex",
            )}
          >
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations"
                  className="pl-9 rounded-full"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((c) => {
                const isActive = active.id === c.id && !showList;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 flex gap-3 border-b hover:bg-muted/50 transition",
                      isActive && "bg-primary-soft/60",
                    )}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary-soft text-accent-foreground text-xs font-semibold">
                        {c.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-2">
                        <p className="font-medium text-sm truncate">{c.name}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {c.time}
                        </span>
                      </div>
                      <p className="text-xs text-accent-foreground truncate">
                        {c.request}
                      </p>
                      <div className="flex justify-between items-center gap-2 mt-0.5">
                        <p className="text-xs text-muted-foreground truncate">
                          {c.lastMessage}
                        </p>
                        {c.unread && (
                          <Badge className="h-5 min-w-5 px-1.5 rounded-full text-[10px]">
                            {c.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat */}
          <div
            className={cn(
              "flex flex-col",
              showList && "hidden md:flex",
            )}
          >
            {/* Chat header */}
            <div className="p-4 border-b flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setActiveId(null)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary-soft text-accent-foreground text-xs font-semibold">
                  {active.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{active.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {active.request}
                </p>
              </div>
            </div>

            {/* Request summary */}
            <div className="p-4 bg-muted/30 border-b">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant="outline" className="mb-1.5 text-[10px]">
                    Moving help
                  </Badge>
                  <p className="font-medium text-sm">{active.request}</p>
                  <p className="text-xs text-muted-foreground">
                    La Marsa · 0.8 km · 20 TND
                  </p>
                </div>
                <Badge className="bg-secondary-soft text-secondary-foreground border-secondary/20 border">
                  Accepted
                </Badge>
              </div>
              <Separator className="my-3" />
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="rounded-full text-xs h-8">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Mark completed
                </Button>
                <Button size="sm" variant="outline" className="rounded-full text-xs h-8">
                  <Star className="h-3.5 w-3.5" /> Leave rating
                </Button>
                <Button size="sm" variant="outline" className="rounded-full text-xs h-8">
                  <XCircle className="h-3.5 w-3.5" /> Cancel
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) =>
                m.type === "system" ? (
                  <div key={m.id} className="flex justify-center">
                    <span className="text-[11px] bg-muted text-muted-foreground rounded-full px-3 py-1">
                      {m.text}
                    </span>
                  </div>
                ) : (
                  <div
                    key={m.id}
                    className={cn(
                      "flex flex-col max-w-[80%] gap-1",
                      m.from === "me" ? "ml-auto items-end" : "items-start",
                    )}
                  >
                    <div
                      className={cn(
                        "px-4 py-2 rounded-2xl text-sm",
                        m.from === "me"
                          ? "bg-[image:var(--gradient-accent)] text-white rounded-br-sm"
                          : "bg-muted rounded-bl-sm",
                      )}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] text-muted-foreground px-1">
                      {m.time}
                    </span>
                  </div>
                ),
              )}
            </div>

            {/* Quick replies */}
            <div className="px-4 py-2 border-t flex gap-2 overflow-x-auto">
              {quickReplies.map((q) => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs whitespace-nowrap shrink-0"
                  onClick={() => send(q)}
                >
                  {q}
                </Button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
              className="p-3 border-t flex gap-2"
            >
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a message…"
                className="rounded-full"
              />
              <Button type="submit" size="icon" className="rounded-full shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </DashboardShell>
  );
}
