---
title: "Style Guide"
subtitle: "Writing standards for Content Factor documentation"
stage: "publish"
---

# Creative Technical Communication Manual

*For the GTTM Project*

---

## Introduction

In today's landscape of rapid digital transformation, technical documentation isn’t just a set of instructions; it's a living guide that empowers users, builds trust, and sustains the lifecycle of innovative projects. The **GTTM (Global Track and Trace & Management)** project—like most modern systems—demands documentation that is both accurate and engaging, bridging the gap between complex technology and real-world application. This manual synthesizes leading practices in technical communication, with a special focus on creative storytelling, style systems, and visual thinking, to provide a scalable foundation for GTTM teams and contributors.

The manual is structured to guide everyone involved in the GTTM project—writers, engineers, designers, and collaborators—through the essentials of crafting compelling and maintainable documentation for modules such as **Blackjack**, **shared-tokens**, and **Tailwind preset**. Core frameworks include modern storytelling models, technical writing principles, standardized diagramming conventions, collaborative authoring mindsets, and visual communication strategies such as **Dan Roam’s Draw to Win** methods. Integrated examples and reference templates ensure that the manual grows with the project, serving both as a how-to guide and as an organizational knowledge base.

---

## 1. Storytelling Frameworks in Technical Communication

### 1.1 Why Storytelling Matters in Technical Documentation

The traditional paradigm of technical documentation prioritized clarity and accuracy over engagement. However, as user needs have become more contextual and interactive, the field recognizes that *narrative techniques* greatly enhance comprehension, retention, and action. Stories provide context, lower cognitive load by chunking complex information, foster emotional connections, and make abstract technical concepts more memorable.

Crucially, storytelling in technical documentation is **not** about adding fictional elements but about structuring information according to the user’s journey: identifying goals, challenges, solutions, and resolutions.

> Example from GTTM Blackjack Module:
> 
> 
> Instead of simply listing Blackjack module functions, documentation should walk users through a session:
> 
> - **Goal:** Play a fair, on-chain Blackjack game.
> - **Challenge:** Ensure randomness and avoid MEV attacks.
> - **Solution:** Use verifiable random functions (VRF) and Counter NFTs.
> - **Resolution:** User plays securely, outcome is verifiable, and code is transparent.

### 1.2 Core Elements of the Technical Narrative

Modern technical storytelling uses familiar narrative arcs :

- **Character**: Almost always the *user* (e.g., “You, the developer configuring shared-tokens for agentic commerce…”).
- **Goal/Desired State**: What the user hopes to achieve (“Integrate secure shared-payment-tokens without exposing sensitive credentials”).
- **Conflict/Challenge**: The main problem or barrier (“Token format mismatch between new API and legacy system”).
- **Plot/Journey**: The sequence of actions, steps, or decisions leading from the original challenge to resolution.
- **Resolution/Success**: The end-state where problems are solved or tasks accomplished, emphasizing learning or improvement.
- **Setting/Context**: The environment in which these events occur—UI, OS, system architecture, etc.

### Practical Application: Mapping Narratives to Documentation Types

| Narrative Element | Doc Type Example | GTTM Module Example |
| --- | --- | --- |
| Character | Getting Started/Persona | First-time module integrator |
| Goal | Use Case/Quickstart | Deploy Blackjack on testnet |
| Conflict | FAQ/Troubleshooting Guide | “Why is ‘EInvalidBlsSig’ thrown?” |
| Plot | Step-by-step Guide/Tutorial | Walkthrough: Creating and dealing a hand in Blackjack |
| Resolution | Success Message/Outcome | “Your bet resolved: payout generated” |
| Setting | System Requirements/Context | “Sui testnet, NodeJS v18, Browser Chrome 120+” |

After the table:

Each documentation section or article can be mapped against this narrative structure for clarity, engagement, and effectiveness. For example, the **shared-tokens** module documentation doesn’t just list API endpoints but walks the reader through a scenario where a bot agent safely facilitates payment on behalf of a user using Stripe’s shared token format.

### 1.3 Scenario-driven and Outcome-oriented Storytelling

- Use *scenarios* and *use cases* to anchor content.
- Present friction points as narrative obstacles.
- Highlight desired outcomes in headers and summaries.

**Example:**

“In the Blackjack module, after a user submits randomness, the system must verify the authenticity of the Counter NFT to prevent replay attacks. Here’s how the underlying contract achieves this…”

This narrative approach contextualizes technical mechanics, making documentation more relatable and actionable.

---

## 2. Technical Writing Principles and Best Practices

### 2.1 Audience-Centered Design

All documentation must begin with an understanding of the intended audience (developer, end user, admin) and their context (skill level, environment, needs). This influences terminology, depth, and structure. For GTTM:

- **Blackjack:** Targeted primarily at blockchain developers familiar with Move, but includes overviews for less technical stakeholders.
- **Shared-tokens:** Designed for cross-disciplinary teams—payments engineers, compliance, and data engineers.
- **Tailwind Preset:** Aims at web developers and designers, expects familiarity with CSS-in-JS and configuration-driven systems.

**Action point:**

Create user personas and test documentation with real users. Leverage analytics (if available) to detect pain points and drop-offs.

### 2.2 Principles of Clarity, Precision, and Accessibility

Modern technical writing prioritizes:

- **Clarity:** Use active voice, plain language, and consistent terminology. Break down complex concepts with analogies and stepwise explanations.
- **Precision:** Eliminate ambiguity. All instructions, options, and parameters must be unambiguously described, often with example values and expected outcomes.
- **Accessibility:** Ensure documentation is usable by people with disabilities—using semantic headings, alt text, color contrast, and supporting screen readers.

**Example for GTTM Shared-tokens:**

Don’t just say “Create a shared payment token”—show:

```bash
curl https://api.stripe.com/v1/shared_payment/issued_tokens \
  -u "sk_test_xxx:" \
  -d payment_method=pm_xxx \
  -d "usage_limits[currency]"=usd \
  -d "seller_details[network_id]"=your_network_id

```

And accompany it with clear language explaining each parameter.

### 2.3 Consistency and Style Systems

Adherence to established style guides (see Section 4) ensures that writing is not just correct, but also **consistent and professional**. Core principles include:

- **Consistent Terminology:** Use the same terms with the same meaning everywhere (e.g., “session token,” never “user token”).
- **Structural Consistency:** Document structures (e.g., “Quickstart,” “Examples,” “API Reference,” “FAQ,” “Changelog”) should follow pre-defined templates.
- **Voice and Tone:** Match project or organizational brand (concise and warm for user-facing docs; direct and formal for APIs; playful for internal blog posts when appropriate).

### 2.4 Modular, Task-based, and Living Documentation

- **Modular:** Create reusable chunks (partials) for repeated steps, parameters, warnings.
- **Task-based:** Organize around real tasks, not just features—“How do I create a Counter NFT?” instead of just explaining what it is.
- **Living:** Treat documentation as code (docs-as-code), using version control, automated builds, and continuous review.

### 2.5 Inclusive, Bias-free Language

Modern documentation adopts inclusive language by:

- Avoiding gendered or culturally specific terms.
- Using examples and names that are diverse and non-stereotyped.
- Explaining accessibility options and limitations up front.

---

## 3. Diagramming Conventions for Technical Documentation

### 3.1 Principles of Technical Diagrams

Diagrams clarify and accelerate understanding of complex architectures and flows. High-quality diagrams in technical documentation should be:

- **Purposeful:** Each diagram should answer a specific question (e.g., How does a shared-token propagate across services?).
- **Consistent:** Line styles, shapes, and labels must consistently represent the same concepts.
- **Accessible:** Provide alt-text and text-based equivalents whenever possible.

**Diagram Types Table:**

| Diagram Type | Use Case | GTTM Example | Convention/Tool |
| --- | --- | --- | --- |
| Sequence Diagrams | Protocols, API/contract call flows | “Blackjack: Player ↔ Backend ↔ Sui” | PlantUML, Mermaid |
| Entity-Relationship (ER) | Data structure relationships | “Blackjack: Game, Player, House structs” | draw.io, Lucid |
| Flowcharts | Multi-step processes, decision trees | “Tailwind preset config resolution flow” | draw.io, Mermaid |
| Architecture Block Diag. | High-level system components | Shared-tokens integration overview | draw.io |
| State Diagrams | Object/process lifecycles | “Game: Created → Dealing → Complete” | draw.io, Lucid |
| Wireframes | UI design/prototyping | “Config UI for Tailwind preset” | Figma, Whimsical |

*Each diagram should bear a title, a concise annotation, and a clear call-out for key steps.*

**Placeholder Example:**

```
[DIAGRAM]
Title: Blackjack Game Flow
Description: Visualizes the contract call sequence when a user initiates a Blackjack session, including input of Counter NFT, VRF randomness, dealing, and result resolution.
[Insert Mermaid/PlantUML code block or PNG]

```

### 3.2 Standards and Notations

Follow established engineering and notational conventions:

- Use standard shapes for process (rect), decision (diamond), input/output (parallelogram).
- Indicate initiator, resolver, and external calls with consistent arrows.
- For software API diagrams, always show POST/GET labels alongside endpoints.
- Clearly mark external systems (e.g., “Stripe”, “Sui chain”, “User Browser”).

Refer to ISO Technical Product Documentation (ISO 01.110, ISO 128/129) for international standards on symbols, views (isometric, orthographic), and dimensioning.

### 3.3 Visual Thinking and Dan Roam’s Draw to Win Model

**Dan Roam’s “Draw to Win”** teaches that simple visuals—basic shapes, lines, arrows, and labels—can unlock clarity where text alone falters:

- Start with a circle, name it, and build upwards.
- Use Roam's “Six Essential Pictures” for core scenarios:
    - **Portrait** (Who), **Chart** (How Much), **Map** (Where), **Timeline** (When), **Flowchart** (How), **Equation** (Why).
- Always complement process flows with a story-driven visual:
“Here’s how a GTTM shared-token moves through the checkout process...”

Visuals should help users “see” the journey their data, requests, or configurations make—from input to resolution.

---

## 4. Documentation Style Systems and Guides

### 4.1 Importance of Style Guides

A style guide is the backbone of consistent, scalable, and maintainable documentation.

GTTM recommends adopting and adapting cues from:

- **Google Developer Style Guide:** Emphasizes developer-centric clarity, inclusiveness, and structured API doc rules.
- **Microsoft Writing Style Guide:** Broad, customer-centric, warm, direct, and consistent.
- **Apple Style Guide:** Strong on terminology, product names, tone, and international clarity.
- **Mailchimp Style Guide:** Models conversational, inclusive, approachable writing (great for onboarding guides and blog posts).
- **Atlassian/Shopify/IBM Design Systems:** Valuable for product/UI content and “microcopy.”

Use these public guides as starting points; create GTTM’s own “living” cheat sheet as the project matures.

### 4.2 Internal Style Cheat Sheet

Below is a sample mini-style sheet adapted for GTTM:

| Aspect | Rule/Standard | GTTM Example |
| --- | --- | --- |
| Terminology | Use exact, defined terms. | “Counter NFT” not “nonce” |
| Code Formatting | Use fenced code blocks; indicate language. | `move ...` |
| Headings | Sentence case for body; title case for H1/main. | ## Verifying Random Input |
| API Parameters | Bold key terms; consistent order; always include default. | **amount** (optional): … |
| Lists & Tables | Use for summarizing; always expand below with prose. | See Section 6.2 |
| Visuals/Diagrams | Alt text required; diagrams must be referenced in text. | [Diagram: SPT workflow] |
| Accessibility | All images/tables have alt-text/descriptions. | [Alt: Blackjack Game Flow] |

### 4.3 Markdown Formatting for GTTM Docs

The documentation is written in markdown—chosen for its accessibility, compatibility with static site generators, and collaborative tools:

**Key practices:**

- Headings use one H1 per page, H2 for major sections, H3 for subsections.
- Breadcrumbs and clear hierarchical heading structure.
- Code using triple-backticks, with language annotation for syntax highlighting.
- Links: always include inline links ([Title](https://www.notion.so/url)).
- Tables for structured data. Always accompany with detailed context paragraphs.
- Quotes for callouts, warnings, or user insights.
- “Admonition” blocks (::: note, ::: tip) for important side hints.

---

## 5. Author Mindset and Collaboration

### 5.1 Writer Identity and Multiple Literacies

Technical communication is cross-functional, embracing identities such as developer-documentarian, content strategist, product evangelist, and user advocate. Writers must develop multiple literacies:

- Functional (tools, platforms, formats)
- Conceptual (deep understanding of systems)
- Evaluative (user perspective, testing)
- Rhetorical (persuasive, narrative skills)

Authors are also “collaboration architects,” facilitating feedback between subject matter experts, product managers, and end users.

### 5.2 Collaboration Practices

- **Docs as Code:** Writers use version control (Git), issue tracking, and CI/CD for docs—mirroring developer workflows.
- **Review Loops:** Peer and SME reviews, usability testing, and public feedback.
- **Knowledge Sharing:** Internal docs, wikis, and Slack/Teams channels.
- **Remote Collaboration:** Be proactive—async docs, clear comments, and transparent change logs.

### 5.3 Author Mindset

- Embrace iteration: Documentation is never “done.”
- Be an advocate: Writers push for usability, accessibility, and clarity on behalf of all users.
- Cultivate curiosity: Continuous learning about the product, users, and documentation craft is essential.
- Value feedback: Negative user experiences are opportunities for improvement.

### 5.4 Psychological Traits and Coping Strategies

- High conscientiousness, attention to detail.
- Empathy for diverse user backgrounds.
- Structured routines, but adaptable when requirements shift.
- Techniques for avoiding burnout: timeboxing, regular reviews, setting boundaries, and practicing self-care.

---

## 6. Module-Specific Documentation Frameworks

### 6.1 GTTM Blackjack Module

### Purpose

The on-chain Blackjack module is an example of a complete smart contract application hosted on the Sui blockchain, with a focus on fair randomness and clear, auditable flows.

### Narrative-driven Documentation Outline

- **Getting Started**
    - System requirements (Move version, Sui CLI, Node.js), testnet links.
    - Persona: Blockchain developer integrating contract and dApp frontend.
- **Scenario**
    - *“Alice wants to play a provably fair game of Blackjack using her browser.”*
- **Architecture Diagram**
    - [Diagram: User ➔ dApp ➔ Backend (Dealer API) ➔ Sui Blockchain]
    - Steps annotated with callouts (“Randomness Collection,” “Counter NFT Submission,” “Deal/Hit Resolution”).
- **Key Flows**
    - Sequence: Initialization, Counter NFT creation, randomness, game creation, deal, repeat (hit, stand), outcome.
    - Error handling: Highlight corner cases like insufficient balance, invalid randomness, contract revert reasons.
- **API Reference**
    - Each function—Move and HTTP—detailed with parameters, expected return, and side effects.
- **Test Coverage**
    - Demo/testnet links, example test scripts.
- **FAQs**
    - “Why do I need to create a Counter NFT?”
    - “How is randomness guaranteed?”
- **Callouts**
    - Security features (MEV resistance), troubleshooting wait times, browser support.

**Sample Markdown Section:**

```markdown
### How Randomness Works in Blackjack

Upon starting a game, the player creates a Counter NFT via a contract call. Mouse movement entropy is captured via the dApp, converted to on-chain randomness. The dealer backend signs and broadcasts the deal, and the contract verifies the signature and the VRF.
[Diagram: Randomness Workflow]

```

### 6.2 GTTM Shared-tokens Module

### Purpose

Facilitates secure payment flows using shared payment tokens (SPT), essential for agentic commerce and delegated payment flows.

### Documentation Highlights

- **Persona**
    - Developer building an AI checkout bot, compliance/data engineer verifying scope and security.
- **Narrative**
    - *“A bot agent creates a Stripe SharedPaymentToken for a seller, enabling a customer to pay without exposing card details, subject to usage and expiry limits.”*
- **Core Concepts**
    - Token lifecycle: Creation, sharing, usage limits/scopes, expiry, revocation.
    - Security: What’s proven (risk checks, blackout on sensitive fields).
- **Diagrams**
    - SPT workflow: Agent → Stripe API → Seller → PaymentIntent call.
- **Examples**
    - cURL scripts for SPT issuance and consumption.
    - Error cases (risk score, expiry, revocation).
- **FAQs**
    - “Can I retrieve the original payment method?”
    - “What risk checks should I monitor?”

### 6.3 GTTM Tailwind Preset

### Purpose

Reusable, composable Tailwind CSS configurations for fast and consistent UI styling.

### Documentation Approach

- **Persona**
    - Frontend developer, designer, tech lead.
- **Narrative**
    - *“Teams want to standardize their color palette and spacing rules across multiple web apps without duplicating config files.”*
- **Quickstart**
    - How to create a preset (my-preset.js), override and compose, and integrate via tailwind.config.js.
- **Best Practices**
    - Version management, sharing between projects, minimizing duplication.
    - Extension and override rules (what’s merged, what’s replaced).
- **API Reference**
    - List of supported theme keys, usage of plugins, and content array behaviors.
- **FAQ**
    - “How do I disable the default Tailwind config?”
    - “Can I nest presets?”

**Sample Markdown Section:**

```markdown
## Configuring a Tailwind CSS Preset

Add your preset module to the `presets` array:

```js
// tailwind.config.js
module.exports = {
  presets: [require('./my-preset')],
  theme: { extend: { minHeight: { 48: '12rem' } } },
}

```

This applies the preset’s theme, plugins, and core plugins. Your local project’s settings override the preset as specified.

```

---

## 7. Markdown Manual Formatting Techniques

### 7.1 Markdown Syntax for Technical Documentation

Leverage **extended Markdown** features where supported, such as tables, fenced code blocks, syntax highlighting, definition lists, and admonitions.
Key conventions:

- Use code fencing (**```language**) for all code snippets; supply the language for syntax highlighting.
- For headings, use a single H1, then H2/H3 hierarchically.
- Always start tables and lists with at least one summary paragraph before, and detailed context after.
- For embedded diagrams, use code blocks or Markdown image syntax, and always annotate with alt-text.

**Example:**
```markdown
### Creating a Counter NFT (Move Example)

```move
public fun create_counter_nft(ctx: &mut TxContext): CounterNFT { ... }

```

This function creates a new Counter NFT required for game initiation. It ensures uniqueness by incrementing an internal counter; do not reuse Counter NFTs between sessions.

```

### 7.2 Callouts and Admonitions

Use admonition syntax (if supported by your documentation engine):

```markdown
::: warning
Ensure you supply a fresh Counter NFT for every new game to prevent replay attacks.
:::

```

### 7.3 Diagram Placeholders

```markdown
[DIAGRAM]
Title: Shared-payment-token Issuance Flow
Description: Sequence showing agent creation, Stripe API, and seller redemption.
[Insert PlantUML/Mermaid code or image link]

```

---

## 8. Appendices

### 8.1 Technical Document Templates

### a. API Reference Template (Markdown)

```markdown
# API Reference: shared-tokens

## Endpoint: POST /shared-tokens

| Parameter      | Type    | Required | Default    | Description                 |
|----------------|---------|----------|------------|-----------------------------|
| payment_method | string  | Yes      | -          | Stripe PaymentMethod ID     |
| currency       | string  | Yes      | "usd"      | Currency for usage limits   |
| max_amount     | number  | Yes      |            | Max spend (cents)          |
| expires_at     | string  | No       | +24h       | Expiry as ISO datetime      |
| seller_network | string  | Yes      |            | Seller’s network ID         |

**Example call:**
```bash
curl -X POST /shared-tokens ...

```

**Responses:**

- 201 Created – Returns token object
- 400 Bad Request – Missing params, invalid format

```

#### b. Options Paper

Adapted from [Markdown Document Templates][41†L1].

```markdown
# <Decision Title>

| Item        | Description                         |
|-------------|-------------------------------------|
| Status      | Not Started / In Progress / Done    |
| Impact      | High / Medium / Low                 |
| Driver      | @driver-name                        |
| Approver    | @approver-name                      |
| Due Date    | YYYY-MM-DD                          |

## Background
Describe the need for the decision.

## Options Considered

| Option      | Description | Pros | Cons | Impact | Effort | Cost |
|-------------|-------------|------|------|--------|--------|------|
| Option 1    | ...         | ...  | ...  |  ...   |  ...   | ...  |
| Option 2    | ...         | ...  | ...  |  ...   |  ...   | ...  |

## Action Items

- [ ] Assign follow-ups and next steps (with owner)

```

### 8.2 Diagram Types for Technical Communication

A practical reference for types, with visual conventions and common tools.

| Diagram Type | Use/Meaning | Best Tools | Example in GTTM |
| --- | --- | --- | --- |
| Sequence Diagram | Interactions over time | Mermaid, PlantUML | Transaction flow in Blackjack |
| ER Diagram | Entity and data structure | draw.io, Lucid | Game/Player struct relations |
| Flowchart | Process steps, if/then logic | draw.io, Lucid | Backend data processing |
| Architecture Block | System/module high-level overview | Lucid, Figma | Payment flow via SPT |
| Wireframe | UI/UX prototyping | Figma, Whimsical | Tailwind config UI |
| State Diagram | Lifecycle states of an object | draw.io | Blackjack Game lifecycle |

*Always supply alt-text and captions. For each, explain purpose, what’s illustrated, and how to interpret.*

### 8.3 Style Cheat Sheet for Technical Writing

| Guideline | Description/Example |
| --- | --- |
| Voice | Active, direct, user-centric (“Click the ‘Deal’ button”) |
| Grammar | Short sentences; avoid complex nesting |
| Technical Terms | Define all terms at first use; include glossary if needed |
| Code & Parameters | Use code blocks, monospace (`), language-tagged; document defaults |
| Headings | One H1; H2 for main sections; avoid “clever” heading names |
| Accessibility | Alt-text for images; label all diagrams/tables for screen readers |
| Diagrams | Provide both visuals and explanatory text |
| Review | Peer + SME review; test by following steps as an end user (usability) |
| Updates | Version/document changelog; update after every product or flow change |

### 8.4 Recommended Reading

### Classic References

- *The Elements of Style* – Strunk & White
- *On Writing Well* – William Zinsser
- *Technical Communication* – Mike Markel & Stuart A. Selber
- *Handbook of Technical Writing* – Gerald J. Alred, Charles T. Brusaw, Walter E. Oliu
- *Managing Your Documentation Projects* – JoAnn T. Hackos

### Modern and Developer-focused

- *Docs for Developers: An Engineer's Field Guide to Technical Writing* – Jared Bhatti et al.
- *The Product is Docs* – Christopher Gales (for integrated product + documentation workflows)
- *Modern Technical Writing* – Andrew Etter

### Online/Company Style Guides

- [Google Developer Documentation Style Guide](https://developers.google.com/style)
- [Microsoft Writing Style Guide](https://learn.microsoft.com/en-us/style-guide/)
- [GitHub’s Open Source Guides and Markdown Docs](https://opensource.guide/docs/)

### Visual Thinking and Diagrams

- *Draw to Win* – Dan Roam
- *The Back of the Napkin* – Dan Roam
- [draw.io blog on diagram types](https://www.drawio.com/blog/types-of-technical-diagrams)
- [PlantUML, Mermaid documentation]

### GTTM Specific

- [Sui Documentation: Blackjack Example][28†L1]
- [Stripe Docs: Shared-payment-token][34†L1]
- [Tailwind CSS Docs: Presets][35†L1][37†L1]
- [GTT API Documentation][29†L1][33†L1]

---

## Conclusion

The **Creative Technical Communication Manual for GTTM** is designed as a living resource. Teams should revisit and iterate the frameworks, templates, and examples herein as the project and its documentation culture evolve. By adopting a storytelling framework, solid technical writing principles, robust diagramming conventions, a scalable style system, and a collaborative author mindset, the GTTM project ensures its documentation remains clear, comprehensive, and engaging for every contributor and user.

As the manual grows, new modules, visual strategies, Markdown semantic patterns, and evolving best practices from the broader technical communication community should be integrated—ensuring GTTM’s documentation remains a model of clarity, accessibility, and creative utility.

---

### Diagram Placeholders

- [Insert diagram: Blackjack session flow (Mermaid or PNG)]
- [Insert diagram: shared-tokens lifecycle (Sequence diagram)]
- [Insert diagram: Tailwind preset configuration layers (Block diagram)]

---