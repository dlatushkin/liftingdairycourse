# Data Mutation

## Database Access via `/data` Helper Functions

All database mutations MUST go through helper functions located in the `src/data` directory.

- **DO NOT** write raw SQL. Use **Drizzle ORM** exclusively.
- **DO NOT** mutate the database directly from server actions or components — always call a `src/data` helper.

### Example structure

```
src/
  data/
    workouts.ts
    exercises.ts
    sets.ts
```

### Example helper function

```ts
// src/data/workouts.ts
import { db } from "@/lib/db";
import { workouts } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

export async function createWorkout(name: string, date: Date) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return db.insert(workouts).values({
    userId: session.user.id,
    name,
    date,
  });
}
```

## Server Actions

All data mutations MUST be performed via **Server Actions**.

- Server actions MUST live in a colocated `actions.ts` file next to the page or feature they belong to.
- **DO NOT** perform mutations in route handlers, client components, or directly in page components.

### Colocated file convention

```
src/app/workouts/
  page.tsx
  actions.ts   ← server actions live here
```

### Parameter typing

- All server action parameters MUST be explicitly typed with TypeScript.
- **DO NOT** use `FormData` as a parameter type — define typed argument objects instead.

### Zod validation

ALL server actions MUST validate their arguments using **Zod** before performing any mutation.

### Example server action

```ts
// src/app/workouts/actions.ts
"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.date(),
});

type CreateWorkoutParams = z.infer<typeof createWorkoutSchema>;

export async function createWorkoutAction(params: CreateWorkoutParams) {
  const parsed = createWorkoutSchema.safeParse(params);
  if (!parsed.success) throw new Error("Invalid input");

  return createWorkout(parsed.data.name, parsed.data.date);
}
```

## Redirects

**DO NOT** call `redirect()` inside server actions. Redirects must be handled client-side after the server action resolves.

```ts
// NEVER DO THIS
export async function createWorkoutAction(params: CreateWorkoutParams) {
  const workout = await createWorkout(params.name, params.startedAt);
  redirect(`/dashboard/workouts/${workout.id}`); // ❌ do not redirect in server actions
}

// DO THIS — return data and redirect client-side
export async function createWorkoutAction(params: CreateWorkoutParams) {
  const workout = await createWorkout(params.name, params.startedAt);
  return workout; // ✅ return result, let the client redirect
}
```

```tsx
// In the client component:
const workout = await createWorkoutAction(params);
router.push(`/dashboard/workouts/${workout.id}`); // ✅ redirect client-side
```

---

**Wrong — no validation, uses FormData:**
```ts
// NEVER DO THIS
export async function createWorkoutAction(formData: FormData) {
  const name = formData.get("name") as string;
  await db.insert(workouts).values({ name }); // direct db call, no validation
}
```
