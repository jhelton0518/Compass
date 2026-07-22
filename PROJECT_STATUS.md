# Compass Project Status

_Last updated: July 22, 2026_

## Checkpoint

- Repository: `jhelton0518/Compass`
- Branch: `main`
- Financial foundation commit: `8f81bec12f4c6e2eb4e7085bc64350eaa5b4589d`
- Financial foundation commit message: `Working financial data foundation`
- Current phase: financial engine checkpoint 3 dashboard integration complete

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
- Detailed Profitability Trends are intentionally deferred from the Dashboard
  to the future dedicated Profitability page. The reusable monthly trend model
  and presentation remain available for that work.
- The approved profitability values reconcile as Gross Profit 25.8% less
  Overhead 14.6% equals Operating Profit 11.2%; less Net Other Expense 0.8%
  equals Net Income 10.4%.
- Financial engine checkpoint 1 defines integer-dollar calculation contracts,
  monthly subtotals, ordered R12M windows, explicit incomplete-window results,
  zero-revenue ratio handling, and presentation formatters.
- Focused synthetic-fixture tests cover formulas, missing and open periods,
  zero revenue, signed negative values, formatting, and exact reconciliation.
- `npm run test:financial` passes 21 focused financial-engine, dataset, and
  dashboard-model tests.
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

## Current Application Behavior

`app/page.tsx` renders the Compass application shell with the dashboard header
and dashboard content. Four profitability KPI cards are connected to the
dashboard financial service model. Cash and the approved Financial Briefing
remain static and unchanged; detailed trends are not rendered on the Dashboard.

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
  Dashboard KPI cards and retains monthly trend points for the future dedicated
  Profitability page.
- `data/income-statements.ts` contains the approved synthetic prototype model
  from July 2024 through June 2026. All 24 periods are marked closed in
  `data/financial-periods.ts`; no prototype period exists after June 2026.
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

Financial engine checkpoint 3 is complete. The approved dashboard now reads
profitability results from the calculation service while preserving its design,
responsive behavior, wording, and static Financial Briefing. Detailed trend
reporting is deferred to the dedicated Profitability page.

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

Define the dedicated Profitability page checkpoint before rendering the retained
monthly and rolling-R12M trend functionality. Keep Cash static until
balance-sheet data is explicitly in scope.
