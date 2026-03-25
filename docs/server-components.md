# Server Component Coding Standards

## Params Must Be Awaited

This project uses **Next.js 15**, where `params` and `searchParams` are **Promises**. They MUST be awaited before accessing their values.

**Wrong — does not await params:**
```tsx
// NEVER DO THIS
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params; // ❌ params is a Promise in Next.js 15
}
```

**Correct — awaits params:**
```tsx
// DO THIS
type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params; // ✅ always await params
}
```

The same rule applies to `searchParams`:

```tsx
type Props = {
  searchParams: Promise<{ query?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { query } = await searchParams; // ✅ always await searchParams
}
```

## Server Components Are Async

All server components that fetch data or access params/searchParams MUST be declared as `async` functions.

```tsx
// ✅ correct
export default async function Page({ params }: Props) { ... }

// ❌ wrong — cannot use await inside a non-async component
export default function Page({ params }: Props) { ... }
```

## No Data Fetching in Client Components

Data fetching belongs exclusively in server components. See `/docs/data-fetching.md` for the full rules. If a client component needs data, fetch it in a parent server component and pass it down as props.
