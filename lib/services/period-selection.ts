export function formatClosedPeriodLabel(period: string) {
  const [year, month] = period.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function buildPeriodSelectionHref(pathname: string, currentSearch: string, period: string) {
  const params = new URLSearchParams(currentSearch);
  params.set("period", period);
  return `${pathname}?${params.toString()}`;
}
