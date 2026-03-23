import { NextRequest, NextResponse } from "next/server";
import { getLiteLLMClient, getModel } from "@/lib/litellm";
import { buildBriefPrompt } from "@/lib/prompts";

/**
 * Brief agent — synthesizes a conversation transcript into a structured brief.
 *
 * This is an internal endpoint, not user-facing. It's called by the chat
 * route when the conversational agent signals conversation close.
 *
 * The brief is currently logged to stdout. The pipeline backend adapter
 * (ClickUp, etc.) plugs in here.
 */
export async function POST(req: NextRequest) {
  const { transcript, submitterContext } = await req.json();

  if (!transcript) {
    return NextResponse.json(
      { error: "transcript required" },
      { status: 400 }
    );
  }

  const client = getLiteLLMClient();
  const model = getModel();
  const briefPrompt = buildBriefPrompt();

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: briefPrompt },
      {
        role: "user",
        content: `Generate a structured brief from the following conversation transcript.

${submitterContext ? `Submitter context:\nName: ${submitterContext.name}\nDepartment: ${submitterContext.department}\nVC Area: ${submitterContext.vc_area}\nRole: ${submitterContext.role}\n` : "No submitter directory data available."}

TRANSCRIPT:

${transcript}`,
      },
    ],
  });

  const rawContent = completion.choices?.[0]?.message?.content || "";

  // Extract JSON from the response
  let brief;
  try {
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    brief = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch {
    console.error("Failed to parse brief JSON:", rawContent);
    return NextResponse.json(
      { error: "Failed to parse brief", raw: rawContent },
      { status: 500 }
    );
  }

  // --- Pipeline backend adapter ---
  // Currently logs to stdout. Replace with ClickUp API write or
  // whatever backend is active.
  console.log("\n========== BRIEF GENERATED ==========");
  console.log(JSON.stringify(brief, null, 2));
  console.log("======================================\n");

  return NextResponse.json({ brief });
}
