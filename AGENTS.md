## General

- Follow clean-code and production-grade best practices at all times.
- Keep logic modular, reusable, and separated by responsibility.
- Prefer simple, readable implementations over unnecessary abstraction.
- Use **arrow functions** consistently.
- Do not add comments unless they explain non-obvious logic or a deliberate decision.
- Never repeat yourself — if something is written twice, it belongs in a shared location.

## Project Structure

```text
components/
  shared/          ← any component used in more than one place
  home/
  products/
hooks/
  home/
  products/
lib/
  api/
  auth/
utils/
  styles.ts        ← reusable Tailwind class strings, cn() compositions, hover/focus patterns
  products/
constants/
  plans.ts         ← subscription tiers, badge config, feature flags
  routes.ts
```

## Constants

- **Never hardcode** plan names (`"free"`, `"premium"`), badge labels, tier logic, or feature flags inline inside components.
- Every shared value belongs in `constants/` and must be imported wherever needed.
- Example: all subscription tier metadata (label, badge variant, feature list, access rules) is defined once in `constants/plans.ts` and reused across filtering, badge rendering, and access checks.

## Reusable Styles & Class Patterns

- **Never copy-paste** Tailwind class strings or style logic across components.
- Any repeated visual pattern — hover effects, focus rings, card styles, transition configs, conditional class combinations — must be extracted to `utils/styles.ts` as a named constant or utility function and imported wherever needed.
- Use `cn()` from `lib/utils` for all conditional class merging.

```ts
// utils/styles.ts
export const hoverCard = " "
export const focusRing = " "
```

## UI & Components

- Use **shadcn/ui** for every UI element — buttons, inputs, badges, dialogs, cards, selects, tooltips, etc.
- Before building any UI element, check if a shadcn component covers it.
  - If it exists and is **installed** → use it.
  - If it exists but is **not installed** → output the install command (`npx shadcn@latest add <component>`) and wait before proceeding.
  - Only build a custom component if shadcn genuinely has no equivalent.
- **Never** use native HTML elements (`<button>`, `<input>`, `<select>`) or build from scratch when a shadcn component exists.
- Any component used in more than one place must immediately be moved to `components/shared/` — never duplicate it.

## Data Fetching

- Always use **TanStack Query + Axios** for client-side fetching and mutations.
- API functions belong in `lib/api/` and are called only through custom hooks in `hooks/<feature>/`.
- Never write Axios or fetch calls directly inside components or pages.

## Next.js, SSR & SEO

- Always read the `vercel-react-best-practices` skill before working on pages, API routes, Server Components, SSR, caching, or routing.
- Default to **Server Components**. Only add `'use client'` when interactivity or browser APIs genuinely require it.
- Use the `metadata` export or `generateMetadata` for all SEO — never insert `<head>` tags manually.
- Follow Next.js recommended patterns. Do not introduce custom workarounds.

## Before Implementing Anything

Before writing a single line of code, answer these:

1. **Does a shadcn component exist for this UI?** → Install it if missing. Never build it yourself.
2. **Is this value used in more than one place?** → It belongs in `constants/`.
3. **Is this class pattern or style repeated elsewhere?** → Extract it to `utils/styles.ts`.
4. **Is this component rendered in more than one place?** → It belongs in `components/shared/`.
5. **Is this a page, route, or SSR concern?** → Read the `vercel-react-best-practices` skill first.
6. **Does this hook/utility/component already exist?** → Reuse it, don't recreate it.
