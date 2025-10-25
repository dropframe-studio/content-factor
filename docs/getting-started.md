# Getting Started with Content Factor

Welcome back 👋 — this is your Day Zero scaffold for the Content Factor pipeline.  
This doc is your quick reference for installing, running, and extending the system.

---

## 1. Install Dependencies
From the project root:

```bash
pnpm install
```

This installs TypeScript, ts-node, and any other dependencies you add later.

---

## 2. Core Pipeline Commands

Each stage of the pipeline is separate so you can debug and extend easily:

```bash
pnpm capture    # Capture latest commit → data/artifacts/<hash>.json
pnpm transform  # Transform artifact(s) → data/transformed/<hash>.json
pnpm publish    # Publish transformed content → data/published/<hash>.json
pnpm measure    # Generate metrics snapshot → data/metrics/metrics.json
```

If you want to run the whole loop in sequence:

```bash
pnpm pipeline
```

---

## 3. Where Things Live

- **Artifacts** → `data/artifacts/`  
  Raw captured work (commits, retros, notes).

- **Transformed** → `data/transformed/`  
  Template outputs (Build Log, Explainer, etc.).

- **Published** → `data/published/`  
  Final outputs ready for dashboard/blog/social.

- **Metrics** → `data/metrics/`  
  Counts, last update, and pipeline health.

- **Templates** → `templates/`  
  Five stubs: Build Log, System Observation, Project Explainer, Teaching Moment, Progress Snapshot.

- **Pipeline** → `pipeline/`  
  Core engine: capture, transform, publish, measure.

---

## 4. First Run

1. Make a commit in any connected project (e.g. `blackjack-trainer`).  
2. From this repo root, run:

```bash
pnpm capture
pnpm transform
pnpm publish
pnpm measure
```

3. Check `data/` folders to see the outputs.  
   - `artifacts/` → raw commit captured  
   - `transformed/` → structured template(s)  
   - `published/` → published JSON  
   - `metrics/` → pipeline stats

---

## 5. Next Steps

- Add more capture adapters (retros, notes, screenshots).  
- Flesh out template stubs with real logic.  
- Expand publishers (Markdown, dashboard API, social).  
- Hook into the `web_app/` frontend to visualize metrics.

---

## 6. Resetting

If you ever want to start fresh:

```bash
rm -rf data/artifacts/* data/transformed/* data/published/* data/metrics/*
```

---

That’s it — you’ve got a reproducible loop from Day Zero. Every commit is now measurable proof-of-work.



