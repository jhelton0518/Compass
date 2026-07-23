# Compass Project Status

_Last updated: July 23, 2026_

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
  endpoint-inclusive axis labels, and selects the nearest period from horizontal
  position anywhere in the plot. Clamped SVG tooltips, active markers, guide
  lines, arrow-key navigation, and touch dragging share the same interaction
  model. Each chart uses a unique restrained company-theme gradient area
  anchored to the visible zero baseline while keeping its line visually dominant.
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
- Financial Statements, Balance Sheet, and Cash share an accessible `As of`
  month selector. It lists all 24 periods with human-readable month names and
  updates cards, statements, comparisons, and endpoint-controlled chart windows
  immediately without an Apply button, form submission, or full-page reload.
- Percentage charts derive an independent domain from each displayed series,
  pad each side by the greater of 20% of the observed range or 0.75 percentage
  points, and round outward to clean half-point bounds. Currency charts retain
  their separate period-ending scaling behavior.
- Permanent chart convention: P&L charts default to R12M values calculated from
  aggregated trailing-12-month dollars, never averages of monthly percentages.
  Monthly P&L trends require explicit selection and labeling; operational and
  balance-sheet measures remain period-ending or as-of views.
- Settings now provides 12 professionally designed prototype color themes.
  Each preset supplies a complete semantic palette for accents, hover and focus
  states, links, selected controls, dark sidebar surfaces, navigation states,
  and financial-table hierarchy. Financial trend lines, markers, gradients, and
  AR/AP aging bars use a fixed neutral slate visualization palette across every
  theme so ordinary financial data does not imply favorable or unfavorable
  judgment through brand color. Theme changes update the surrounding interface
  immediately without recoloring financial values or neutral structural
  surfaces. Compass Blue is the default and can be restored
  with a reset action. The
  preference is temporarily persisted in company-scoped `localStorage` for
  Volunteer Custom Homes and is structured for replacement by a company-level
  database setting when accounts exist. Future branding work will let users
  upload, replace, or remove a company logo with file-type, file-size, dimension,
  and security validation. Customer logos should appear in a restrained
  workspace-branding location such as the company selector/header or sidebar so
  Compass product branding and customer company branding coexist.
- Accounts Receivable uses an operational as-of date of July 22, 2026 and
  derives KPI totals, aging buckets, customer risk, days past due, collection
  status, and owner insights from invoice due dates and amounts. No age or
  status values are stored in invoice fixtures.
- `npm run test:financial` passes 67 focused financial-engine, dashboard,
  profitability, Income Statement, AR transformation, and navigation tests.
- Income Statement financial QC confirms every displayed rolling endpoint uses
  the same service series as Profitability and reconciles Direct Costs,
  Indirect Costs, Gross Profit, Overhead, Operating Profit, signed net Other
  Income/Expense, and Net Income from aggregated trailing-12-month dollars.
- The authoritative Balance Sheet foundation defines current and non-current
  Assets and Liabilities, Equity, contra accounts, liquidity classifications,
  period-ending account balances, statement outputs, and AR/AP aging contracts.
- Balance Sheet reconciliation remains available in the financial service and
  view model. Balanced statements are silent in the interface; a difference
  exceeding the one-dollar rounding tolerance produces an accessible,
  period-specific warning above the Balance Sheet summary instead of a status
  row at the bottom of the statement.
- Volunteer Custom Homes has 24 ordered, exactly balanced monthly Balance Sheet
  endpoints from July 2024 through June 2026 using the permanent GL accounts to
  reporting categories to major financial categories hierarchy.
- June 2026 reconciles to Cash $418,000, Accounts Receivable $782,000, Other
  Current Assets $96,000, Accounts Payable $524,000, Credit Cards $118,000,
  Other Current Liabilities $42,000, Working Capital $612,000, Current Ratio
  1.8947368421, Quick Assets $1,200,000, and Quick Ratio 1.7543859649.
- Current Fiscal-Year Net Income is calculated from authoritative monthly Income
  Statements. The June 2024 equity anchor supports the initial partial year;
  each January closes the prior calendar year's result into Retained Earnings
  without storing or double-counting current-year income.
- Cash Runway has been removed and is deferred until a supported cash-flow
  denominator exists.
- Financial Statements now provides a selectable, period-ending Balance Sheet
  for every closed month from July 2024 through June 2026. Its hierarchy places
  details before subtotals, formats contra balances correctly, and visibly
  reconciles Total Assets to Total Liabilities and Equity.
- Balance Sheet summary cards calculate selected-period Total Assets, Total
  Liabilities, Total Equity, Working Capital, Current Ratio, and Quick Ratio,
  with neutral comparisons to the immediately preceding available month.
- Working Capital, Current Ratio, and Quick Ratio charts show up to 12 calculated
  monthly period-ending endpoints through the selected period using the responsive
  interactive chart infrastructure; all 24 authoritative periods remain selectable.
- Cash and Working Capital now reads exclusively from the authoritative Balance
  Sheet service, supports all 24 historical period selections, and charts up to
  12 monthly period-ending Operating Cash balances through the selected period.
  The superseded liquidity fixture has been removed; operational AR and AP
  fixtures remain dated July 22, 2026.

## Current Application Behavior

The application now exposes seven working destinations through the shared
sidebar. The Dashboard remains the approved R12M overview with four calculated
profitability KPIs, static Cash, and the unchanged Financial Briefing. Financial
Statements includes selectable Income Statement and Balance Sheet views, while
Cash and Working Capital uses authoritative period-ending Balance Sheet data.

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
- `data/prototype-fixtures.ts` is now isolated to operational AR and AP working
  lists. Period-ending Cash and Working Capital no longer use fixture values.
- `data/income-statements.ts` contains the approved synthetic prototype model
  from July 2024 through June 2026. All 24 periods are marked closed in
  `data/financial-periods.ts`; no prototype period exists after June 2026.
- `data/balance-sheet-records.ts` contains period-ending Balance Sheet records,
  not R12M values. `lib/services/balance-sheet-service.ts` is the authoritative
  aggregation, equation, change, Working Capital, and liquidity-ratio service.
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

Connect the Dashboard Cash KPI to the authoritative June 2026 Balance Sheet
endpoint without changing its approved layout or briefing. Then plan explicit
AR/AP control-account reconciliation while preserving July 22 operational aging
views. Cash Flow remains deferred.
