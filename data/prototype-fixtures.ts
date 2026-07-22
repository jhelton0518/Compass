// Clearly isolated prototype fixtures. These values are not calculated from
// the income-statement engine or presented as connected accounting data.
export const liquidityFixture = {
  asOfPeriod: "2026-06",
  cash: 418_000,
  workingCapital: 612_000,
  currentRatio: 1.89,
  runwayMonths: 2.8,
  cashTrend: [512000, 486000, 459000, 447000, 431000, 418000],
  cashTrendLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  currentAssets: [
    { label: "Cash", amount: 418_000 },
    { label: "Accounts Receivable", amount: 782_000 },
    { label: "Other current assets", amount: 96_000 },
  ],
  currentLiabilities: [
    { label: "Accounts Payable", amount: 524_000 },
    { label: "Credit cards", amount: 118_000 },
    { label: "Other current liabilities", amount: 42_000 },
  ],
};

export const receivablesFixture = {
  invoices: [
    { id: "INV-2481", customer: "Harpeth Ridge Development", due: "2026-05-02", amount: 128_000 },
    { id: "INV-2496", customer: "Westhaven Properties", due: "2026-05-24", amount: 92_000 },
    { id: "INV-2512", customer: "Arrington Homes", due: "2026-06-08", amount: 76_000 },
    { id: "INV-2527", customer: "Franklin Custom Living", due: "2026-06-21", amount: 113_000 },
    { id: "INV-2534", customer: "Thompson Station Partners", due: "2026-07-10", amount: 108_000 },
  ],
};

export const payablesFixture = {
  total: 524_000,
  currentDue: 318_000,
  dueNext7: 146_000,
  pastDue: 74_000,
  aging: [
    { label: "Past due", amount: 74_000 },
    { label: "Next 7", amount: 146_000 },
    { label: "8–30", amount: 172_000 },
    { label: "31+", amount: 132_000 },
  ],
  vendors: [
    { name: "Mid-State Lumber", balance: 148_000, priority: "Critical" },
    { name: "Volunteer Concrete", balance: 112_000, priority: "High" },
    { name: "Franklin Electric Supply", balance: 91_000, priority: "Normal" },
    { name: "Premier Plumbing Supply", balance: 84_000, priority: "High" },
    { name: "Tennessee Equipment Rental", balance: 89_000, priority: "Normal" },
  ],
  bills: [
    { id: "BILL-8814", vendor: "Mid-State Lumber", due: "June 22, 2026", amount: 64_000, status: "Past due", priority: "Pay now" },
    { id: "BILL-8841", vendor: "Volunteer Concrete", due: "June 29, 2026", amount: 48_000, status: "Past due", priority: "Pay now" },
    { id: "BILL-8877", vendor: "Premier Plumbing Supply", due: "July 3, 2026", amount: 52_000, status: "Due soon", priority: "Schedule" },
    { id: "BILL-8893", vendor: "Franklin Electric Supply", due: "July 6, 2026", amount: 41_000, status: "Due soon", priority: "Schedule" },
    { id: "BILL-8910", vendor: "Tennessee Equipment Rental", due: "July 18, 2026", amount: 67_000, status: "Open", priority: "Monitor" },
  ],
};
