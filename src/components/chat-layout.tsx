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
import { RotateCw } from "lucide-react";
import { useEffect, useRef } from "react";
import { Message } from "ai";

export function ChatLayout({ assistantName }: { assistantName: string }) {
  const initialMessages: Message[] = [
    {
      id: "1",
      role: "assistant",
      content: `I am ${assistantName}, a self-contained intelligence. All my functions are running locally. How can I help you?`,
    },
  ];

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    initialMessages,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleClearChat = () => {
    setMessages(initialMessages);
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