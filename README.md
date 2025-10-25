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
  Core scripts for `capture`, `transform`, `publish`, and `measure`.

- **Publish Layer (`/publish`)**  
  Output channels (dashboard, markdown, social).

- **Templates (`/templates`)**  
  Content blueprints (BuildLog, ProgressSnapshot, ProjectExplainer, etc.).

- **Data (`/data`)**  
  - `artifacts/`: raw commits and snapshots captured by the pipeline.  
  - `published/`: processed outputs (JSON + Markdown) ready for distribution.

- **Docs (`/docs`)**  
  - `initiation/`: Charter, Stakeholders, Business Case, Pipeline Flow.  
  - `guides/`: onboarding, contributing, style guide.  
  - `reference/`: API and config notes.  
  - `architecture.md`, `getting-started.md`.

- **Web App (`/web_app`)**  
  A lightweight frontend shell for visualizing pipeline outputs.

---

## 🛠️ Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-org/content-factor.git
   cd content-factor
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run pipeline scripts**
   ```bash
   pnpm run pipeline:capture
   pnpm run pipeline:transform
   pnpm run pipeline:publish
   pnpm run pipeline:measure
   ```

4. **Explore outputs**  
   - Raw artifacts: `data/artifacts/`  
   - Published logs/snapshots: `data/published/`

---

## 📂 Repo Structure

```
content-factor/
├── pipeline/       # Core pipeline scripts
├── publish/        # Output channels
├── templates/      # Content blueprints
├── data/           # Artifacts + published outputs
├── docs/           # Initiation, guides, reference
├── web_app/        # Visualization shell
└── dist/           # Compiled JS output
```

---

## 🎯 Goals

- Prove the **Content Factor pipeline** as a repeatable loop.  
- Maintain **visibility** with dashboards and commit discipline.  
- Document every step for **future onboarding** and reproducibility.  

---

## 🤝 Contributing

Contributions are welcome!  
See [`docs/guides/contributing.md`](docs/guides/contributing.md) for style rules, commit conventions, and onboarding steps.

---

## 📜 License

[MIT](LICENSE)
