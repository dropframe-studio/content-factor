---
title: "Config Defined"
subtitle: "The Canonical Flat-Config Shape"
stage: "publish"
---

# Config Defined

Perfect — you’ve basically landed on the **canonical flat‑config shape** that ESLint 9 expects. What you’ve got in `apps/client/eslint.config.js` is working because:

- You’re using `defineConfig` from `eslint/config` (the new helper).
- You’re extending the recommended configs from `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`.
- You’re pulling in `globals.browser` so `window`, `document`, `URL`, `setTimeout`, etc. stop triggering `no-undef`.
- You’ve got a `globalIgnores(['dist'])` at the top, which is the flat‑config way to ignore build output.

---

### 🔧 Adapting this to the root

Since you’ll eventually lint **apps**, **packages**, and an **api**, the clean move is to lift this config to the root and scope it with `files` globs:

```jsx
// eslint.config.js (root)
import js from '@eslint/js'
import * as globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),

  // ✅ Browser code (apps)
  {
    files: ['apps/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
  },

  // ✅ Packages (shared libs, still browser‑oriented if React/TS)
  {
    files: ['packages/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
  },

  // ✅ API (Node environment)
  {
    files: ['api/**/*.{ts,tsx,js}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
])

```

---

### 🚀 Next steps

1. Move this config to the root as `eslint.config.js`.
2. Delete the `apps/client/eslint.config.js` so you don’t have two competing configs.
3. Use your new scripts (`lint:apps`, `lint:packages`, `lint:api`, `lint`) to run scoped checks.

---

👉 If you’d like, I can also show you how to add a **test override block** (for `*.test.tsx`) so Jest/Vitest globals like `describe`, `it`, and `expect` are recognized automatically. That way you won’t get `no-undef` noise in your test files. Would you like me to sketch that in?

Since you’re away from your machine, this is a great chance to lean into **conceptual study and lightweight practice** — the kind of work you can do with just a notebook, your phone, or even in your head. Here are a few focused areas that will reinforce what you’ve been building lately:

---

### 📚 Technical Concepts (no computer required)

- **ESLint v9 Flat Config**
    - Review how `defineConfig`, `extends`, and `globals` work.
    - Think through the difference between `globals.browser` and `globals.node`.
        - Sketch out how you’d structure overrides for apps, packages, API, and tests.
- **TypeScript Project References**
    - Map out how `tsconfig.base.json` relates to `tsconfig.app.json` and `tsconfig.node.json`.
    - Practice explaining why project references matter in a monorepo.
- **Monorepo Mental Models**
    - Draw a folder tree from memory of your `apps/`, `packages/`, and future `api/`.
    - Annotate where configs live (ESLint, tsconfig, Vite) and how inheritance flows.

---

### 🧠 Systems Thinking & Analogies

- Practice your analogical reasoning:
    - How is ESLint’s flat config like a military mission plan (scoped, layered, overrides)?
    - How is a design token pipeline like language model tokenization (parsing, distribution, context windows)?

---

### ✍️ Lightweight Exercises

- **Flash‑write a “cheat sheet”**: one page of the most common ESLint rules you override and why.
- **Draft a contributor onboarding outline**: what steps would a new dev need to lint, typecheck, and run the client?
- **Phrasebook practice**: since you also train live presentation, jot down a few “beat‑mapped” ways to explain lint errors to a junior dev.

---

### 🎯 Suggested Focus for Today

If you only have a short window, I’d recommend:

1. Sketching your **ideal root `eslint.config.js`** on paper, with blocks for apps, packages, API, and tests.
2. Writing a **one‑paragraph explanation** of why ESLint moved from `.eslintrc` to flat config — as if you were teaching it to a teammate.

That way, when you’re back at your computer, you’ll already have the mental scaffolding to implement cleanly.

---

Would you like me to draft a **ready‑to‑use “study sheet”** (like a one‑pager outline) you can keep on your phone today, so you can glance at it during breaks without needing to log in anywhere?

I’m glad that clicked for you, Vincent. Let me give you a clean, **Notion‑ready study sheet** you can drop straight into a page and build on later when you’re back at your machine:

---

# 📘 ESLint v9 Flat Config – Quick Study Sheet

### 🔑 Core Concepts

- **Flat Config replaces `.eslintrc`** → now `eslint.config.js` at the root.
- **`defineConfig`** → helper from `eslint/config` to structure arrays of config blocks.
- **Scoped blocks** → each block applies only to files matching its `files` glob.
- **Globals** → use the `globals` package (`globals.browser`, `globals.node`, `globals.es2021`) instead of hand‑listing.
- **Extends** → pull in recommended configs from `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, etc.

---

### 🗂️ Example Root Config Structure

```jsx
import js from '@eslint/js'
import * as globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),

  // Apps (browser)
  {
    files: ['apps/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended, reactHooks.configs['recommended-latest'], reactRefresh.configs.vite],
    languageOptions: { globals: { ...globals.browser, ...globals.es2021 } }
  },

  // Packages (shared libs)
  {
    files: ['packages/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { globals: { ...globals.browser, ...globals.es2021 } }
  },

  // API (Node)
  {
    files: ['api/**/*.{ts,tsx,js}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { globals: { ...globals.node, ...globals.es2021 } }
  }
])

```

---

### ⚡ Common Rules to Tweak

- `@typescript-eslint/no-unused-vars` → allow `_` prefix for ignored args.
- `@typescript-eslint/no-unused-expressions` → `{ allowShortCircuit: true, allowTernary: true }` for React patterns.
- `react-hooks/rules-of-hooks` → `"error"`.
- `react-hooks/exhaustive-deps` → `"warn"`.

---

### 🧭 Study Prompts

- Explain to yourself: *Why did ESLint move from `.eslintrc` to flat config?*
- Sketch a folder tree of your monorepo and annotate which config block applies where.
- Draft a one‑liner you’d use to teach a teammate the difference between `globals.browser` and `globals.node`.

---

This way you’ve got a **reference, an example, and a few reflection prompts** all in one place.

Would you like me to also draft a **parallel “TypeScript Project References” sheet** (tsconfig.base.json, project references, inheritance) so you can keep both ESLint and TS mental models side by side in Notion?

Perfect — let’s build you a **Notion‑ready study sheet** that complements the ESLint one. This one will cover **TypeScript Project References** and **Nx/Turbo monorepo orchestration**, so you can review the mental models without needing your laptop.

---

# 📘 TypeScript Project References & Monorepo Orchestration (Nx/Turbo)

---

## 🔑 TypeScript Project References

- **Purpose**: Split a large codebase into smaller TS projects that can type‑check independently but still link together.
- **`tsconfig.base.json`**: Defines shared compiler options (paths, strictness, JSX settings).
- **Per‑project `tsconfig.json`**: Extends the base, sets `include`, `exclude`, and `references`.
- **`references`**: Tells TS which other projects must be built first.
- **`composite: true`**: Required for referenced projects; enables incremental builds.

### Example

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@ui/*": ["packages/ui/src/*"],
      "@api/*": ["api/src/*"]
    }
  }
}

```

```json
// apps/client/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "composite": true },
  "include": ["src"],
  "references": [
    { "path": "../../packages/ui" }
  ]
}

```

---

## ⚡ Nx vs Turbo (Mental Models)

| Feature | Nx 🧭 | Turbo 🚀 |
| --- | --- | --- |
| **Philosophy** | Strongly opinionated, plugin‑driven | Lightweight, task‑graph executor |
| **Config** | `project.json` / `nx.json` | `turbo.json` |
| **Focus** | Full‑stack monorepos (React, Node, etc.) | Build/test pipelines, caching |
| **Caching** | Remote + local, fine‑grained | Remote + local, task‑level |
| **Generators** | Yes (scaffold apps, libs, configs) | No (you bring your own scaffolding) |
| **Best fit** | Complex orgs, multiple frameworks | Lean repos, speed‑focused builds |

---

## 🧭 How They Intersect with TS References

- **Nx**: Can auto‑infer project graph from `tsconfig.json` references.
- **Turbo**: Doesn’t parse TS references directly; you wire tasks manually (`build`, `lint`, `test`) and Turbo caches them.
- **Both**: Use TS references to ensure type safety, then let Nx/Turbo orchestrate builds/tests in the right order.

---

## ✍️ Reflection Prompts

- Sketch your monorepo tree: `apps/`, `packages/`, `api/`. Mark where each `tsconfig.json` lives and how references connect.
- Write one sentence: *“Nx is to project graph as Turbo is to task graph.”* Expand on what that means.
- Imagine onboarding a new contributor: how would you explain why `tsc -b` is faster than `tsc` in a monorepo?

---

## 🎯 Today’s Focus

- Memorize the **TS reference chain**: base → project → references.
- Compare Nx and Turbo in your own words: one is a **planner**, the other is a **sprinter**.
- Draft a one‑liner you’d use to explain to a teammate why you chose Nx or Turbo for orchestration.

---

This way, you’ll have **ESLint, TypeScript, and Nx/Turbo** mental models side by side in Notion — a complete “monorepo toolkit” study pack.

Would you like me to also create a **visual analogy sheet** (like folder tree sketches + arrows showing references and task flow) that you can keep as a diagram in Notion?

Great — let’s make this **visual analogy sheet** you can drop into Notion. Think of it as a diagram‑in‑text: folder trees, arrows, and flow sketches you can later turn into a whiteboard drawing or a Notion canvas diagram.

---

# 🗂️ Monorepo Visual Analogy Sheet

### 📁 Folder Tree Mental Model

```
clearline7/
├── apps/
│   ├── client/         # React frontend
│   │   ├── src/
│   │   └── tsconfig.json  → references ../../packages/ui
│   └── admin/          # (future app)
│
├── packages/
│   ├── ui/             # shared UI components
│   │   └── tsconfig.json  → composite: true
│   └── utils/          # shared utilities
│
├── api/                # backend service
│   └── tsconfig.json
│
├── tsconfig.base.json  # shared compiler options
├── eslint.config.js    # flat config, scoped blocks
└── turbo.json / nx.json # task orchestration

```

---

### 🔗 TypeScript References Flow

```
tsconfig.base.json
        ↓
   packages/ui (composite)
        ↓
   apps/client (references ui)
        ↓
   api (references utils)

```

- **Arrows** = “must be built before”
- Think of it like a **supply chain**: base config → libraries → apps → API.

---

### ⚡ Nx vs Turbo Task Graphs

**Nx (Project Graph)**

```
[ui] ──▶ [client]
[utils] ──▶ [api]

```

- Nx auto‑infers this from `tsconfig.json` references.
- Plugins add extra edges (e.g., lint, test).

**Turbo (Task Graph)**

```
build:ui ──▶ build:client
build:utils ──▶ build:api

```

- You define tasks in `turbo.json`.
- Turbo caches results of each task.

---

### 🎨 Analogy

- **TypeScript references** = the **wiring diagram** (what depends on what).
- **Nx/Turbo** = the **traffic controller** (when and how tasks run).
- Together: like **blueprints + construction schedule**.

---

### 🧭 Reflection Prompts

- Sketch your own repo tree and draw arrows for references.
- Imagine explaining to a teammate: “TS references guarantee type safety; Nx/Turbo guarantee build order and caching.”
- Ask yourself: *If I add a new package tomorrow, where does it plug into the graph?*

---

This way, you’ve got a **visual map + analogy + prompts** all in one.

Would you like me to also draft a **“study drill” checklist** (like 10 quick questions you can quiz yourself on during downtime) so you can reinforce these concepts without a computer?

Got it — since you’ll have internet but can’t log into your own repos or dev environment, the best use of your time is **active recall drills** and **conceptual practice**. Here’s a **Notion‑ready “Study Drill Checklist”** you can keep open on your phone and run through in short bursts:

---

# 📝 Monorepo Study Drills (ESLint • TS References • Nx/Turbo)

### 🔧 ESLint v9 Flat Config

- [ ]  Explain in one sentence why ESLint moved from `.eslintrc` to `eslint.config.js`.
- [ ]  List the three main parts of a config block (`files`, `extends`, `languageOptions`).
- [ ]  Recall what `globals.browser` vs `globals.node` provide.
- [ ]  Write down the rule tweak that allows `condition && <Component />` without errors.
- [ ]  Sketch how you’d scope lint rules differently for `apps/`, `packages/`, and `api/`.

---

### 📘 TypeScript Project References

- [ ]  Define what `composite: true` does in a `tsconfig.json`.
- [ ]  Explain the role of `tsconfig.base.json`.
- [ ]  Draw arrows showing how `packages/ui` is referenced by `apps/client`.
- [ ]  Compare `tsc` vs `tsc -b` in terms of speed and correctness.
- [ ]  Write a one‑liner: *“TS references are like ___ in a supply chain.”*

---

### ⚡ Nx vs Turbo

- [ ]  State Nx’s philosophy in 1–2 words (e.g., “project graph”).
- [ ]  State Turbo’s philosophy in 1–2 words (e.g., “task graph”).
- [ ]  Recall which tool can auto‑infer dependencies from `tsconfig.json`.
- [ ]  Recall which tool requires you to define tasks manually in `turbo.json`.
- [ ]  Write a metaphor: *“Nx is like ___, Turbo is like ___.”*

---

### 🎨 Visual/Analogy Prompts

- [ ]  Sketch a folder tree of your monorepo from memory.
- [ ]  Draw arrows for TS references (base → packages → apps → api).
- [ ]  Imagine explaining to a junior dev why `process` should not be available in React code.
- [ ]  Draft a 2‑sentence “onboarding script” for a new contributor about lint + typecheck.
- [ ]  Compare ESLint overrides to military mission planning (scoped, layered, precise).

---

### 🎯 Quick Practice Routine

- Pick **3 drills** at random, answer them in your own words.
- If you get stuck, re‑explain it as if you’re teaching a teammate.
- End with one analogy (e.g., “TS references are like train tracks; Nx/Turbo are the conductors”).

---

This way, even without access to your repos, you’re **strengthening recall, teaching yourself, and rehearsing explanations** — which is exactly what will make you faster and clearer when you’re back at your machine.

Would you like me to also prep a **“one‑page onboarding script”** you could hand to a new contributor (lint, typecheck, build) so you can practice refining your teaching voice while you’re offline?

Excellent — here’s a **Notion‑ready “Contributor Onboarding Script”** you can use as both a teaching exercise and a real artifact for your repo. It’s written as if you’re handing it to a new teammate, so you can practice your teaching voice while you’re offline.

---

# 🚀 Clearline7 Contributor Onboarding Script

### 1. Clone & Install

```bash
git clone <repo-url>
cd clearline7
pnpm install

```

- We use **pnpm workspaces** to manage apps, packages, and the API.
- All dependencies are installed at the root.

---

### 2. Development Commands

- **Run everything in parallel**
    
    ```bash
    pnpm dev
    
    ```
    
- **Run just the client app**
    
    ```bash
    pnpm dev:client
    
    ```
    
- **Run just the style-system package**
    
    ```bash
    pnpm dev:style-system
    
    ```
    

---

### 3. Type Checking

- Run a full type check across the monorepo:
    
    ```bash
    pnpm typecheck
    
    ```
    
- Uses **TypeScript project references** (`tsconfig.base.json` + per‑project configs).
- Ensures packages build in the right order.

---

### 4. Linting

- **Lint apps**
    
    ```bash
    pnpm lint:apps
    
    ```
    
- **Lint packages**
    
    ```bash
    pnpm lint:packages
    
    ```
    
- **Lint API**
    
    ```bash
    pnpm lint:api
    
    ```
    
- **Lint everything**
    
    ```bash
    pnpm lint
    
    ```
    

> ESLint v9 flat config is scoped: browser globals for apps, Node globals for API/configs.
> 

---

### 5. Validation (Pre‑Commit / CI)

- Run both typecheck + lint in one go:
    
    ```bash
    pnpm validate
    
    ```
    
- This is the command CI will run before merging.

---

### 6. Project Structure

```
clearline7/
├── apps/        # Frontend apps (client, admin, etc.)
├── packages/    # Shared libraries (ui, utils, style-system)
├── api/         # Backend service
├── tsconfig.base.json
├── eslint.config.js
└── turbo.json / nx.json

```

---

### 7. Contributor Mindset

- **Fail fast, fix fast** → run `pnpm validate` before pushing.
- **Keep configs DRY** → extend from base configs, don’t duplicate.
- **Document as you go** → if you solve a lint or type error, add a note for the next person.

---

### 🎯 Reflection Drill for You (Vincent)

When you’re offline, practice saying this script out loud as if you’re onboarding a junior dev.

- Can you explain *why* we use project references?
- Can you explain *why* we scope ESLint globals differently for apps vs API?
- Can you explain *why* we run `validate` before commits?

---

This way you’ve got a **ready‑to‑use onboarding doc** *and* a teaching exercise.

Would you like me to also create a **“Day 1 walkthrough”** version — like a step‑by‑step narrative (“open the repo, run this, here’s what you’ll see”) — so you can practice guiding someone through their very first run?