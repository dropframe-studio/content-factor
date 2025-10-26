# 📚 Content Factor Docs

Welcome to the **Content Factor documentation system** — a branded, narrative-driven knowledge base powered by Astro. This site captures the philosophy, storytelling frameworks, and design rationale behind the Content Factor pipeline.

---

## 🧠 Purpose

This documentation exists to:

- **Narrate the system** — explain not just how it works, but why it works.
- **Onboard contributors** — provide clear writing frameworks and visual standards.
- **Scale communication** — unify technical artifacts, retros, and design into a coherent voice.

---

## 📂 Structure

```
src/content/
├── storytelling/     → Writing frameworks and narrative templates
├── manuals/          → Creative technical communication guides
├── philosophy/       → Systemic thinking, config theory, Radiant Seven
└── index.md          → Landing page for the docs site
```

---

## 🎨 Design System

This site is styled using the Content Factor design tokens:
- **Pipeline colors**: Build, Capture, Transform, Publish, Measure
- **Typography**: Space Grotesk (headings), Inter (body), JetBrains Mono (code)
- **Layout**: Modular spacing, subtle shadows, branded UI components

Tokens are defined in `tailwind.config.ts` and shared across the dashboard and publishing pipeline.

---

## ✍️ Writing Philosophy

We use a **storytelling-first approach** to technical documentation:
- Every artifact is a narrative.
- Every commit is a learning moment.
- Every retro is a reflection.
- Every doc is a proof of clarity.

See [`storytelling/`](./src/content/storytelling) for writing templates and narrative scaffolds.

---

## 🚀 Local Development

```bash
cd docs
pnpm install
pnpm dev
```

Then visit [http://localhost:4321](http://localhost:4321)

---

## 🔮 Future Extensions

- Add search, TOC, and dark mode
- Auto-publish from `data/` artifacts
- Connect to blog and social publishing
- Expand prompt library and design rationale

---

Built with ❤️ using [Astro](https://astro.build) and the Content Factor pipeline.
