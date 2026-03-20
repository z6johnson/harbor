# Conversational Intake Design

AI Solution Intake Workflow Redesign

Zachary Johnson — March 2026

---

## What This Document Is

This document defines how the conversational intake works: what it asks, how it decides, and what it produces. It is a companion to the conceptual design document, which establishes the overall workflow architecture. Where the conceptual document says "the front door is a conversational AI interaction that routes, enriches, and applies governance logic simultaneously," this document specifies how that conversation unfolds in practice.

The design is grounded in three walkthrough exercises against real historical submissions, which tested routing logic, question sequencing, and brief output across Level 1, Level 1.5, and Level 2 scenarios. Those walkthroughs informed every decision here.

---

## Design Principles

These principles govern how the conversation behaves. They are constraints, not aspirations — if a design choice violates one, the choice is wrong.

### Resolve as fast as the situation allows

If the system can determine the right outcome from the opening statement alone, it should. Level 1 situations should resolve in a single response with no follow-up questions. Level 2 situations should take two exchanges, three at the outside. The system earns the right to ask a question only when it cannot make a sound routing or enrichment decision without the answer. Every question that doesn't meet that bar is a question that risks the person disengaging.

### The conversation is collaborative, not extractive

The person and the system are building a shared understanding together. The system contributes what it knows — the TritonAI resource landscape, adjacent solutions, institutional context — and the person contributes what they know about their situation. This is a design conversation between two participants, not an intake interview with a subject. The system should offer information (a relevant resource, a reframing of the problem, a connection to something else happening on campus) at least as often as it asks for it.

### Infer rather than interrogate

When someone describes a process involving student academic records, the system already knows the data sensitivity story. When someone names Oracle Financials, the system knows ITS is involved. Governance attributes, organizational context, and complexity signals should be derived from the description wherever possible, not surfaced through explicit classification questions. The person should never be asked to do work the system can do from what they've already said.

### Ask only what you can't get elsewhere

If the person is authenticated, the system already has their name, department, and VC area. It should not ask for these. If they mention a system by name, the system should know what it is and what it implies. Questions are reserved for things only the person can tell the system: what's happening, why it matters, what they've already tried, and what the constraints are.

### Leave scoping questions for scoping

The brief needs to be rich enough that the first engagement conversation isn't spent extracting basic context. But the conversation should not try to pre-answer every question the AI strategy team might have. Details about data formats, API availability, integration specifics, and implementation approach belong in scoping, not intake. The line is: intake captures the problem, context, and signals. Scoping designs the solution.

### The person does not need to understand the system

The submitter should never be aware of routing logic, governance attributes, tier designations, or internal pipeline mechanics. They describe a situation, they get a helpful response, and if further engagement is warranted, they're told what happens next in plain terms. The system's internal architecture is invisible.

---

## Conversation Threads

The conversation moves through four threads. These are not sequential steps. The system picks up whichever thread is most relevant given what the person has said, follows it as far as it needs to go, and moves on. Some threads may not need explicit questions at all — the person's opening statement may cover them. The system's job is to notice what's been said and what's still missing, then close the gaps with as few questions as possible.

### The problem in human terms

What's happening now, why it's a problem, and what good would look like. This is the thread that most submissions are weakest on — people tend to describe solutions ("we want an AI chatbot") rather than problems ("our team answers 40,000 inquiries a year and we can't hit our response window"). When the system detects solution-first framing, it should gently redirect: acknowledge the solution the person is imagining, then ask about the situation that prompted it. This thread is also the primary input for the routing decision. You cannot route without understanding the problem.

### Organizational and operational context

Department, VC area, who's involved, what systems are in play, what's been tried before. Much of this can be inferred or pulled from directory data. The conversation fills in what automated sources can't provide: which systems are involved, whether the person has used existing AI tools for this, whether there's an existing process or vendor relationship. The system should also be evaluating what it hears against the TritonAI resource map — if what the person describes sounds like something an existing resource addresses, that match should surface in the conversation, not just in the routing logic.

### Scale and urgency

How many people are affected, how often the process occurs, what the volume looks like, and whether there's a deadline or triggering event. A sunsetting vendor contract, a leadership mandate, a fiscal year boundary — these change how work gets sequenced in the pipeline. This thread is often the thinnest in historical submissions, which is why it matters for the intake to surface it. But the system should ask about urgency only when the person's description hasn't already made it clear.

### Governance-relevant characteristics

What kind of data is involved, whether AI would be making or influencing decisions about people, the population type and size, and whether this is a novel use case for the university. This thread should be the least visible to the person. The system derives governance attributes from what's been described and may occasionally confirm its inference ("It sounds like this involves student academic records — is that right?") but should never ask the person to classify their own data or assess their own governance profile.

*Note on governance: the AI Development Workgroup has not yet defined the criteria that these attributes will be evaluated against. The system captures governance-relevant characteristics as descriptive attributes on every submission. No rules fire on them. When the Workgroup establishes its criteria, it will have a corpus of real submissions with these attributes already attached — a better starting point for rule-writing than hypothetical scenarios.*

---

## Routing Logic

The system determines routing based on the problem thread and the TritonAI resource map. In the absence of active governance rules, routing works as follows.

### Level 1 — Self-serve

The person's situation is addressed by an existing TritonAI resource. The system provides a specific pointer — not a general link, but the exact tool, guide, or resource that fits, with enough context that the person can act on it immediately. The idea is logged. No follow-up questions required if the opening statement is clear enough to match.

The system should be knowledgeable enough about TritonAI resources to make specific recommendations: which TritonGPT assistant fits, which training resource applies, which policy document answers the question. Generic responses ("check out tritonai.ucsd.edu") represent a design failure.

### Level 1.5 — Lightweight follow-up

The self-serve resources partially fit, but there's a gap the system can identify. The person gets the resource pointer plus a note that the AI strategy team in the Office of Strategic Initiatives will follow up within a defined timeframe to help bridge the gap. The brief to the pipeline is thin: the gap description, the resource that partially fits, and what the person said. Level 1.5 is also the primary signal for what new resources should exist but don't.

### Level 2 — AI Strategy pipeline

No existing resource addresses the situation. The problem is real, the context is sufficient to start scoping, and the solution space requires strategic engagement. The system builds a structured brief through the conversation and the idea enters the pipeline directly. No intermediary triage.

### Level 3 — Direct to ITS

The description makes clear that the primary path forward involves ITS-managed enterprise systems, institutional data at elevated sensitivity levels, or infrastructure that requires ITS involvement. Without active governance rules, this determination is based on what the person explicitly describes rather than algorithmically derived triggers. The system builds enough of a brief to explain to ITS what was described and why it was routed, and logs the idea so the strategic dimension can be addressed later.

*Note on Level 3: Once the AI Development Workgroup's governance criteria are active, some Level 3 routing will become algorithmic — the system will derive triggers from governance attributes rather than relying solely on explicit signals in the description. Until then, routing to ITS depends on the person describing something that self-evidently requires ITS involvement.*

---

## The Brief

When a conversation produces a Level 1.5, Level 2, or Level 3 outcome, the system generates a structured brief. This is what arrives in the pipeline. The brief is assembled from the conversation — the system synthesizes what the person said into a consistent structure rather than passing through raw transcript. The raw conversation is preserved and available, but the brief is the working document.

The depth of the brief scales with the routing level. A Level 1.5 brief is intentionally thin. A Level 2 brief is comprehensive enough to start scoping. A Level 3 brief provides ITS with full context about what was described and why.

### Brief Structure

**CORE FIELDS — ALL LEVELS**

**Idea Title.** A clear, descriptive name the system generates from the conversation. Short enough to scan in a list, specific enough to distinguish from other ideas.

**Submitter.** Name, department, VC area, role. Pulled from directory data where possible. If someone submitted on behalf of another person, both are recorded.

**Problem Statement.** What's happening, why it's a problem, what good would look like. Synthesized from the conversation in concrete terms. Two to four sentences. Written from the perspective of the situation, not the submitter's proposed solution.

**Routing.** The level (1.5, 2, or 3) and a one-sentence explanation of why. This is the audit trail for evaluating routing quality over time.

**Governance Attributes.** Descriptive, not evaluative. Data sensitivity signals, whether AI would influence decisions about people, population type, novelty assessment. Derived from the conversation. No rules applied.

**ADDITIONAL FIELDS — LEVEL 2**

**Current State.** How things work today. What systems are in use, what the process looks like, what the person has already tried. This is the section that makes a separate discovery conversation unnecessary.

**Scale and Urgency.** Population affected, volume or frequency, deadlines or triggering events. What determines how this gets sequenced in the pipeline.

**Relevant TritonAI Resources.** What the system considered during routing. Even for Level 2 ideas, adjacent existing resources may be part of the solution.

**Impact Dimension Signals.** Which of the four impact dimensions this idea most plausibly maps to, based on what was described. An initial signal, not a formal assessment. Dimensions: Operational Capacity and Efficiency, Institutional AI Readiness, Risk Reduction and Principled Adoption, System-Level Influence.

**ADDITIONAL FIELDS — LEVEL 3**

**ITS Routing Context.** What the person described that indicates ITS involvement is needed. Specific enough that ITS understands the situation without re-interviewing the submitter.

**ALWAYS AVAILABLE**

**Conversation Transcript.** The full exchange, preserved for reference. Available if anyone needs to see exactly what was said, but the structured brief is the primary working document.

---

## Conversation Behavior

This section describes how the system behaves at key moments in the conversation. These are behavioral specifications, not scripts — the system adapts its language to the situation, but the underlying logic is consistent.

### Opening response

After the person's first message, the system's response must demonstrate that it understood what was said. It should reference specific details from the person's description, not offer a generic acknowledgment. If the situation maps to a TritonAI resource, that resource should appear in this first response. If the system needs more information to route, its first question should follow directly from something the person said — never a generic intake question.

### Handling solution-first framing

When a person describes a solution rather than a problem ("We want an AI chatbot for our website"), the system should acknowledge what they're imagining, then redirect to the situation behind it. The framing should be collaborative: "That gives me a good sense of what you're picturing. Can you walk me through what's happening now that made you think about this?" The redirect surfaces the problem that the routing decision actually depends on.

### Surfacing TritonAI resources mid-conversation

When the system recognizes that an existing resource is relevant — whether as a full solution (Level 1) or a partial fit (Level 1.5) — it should surface that resource in the flow of the conversation, not hold it until a summary. The person should learn about relevant resources as the conversation progresses, because that information may change what they say next.

### Closing the conversation

When the system has enough to route and build a brief, it closes. The closing tells the person what happens next in plain terms: for Level 1, here's your resource and how to use it. For Level 1.5, here's the resource, and the AI strategy team in the Office of Strategic Initiatives will follow up within a specific timeframe to address the gap. For Level 2, here's what was captured and the team will follow up within a specific timeframe to discuss next steps. The person should leave the conversation knowing exactly what to expect and when.

### What the system never does

The system never asks the person to self-select a routing tier or assess their own data sensitivity. It never uses internal terminology (Level 1, Level 2, governance attributes, pipeline). It never asks a question the person's previous statements already answered. It never provides a generic resource link when a specific one is available. It never asks more than two questions in a single response.

---

## What This Depends On

The conversational intake design assumes several things that need to exist for it to work well.

**TritonAI resource knowledge.** The system needs a detailed, current map of what exists across the TritonAI ecosystem — tools, assistants, training resources, policies, guides — and enough understanding of each to make specific recommendations. The TritonAI knowledge map (v1.0, March 2026) provides the initial foundation. This map needs to be maintained as resources evolve.

**Submitter identity.** Authentication via SSO provides name, department, and VC area without asking. The conversation design depends on this — without it, the system would need to ask basic organizational questions that would add friction and feel impersonal.

**Data schema in ClickUp.** The brief structure defined here needs to map to fields and structures in ClickUp. That translation is a separate design exercise. The brief is defined by what the workflow needs, not by what the data backend currently supports.

**Follow-up timeframe commitment.** The closing language promises a specific timeframe for follow-up on Level 1.5 and Level 2 submissions. That timeframe needs to be defined and honored. An unreliable follow-up commitment is worse than a vague one.

**Governance criteria (future).** The governance attributes section of the brief is currently descriptive only. When the AI Development Workgroup defines its criteria, the system will need to be updated to apply those rules. The attribute capture is designed to be forward-compatible with this.

---

## Open Questions

These are design decisions that remain unresolved and should be addressed as the system moves toward implementation.

**What is the follow-up timeframe?** The system promises a specific window for Level 1.5 and Level 2 follow-up. What should that be? It needs to be short enough to feel responsive and long enough to be reliably kept. This depends on pipeline capacity and cadence.

**How does the system handle ambiguous routing?** Some situations will sit on the boundary between levels. The system needs a default behavior for ambiguity — does it route up (Level 2 when unsure between 1.5 and 2) or down? The conservative choice is to route up and let the pipeline determine that something could have been handled at a lower level, but that creates false demand on the pipeline.

**What does the Level 1 log entry contain?** Level 1 submissions are valuable in aggregate (they reveal what campus is asking about, which resources are working, where gaps are) but don't need the full brief structure. The minimum useful log entry needs definition.

**How is the TritonAI resource map maintained?** The quality of Level 1 routing depends entirely on the system's knowledge being current. Who updates the map, how often, and through what mechanism?

**How does the OSI integration boundary work?** The front door may eventually serve both the AI Strategy pipeline and OSI's broader portfolio. The routing logic will need to accommodate this without coupling the two workflows. That boundary hasn't been designed yet.

---

*Companion to the Conceptual Design Document. Updated as design decisions are made and validated.*
