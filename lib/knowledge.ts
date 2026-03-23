import { readFile } from "fs/promises";
import { join } from "path";

let cachedMap: string | null = null;

/**
 * Load the TritonAI knowledge map from disk and cache it.
 * The map is small enough (~5k tokens) to inject fully into context.
 */
export async function getKnowledgeMap(): Promise<string> {
  if (cachedMap) return cachedMap;

  const mapPath = join(process.cwd(), "data", "tritonai_knowledge_map.json");
  const raw = await readFile(mapPath, "utf-8");
  cachedMap = raw;
  return raw;
}
