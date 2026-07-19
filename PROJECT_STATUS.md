# Compass Project Status

_Last updated: July 19, 2026_

## Checkpoint

- Repository: `jhelton0518/Compass`
- Branch: `main`
- Foundation commit: `8f81bec12f4c6e2eb4e7085bc64350eaa5b4589d`
- Foundation commit message: `Working financial data foundation`
- Working tree at the foundation checkpoint: clean
- Current phase: ready for UI

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
- Commit `8f81bec` was reported as compiling successfully before this checkpoint.

## Current Application Behavior

`app/page.tsx` requests period `2025-07` through `getIncomeStatement()` and displays Compass, Volunteer Custom Homes, Period, Revenue, Labor, Material, and Office Payroll.

This is a temporary proof that the data/service path works. It is not the intended dashboard UI.

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
- `lib/services/financial-service.ts` currently exists as an empty placeholder and is not part of the working page path.
- The repository version of `data/income-statements.ts` currently contains periods July through December 2025. Additional prototype periods should be added only when that work is explicitly in scope.
- A previous failure was caused by moved TypeScript files being saved as zero-byte files. Always confirm files are saved and non-empty before troubleshooting export errors.
- If stale Turbopack output appears after file changes, delete `.next` and restart the development server.

## Current Objective

Build the Compass interface without redesigning the financial foundation and without adding calculations yet.

Implementation order:

1. Application shell
2. Left navigation
3. Header
4. Company selector
5. "As of June 2026" control
6. Dashboard layout
7. KPI cards
8. Financial Briefing panel

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

Implement and verify the application shell as the first isolated UI feature. Do not add KPI calculations or analytics during that step.
