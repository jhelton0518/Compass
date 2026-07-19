# Compass Agent Guide

## Project

Compass is a financial visibility and FP&A application for construction contractors. The current prototype company is Volunteer Custom Homes.

Product principle:

> Financial statements tell you what's already happened. Compass tells you where you're going next.

## Repository Safety

- The only GitHub repository in scope is `jhelton0518/Compass`.
- Never access, modify, authenticate to, push to, fetch from, or otherwise interact with the `rawso-jhelton` account or any RAWSO repository.
- Preserve user work and unrelated changes.
- Do not rewrite Git history or use destructive Git commands unless the user explicitly requests and approves the exact operation.

## Current Development Scope

- The financial data foundation is complete enough to begin UI work.
- Do not redesign the data model or refactor the architecture unless the user explicitly asks.
- Focus on the application interface before adding calculations or analytics.
- Preserve the service layer between UI components and seed data.
- Build one feature at a time, verify it, and then commit it.

Current UI priority:

1. Application shell
2. Left navigation
3. Header
4. Company selector
5. "As of June 2026" period control
6. Dashboard layout
7. KPI cards
8. Financial Briefing panel

## Product and Financial Conventions

- Use "Overhead," not "Operating Expenses" or "OpEx," in the product interface.
- Keep Direct Costs, Indirect Costs, Overhead, Revenue, and Other Income/Expense distinct.
- Default reporting views to the last closed month.
- Show an "As of [Month YYYY]" period context throughout the application.
- The prototype's primary R12M window is July 2025 through June 2026.
- Do not invent prototype data beyond July 2026.
- Volunteer Custom Homes is the prototype company.

## Design Direction

Compass should feel calm, clean, spacious, modern, premium, confident, and minimal. Draw inspiration from Apple, Linear, Notion, and Stripe. Avoid the dense, cluttered feel of traditional accounting software.

Use a fixed dark-navy sidebar, a light neutral canvas, white cards, restrained borders or soft shadows, generous spacing, rounded active navigation states, and professional typography.

Initial navigation:

- Dashboard
- Profitability
- Cash & Working Capital
- Financial Statements
- Accounts Receivable
- Accounts Payable
- Settings

## Implementation Workflow

Before changing code:

1. Read `PROJECT_STATUS.md`.
2. Inspect the relevant existing files.
3. Confirm the change stays within the current objective.

For each feature:

1. Make the smallest coherent implementation.
2. Run `npm run lint`.
3. Run `npm run build`.
4. Fix relevant failures before declaring completion.
5. Summarize what changed and what was verified.
6. Commit only after verification.

Do not move or rename foundation files casually. Ensure edited files are saved and non-empty before diagnosing module/export errors. If Turbopack reports missing exports after file movement, verify file contents, clear `.next`, and restart Next.js.

## Checkpoint Protocol

When the user says "checkpoint Compass":

1. Inspect Git status and the latest commit.
2. Update `PROJECT_STATUS.md` with completed work, verification results, known issues, and the exact next objective.
3. Update this file only when a lasting project rule or convention has changed.
4. Commit the checkpoint.
5. Make sure the checkpoint is available on `jhelton0518/Compass`.

Keep `AGENTS.md` concise and durable. Keep changing progress details in `PROJECT_STATUS.md`.
