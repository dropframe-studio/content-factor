Good — this is an **implementation draft**, not a thought experiment.
Below is a **clean, minimal, production-leaning directory watcher** that maps *directly* to the Artifact schema you just locked.

No UI. No database assumptions. No engines.
This is a **capture spine**.

---

# Directory Watcher — Draft v0.1

## Design Constraints (Explicit)

* Append-only capture
* Idempotent (same file ≠ duplicate artifact)
* Single ingestion path for:

  * directory watch
  * CLI upload
  * future API endpoint
* Zero schema branching by file type

---

## File Layout

```text
capture/
├── watcher.py          # filesystem watcher
├── ingest.py           # core artifact creation
├── fingerprint.py      # hashing & dedupe
├── policy.py           # asset policy decision
├── mime.py             # mime detection
└── state.json          # seen hashes (local prototype only)
```

You can collapse this later — separation is for clarity now.

---

## 1. fingerprint.py

```python
import hashlib

def file_checksum(path, chunk_size=8192):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(chunk_size), b""):
            h.update(chunk)
    return h.hexdigest()
```

---

## 2. mime.py

```python
import mimetypes

def detect_mime(path):
    mime, _ = mimetypes.guess_type(path)
    return mime or "application/octet-stream"
```

(You can swap to `python-magic` later without touching the watcher.)

---

## 3. policy.py

```python
def decide_asset_policy(*, mime, size_bytes, manual=None):
    if manual:
        return manual

    if size_bytes < 10_000_000:
        mode = "store"
        reason = "size"
    elif mime.startswith("image/") or mime.startswith("audio/"):
        mode = "store"
        reason = "type"
    else:
        mode = "pointer"
        reason = "size"

    return {
        "mode": mode,
        "reason": reason
    }
```

---

## 4. ingest.py (Core Logic — This Is the Heart)

```python
import os
import uuid
from datetime import datetime
from fingerprint import file_checksum
from mime import detect_mime
from policy import decide_asset_policy

def ingest_file(path, *, origin_system="watcher", user=None):
    stat = os.stat(path)
    checksum = file_checksum(path)
    mime = detect_mime(path)

    asset_policy_base = decide_asset_policy(
        mime=mime,
        size_bytes=stat.st_size
    )

    artifact = {
        "id": str(uuid.uuid4()),
        "type": classify_type(mime),
        "origin": {
            "system": origin_system,
            "user": user,
            "path": path
        },
        "content_ref": None,
        "asset_policy": {
            **asset_policy_base,
            "checksum": checksum,
            "size_bytes": stat.st_size,
            "location": "local"
        },
        "metadata": {
            "title": os.path.basename(path),
            "created_at": datetime.fromtimestamp(stat.st_mtime).isoformat(),
            "tags": [],
            "intent": "unknown"
        },
        "metadata_ext": {
            "mime": mime
        },
        "custom": {},
        "links": [],
        "lifecycle": {
            "status": "active",
            "revision": 1
        },
        "captured_at": datetime.utcnow().isoformat()
    }

    return artifact


def classify_type(mime):
    if mime.startswith("image/"):
        return "image"
    if mime.startswith("audio/"):
        return "audio"
    if mime in ("application/pdf",):
        return "document"
    if mime.startswith("text/"):
        return "document"
    return "other"
```

📌 **Important**
`classify_type` is intentionally dumb.
This prevents schema drift.

---

## 5. watcher.py

```python
import json
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from ingest import ingest_file
from fingerprint import file_checksum

STATE_FILE = "state.json"


def load_state():
    try:
        with open(STATE_FILE) as f:
            return set(json.load(f))
    except FileNotFoundError:
        return set()


def save_state(state):
    with open(STATE_FILE, "w") as f:
        json.dump(list(state), f)


class CaptureHandler(FileSystemEventHandler):
    def __init__(self):
        self.seen = load_state()

    def on_created(self, event):
        if event.is_directory:
            return

        checksum = file_checksum(event.src_path)
        if checksum in self.seen:
            return

        artifact = ingest_file(event.src_path)
        self.seen.add(checksum)
        save_state(self.seen)

        emit_artifact(artifact)


def emit_artifact(artifact):
    # Prototype: print JSON
    # Later: write to DB, queue, API, etc.
    print(json.dumps(artifact, indent=2))


def watch(path):
    observer = Observer()
    handler = CaptureHandler()
    observer.schedule(handler, path, recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()


if __name__ == "__main__":
    watch("./inbox")
```

---

# What This Gives You Immediately

### ✔ Directory Watch

Drop a file → Artifact JSON emitted

### ✔ Idempotency

Hash-based dedupe (prototype-safe)

### ✔ API-Ready

`ingest_file()` can be called by:

* CLI
* HTTP endpoint
* Drag-drop GUI

### ✔ Schema-Aligned

Every output validates against the Artifact schema you locked

---

# What This Intentionally Does *Not* Do (Yet)

* No extraction (OCR, text, transcript)
* No DB assumptions
* No async queue
* No UI
* No linking logic

That’s **correct** at this stage.

---

# Next Natural Locks

1. **Example Artifacts** (PDF, retro, screenshot)
2. **Metadata truth rules** (what is mutable vs immutable)
3. **Asset store adapters** (local → bucket → pointer)
4. **Extraction workers** (non-blocking)

This watcher is solid enough to ship internally today and still survive refactors later.
