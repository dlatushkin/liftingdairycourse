# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

Next.js 16 app using the **App Router** (not Pages Router) with React 19, TypeScript 5 (strict mode), and Tailwind CSS v4.

- `src/app/` — App Router pages and layouts
- `@/*` path alias maps to `./src/*`
- ESLint uses the new flat config format (`eslint.config.mjs`)
- Tailwind v4 is configured via PostCSS plugin (`@tailwindcss/postcss`), not a `tailwind.config.js`
