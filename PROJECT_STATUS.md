# Compass Project Status

_Last updated: July 22, 2026_

## Checkpoint

- Repository: `jhelton0518/Compass`
- Branch: `main`
- Financial foundation commit: `8f81bec12f4c6e2eb4e7085bc64350eaa5b4589d`
- Financial foundation commit message: `Working financial data foundation`
- Current phase: complete navigable application UI milestone

## Stack

- Next.js 16 using the App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React
- ESLint
- Cursor IDE
- Git and GitHub

## Completed

- Next.js application is established.
- TypeScript and Tailwind are configured.
- Git history is clean under the personal GitHub account.
- Volunteer Custom Homes company data exists.
- Financial periods, GL accounts, reporting categories, and account mappings exist.
- Monthly income statement seed data exists.
- The income statement service can retrieve a selected period.
- The page reads financial data through the service layer.
- The responsive application shell and fixed dark-navy navigation are complete.
- The dashboard header includes the Volunteer Custom Homes company selector and
  an "As of June 2026" reporting-period control.
- The dashboard overview calculates Revenue, Gross Profit %, Overhead % of
  Revenue, and Net Income % from the Volunteer Custom Homes financial model.
  Cash remains static until balance-sheet data exists.
- The Financial Briefing presents a static, owner-focused summary of growth,
  gross margin pressure, improved Overhead discipline, and tight cash.
- Detailed Profitability Trends remain off the Dashboard and now appear on the
  dedicated Profitability page using the reusable trend model.
- The approved profitability values reconcile as Gross Profit 25.8% less
  Overhead 14.6% equals Operating Profit 11.2%; less Net Other Expense 0.8%
  equals Net Income 10.4%.
- Financial engine checkpoint 1 defines integer-dollar calculation contracts,
  monthly subtotals, ordered R12M windows, explicit incomplete-window results,
  zero-revenue ratio handling, and presentation formatters.
- Focused synthetic-fixture tests cover formulas, missing and open periods,
  zero revenue, signed negative values, formatting, and exact reconciliation.
- Financial engine checkpoint 2 replaces the incompatible seed records with
  24 approved synthetic modeling periods from July 2024 through June 2026.
- Both current and prior R12M windows reconcile to the approved totals, ratios,
  and comparisons. July 2025 through June 2026 also reconciles to the approved
  monthly Gross Profit sequence and steadily improving Overhead percentage.
- Financial engine checkpoint 3 adds a dashboard-facing service model using
  company `vch` and the June 2026 closed endpoint. It calculates the current
  and prior R12M results, formatted KPI values and comparisons, and all 12
  monthly profitability trend points without duplicating formulas in React.
- The Dashboard uses its overview cards as the authoritative R12M presentation
  and ends cleanly after the unchanged Financial Briefing.
- Incomplete R12M windows and zero-revenue ratios retain explicit unavailable
  states instead of presenting partial or misleading profitability results.
- `npm run lint` and `npm run build` pass as of July 22, 2026.
- Functional, active-state sidebar navigation now connects Dashboard,
  Profitability, Cash & Working Capital, Financial Statements, Accounts
  Receivable, Accounts Payable, and Settings across responsive layouts.
- The dedicated Profitability page uses the approved financial engine for four
  R12M overview metrics, 12 rolling-R12M endpoints, monthly detail, and grouped
  Direct Cost, Indirect Cost, and Overhead drivers.
- Financial Statements provides calculated Monthly, YTD, and R12M Income
  Statement views using closed-period metadata. Balance Sheet and Cash Flow are
  clearly unavailable until their financial foundations exist.
- Cash & Working Capital, Accounts Receivable, and Accounts Payable are complete
  prototype experiences backed only by centralized, explicitly labeled fixture
  data in `data/prototype-fixtures.ts`.
- Settings presents company and reporting preferences, connection status, the
  three-layer account model, mapping controls, and existing financial category
  records without external writes.
- Shared page headers, shells, cards, panels, tables, charts, segmented controls,
  status badges, prototype labels, and unavailable states keep every page within
  the approved Dashboard visual system.
- Profitability and Cash trends use accessible line charts that plot their
  ordered calculated or fixture values without favorability-based direction
  transformations.
- The shared line chart measures its rendered container with `ResizeObserver`
  and draws at matching SVG pixel dimensions without a stretched coordinate
  system. It retains every data point, selects at most six non-overlapping
  endpoint-inclusive axis labels, and provides clamped SVG tooltips, active
  markers, and guide lines for pointer, keyboard, and touch interaction.
- Income Statement Monthly, YTD, and R12M views expose underlying monthly
  columns. YTD shows January through December with future months unavailable;
  R12M shows 12 trailing months, and both include reconciled total columns.
- Gross Profit, Overhead, and Net Income margin charts accompany
  the displayed Income Statement columns using aggregated rolling-R12M values
  ending in each displayed month.
- The R12M Income Statement now presents section bands before account detail,
  section subtotals after detail, and distinct Gross Profit, Operating Profit,
  Net Income, and percentage rows. Its fixed-layout desktop table fits all 12
  monthly columns plus R12M Total at 1280px and wider; tablet and mobile retain
  an internal scrollbar and sticky Category column.
- Twelve-point charts display all 12 crisp, angled month labels while retaining
  measured SVG dimensions, clamped interactive tooltips, active markers, and
  guide lines. Live checks found no label intersections at desktop width.
- Permanent chart convention: P&L charts default to R12M values calculated from
  aggregated trailing-12-month dollars, never averages of monthly percentages.
  Monthly P&L trends require explicit selection and labeling; operational and
  balance-sheet measures remain period-ending or as-of views.
- Accounts Receivable uses an operational as-of date of July 22, 2026 and
  derives KPI totals, aging buckets, customer risk, days past due, collection
  status, and owner insights from invoice due dates and amounts. No age or
  status values are stored in invoice fixtures.
- `npm run test:financial` passes 33 focused financial-engine, dashboard,
  profitability, Income Statement, AR transformation, and navigation tests.
- Income Statement financial QC confirms every displayed rolling endpoint uses
  the same service series as Profitability and reconciles Direct Costs,
  Indirect Costs, Gross Profit, Overhead, Operating Profit, signed net Other
  Income/Expense, and Net Income from aggregated trailing-12-month dollars.

## Current Application Behavior

The application now exposes seven working destinations through the shared
sidebar. The Dashboard remains the approved R12M overview with four calculated
profitability KPIs, static Cash, and the unchanged Financial Briefing. Detailed
analysis lives on purpose-built pages rather than duplicating Dashboard content.

## Important Files

### Data

- `data/income-statements.ts`
- `data/gl-accounts.ts`
- `data/reporting-categories.ts`
- `data/account-mappings.ts`
- `data/volunteer-custom-homes.ts`
- `data/financial-periods.ts`

### Services

- `lib/services/income-statement.ts`
- `lib/services/financial-service.ts`

### Application

- `app/page.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `app/types/`

## Current Technical Notes

- `lib/services/income-statement.ts` exports `getIncomeStatement()` and `getAllIncomeStatements()`.
- `lib/services/financial-service.ts` now contains the presentation-independent
  calculation engine.
- `lib/services/dashboard-financial-service.ts` adapts engine results for the
  Dashboard KPI cards and retains reusable monthly trend points.
- `lib/services/analysis-view-models.ts` builds rolling-R12M profitability and
  Monthly/YTD/R12M Income Statement column, total, and chart models without
  putting accounting formulas in React components.
- `lib/services/prototype-view-models.ts` derives fixture-backed presentation
  values such as AR days past due without creating a second stored value.
- `data/prototype-fixtures.ts` is the isolated source for temporary Cash,
  working-capital, AR, and AP values. These are not engine-calculated or
  connected accounting records.
- `data/income-statements.ts` contains the approved synthetic prototype model
  from July 2024 through June 2026. All 24 periods are marked closed in
  `data/financial-periods.ts`; no prototype period exists after June 2026.
- Live browser verification at desktop width confirms sharp chart rendering,
  distinct final-period labels, visible Profitability and Cash tooltips, and
  access to June 2026 plus R12M Total through the Income Statement table's own
  horizontal scroll area.
- A previous failure was caused by moved TypeScript files being saved as zero-byte files. Always confirm files are saved and non-empty before troubleshooting export errors.
- If stale Turbopack output appears after file changes, delete `.next` and restart the development server.

## Current Objective

The initial dashboard UI sequence is complete:

1. Application shell and left navigation
2. Dashboard header
3. Company selector
4. "As of June 2026" control
5. Dashboard layout
6. Five-card KPI overview
7. Financial Briefing

The coordinated application UI milestone is complete. All remaining pages use
the approved design language and responsive navigation. Profitability and the
Income Statement use authoritative calculated records; Cash, balance-sheet,
AR, and AP values remain isolated prototypes.

## UI Direction

The interface should feel calm, clean, spacious, modern, premium, confident, and minimal.

Baseline visual direction:

- Fixed dark-navy sidebar
- Light neutral main canvas
- White cards
- Restrained borders and soft shadows
- Generous spacing
- Rounded active navigation state
- Clear, professional typography
- No dense QuickBooks-style accounting interface

Initial navigation:

- Dashboard
- Profitability
- Cash & Working Capital
- Financial Statements
- Accounts Receivable
- Accounts Payable
- Settings

## Product Context

Compass is initially designed for small construction contractors using QuickBooks Online who need clearer financial visibility. Volunteer Custom Homes is the prototype client.

The initial analysis priority is:

1. Gross Profit percentage
2. Overhead as a percentage of Revenue
3. Net Income percentage
4. Operating Profit percentage
5. Accounts Receivable, Accounts Payable, and Working Capital

## Next Action

Begin the next financial-foundation milestone: add and reconcile balance-sheet
data before replacing the isolated Cash, working-capital, AR, or AP fixtures or
enabling Balance Sheet and Cash Flow statements.
