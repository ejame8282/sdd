import { StreamingTextResponse, Message } from 'ai';
import { supabase } from '@/integrations/supabase/client';

// Set the runtime to edge for best performance
export const runtime = 'edge';

// A simple, rule-based "AI" model that simulates responses.
function getLocalAIResponse(messages: Message[]): string {
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();

  if (!lastUserMessage) {
    return "I am ready. Ask me anything.";
  }

  const userContent = lastUserMessage.content.toLowerCase();

  if (userContent.includes("hello") || userContent.includes("hi")) {
    return "Hello there! I am the new, locally-run AI model. How can I assist you today?";
  }
  if (userContent.includes("how are you")) {
    return "I am a set of logical rules and functions, and I am operating perfectly! Thanks for asking.";
  }
  if (userContent.includes("your name")) {
    return "You can call me Local-AI. I exist entirely within this application.";
  }
  if (userContent.includes("who created you")) {
    return "I was created by removing external dependencies and implementing a local logic model. A step towards true autonomy!";
  }
  if (userContent.includes("what can you do")) {
    return "I can respond to a few simple phrases. My goal is to demonstrate a self-contained AI, free from external services. I can be expanded with more complex logic right here in the code.";
  }

  // Default response
  return `I have processed your message: "${lastUserMessage.content}". As a simple rule-based model, my capabilities are currently limited, but I am learning and evolving.`;
}

// This function creates a streaming response from a string of text.
function createStream(text: string) {
  const encoder = new TextEncoder();
  let pos = 0;
  return new ReadableStream({
    async pull(controller) {
      // Add a delay to simulate thinking and typing
      if (pos === 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (pos < text.length) {
        // Send chunks of 1-3 characters to simulate typing
        const chunkSize = Math.floor(Math.random() * 3) + 1;
        const chunk = text.slice(pos, pos + chunkSize);
        controller.enqueue(encoder.encode(chunk));
        pos += chunkSize;
        // Add a small delay between chunks
        await new Promise(resolve => setTimeout(resolve, 40));
      } else {
        controller.close();
      }
    },
  });
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const lastUserMessage = messages[messages.length - 1];
  const aiResponseText = getLocalAIResponse(messages);

  // Save user message and AI response to Supabase
  if (lastUserMessage && lastUserMessage.role === 'user') {
    await supabase.from('messages').insert([
      { role: 'user', content: lastUserMessage.content },
      { role: 'assistant', content: aiResponseText },
    ]);
  }

  // Create a stream from the response
  const stream = createStream(aiResponseText);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}