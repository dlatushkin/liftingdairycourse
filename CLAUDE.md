# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Docs

**IMPORTANT:** Before generating any code, always check the `/docs` folder for relevant documentation files and follow the guidelines defined there. The `/docs` folder contains specs, conventions, and design decisions that must be respected in all generated code.

- /docs/ui.md
- /docs/data-fetching.md
- /docs/data-mutation.md
- /docs/auth.md
- /docs/routing.md
- /docs/server-components.md

## Architecture

Next.js 16 app using the **App Router** (not Pages Router) with React 19, TypeScript 5 (strict mode), and Tailwind CSS v4.

- `src/app/` — App Router pages and layouts
- `@/*` path alias maps to `./src/*`
- ESLint uses the new flat config format (`eslint.config.mjs`)
- Tailwind v4 is configured via PostCSS plugin (`@tailwindcss/postcss`), not a `tailwind.config.js`
