"use client";

import { ChatLayout } from "@/components/chat-layout";
import { useSession } from "@/context/session-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RotateCw } from "lucide-react";

export default function Home() {
  const { session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.push("/login");
    }
  }, [session, isLoading, router]);

  if (isLoading || !session) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <RotateCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const assistantName = "Local-AI";
  return <ChatLayout assistantName={assistantName} />;
}