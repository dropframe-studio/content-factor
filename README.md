# 📝 Content Factor
[![Build Status](https://img.shields.io/github/actions/workflow/status/dropframe-studio/content-factor/ci.yml?branch=main)](../../actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/dropframe-studio/content-factor/main)](../../commits/main)
[![Docs](https://img.shields.io/badge/docs-initiation-blue)](docs/initiation/README.md)

**Content Factor** is a core project under the [Dropframe Studio](https://github.com/dropframe-studio) organization.

It is a modular pipeline for sustainable content creation, operationalizing the **Build → Capture → Transform → Publish → Measure** loop.

The system turns raw commits into visible proof‑of‑work with dashboards, logs, and snapshots—serving as both a content engine and a visibility framework.

---

## 🌐 Part of the Dropframe Studio Ecosystem

Content Factor is one of several **core projects** in the Dropframe Studio org, alongside:

- **Grindline** – workflow automation and orchestration
- **StyleSystem** – shared design tokens and UI foundations
- **Dropframe** – the umbrella workspace and integration layer

Together, these projects form a federated ecosystem for building, publishing, and scaling creative systems.

---

## 🚀 Project Overview

- **Pipeline (`/pipeline`)**
  - Core scripts for `capture`, `transform`, `publish`, and `measure`.
  - **Multi-capture system**: Git commits, sprint retros, and extensible adapters for notes, screenshots, and more.
  
- **Publish Layer (`/publish`)**
  - Output channels (dashboard, markdown, social).
  
- **Templates (`/templates`)**
  - Content blueprints: BuildLog, ProgressSnapshot, ProjectExplainer, SystemObservation, TeachingMoment.
  - Smart routing: commits → Build Logs, retros → Progress Snapshots.
  
- **Data (`/data`)**
  - `artifacts/`: Raw commits and snapshots captured by the pipeline.
  - `published/`: Processed outputs (JSON + Markdown) ready for distribution.
  - `metrics/`: Pipeline health and visibility stats.
  
- **Web App (`/web_app`)**
  - **Dashboard UI** for visualizing artifacts, metrics, and published content.
  - Built with React + Tailwind CSS + Vite.
  - Filter by type, view Markdown previews, track progress in real-time.
  
- **Docs (`/docs`)**
  - `initiation/`: Charter, Stakeholders, Business Case, Pipeline Flow.
  - `guides/`: Onboarding, contributing, style guide.
  - `reference/`: API and config notes.
  - `architecture.md`, `getting-started.md`.

---

## 🛠️ Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/dropframe-studio/content-factor.git
cd content-factor
pnpm install
```

### 2. Run the Pipeline

**Full automated pipeline (capture latest commit + process):**
```bash
pnpm start
```

Or run individual steps:
```bash
pnpm capture:commit   # Capture latest Git commit
pnpm capture:retro    # Interactive sprint retrospective
pnpm transform        # Apply templates
pnpm publish-content  # Generate Markdown
pnpm measure          # Collect metrics
```

### 3. View the Dashboard

```bash
cd web_app
pnpm install
pnpm dev
```

Open `http://localhost:3000` to see your artifacts visualized with metrics, filters, and Markdown previews.

### 4. Explore Outputs

- **Raw artifacts:** `data/artifacts/`
- **Published content:** `data/published/`
- **Metrics:** `data/metrics/`

---

## 📂 Repo Structure

```
content-factor/
├── pipeline/
│   ├── capture/       # Multi-capture adapters (commit, retro)
│   ├── transform.ts   # Template routing
│   ├── publish.ts     # Markdown generation
│   └── measure.ts     # Metrics collection
├── publish/           # Channel-specific publishers
├── templates/         # Content blueprints (5 templates)
├── data/
│   ├── artifacts/     # Captured work (JSON)
│   ├── published/     # Final outputs (Markdown)
│   └── metrics/       # Pipeline stats
├── web_app/           # Dashboard UI (React + Tailwind)
├── docs/              # Initiation, guides, reference
└── dist/              # Compiled JS output
```

---

## 🎯 Current Capabilities

### Capture Types
| Type | Trigger | Template | Output |
|------|---------|----------|--------|
| **Git Commit** | Automatic | Build Log | Daily dev work |
| **Sprint Retro** | Manual prompt | Progress Snapshot | Sprint reflections |

### Templates
- **Build Log** — What I built, why it matters, what I learned, next step
- **Progress Snapshot** — What shipped, what went well, what was hard, learnings
- **Project Explainer** — Problem, solution, how it works, audience
- **System Observation** — Observation, pattern, implications, alternative
- **Teaching Moment** — Challenge, failed approaches, solution, try this

### Pipeline Flow
```
Commit/Retro → Capture → Transform → Publish → Measure
                  ↓          ↓          ↓         ↓
              Artifact    Template   Markdown   Metrics
                JSON       JSON        .md       JSON
```

---

## 🎯 Goals

- Prove the **Content Factor pipeline** as a repeatable loop.
- Maintain **visibility** with dashboards and commit discipline.
- Document every step for **future onboarding** and reproducibility.
- Create **measurable proof-of-work** that compounds over time.

---

## 📈 Example Output

After running `pnpm capture:retro`:

```markdown
# Progress Snapshot

## Sprint 0: Content Factor Pipeline

## What I Shipped
Built full pipeline with multi-capture support

## What Went Well
The system is now extensible

## What Was Hard
Tempering excitement

## What I Learned
This is something we can do, just fine, it seems

## Next Focus
UI and more captures
```

---

## 🔮 Next Horizons

- Connect dashboard to real data (read from `data/` folders)
- Add more capture adapters (notes, screenshots, design artifacts)
- Enrich templates with smart extraction (parse diffs, detect patterns)
- Add social publishers (Twitter, LinkedIn stubs)
- Federate across projects (Dropframe, Grindline, StyleSystem)

---

## 🤝 Contributing

Contributions are welcome!

See [`docs/guides/contributing.md`](docs/guides/contributing.md) for style rules, commit conventions, and onboarding steps.

---

## 📜 License

[MIT](LICENSE)