---
name: launchnests-design
description: LaunchNests visual design system. Read before building or restyling any page, section or component UI (layouts, grids, lists, CTAs, hero blocks, tables, forms). Covers the dashed-line separation style, corner brackets, icon policy, CTA links, and which utils/styles.ts constants to reuse.
---

# LaunchNests design system

The site is flat and editorial: white background, dashed hairlines, square corners, monospace labels. Content is separated by **dashed lines**, not boxed into cards.

## Hard rules

1. **No cards.** Don't use shadcn `Card`, rounded bordered boxes, shadows or tinted panels to group content. Separate content with dashed borders, such as `border-dashed border-border`, `divide-dashed` and dashed grids.
2. **Corner brackets only where they mark a focal block.** Examples: a hero result, a key comparison grid, a featured profile. Use `CornerBrackets` (`components/shared/corner-brackets.tsx`) inside a `relative` parent. For a grid, wrap it in `FramedGrid` (`components/shared/framed-grid.tsx`) so the brackets never pick up `divide-*` borders. Don't put brackets on every block.
3. **No decorative icons.** Add an icon only when it carries meaning text can't: a status (pass/warn/fail), a control (close, chevron, external link), or a recognisable logo. Section titles, labels, stats and bullet points get no icons. Use a small dot (`bulletDot`) for bullets.
4. **Square corners.** No `rounded-*` on layout blocks. Small pills, avatars and badges may keep their component defaults.
5. **CTAs are links styled as buttons**, so crawlers see a real `<a href>`:
   - `<Button nativeButton={false} render={<Link href={…} />}>All Docker alternatives →</Button>`
   - In section headers, use `<Link className={sectionHeaderCtaButton}>`.
   - The arrow is a text `→` (or `↗` for outbound links), not an icon. Outbound links use `rel={NOFOLLOW_LINK_REL}`.
6. **Form controls align.** Inputs and buttons in one row use the same default size (`h-8`). Don't put `size="lg"` on a button next to a default `Input`.
7. **Labels** are mono uppercase (`monoLabel`, `comparisonCategoryPill`), not icon + text.

## Reuse these constants (`utils/styles.ts`)

Never write these class strings inline.

| Need | Constant(s) |
|---|---|
| Full-width standalone page (`/compare*`, `*-alternative`) | `comparisonPageContainer`, `comparisonHeroWrapper`, `comparisonCategoryPill`, `comparisonH1`, `comparisonLeadParagraph`, `comparisonTrustBar`, `comparisonSectionTitle`, `comparisonSectionSubtitle`, `comparisonTableCard` |
| Sidebar-layout page sections | `aboutSectionBlock`, `aboutSectionTitle`, `sectionHeaderBox`, `proseParagraph`, `mutedText` |
| 2 / 3 column dashed grids | `dashedGrid2`, `dashedGrid3`, `dashedGridCell`, `dashedCellTitle` |
| Stacked dashed list (FAQ, checks) | `dashedFrame`, `dashedFrameRow` |
| Link lists | `dashedRowGrid` / `dashedRowCell` / `dashedRowItem` (sidebar pages), `dashedLinkGrid` / `dashedLinkGridItem` (full width), `dashedLinkTitle`, `dashedLinkMeta`, `compareLinkList` / `compareLinkPill` (inline chips) |
| Bullets | `bulletList`, `bulletItem`, `bulletDot` |
| Inline links | `comparisonInlineLink`, `inlineTextLink` |
| Free-tool widgets | `freeToolWidget`, `freeToolForm`, `freeToolResult`, `freeToolScore`, `freeToolStatusBadge`, `freeToolReport`, `freeToolPanelHeader`, `freeToolCodeBlock`, `freeToolCtaRow`, `freeToolCheckTitle`, `freeToolCheckDetail` |

Shared building blocks: `FramedGrid`, `ComparisonLinkGrid`, `CornerBrackets`, `PageBreadcrumb`, `PageHeader`, `AskAiBar`, `SiteUrlForm` and `FreeToolCheckList` / `CheckStatusBadge` (free-tool inputs and pass/warn/fail lists).

If a pattern you need isn't here, add a named constant to `utils/styles.ts` and update this table. Don't inline it.

## Layout choice

- **Full width, no sidebars:** compare hub, compare detail and `*-alternative` pages (`isStandaloneComparisonRoute` in `components/layout/app-layout-shell.tsx`). Use the `comparison*` hero and container classes. Reference pages: `/devhunt-alternative`, `/compare/docker-vs-podman`.
- **Sidebar layout:** alternatives, glossary, free tools and most other pages. Use `PageBreadcrumb`, then `PageHeader`, then sections split by `aboutSectionBlock` / `sectionHeaderBox` and dashed row grids. Reference: `/glossary`.

## Checklist before shipping UI

- [ ] No `Card`, shadow or rounded container used to group content
- [ ] Every icon carries meaning; decorative ones removed
- [ ] Corner brackets only on the focal block(s), placed on a wrapper
- [ ] CTAs are `<a href>` links with text arrows
- [ ] Inputs and buttons in a row share a height
- [ ] All class strings come from `utils/styles.ts`

Older pages don't follow every rule yet. Bring a page into line when you touch it, and don't copy old patterns from it.
