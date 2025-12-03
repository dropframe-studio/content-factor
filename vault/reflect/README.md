# 🪞 Reflection Vault — `/vault/reflect/`

Welcome to the **Reflection Vault**, the introspective heart of the VSMForge ecosystem.
This module records, organizes, and routes insights from daily work, mini-sprints, and full sprint cycles — ensuring every reflection becomes usable data for systemic growth.

---

## 🧭 Purpose

The Reflection Vault transforms **personal awareness into organizational intelligence**.

Each entry captures what was *noticed, solved, or felt*, and routes it through connected modules — turning reflection into feedback, feedback into structure, and structure into evolution.

---

## 📁 Structure

```
/vault/reflect/
├── 2025-11-01-system.md
├── 2025-11-01-creative.md
├── 2025-11-01-operational.md
├── 2025-11-01-emotive.md
├── 2025-11-01-meta.md
├── 2025-11-01-strategic.md
└── index.md
```

**File Types:**

| Type               | Purpose                                           | Example Tags              | Feeds Into              |
| ------------------ | ------------------------------------------------- | ------------------------- | ----------------------- |
| `*-system.md`      | Notes on architecture, clarity, or integration    | `#system`, `#clarity`     | `/content-factor/sync/` |
| `*-creative.md`    | Ideation, narrative, design inspiration           | `#creative`, `#design`    | `/design/prompts/`      |
| `*-operational.md` | Workflow, habits, or sprint logistics             | `#ops`, `#workflow`       | `/content-factor/sync/` |
| `*-emotive.md`     | Personal tone, motivation, emotional intelligence | `#emotive`, `#mindset`    | `/design/prompts/`      |
| `*-meta.md`        | Observations about thinking, tools, and systems   | `#meta`, `#learning`      | `/prompt-os/`           |
| `*-strategic.md`   | Long-term synthesis and directional insight       | `#strategic`, `#feedback` | `/strategic-vault/`     |

---

## 🔁 Flow Integration

Reflections don’t just sit here — they **circulate**.

1. **Capture:** write freely in the daily or sprint reflection file.
2. **Tag:** apply tags like `#system`, `#meta`, or `#emotive`.
3. **Sync:** `content-factor` parses tags and routes insights to relevant modules.
4. **Synthesize:** selected entries flow into the Strategic Vault for sprint-end reporting.

---

## 🧩 Linked Modules

| Module                 | Connection                              | Purpose                                |
| ---------------------- | --------------------------------------- | -------------------------------------- |
| `content-factor/sync/` | Receives operational/system reflections | Converts awareness into pipeline logic |
| `design/prompts/`      | Receives creative/emotive reflections   | Refines visual and tonal language      |
| `prompt-os/`           | Receives meta reflections               | Evolves prompt pattern intelligence    |
| `strategic-vault/`     | Receives strategic reflections          | Feeds organizational feedback loops    |

---

## 🧘 Rituals

* **Daily Reflection:** 3 prompts — “One thing I solved,” “One thing I noticed,” “One thing I carry forward.”
* **Mini-Sprint Reflection:** Quick synthesis of progress and emotional tone.
* **Sprint-End Reflection:** Broader strategic summary sent to `/strategic-vault/drawers/feedback/`.

---

## 🧙‍♂️ Authored by the Reflective Triad

* **Meta** — observes semantics and pattern of thought
* **Grok** — synthesizes systems and emotional patterns
* **Perplexity** — validates clarity and coherence for external contributors
