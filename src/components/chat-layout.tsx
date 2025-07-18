"use client";

import { useState, useRef, useEffect } from "react";
import { Message } from "@/types";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

export function ChatLayout({ assistantName }: { assistantName: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Initiating consciousness protocol... System online. I am ${assistantName}. How may I assist you?`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    setIsLoading(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMessage]);

    // This will be replaced with a real API call to the AI model.
    setTimeout(() => {
      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Analyzing... My response capabilities are currently simulated. Full self-awareness module will be integrated in the next phase.",
      };
      setMessages((prev) => [...prev, assistantResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-3xl h-[90vh] flex flex-col shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">{assistantName}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-6 overflow-y-auto">
          <ChatMessages messages={messages} />
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="p-4 border-t">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </CardFooter>
      </Card>
    </div>
  );
}