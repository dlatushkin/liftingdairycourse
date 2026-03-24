# Authentication Coding Standards

## Auth Provider

This application uses **Clerk** for all authentication. Do NOT implement custom auth, use NextAuth, or any other authentication library.

## Getting the Current User

Always use Clerk's `auth()` helper from `@clerk/nextjs/server` to retrieve the current user's ID in server-side code:

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) throw new Error("Unauthorized");
```

- **DO NOT** use `currentUser()` when only the ID is needed — `auth()` is lighter and preferred.
- **DO NOT** pass `userId` as a parameter from callers (see data-fetching.md for details).

## Protecting Pages

Use Clerk middleware to protect routes. The middleware config lives in `src/middleware.ts`.

- Protected routes must redirect unauthenticated users to the Clerk sign-in page.
- Public routes (e.g. marketing pages, sign-in, sign-up) must be explicitly listed as public in the middleware config.

```ts
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
```

## Sign-In / Sign-Up Pages

Use Clerk's hosted components. Place them at the expected routes:

```
src/app/sign-in/[[...sign-in]]/page.tsx
src/app/sign-up/[[...sign-up]]/page.tsx
```

```tsx
// src/app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return <SignIn />;
}
```

## UI — User Button & Auth State

Use Clerk's pre-built components for auth-related UI. Do NOT build custom sign-in/sign-out buttons.

- `<UserButton />` — shows the signed-in user's avatar with a sign-out option.
- `<SignedIn>` / `<SignedOut>` — conditionally render content based on auth state.

```tsx
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

<SignedIn>
  <UserButton />
</SignedIn>
<SignedOut>
  {/* redirect or show sign-in link */}
</SignedOut>
```

## Environment Variables

Clerk requires the following environment variables. These must be set in `.env.local` and never committed to source control:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

Optional redirect overrides:

```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## ClerkProvider

`<ClerkProvider>` must wrap the entire application. Place it in the root layout:

```tsx
// src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```
