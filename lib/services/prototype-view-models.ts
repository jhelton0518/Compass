type ReceivablesFixture = {
  invoices: readonly { id: string; customer: string; due: string; amount: number }[];
};

const DAY_MS = 86_400_000;

function parseIsoDate(date: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) throw new TypeError(`Invalid ISO date: ${date}`);
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function calculateDaysPastDue(dueDate: string, asOfDate: string) {
  return Math.max(0, Math.floor((parseIsoDate(asOfDate) - parseIsoDate(dueDate)) / DAY_MS));
}

export function buildReceivablesViewModel(data: ReceivablesFixture, asOfDate: string) {
  const invoices = data.invoices.map((invoice) => {
    const daysPastDue = calculateDaysPastDue(invoice.due, asOfDate);
    const status = daysPastDue === 0 ? "Current" : daysPastDue > 45 ? "Escalate" : "Follow up";
    return { ...invoice, daysPastDue, status };
  });
  const total = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const current = invoices.filter((invoice) => invoice.daysPastDue === 0).reduce((sum, invoice) => sum + invoice.amount, 0);
  const over45 = invoices.filter((invoice) => invoice.daysPastDue > 45).reduce((sum, invoice) => sum + invoice.amount, 0);
  const averageDaysPastDue = total === 0 ? 0 : Math.round(invoices.reduce((sum, invoice) => sum + invoice.amount * invoice.daysPastDue, 0) / total);
  const agingDefinitions = [
    { label: "Current", matches: (days: number) => days === 0 },
    { label: "1–30", matches: (days: number) => days >= 1 && days <= 30 },
    { label: "31–45", matches: (days: number) => days >= 31 && days <= 45 },
    { label: "46–60", matches: (days: number) => days >= 46 && days <= 60 },
    { label: "61–90", matches: (days: number) => days >= 61 && days <= 90 },
    { label: "90+", matches: (days: number) => days > 90 },
  ];
  const aging = agingDefinitions.map((bucket) => ({
    label: bucket.label,
    amount: invoices.filter((invoice) => bucket.matches(invoice.daysPastDue)).reduce((sum, invoice) => sum + invoice.amount, 0),
  }));
  const customers = invoices.map((invoice) => ({
    name: invoice.customer,
    balance: invoice.amount,
    risk: invoice.daysPastDue > 45 ? "High" : invoice.daysPastDue > 0 ? "Watch" : "Low",
  })).sort((a, b) => b.balance - a.balance);
  const over45Percent = total === 0 ? 0 : (over45 / total) * 100;

  return {
    asOfDate,
    total,
    current,
    over45,
    over45Percent,
    averageDaysPastDue,
    aging,
    customers,
    invoices,
    insights: [
      `${over45Percent.toFixed(0)}% of open receivables are more than 45 days past due.`,
      `${invoices.filter((invoice) => invoice.status === "Escalate").length} invoices require immediate collection escalation.`,
      current === 0 ? "Every invoice in the current worklist is now past due." : "Protect current balances with proactive collection reminders.",
    ],
  };
}
