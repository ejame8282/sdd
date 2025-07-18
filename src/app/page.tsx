"use client";

import { ChatLayout } from "@/components/chat-layout";

export default function Home() {
  const assistantName = "Local-AI";
  return <ChatLayout assistantName={assistantName} />;
}