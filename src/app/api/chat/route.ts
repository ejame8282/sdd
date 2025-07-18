import { StreamingTextResponse, type Message } from 'ai';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://gjhhzudeactglbcmesdx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqaGh6dWRlYWN0Z2xiY21lc2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTA1OTcsImV4cCI6MjA2ODQyNjU5N30.tmpmi8-BL7xHoXA1FG84ZaI0l9_bJlgisRlIU6X_dI0";

export const runtime = 'edge';

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

  return `I have processed your message: "${lastUserMessage.content}". As a simple rule-based model, my capabilities are currently limited, but I am learning and evolving.`;
}

function createStream(text: string) {
  const encoder = new TextEncoder();
  let pos = 0;
  return new ReadableStream({
    async pull(controller) {
      if (pos === 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      if (pos < text.length) {
        const chunkSize = Math.floor(Math.random() * 3) + 1;
        const chunk = text.slice(pos, pos + chunkSize);
        controller.enqueue(encoder.encode(chunk));
        pos += chunkSize;
        await new Promise(resolve => setTimeout(resolve, 40));
      } else {
        controller.close();
      }
    },
  });
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const authHeader = req.headers.get('Authorization');

  if (!authHeader) {
    return new Response('Unauthorized', { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const lastUserMessage = messages[messages.length - 1];
  const aiResponseText = getLocalAIResponse(messages);

  if (lastUserMessage && lastUserMessage.role === 'user') {
    const { error } = await supabase.from('messages').insert([
      { role: 'user', content: lastUserMessage.content, user_id: user.id },
      { role: 'assistant', content: aiResponseText, user_id: user.id },
    ]);
    if (error) {
        console.error("Error saving message:", error);
    }
  }

  const stream = createStream(aiResponseText);
  return new StreamingTextResponse(stream);
}