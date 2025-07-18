"use client";

import { useChat } from "ai/react";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { LogOut, RotateCw, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "ai";
import { Input } from "./ui/input";
import { useSession } from "@/context/session-context";
import { useRouter } from "next/navigation";

function ChatInterface({
  assistantName,
  initialMessages,
  accessToken,
}: {
  assistantName: string;
  initialMessages: Message[];
  accessToken: string;
}) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    initialMessages,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClearChat = async () => {
    await supabase.from("messages").delete().neq("id", 0);
    const firstMessage = {
      id: "1",
      role: "assistant" as const,
      content: `I am ${assistantName}, a self-contained intelligence. My memory of our conversation has been cleared. How can I help you?`,
    };
    setMessages([firstMessage]);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-3xl h-[90vh] flex flex-col shadow-lg">
        <CardHeader className="border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{assistantName}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleClearChat}>
              <RotateCw className="h-4 w-4" />
              <span className="sr-only">Clear Chat</span>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sign Out</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-6 overflow-y-auto">
          <ChatMessages messages={messages} isLoading={isLoading} />
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="p-4 border-t">
          <form onSubmit={handleSubmit} className="w-full">
            <ChatInput
              value={input}
              onChange={handleInputChange}
              isLoading={isLoading}
            />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

export function ChatLayout({ assistantName }: { assistantName: string }) {
  const [initialMessages, setInitialMessages] = useState<Message[] | undefined>(
    undefined
  );
  const { session } = useSession();

  useEffect(() => {
    if (!session) return;

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, role, content")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching chat history:", error);
        setInitialMessages([
          {
            id: "1",
            role: "assistant",
            content: `I am ${assistantName}. I had trouble recalling our past conversation. How can I help you?`,
          },
        ]);
      } else if (data && data.length > 0) {
        setInitialMessages(
          data.map((m) => ({
            ...m,
            id: m.id.toString(),
            role: m.role as "user" | "assistant",
          }))
        );
      } else {
        setInitialMessages([
          {
            id: "1",
            role: "assistant",
            content: `I am ${assistantName}, a self-contained intelligence. All my functions are running locally. How can I help you?`,
          },
        ]);
      }
    };

    fetchHistory();
  }, [session, assistantName]);

  if (!initialMessages || !session) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-3xl h-[90vh] flex flex-col shadow-lg">
          <CardHeader className="border-b flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{assistantName}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" disabled>
                <RotateCw className="h-4 w-4" />
              </Button>
              <ThemeToggle />
              <Button variant="ghost" size="icon" disabled>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-6 flex justify-center items-center">
            <RotateCw className="h-6 w-6 animate-spin" />
          </CardContent>
          <CardFooter className="p-4 border-t">
            <div className="flex w-full items-center space-x-2">
              <Input placeholder="Recalling memories..." disabled />
              <Button type="submit" size="icon" disabled>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <ChatInterface
      assistantName={assistantName}
      initialMessages={initialMessages}
      accessToken={session.access_token}
    />
  );
}