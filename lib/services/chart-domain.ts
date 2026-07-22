const MINIMUM_PADDING_PER_SIDE = 0.75;
const RANGE_PADDING_FACTOR = 0.2;
const CLEAN_PERCENTAGE_INCREMENT = 0.5;

export type ChartDomain = {
  lower: number;
  upper: number;
};

export function calculatePercentageChartDomain(values: readonly number[]): ChartDomain {
  if (values.length === 0 || values.some((value) => !Number.isFinite(value))) {
    throw new TypeError("Percentage chart domains require finite values.");
  }

  const observedLower = Math.min(...values);
  const observedUpper = Math.max(...values);
  const observedRange = observedUpper - observedLower;
  const padding = Math.max(observedRange * RANGE_PADDING_FACTOR, MINIMUM_PADDING_PER_SIDE);

  return {
    lower: Math.floor((observedLower - padding) / CLEAN_PERCENTAGE_INCREMENT) * CLEAN_PERCENTAGE_INCREMENT,
    upper: Math.ceil((observedUpper + padding) / CLEAN_PERCENTAGE_INCREMENT) * CLEAN_PERCENTAGE_INCREMENT,
  };
}
