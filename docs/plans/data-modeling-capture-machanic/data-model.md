Good — this is the *right* pause point.
What you’re asking for is **conceptual alignment**, not more code. I’ll keep this clean and structural.

Below is a **single coherent model** that aligns:

* the **universal forms** you were pushing earlier
* the **Artifact schema + watcher** we just built
* the **templates** you already use (BuildLog, ProgressSnapshot, SystemObservation, etc.)

No new abstractions. No engine talk.

---

## 1. Re-establish the Core Separation (This Is the Key)

There are **three distinct layers** in your system. They must *never collapse into each other*.

### Layer 1 — **Capture / Form**

> *What was recorded?*

* Universal
* Low-intent
* Evidence-oriented
* Immutable

**This is the Artifact layer.**

---

### Layer 2 — **Interpretation / Template**

> *What is this used as?*

* Semantic
* Opinionated
* Contextual
* Repeatable

**This is where your templates live.**

---

### Layer 3 — **Publication / View**

> *How is it rendered or surfaced?*

* Markdown
* Dashboard
* Social
* Reports

You already have this.

📌
Your earlier instinct was correct: **forms ≠ templates ≠ outputs**.
The watcher we built sits *entirely* in Layer 1.

---

## 2. Universal Forms (Reframed Precisely)

Earlier you said:

> “We are going to need more than one form… AAR, VSM card content, lattice communications…”

Here’s the alignment:

### ❌ What Forms Are *Not*

* Not file types
* Not templates
* Not UI components
* Not schemas per feature

### ✅ What Forms *Actually Are*

**Forms are capture intents.**
They answer *why* something was captured, not *what it becomes*.

That maps directly to:

```ts
artifact.type
artifact.metadata.intent
```

---

## 3. The Actual Universal Forms (Locked Set)

Based on everything you’ve said across threads, there are really **four** universal forms:

| Universal Form             | Artifact Mapping                                               | Notes                        |
| -------------------------- | -------------------------------------------------------------- | ---------------------------- |
| **Evidence**               | `type: document / image / audio / link`<br>`intent: reference` | Directory watcher lives here |
| **Annotation**             | `type: annotation`<br>`intent: note`                           | Notes, margin comments       |
| **Reflection (AAR)**       | `type: annotation`<br>`intent: retro`                          | Time-bound, evaluative       |
| **Signal / Communication** | `type: annotation or link`<br>`intent: commentary`             | Lattice inputs               |

📌
**Retro vs Note is solved here** — same structure, different intent.

No template decisions yet.

---

## 4. Where Templates Actually Belong (This Was the Confusion)

Your templates:

* `BuildLog`
* `ProgressSnapshot`
* `SystemObservation`
* `ProjectExplainer`
* `TeachingMoment`

These are **NOT forms**.
They are **interpretive lenses** applied *after capture*.

### That means:

* One Artifact → many possible templates
* One template → many possible Artifact sources
* Templates never write to `data/artifacts`

They write to:

```
data/published/
```

This matches your repo perfectly.

---

## 5. Concrete Alignment Example (End-to-End)

### Example: PDF dropped into `/docs`

**Layer 1 — Capture**

```json
{
  "type": "document",
  "metadata": {
    "intent": "reference"
  }
}
```

Nothing more.

---

**Layer 2 — Template Application**

Later, during transform:

* Same artifact is interpreted as:

  * `ProjectExplainer`
  * or `SystemObservation`

That logic lives in:

```
pipeline/transform.ts
templates/*.ts
```

The Artifact itself does **not change**.

---

**Layer 3 — Output**

Generates:

```
project-explainer-*.md
system-observation-*.json
```

As you already do.

---

## 6. Why the Watcher Is Correct (And Safe)

The TS watcher:

* Produces **Evidence-form Artifacts**
* Assigns:

  * `type`
  * `intent`
* Does **not**:

  * select templates
  * guess meaning
  * generate narratives

That keeps it aligned with your philosophy:

> capture first, meaning later

---

## 7. How This Matches Your “Universal Forms” Goal

You wanted:

> “One form for many things, not many forms for one thing”

That is exactly what this gives you:

* **One Artifact schema**
* **Few capture intents**
* **Many templates**
* **Unlimited outputs**

No form explosion.
No schema drift.

---

## 8. The One Alignment Rule to Write Down (Important)

I’d actually put this in `architecture.md`:

> **Forms capture. Templates interpret. Artifacts persist.**

If a component violates that rule, it’s in the wrong layer.

---

## 9. What We Should Lock Next (Very Targeted)

To fully seal this alignment, the next useful step is **one of these**:

### Option A — Template Contract

Define *what a template is allowed to read from an Artifact*
(and what it must never modify)

### Option B — Intent Truth Rules

Lock when `intent` can be set automatically vs manually
(watcher vs CLI vs UI)

### Option C — Multi-Template Fan-Out

Formalize that one Artifact may generate N templates
without duplication or mutation

All three are natural continuations of *this* alignment.

If you want, say which one and I’ll keep it just as tight as this review.
