function formatNumber(value: number, maximumFractionDigits: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

export function formatDollarAbbreviation(amount: number) {
  if (!Number.isSafeInteger(amount)) {
    throw new TypeError("Currency amounts must be integer dollars.");
  }

  const sign = amount < 0 ? "−" : "";
  const magnitude = Math.abs(amount);

  if (magnitude >= 1_000_000) {
    return `${sign}$${formatNumber(magnitude / 1_000_000, 2)}M`;
  }

  if (magnitude >= 1_000) {
    return `${sign}$${formatNumber(magnitude / 1_000, 0)}K`;
  }

  return `${sign}$${formatNumber(magnitude, 0)}`;
}

export function formatPercentage(value: number | null) {
  return value === null ? "—" : `${value.toFixed(1)}%`;
}

export function formatComparisonPoints(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toFixed(1)} pts`;
}
