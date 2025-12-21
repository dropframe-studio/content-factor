# 1. Unifying Principle (Anchor This First)

**Every capture is an Artifact.**
Documents, notes, retros, screenshots, audio, commits — all the same *at rest*.

Differences live in:

* `artifact.type`
* `artifact.origin`
* `artifact.asset_policy`
* `artifact.metadata`

This prevents future fragmentation.

---

# 2. Document Capture Stream (All Docs, One Path)

You already answered the scope question:

> **All the docs, everything we use here it should capture**

So don’t branch by format at ingestion.

### Supported Types (Initial)

Treat these as *mime-detected*, not hardcoded:

* PDFs
* Word / DOCX
* Markdown
* Plain text
* Spreadsheets
* Presentations
* Images
* Audio
* (Later: video, archives)

📌 **Rule:**
**File type never defines schema — only extraction behavior.**

---

## Capture Methods (CLI-first, API-compatible)

### A. Directory Watch (Primary)

Yes — this solves 80% cleanly.

**Behavior**

* Watch one or more “inbox” directories
* Any new or modified file becomes an Artifact
* Non-blocking, append-only

**Recommended Python stack**

* `watchdog` (filesystem events)
* `hashlib` (dedupe + integrity)
* `python-magic` (mime detection)

**Flow**

```
filesystem event
→ fingerprint (hash)
→ mime detect
→ artifact record created
→ asset policy decision
→ store or pointer
→ metadata attach
```

This maps *directly* to your future API.

---

### B. CLI Explicit Upload (Secondary)

```
cf capture ./docs/whitepaper.pdf --tag strategy --store
```

Same backend function as directory watch — just explicit flags.

---

### C. Manual Drag & Drop (Yes, You Can)

> can that python gui do manual drag and drop

**Yes. Two viable paths:**

#### Option 1 — Minimal, Reliable

* **Tkinter + tkdnd**
* Lightweight, local-only
* Perfect for admin/debug UI

#### Option 2 — More Power

* **PySide / PyQt**
* Native drag-drop
* Better future extensibility

📌 **Important:**
Drag-drop should **not** define logic.
It should drop into the same watched directory or call the same capture function.

---

# 3. Asset Handling (Store vs Pointer)

This should be **policy-driven**, not hardcoded.

## Asset Policy Object (Required)

Every artifact gets one:

```json
asset_policy: {
  mode: "store" | "pointer" | "hybrid",
  reason: "size" | "sensitivity" | "manual" | "default",
  location: "local" | "s3" | "gcs" | "db",
  checksum: "sha256..."
}
```

### Suggested Default Logic

| Condition       | Action              |
| --------------- | ------------------- |
| < 10MB          | Store               |
| Image           | Store               |
| Audio           | Store               |
| Video           | Pointer             |
| Doc (PDF/DOCX)  | Store               |
| Manual override | Respect             |
| Sensitive       | Pointer + encrypted |

📌 **Key insight:**
**Pointer is still an asset** — it just references storage elsewhere.

---

# 4. Metadata Layer (This Is the Spine)

You want **both standardized + flexible**.
Do **not** choose one.

## Metadata Model (Two-Tier)

### Tier 1 — Universal Fields (Always Present)

```json
metadata: {
  title,
  description,
  tags: [],
  created_at,
  captured_at,
  source: {
    system,
    user,
    path,
    device
  },
  relations: [],
  confidence,
  threat_level
}
```

These are queryable across *everything*.

---

### Tier 2 — Type-Specific Payload

```json
metadata_ext: {
  document: {
    page_count,
    author,
    extracted_text_ref
  },
  audio: {
    duration,
    transcript_ref
  },
  screenshot: {
    resolution,
    window_title
  }
}
```

📌 **Rule:**
Nothing critical lives *only* in `metadata_ext`.

---

### Tier 3 — Custom KV (Unblocked Future)

```json
custom: {
  "bolt": "strategic",
  "phase": "drift",
  "ritual": "after_action"
}
```

Never schema-validate this layer.

---

# 5. Retro vs Note (Resolve It Cleanly)

Right now they overlap because they are **both annotations**.

### Recommendation (Strong)

**Unify into one type:**

```json
artifact.type = "annotation"
```

Differentiate by intent:

```json
metadata.intent = "retro" | "note" | "commentary"
```

Why this matters:

* Same structure
* Same storage
* Same linking rules
* Different *semantic weight*

📌 Retros are **time-bound reflections**
📌 Notes are **contextual observations**

Intent ≠ structure.

---

# 6. Core Artifact Schema (Draft)

This is the lock point.

```json
artifact {
  id,
  type,
  origin,
  content_ref,
  asset_policy,
  metadata,
  metadata_ext,
  custom,
  links,
  lifecycle {
    status,
    revision,
    archived
  }
}
```

Everything else plugs into this.

---

# 7. What I’d Do Next (Order Matters)

### Phase 1 — Today

1. Lock **Artifact schema**
2. Lock **asset_policy**
3. Lock **metadata tiers**

### Phase 2 — Tomorrow

4. Implement directory watch
5. Route CLI uploads through same function

### Phase 3 — After

6. Add drag-drop UI (thin wrapper)
7. Add extraction workers (text, OCR, transcription)

---

## One Final Framing (Important)

This system is **not ingesting files**.
It is **registering evidence**.

Files are just one kind of evidence.