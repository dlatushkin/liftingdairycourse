# Data Fetching

## CRITICAL RULE: Server Components Only

ALL data fetching in this application MUST be done via **Server Components**.

**DO NOT** fetch data via:
- Route handlers (`/app/api/...`)
- Client components (`"use client"`)
- Any other mechanism

This is non-negotiable. If you need data in a client component, fetch it in a parent server component and pass it down as props.

## Database Access via `/data` Helper Functions

All database queries MUST go through helper functions located in the `/data` directory.

- **DO NOT** write raw SQL. Use **Drizzle ORM** exclusively.
- **DO NOT** query the database directly from page or layout components — always call a `/data` helper.

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
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function getWorkoutsForCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, session.user.id));
}
```

## User Data Isolation — CRITICAL

A logged-in user MUST only ever be able to access their own data. This means:

- **Every** query that returns user-specific data MUST filter by the authenticated user's ID.
- Retrieve the current user's ID inside the helper function itself — never accept a `userId` as a parameter from the caller, as this could allow a caller to pass an arbitrary ID.
- If no valid session exists, throw an `"Unauthorized"` error immediately — do not fall through or return empty data silently.

**Wrong — trusts the caller:**
```ts
// NEVER DO THIS
export async function getWorkouts(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

**Correct — enforces ownership internally:**
```ts
export async function getWorkouts() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, session.user.id));
}
```

Failing to filter by the authenticated user's ID is a **serious security vulnerability**.
