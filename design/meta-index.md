# 🎨 Content Factor Design System

This folder contains the **visual DNA** of Content Factor.  
It unifies tokens, prompts, and the brand kit into a single source of truth.

---

## 📂 Structure

```
design/
├── README.md          # Design rationale + index (this file)
├── tokens/            # Atomic values (colors, typography, spacing, borders, shadows)
│   └── root.json
├── prompts/           # Reusable image prompt fragments
│   ├── icons.md
│   ├── ui.md
│   ├── navigation.md
│   └── emojis.md
└── brand-kit/         # Visual reference + usage rules
    ├── logo-lockups.png
    ├── palette.png
    ├── typography.png
    └── usage-rules.md
```

---

## ✨ Components

- **Tokens**  
  Atomic design values (color, typography, spacing, borders, shadows).  
  → Used in Tailwind config, publishing templates, and Figma.

- **Prompts**  
  Tokenized image prompt fragments for icons, UI, navigation, and emoji assets.  
  → Ensures generated visuals stay consistent with the brand.

- **Brand Kit**  
  Logo lockups, palette, typography samples, and usage rules.  
  → Provides a visual reference for contributors and external collaborators.

---

## 🧭 How to Use

- **Frontend** → Import `tokens/root.json` into Tailwind v4 for consistent UI.  
- **Publishing** → Reference tokens in Markdown templates and dashboards.  
- **Imagery** → Pull from `prompts/` when generating icons, UI mockups, or emoji assets.  
- **Docs** → Link to `brand-kit/` for onboarding and external presentations.

---

## 🔮 Future Extensions

- Add **light/dark themes** as token variants.  
- Expand **prompt sets** (illustrations, diagrams, social banners).  
- Automate **token sync** between Tailwind, Figma, and docs.
