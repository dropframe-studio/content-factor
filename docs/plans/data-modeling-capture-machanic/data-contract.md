Good — then we lock **all three** as *contracts*, not code.
What follows is a **tight alignment spec** you can actually live with, not philosophy.

I’ll do this in **three short sections**, then close with a **single mental model** you can keep in your head while building.

---

# 1. Template Contract

**(What templates may read, may write, and must never touch)**

## 1.1 What a Template *Is*

A **template is a pure interpreter**.

It:

* reads Artifacts
* produces *derived outputs*
* never mutates capture truth

This is already how your repo behaves — we’re just making it explicit.

---

## 1.2 What Templates MAY Read (Explicit Allow List)

Templates may read:

### Core Identity

* `artifact.id`
* `artifact.type`
* `artifact.origin`
* `artifact.captured_at`

### Metadata (Primary Signal)

* `metadata.title`
* `metadata.description`
* `metadata.tags`
* `metadata.intent`
* `metadata.threat_level`
* `metadata.relations`

### Asset Context

* `asset_policy.mode`
* `asset_policy.location`
* `asset_policy.size_bytes`

### Extended Metadata (Optional)

* `metadata_ext.*`
* `custom.*`

📌
Templates may **interpret** these fields freely.

---

## 1.3 What Templates MUST NEVER Write

Templates must **never** modify:

* `artifact.id`
* `artifact.origin`
* `asset_policy.*`
* `metadata.created_at`
* `captured_at`
* `lifecycle.revision`

They also must **not**:

* overwrite the Artifact file
* “upgrade” an Artifact into a semantic type
* backfill capture metadata

📌
If a template needs to “add meaning,” it does so by **creating output**, not editing input.

---

## 1.4 What Templates MAY Produce

Templates may produce:

* new files in `data/published/`
* derived JSON
* derived Markdown
* summaries, narratives, dashboards
* **links that reference artifact IDs**

They do **not** create new Artifacts unless explicitly routed back through capture.

---

## 1.5 One-Sentence Rule (Write This Somewhere)

> **Templates are readers and writers of meaning, never editors of truth.**

---

# 2. Intent Truth Rules

**(When intent is set automatically vs manually)**

This is where your *forms* idea finally locks cleanly.

---

## 2.1 Intent Is a Capture Property

`metadata.intent` answers:

> *Why was this captured?*

Not:

* what it means
* how it will be used
* what template it becomes

---

## 2.2 Allowed Intent Values (Locked)

You already converged on these — let’s freeze them:

```ts
intent ∈ {
  "reference",   // evidence, documents, files
  "note",        // annotation, margin thought
  "retro",       // AAR / reflection
  "commentary",  // lattice / communication
  "unknown"
}
```

No template-specific intents.
No semantic creep.

---

## 2.3 Who Sets Intent (Authority Rules)

| Capture Path      | Allowed to Set Intent | Default          |
| ----------------- | --------------------- | ---------------- |
| Directory Watcher | ❌ No                  | `reference`      |
| CLI Capture       | ✅ Yes                 | User-provided    |
| UI Form           | ✅ Yes                 | Form-bound       |
| API               | ⚠️ Optional           | Must be explicit |

📌
**Watcher is evidence-only by design.**
This keeps it safe and boring (good).

---

## 2.4 Can Intent Change Later?

Yes — **but only via revision**, not mutation.

That means:

* changing intent creates a **new Artifact revision**
* original capture remains intact

This preserves auditability and training lineage.

---

## 2.5 Intent vs Template (Critical Distinction)

* Intent = *why it was captured*
* Template = *how it is interpreted*

One does not imply the other.

---

# 3. Multi-Template Fan-Out

**(One Artifact → many Templates, cleanly)**

This is where your system becomes powerful *without becoming messy*.

---

## 3.1 Core Rule

> **Artifacts do not belong to templates. Templates reference artifacts.**

That’s it. Everything else follows.

---

## 3.2 Fan-Out Model (Explicit)

A single Artifact may be used to generate:

* 0 templates
* 1 template
* N templates

Example:

```
artifact: raw-commit-20251218-cfa3.json
```

May generate:

* BuildLog
* ProgressSnapshot
* SystemObservation

Each output:

* references the same `artifact.id`
* lives independently
* does not modify the source

---

## 3.3 How Fan-Out Is Tracked (Minimal, Sufficient)

You already do this implicitly, but formally:

### In Published Output

```json
{
  "source_artifact": "raw-commit-20251218-cfa3",
  "template": "BuildLog",
  "generated_at": "2025-12-18T22:41:00Z"
}
```

No reverse index needed at capture time.

---

## 3.4 What This Prevents (On Purpose)

* No duplication of capture data
* No “template ownership” of artifacts
* No accidental narrative lock-in
* No re-capture just to change meaning

This aligns perfectly with your **training-first, not lore-first** stance.

---

# 4. The Single Mental Model (Keep This)

Here’s the whole system in one diagram you can hold mentally:

```
[ World ]
   ↓
[ Capture Form ]
   ↓
[ Artifact (truth, immutable) ]
   ↓
[ Template(s) (interpretation) ]
   ↓
[ Published Outputs ]
```

Or in your language:

> **Capture installs reality. Templates install meaning.**

---

# 5. Why This Aligns With Everything You’ve Been Saying

* Your push for **universal forms** → resolved via `intent`
* Your resistance to narrative creep → enforced by immutability
* Your need for training over lore → templates are optional, not mandatory
* Your existing repo structure → unchanged, just clarified

Nothing here contradicts your build — it *explains* it.

---

# 6. What I’d Lock Next (Only One Step)

Now that all three are aligned, the *next* load-bearing thing is:

### **Artifact Revision Semantics**

* what counts as a new revision
* what increments vs forks
* how watcher vs CLI behaves on modification

That’s the last place this system could drift if left vague.

If you want, we do that next — same level of precision, no fluff.
