Perfect. Below is a **TypeScript directory watcher skeleton** that **fits your repo exactly** and plugs into the existing `pipeline` without inventing new abstractions.

This is **intentionally thin**: capture → artifact → storage manager.
No transforms, no publish, no templates.

---

# TS Directory Watcher — Skeleton (Repo-Aligned)

## Placement (Do This First)

```
pipeline/
└── capture/
    └── watcher/
        ├── index.ts        ← entry
        ├── classify.ts     ← mime → artifact.type
        ├── fingerprint.ts ← hash + dedupe
        └── policy.ts      ← asset_policy decision
```

This mirrors `commit.ts`, `note.ts`, `screenshot.ts`.

---

# 1. fingerprint.ts

```ts
import fs from "fs";
import crypto from "crypto";

export function fileChecksum(path: string): string {
  const hash = crypto.createHash("sha256");
  const stream = fs.createReadStream(path);

  return new Promise<string>((resolve, reject) => {
    stream.on("data", chunk => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  }) as unknown as string;
}
```

(You may want async later — skeleton keeps intent obvious.)

---

# 2. classify.ts

```ts
export function classifyType(mime: string): string {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("audio/")) return "audio";
  if (mime === "application/pdf") return "document";
  if (mime.startsWith("text/")) return "document";
  return "other";
}
```

📌 **Rule:**
Classification is *coarse* on purpose.
Templates decide meaning later.

---

# 3. policy.ts

```ts
export function decideAssetPolicy(
  mime: string,
  sizeBytes: number
) {
  if (sizeBytes < 10_000_000) {
    return { mode: "store", reason: "size" };
  }

  if (mime.startsWith("image/") || mime.startsWith("audio/")) {
    return { mode: "store", reason: "type" };
  }

  return { mode: "pointer", reason: "size" };
}
```

---

# 4. index.ts (The Watcher Entry)

```ts
import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import { v4 as uuidv4 } from "uuid";

import { classifyType } from "./classify";
import { decideAssetPolicy } from "./policy";
import { fileChecksum } from "./fingerprint";

import { persistArtifact } from "../storage/manager";
import { Artifact } from "../artifact";
```

### Core handler

```ts
async function ingestFile(filePath: string) {
  const stat = fs.statSync(filePath);
  const mimeType = mime.lookup(filePath) || "application/octet-stream";
  const checksum = await fileChecksum(filePath);

  const assetPolicyBase = decideAssetPolicy(
    mimeType as string,
    stat.size
  );

  const artifact: Artifact = {
    id: uuidv4(),
    type: classifyType(mimeType as string),
    origin: {
      system: "watcher",
      path: filePath
    },
    content_ref: null,
    asset_policy: {
      ...assetPolicyBase,
      checksum,
      size_bytes: stat.size,
      location: "filesystem"
    },
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
  };

  await persistArtifact(artifact);
}
```

---

### Watch bootstrap

```ts
export function startWatcher(directories: string[]) {
  const watcher = chokidar.watch(directories, {
    ignoreInitial: true,
    persistent: true
  });

  watcher.on("add", async (filePath) => {
    try {
      await ingestFile(filePath);
    } catch (err) {
      console.error("Watcher ingest failed:", err);
    }
  });

  console.log("📡 Content Factor watcher active");
}
```

---

### Optional CLI hook

```ts
if (require.main === module) {
  startWatcher(["./inbox", "./docs", "./design"]);
}
```

---

# 5. How This Integrates Cleanly

✔ Uses **existing** `storage/manager.ts`
✔ Emits **canonical Artifact** objects
✔ Does **not** touch transform or publish
✔ Can be started as:

* daemon
* dev helper
* background process
* future service

---

# 6. What This Does *Not* Do (By Design)

* No dedupe store yet (checksum check can be added in `persistArtifact`)
* No extraction
* No revisioning
* No linking
* No semantic classification

This keeps capture **pure**.

---

# 7. Immediate Next Safe Upgrades (Choose One)

1. **Deduplication gate** inside `storage/manager.ts`
2. **Ignore rules** (from config file)
3. **Revision handling** (file modified → new revision)
4. **Watcher → API parity** (reuse `ingestFile` in HTTP endpoint)

---

If you want next, I can:

* map this exactly onto your existing `Artifact` TS interface
* add revision logic for modified files
* add a lightweight ignore/filter system
* or wire this into your existing CLI (`cf watch`)

Say the word.
