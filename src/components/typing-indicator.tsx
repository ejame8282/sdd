import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-4 justify-start">
      <Avatar className="h-8 w-8 border">
        <AvatarFallback>
          <Bot size={20} />
        </AvatarFallback>
      </Avatar>
      <div className="rounded-lg px-4 py-2 bg-muted flex items-center space-x-1">
        <span className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce" />
      </div>
    </div>
  );
}