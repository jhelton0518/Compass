export function nearestPeriodIndex(pointerX: number, plotLeft: number, plotWidth: number, periodCount: number) {
  if (periodCount <= 0) return null;
  if (periodCount === 1 || plotWidth <= 0) return 0;
  const boundedX = Math.max(plotLeft, Math.min(plotLeft + plotWidth, pointerX));
  return Math.round(((boundedX - plotLeft) / plotWidth) * (periodCount - 1));
}

export function movePeriodIndex(current: number | null, periodCount: number, key: "ArrowLeft" | "ArrowRight" | "Home" | "End") {
  if (periodCount <= 0) return null;
  if (key === "Home") return 0;
  if (key === "End") return periodCount - 1;
  if (key === "ArrowLeft") return Math.max(0, (current ?? 0) - 1);
  return Math.min(periodCount - 1, (current ?? -1) + 1);
}

export function calculateZeroBaselineY(low: number, high: number, plotTop: number, plotHeight: number) {
  const range = high - low || 1;
  const projectedY = plotTop + ((high - 0) / range) * plotHeight;
  return Math.max(plotTop, Math.min(plotTop + plotHeight, projectedY));
}

export function buildZeroAreaPath(points: ReadonlyArray<{ x: number; y: number }>, zeroY: number) {
  if (points.length === 0) return "";
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
  return `${line} L${points.at(-1)!.x} ${zeroY} L${points[0].x} ${zeroY} Z`;
}

export function chartGradientId(instanceId: string) {
  return `compass-line-gradient-${instanceId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}
