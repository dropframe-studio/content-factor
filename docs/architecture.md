# Content Factor Architecture

This document explains the philosophy and structure of the Content Factor system.  
It’s meant as a reminder of *why* each piece exists, not just *what* it does.

---

## 1. Core Idea

Content Factor is a **measurable, automated pipeline for visibility**.  
Every piece of work (commits, retros, notes) becomes an **Artifact**.  
Artifacts flow through a loop:

**Build → Capture → Transform → Publish → Measure**

This loop ensures that progress is always visible, structured, and reusable.

---

## 2. Key Concepts

### Artifact
- The atomic unit of captured work.
- Examples: a Git commit, a retro note, a design sketch.
- Stored as JSON in `data/artifacts/`.

### Template
- A structured lens applied to an Artifact.
- Turns raw work into a narrative (Build Log, Explainer, Teaching Moment, etc.).
- Lives in `templates/`.

### Publisher
- A channel-specific output.
- Examples: dashboard JSON, Markdown blog post, social snippet.
- Lives in `publish/`.

### Metrics
- Visibility into the pipeline itself.
- Tracks counts, last update, and health of the loop.
- Stored in `data/metrics/`.

---

## 3. Directory Map

```
content-factor/
├─ pipeline/     # Core engine (capture, transform, publish, measure)
├─ templates/    # Content blueprints
├─ publish/      # Channel-specific publishers
├─ data/         # Runtime outputs (artifacts, transformed, published, metrics)
├─ web_app/      # Dashboard frontend
└─ docs/         # Documentation
```

---

## 4. Flow Overview

1. **Capture**  
   - Input: raw work (e.g. Git commit).  
   - Output: `Artifact` JSON in `data/artifacts/`.

2. **Transform**  
   - Input: Artifact.  
   - Output: structured content via templates in `data/transformed/`.

3. **Publish**  
   - Input: transformed content.  
   - Output: published JSON in `data/published/` (later: Markdown, dashboard, social).

4. **Measure**  
   - Input: pipeline state.  
   - Output: metrics snapshot in `data/metrics/metrics.json`.

---

## 5. Philosophy

- **Proof-of-Work**: Every commit or note leaves behind a measurable artifact.  
- **Separation of Concerns**: Capture, transform, publish, and measure are independent.  
- **Scalability**: Start with JSON + stubs, expand into APIs, dashboards, and automation.  
- **Visibility First**: The system exists to make progress undeniable and shareable.  

---

## 6. Next Horizons

- Add more capture adapters (retros, screenshots, notes).  
- Expand templates into richer narratives.  
- Connect publishers to real channels (Markdown → blog, JSON → dashboard).  
- Visualize metrics in `web_app/`.  
- Federate across multiple projects (Dropframe, Grindline, StyleSystem).

---

**Remember:** Content Factor is not just code—it’s a visibility engine.  
Every artifact is a receipt of progress. Every loop run is proof-of-work.
