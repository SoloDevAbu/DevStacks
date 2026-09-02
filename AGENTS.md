## General

- Follow clean-code and production-grade best practices.
- Keep logic modular, reusable, and separated by responsibility.
- Prefer simple, readable implementations over unnecessary abstraction.
- Use **arrow functions** consistently.
- Do not add comments unless they explain non-obvious logic or an important decision.
- Do not over-engineer.

## Project Structure

Keep related code organized into dedicated subfolders.

```text
components/
  home/
  products/
  ...
hooks/
  products/
  home/
  ...
lib/
  api/
  auth/
  ...
utils/
  products/
  ...
```

- Page-specific components belong in `components/<page-or-feature>/`.
- Custom hooks belong in `hooks/<feature>/`.
- API/data-fetching logic must **never** be written directly inside pages or components.
- Keep reusable utilities in `utils/<feature>/`.
- Keep shared libraries/configuration in `lib/<feature>/`.
- Follow the same separation pattern for other code whenever appropriate.

## Data Fetching

- Always use **TanStack Query + Axios** for client-side data fetching and mutations.
- Create API functions separately and call them through custom hooks.
- Never write Axios/API/fetch calls directly inside components or pages.
- Keep query and mutation hooks organized under the appropriate `hooks/<feature>/` folder.

## UI & Components

- Use **shadcn/ui** for UI components everywhere and if the component doesn't exists then asks for install if first then use it.
- Before implementing a component, check the relevant **shadcn skill** for the use case and follow its recommended approach.
- Prefer composition and reusable components over large monolithic components.

## Pages, API, SSR, SSE & Next.js

- Before working on pages, API routes, Server Components, SSR, SSE, caching, routing, or other Next.js-specific functionality, **always read and follow the `vercel-react-best-practices` skill first**.
- Follow Next.js/React recommended patterns rather than introducing custom patterns unnecessarily.

## Before Implementing

1. Check the relevant skills/documentation when required above.
2. Inspect the existing project structure and patterns.
3. Reuse existing components, utilities, hooks, and abstractions where appropriate.
4. Keep new code consistent with the existing architecture.
5. Ensure responsibilities remain separated and files stay focused.
