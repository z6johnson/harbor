# Harbor

Conversational AI intake system for routing, enriching, and triaging AI solution ideas at UC San Diego.

## What this is

Harbor is the front door to UCSD's AI solution intake workflow. A person describes their situation in plain language, and Harbor has a conversation that simultaneously figures out what they need, builds a structured brief, and routes the idea to the right place — all without the person needing to understand any of the internal mechanics.

The system replaces the previous form-to-email-to-meeting pipeline with a conversational interaction that produces richer information in less time and routes without intermediary triage.

## How routing works

Harbor determines one of four outcomes based on the conversation:

**Level 1** — An existing TritonAI resource addresses the situation. The person gets a specific pointer to the right tool, guide, or assistant. The interaction is logged but doesn't enter the active pipeline.

**Level 1.5** — Existing resources partially fit, but there's a gap. The person gets the resource pointer and a lightweight follow-up from AI Strategy to bridge the gap.

**Level 2** — A real engagement candidate. Harbor builds a structured brief through the conversation and routes it directly into the AI Strategy pipeline, ready for scoping.

**Level 3** — The situation primarily involves ITS-managed enterprise systems or elevated data sensitivity. Harbor builds a contextual handoff for ITS and logs the idea for later strategic engagement.

The person never self-selects. Harbor makes the routing decision based on what they describe.

## Architecture

Harbor sits in front of the AI Strategy pipeline managed in ClickUp. It reads from the TritonAI knowledge map for resource matching and writes structured briefs to ClickUp via API. The working interface for pipeline management is a custom ambient dashboard — ClickUp is the data backend, never the interaction layer.

Related infrastructure: [helm](https://github.com/z6johnson/helm) · [beacon](https://github.com/z6johnson/beacon)

## Design documentation

- `docs/conversational-intake-design.md` — How the conversation works: question logic, routing rules, brief structure, behavioral specs
- `docs/seed-style-guide.md` — Aesthetic and UX principles for all project interfaces

The conceptual design document for the broader intake workflow redesign lives in the project's Claude workspace.

## Status

Design phase. The conversational intake design is established. Next steps include data schema translation to ClickUp, follow-up timeframe definition, and implementation.

---

Zachary Johnson · Director of AI Strategy · UC San Diego
