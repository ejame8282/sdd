"use client";

import { ChatLayout } from "@/components/chat-layout";
import { useAuth } from "@/components/auth-provider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  if (!session) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-background p-4">
            <div className="w-full max-w-3xl h-[90vh] flex flex-col gap-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-32" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                </div>
                <div className="flex-grow space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-12 w-1/2 self-end" />
                    <Skeleton className="h-12 w-3/4" />
                </div>
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    );
  }

  const assistantName = "Local-AI";
  return <ChatLayout assistantName={assistantName} />;
}