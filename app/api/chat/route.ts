import { NextRequest } from "next/server";
import { getLiteLLMClient, getModel } from "@/lib/litellm";
import { buildSystemPrompt } from "@/lib/prompts";
import { getKnowledgeMap } from "@/lib/knowledge";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: "messages required" }), {
      status: 400,
    });
  }

  const knowledgeMap = await getKnowledgeMap();
  const systemPrompt = buildSystemPrompt(knowledgeMap);

  const client = getLiteLLMClient();
  const model = getModel();

  const stream = await client.chat.completions.create({
    model,
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ],
  });

  // Stream SSE back to the client, stripping the close marker
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      let fullContent = "";

      try {
        for await (const chunk of stream) {
          const delta = chunk.choices?.[0]?.delta?.content;
          if (delta) {
            fullContent += delta;

            // Strip the conversation close marker from streamed content
            const markerIndex = delta.indexOf("[CONVERSATION_COMPLETE]");
            const cleanDelta =
              markerIndex >= 0
                ? delta.slice(0, markerIndex)
                : delta;

            if (cleanDelta) {
              const payload = JSON.stringify({
                choices: [{ delta: { content: cleanDelta } }],
              });
              controller.enqueue(
                encoder.encode(`data: ${payload}\n\n`)
              );
            }
          }
        }

        // Check if conversation was closed — fire brief agent
        if (fullContent.includes("[CONVERSATION_COMPLETE]")) {
          const cleanTranscript = messages
            .map(
              (m: { role: string; content: string }) =>
                `${m.role === "user" ? "Person" : "Harbor"}: ${m.content}`
            )
            .join("\n\n");

          const assistantClosing = fullContent
            .replace("[CONVERSATION_COMPLETE]", "")
            .trim();

          const fullTranscript =
            cleanTranscript +
            "\n\nHarbor: " +
            assistantClosing;

          // Fire brief generation asynchronously
          triggerBriefGeneration(fullTranscript).catch(console.error);
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        console.error("Stream error:", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

async function triggerBriefGeneration(transcript: string) {
  const baseUrl =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  await fetch(`${baseUrl}/api/brief`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
  });
}
