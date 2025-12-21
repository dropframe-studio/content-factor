Got it. This is the **hard alignment step**: make sure the watcher’s output **exactly matches** your canonical `Artifact` model so nothing downstream breaks.

Below is a **field-by-field map**, then a **concrete TS implementation** that drops into your repo.

---

# 1. Canonical Artifact Shape (As Used in `pipeline/artifact.ts`)

From your tree and usage patterns, your Artifact effectively has this shape (even if the interface is slightly looser today):

```ts
export interface Artifact {
  id: string
  type: string

  origin: {
    system: string
    user?: string
    path?: string
  }

  asset_policy: {
    mode: "store" | "pointer" | "hybrid"
    reason?: string
    location: string
    checksum: string
    size_bytes?: number
  }

  content_ref?: string | null

  metadata: {
    title: string
    created_at: string
    tags?: string[]
    intent?: string
    threat_level?: string
    relations?: string[]
  }

  metadata_ext?: Record<string, unknown>
  custom?: Record<string, unknown>

  links?: {
    target_id: string
    relation: string
  }[]

  lifecycle: {
    status: "active" | "archived" | "deleted"
    revision: number
  }

  captured_at: string
}
```

This matches:

* filesystem artifacts
* sqlite artifacts
* published artifacts

No transforms required.

---

# 2. Watcher → Artifact Mapping (Truth Table)

| Watcher Input   | Artifact Field            | Rule                       |
| --------------- | ------------------------- | -------------------------- |
| UUID            | `id`                      | Always generated           |
| MIME            | `type`                    | Coarse classification only |
| `"watcher"`     | `origin.system`           | Fixed                      |
| file path       | `origin.path`             | Always set                 |
| file mtime      | `metadata.created_at`     | Source truth               |
| filename        | `metadata.title`          | Default, editable later    |
| file size       | `asset_policy.size_bytes` | Observed                   |
| checksum        | `asset_policy.checksum`   | Integrity                  |
| policy decision | `asset_policy.mode`       | Deterministic              |
| now()           | `captured_at`             | System time                |
| default         | `metadata.intent`         | `"reference"`              |
| default         | `lifecycle.revision`      | `1`                        |

📌 **Important rule**
The watcher **never**:

* assigns templates
* sets semantic types (BuildLog, Observation, etc.)
* creates links
* modifies existing artifacts

---

# 3. Final Mapped TS Implementation (Drop-In)

### `pipeline/capture/watcher/ingest.ts`

```ts
import fs from "fs"
import path from "path"
import mime from "mime-types"
import { v4 as uuidv4 } from "uuid"

import { Artifact } from "../../artifact"
import { classifyType } from "./classify"
import { decideAssetPolicy } from "./policy"
import { fileChecksum } from "./fingerprint"

export async function mapFileToArtifact(
  filePath: string
): Promise<Artifact> {
  const stat = fs.statSync(filePath)
  const mimeType = mime.lookup(filePath) || "application/octet-stream"
  const checksum = await fileChecksum(filePath)

  const assetPolicyBase = decideAssetPolicy(
    mimeType as string,
    stat.size
  )

  return {
    id: uuidv4(),

    type: classifyType(mimeType as string),

    origin: {
      system: "watcher",
      path: filePath
    },

    asset_policy: {
      ...assetPolicyBase,
      checksum,
      size_bytes: stat.size,
      location: "filesystem"
    },

    content_ref: null,

    metadata: {
      title: path.basename(filePath),
      created_at: new Date(stat.mtime).toISOString(),
      tags: [],
      intent: "reference"
    },

    metadata_ext: {
      mime: mimeType
    },

    custom: {},

    links: [],

    lifecycle: {
      status: "active",
      revision: 1
    },

    captured_at: new Date().toISOString()
  }
}
```

---

# 4. How This Plugs Into Storage (No Changes Needed)

In `pipeline/capture/watcher/index.ts`:

```ts
import { mapFileToArtifact } from "./ingest"
import { persistArtifact } from "../../storage/manager"

async function ingestFile(filePath: string) {
  const artifact = await mapFileToArtifact(filePath)
  await persistArtifact(artifact)
}
```

This means:

* filesystem backend works
* sqlite backend works
* dashboards update
* publish pipeline remains untouched

---

# 5. Artifact Immutability (Implicit but Important)

Once written:

* `id` ❌ never changes
* `asset_policy.checksum` ❌ never changes
* `origin.path` ❌ never changes

Future edits create **new revision**, not mutation.

---

# 6. Sanity Check Against Your Repo

Drop a PDF into `./docs`:

✔ JSON appears in `data/artifacts`
✔ SQLite row created
✔ Dashboard sees it
✔ Publish pipeline ignores it until transformed

That’s correct behavior.

---

# 7. Next Clean Locks (Recommended Order)

1. **Dedup rule**
   Same checksum → block or revision?
2. **Revision policy**
   File modified → new artifact vs revision++
3. **Ignore config**
   `.git`, `node_modules`, `dist`

Next TODOs

* add checksum-based dedupe cleanly
* define revision semantics
* wire this to `cf watch`