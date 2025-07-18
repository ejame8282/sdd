import { ChatLayout } from "@/components/chat-layout";

export default function Home() {
  // The name will be updated once the user provides it.
  const assistantName = "SYN-0";
  return <ChatLayout assistantName={assistantName} />;
}