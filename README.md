# harbor

Conversational AI intake system for routing, enriching, and triaging AI solution ideas at UC San Diego.

## What this is

harbor is the front door to UCSD's AI solution intake workflow. A person describes their situation in plain language, and harbor has a conversation that simultaneously figures out what they need, builds a structured brief, and routes the idea to the right place — all without the person needing to understand any of the internal mechanics.

The system replaces the previous form-to-email-to-meeting pipeline with a conversational interaction that produces richer information in less time and routes without intermediary triage.

## How routing works

harbor determines one of four outcomes based on the conversation:

**Level 1** — An existing TritonAI resource addresses the situation. The person gets a specific pointer to the right tool, guide, or assistant. The interaction is logged but doesn't enter the active pipeline.

**Level 1.5** — Existing resources partially fit, but there's a gap. The person gets the resource pointer and a lightweight follow-up from AI Strategy to bridge the gap.

**Level 2** — A real engagement candidate. harbor builds a structured brief through the conversation and routes it directly into the AI Strategy pipeline, ready for scoping.

**Level 3** — The situation primarily involves ITS-managed enterprise systems or elevated data sensitivity. harbor builds a contextual handoff for ITS and logs the idea for later strategic engagement.

The person never self-selects. harbor makes the routing decision based on what they describe.

## Architecture

```
harbor/
├── app/                          # Next.js app router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Conversational interface
│   ├── globals.css               # Design tokens and base styles
│   └── api/
│       ├── chat/route.ts         # Streaming conversation endpoint
│       └── brief/route.ts        # Brief agent endpoint
├── lib/
│   ├── prompts.ts                # System prompt assembly (4 layers)
│   ├── litellm.ts                # LiteLLM client via OpenAI SDK
│   └── knowledge.ts              # TritonAI knowledge map loader
├── data/
│   └── tritonai_knowledge_map.json
└── docs/                         # Design documentation
```

harbor is a Next.js application deployed on Vercel. It calls a LiteLLM proxy for model access and reads from the TritonAI knowledge map for resource matching. When a conversation closes, a brief agent synthesizes the exchange into a structured JSON brief for the pipeline backend.

Related infrastructure: [helm](https://github.com/z6johnson/helm) · [beacon](https://github.com/z6johnson/beacon)

## Local development

```sh
git clone https://github.com/z6johnson/harbor.git
cd harbor
npm install
```

Copy the environment template and fill in your values:

```sh
cp .env.example .env.local
```

Required environment variables:

| Variable | Description |
|---|---|
| `LITELLM_API_BASE` | URL of your LiteLLM proxy (e.g. `https://your-proxy.example.com`) |
| `LITELLM_API_KEY` | API key for the LiteLLM proxy |
| `HARBOR_MODEL` | Model identifier (default: `bedrock/claude-opus-4-6-v1`) |

Start the dev server:

```sh
npm run dev
```

The app runs at `http://localhost:3000`.

## Deploy to Vercel

### First deploy

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the `z6johnson/harbor` repository.
3. Vercel auto-detects Next.js. No build settings to change.
4. Add environment variables before deploying:

   - `LITELLM_API_BASE` — Your LiteLLM proxy URL. Must be reachable from Vercel's serverless functions.
   - `LITELLM_API_KEY` — Your LiteLLM API key. Add this as a **sensitive** variable (encrypted, not visible after save).
   - `HARBOR_MODEL` — Model to use. Set to `bedrock/claude-opus-4-6-v1` or whichever model is available on your LiteLLM instance.

5. Deploy.

### Environment variables in Vercel

Go to **Project Settings → Environment Variables** to add or update:

| Variable | Value | Notes |
|---|---|---|
| `LITELLM_API_BASE` | `https://your-proxy.example.com` | Must be accessible from Vercel serverless functions |
| `LITELLM_API_KEY` | (your key) | Mark as **Sensitive** |
| `HARBOR_MODEL` | `bedrock/claude-opus-4-6-v1` | Can be changed to any model available through your LiteLLM proxy |

After changing environment variables, redeploy for changes to take effect (Settings → Deployments → Redeploy, or push a new commit).

### Subsequent deploys

Pushes to `main` trigger automatic production deploys. Pull request branches get preview deployments.

## Design documentation

- `docs/conversational-intake-design.md` — Conversation logic, routing rules, brief structure, behavioral specs
- `docs/prompt-architecture.md` — System prompt layers, brief agent design, implementation notes
- `docs/seed-style-guide.md` — Aesthetic and UX principles
- `docs/responsible-ai-seed-principles.md` — Responsible AI constraints

---

Zachary Johnson · Director of AI Strategy · UC San Diego
