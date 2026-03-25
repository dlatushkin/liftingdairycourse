# Routing

## Route Structure

All application routes must be nested under `/dashboard`. There should be no top-level authenticated routes outside of this prefix.

```
/dashboard          → Dashboard home
/dashboard/workout  → Workout pages
/dashboard/...      → All other app pages
```

## Route Protection

All `/dashboard` routes are protected and require the user to be authenticated.

Route protection is implemented via **Next.js Middleware** (`src/middleware.ts`), not in individual page components or layouts.

```ts
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthenticated = // check session/token

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

- Do **not** guard routes inside `page.tsx` files or layouts — middleware is the single enforcement point.
- Unauthenticated users must be redirected to `/login` (or equivalent public route).
- Public routes (e.g. `/login`, `/register`) must remain outside the `/dashboard` prefix.
