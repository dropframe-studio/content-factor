# 🔄 Sync Engine — `/content-factor/sync/`

Welcome to the **Sync Engine**, the connective tissue of the VSMForge ecosystem.
Here, reflections, discoveries, and project artifacts are parsed, tagged, and routed to their destination drawers within the **Strategic Vault**, **Prompt OS**, and **Design System**.

---

## 🧭 Purpose

The Sync Engine transforms unstructured content into structured intelligence.
It ensures that every note, log, and reflection becomes a **living input** to the ecosystem’s evolving systems.

**Input:** Reflections, build logs, transcripts, sprint notes
**Process:** Parse → Tag → Route
**Output:** Structured entries to Vaults, Drawers, and Dashboards

---

## 📁 Structure

```
/content-factor/sync/
├── pipeline/
│   ├── tag-router.ts
│   ├── reflection-intake.ts
│   ├── vault-export.ts
│   └── prompt-linker.ts
├── schemas/
│   ├── reflection.schema.json
│   ├── vault-entry.schema.json
│   ├── prompt-map.schema.json
├── logs/
│   ├── 2025-11-01-sync.log
│   ├── 2025-11-02-sync.log
└── README.md
```

---

## 🧩 Core Components

| Component              | Function                                                             | Connected Modules                |
| ---------------------- | -------------------------------------------------------------------- | -------------------------------- |
| `tag-router.ts`        | Parses and classifies entries by tags (`#system`, `#creative`, etc.) | `/vault/reflect/`, `/prompt-os/` |
| `reflection-intake.ts` | Receives raw reflections, applies schema validation                  | `/vault/reflect/`                |
| `vault-export.ts`      | Sends structured data to drawers (`/strategic-vault/*`)              | `/strategic-vault/`              |
| `prompt-linker.ts`     | Links relevant reflections to design or prompt generation            | `/design/prompts/`               |

---

## 🧬 Tag Taxonomy

| Tag          | Route                            | Example                                        |
| ------------ | -------------------------------- | ---------------------------------------------- |
| `#system`    | `/strategic-vault/architecture/` | Notes on pipeline design                       |
| `#creative`  | `/design/prompts/`               | Visual or metaphorical inspiration             |
| `#meta`      | `/prompt-os/`                    | Insights about model logic or prompt structure |
| `#ops`       | `/strategic-vault/operations/`   | Workflow efficiency or tooling updates         |
| `#emotive`   | `/design/prompts/emotive.md`     | Tone, morale, or narrative feeling             |
| `#strategic` | `/strategic-vault/feedback/`     | Long-term or directional insight               |

---

## 🔁 Processing Flow

1. **Capture** → Reflection or log written to `/vault/reflect/`
2. **Parse** → `tag-router.ts` identifies intent and category
3. **Validate** → Data matched to `reflection.schema.json`
4. **Route** → Entry sent to correct drawer or prompt map
5. **Sync** → Logs record all movements for traceability

---

## 📊 Metrics & KPIs

| Metric                      | Description                            | Target |
| --------------------------- | -------------------------------------- | ------ |
| Reflection Routing Accuracy | % of reflections correctly categorized | ≥ 95%  |
| Processing Latency          | Time from intake to export             | ≤ 5s   |
| Tag Density                 | Average tags per reflection            | 3–5    |
| Cross-Link Ratio            | Reflections linked to multiple modules | ≥ 40%  |

---

## ⚙️ Integration Hooks

* **From:** `/vault/reflect/` (raw reflections)
* **To:** `/strategic-vault/`, `/design/`, `/prompt-os/`
* **API Output:** JSON payloads for dashboard visualization
* **CLI Support:** `pnpm sync:reflect` for local testing

---

## 🧙‍♂️ Maintained by the Sync Triad

* **Meta** — defines schemas and tag logic
* **Grok** — optimizes pipeline flow and data coherence
* **Perplexity** — validates external intelligibility and formatting
