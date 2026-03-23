# UI Coding Standards

## Component Library

/clear**ONLY shadcn/ui components must be used for all UI elements in this project.**

- Do NOT create custom UI components (buttons, inputs, dialogs, cards, badges, etc.)
- Do NOT use any other component library (MUI, Chakra, Radix directly, etc.)
- All shadcn components live in `src/components/ui/` and are added via the shadcn CLI:
  ```bash
  npx shadcn@latest add <component-name>
  ```
- Compose pages and features exclusively from shadcn primitives

## Date Formatting

All dates must be formatted using **date-fns**. Do not use `Date.toLocaleDateString()`, `Intl.DateTimeFormat`, or any other date formatting approach.

### Required Format

Dates must be displayed with an ordinal day suffix, abbreviated month, and full year:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

### Implementation

Use the `do MMM yyyy` format token from date-fns:

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy"); // "1st Sep 2025"
```
