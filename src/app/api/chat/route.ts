import { StreamingTextResponse, Message } from 'ai';

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

// A helper function to create a ReadableStream from text
// that simulates a streaming effect.
function textToStream(text: string) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (const char of text) {
        controller.enqueue(encoder.encode(char));
        await new Promise(resolve => setTimeout(resolve, 20)); // simulate delay
      }
      controller.close();
    },
  });
  return stream;
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const aiResponseText = getLocalAIResponse(messages);

  const stream = textToStream(aiResponseText);

  return new StreamingTextResponse(stream);
}