# Design System Snapshot (Project Audit)

Date: 2026-02-05

This document summarizes the current design system implementation (fonts, colors, spacing, components), plus known inconsistencies and recommended alignments.

## Foundations

**Typography**
- Base font: `Satoshi` (with `system-ui, sans-serif` fallback)
- Defined in: `tailwind.config.ts` + `src/index.css`
- Body uses `font-satoshi` in `src/index.css`

**Colors (CSS variables)**
- Defined in: `src/index.css` under `:root`
- Consumed via Tailwind tokens in: `tailwind.config.ts`
- Primary tokens:
  - `--background`, `--foreground`
  - `--card`, `--card-foreground`
  - `--popover`, `--popover-foreground`
  - `--primary`, `--primary-foreground`
  - `--secondary`, `--secondary-foreground`
  - `--muted`, `--muted-foreground`
  - `--accent`, `--accent-foreground`
  - `--destructive`, `--destructive-foreground`
  - `--border`, `--input`, `--ring`
- Radius token: `--radius` (0.5rem)

**Spacing / Layout**
- Container defaults: center + padding `2rem`, max width `1400px` at `2xl`.
- Common page layout: `DashboardContainer` with inner wrappers using `w-full` and `space-y-6`.

## UI Component Inventory (shadcn/ui)

All UI primitives live in `src/components/ui`:
- `accordion`, `alert-dialog`, `alert`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input-otp`, `input`, `label`, `menubar`, `navigation-menu`, `pagination`, `password-input`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `toast`, `toaster`, `toggle-group`, `toggle`, `tooltip`.

## Key Custom Components (Dashboard)

Examples of core layout/structure components in use:
- `DashboardContainer`
- `AnalyticsSection`, `UserAnalyticsSection`, `ClientDashboardSummary`
- `TaskManagementSection`, `TaskTable`, `TaskMobileCards`, `TaskDetailsSheet`
- `TimelineSection`, `ProjectTimeline`, `ProjectTimelineHeader`, `ProjectTimelineItem`

## Component Styling Standards (Current)

**Badge / Pill styles** (`src/components/ui/badge.tsx`)
- Base: `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors`
- Default/secondary/destructive variants include **hover** styles.

**Table** (`src/components/ui/table.tsx`)
- Tables depend on per-cell classes in each consumer (no single global sizing).

**Cards** (`src/components/ui/card.tsx`)
- Size/spacing controlled by each card consumer (e.g., `CardContent` padding often `p-4` or `p-6` depending on component).

## Known Inconsistencies / Issues Observed

1. **Pills (Badges) have hover effects**
   - The `Badge` component variants include `hover:` styles by default.
   - Desired: pills should be static (no hover state).

2. **Status pill wraps to two lines**
   - `in progress` can wrap due to table cell width or badge text wrapping.
   - Needs `whitespace-nowrap` on status badges (or a fixed min width).

3. **Card sizing and spacing inconsistent**
   - Some cards use `p-4`, others `p-6` or custom spacing.
   - Different typography (font sizes/weights) across analytics cards.

4. **Typography & line-height variance**
   - Headings and labels vary between sections (`text-lg`, `text-xl`, `text-3xl`), sometimes inconsistent for similar hierarchy.

## Recommended Standardizations (Proposed)

**Pills / Badges**
- Add a `pill` variant without hover, or remove hover from all variants.
- Add `whitespace-nowrap` to status badges to avoid wrapping.

**Cards**
- Standardize analytics cards:
  - `CardContent` padding: `p-6`
  - Heading: `text-sm font-medium text-slate-600`
  - Value: `text-3xl font-semibold text-slate-900`
  - Footer/metadata: `text-sm text-slate-500`

**Tables**
- Align column width strategy between client/admin:
  - Use `whitespace-nowrap` for status columns and action columns.
  - Ensure consistent cell padding and typography.

**Typography**
- Define hierarchy tokens for common heading sizes:
  - H1: `text-3xl font-bold`
  - H2: `text-xl font-semibold`
  - Section labels: `text-sm font-medium text-slate-600`

## References

- Global styles: `src/index.css`
- Tailwind theme: `tailwind.config.ts`
- Badge styling: `src/components/ui/badge.tsx`
- Task layout: `src/components/dashboard/TaskManagementSection.tsx`, `src/components/TaskTable.tsx`, `src/components/task/TaskMobileCards.tsx`
- Timeline: `src/components/ProjectTimeline.tsx`, `src/components/timeline/ProjectTimelineHeader.tsx`

