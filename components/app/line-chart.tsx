"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { calculatePercentageChartDomain } from "../../lib/services/chart-domain";
import { buildZeroAreaPath, calculateZeroBaselineY, chartGradientId, movePeriodIndex, nearestPeriodIndex } from "../../lib/services/chart-geometry";

type LineChartProps = {
  values: number[];
  labels: string[];
  format: "percentage" | "currency" | "ratio";
  metricName: string;
  tooltipPrefix: string;
};

const CHART_HEIGHT = 260;
const MARGINS = { top: 18, right: 18, bottom: 76, left: 58 };

function formatValue(value: number, format: LineChartProps["format"]) {
  if (format === "percentage") return `${value.toFixed(1)}%`;
  if (format === "ratio") return `${value.toFixed(2)}×`;
  const magnitude = Math.abs(value);
  const sign = value < 0 ? "−" : "";
  if (magnitude >= 1_000_000) return `${sign}$${(magnitude / 1_000_000).toFixed(2)}M`;
  if (magnitude >= 1_000) return `${sign}$${Math.round(magnitude / 1_000)}K`;
  return `${sign}$${Math.round(magnitude)}`;
}

function axisLabel(label: string) {
  const match = /^(\w{3,9})\s+(\d{4})$/.exec(label);
  return match ? `${match[1].slice(0, 3)} ${match[2].slice(2)}` : label;
}

function tickIndexes(length: number, plotWidth: number) {
  if (length <= 12) return Array.from({ length }, (_, index) => index);
  const count = Math.max(2, Math.min(12, Math.floor(plotWidth / 65)));
  return Array.from(new Set(Array.from({ length: count }, (_, index) => Math.round(index * (length - 1) / (count - 1)))));
}

export function LineChart({ values, labels, format, metricName, tooltipPrefix }: LineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const instanceId = useId();
  const descriptionId = `chart-description-${instanceId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const gradientId = chartGradientId(instanceId);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const updateWidth = () => setWidth(Math.max(0, Math.floor(element.getBoundingClientRect().width)));
    updateWidth();
    const observer = new ResizeObserver((entries) => setWidth(Math.max(0, Math.floor(entries[0].contentRect.width))));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const geometry = useMemo(() => {
    if (!width || values.length === 0) return null;
    const plotWidth = Math.max(1, width - MARGINS.left - MARGINS.right);
    const plotHeight = CHART_HEIGHT - MARGINS.top - MARGINS.bottom;
    const minimum = Math.min(...values);
    const maximum = Math.max(...values);
    const currencyPadding = Math.max((maximum - minimum) * 0.15, Math.abs(maximum) * 0.03, 1);
    const percentageDomain = format === "percentage" ? calculatePercentageChartDomain(values) : null;
    const ratioPadding = Math.max((maximum - minimum) * 0.2, 0.05);
    const ratioDomain = format === "ratio" ? { lower: Math.floor((minimum - ratioPadding) * 20) / 20, upper: Math.ceil((maximum + ratioPadding) * 20) / 20 } : null;
    const low = percentageDomain?.lower ?? ratioDomain?.lower ?? minimum - currencyPadding;
    const high = percentageDomain?.upper ?? ratioDomain?.upper ?? maximum + currencyPadding;
    const range = high - low || 1;
    const points = values.map((value, index) => ({
      x: Math.round(values.length === 1 ? MARGINS.left + plotWidth / 2 : MARGINS.left + (index / (values.length - 1)) * plotWidth),
      y: Math.round(MARGINS.top + ((high - value) / range) * plotHeight),
      value,
      label: labels[index],
    }));
    const zeroY = calculateZeroBaselineY(low, high, MARGINS.top, plotHeight);
    return { axisMinimum: percentageDomain?.lower ?? ratioDomain?.lower ?? minimum, axisMaximum: percentageDomain?.upper ?? ratioDomain?.upper ?? maximum, low, high, plotWidth, plotHeight, zeroY, points, tickIndexes: tickIndexes(values.length, plotWidth), path: points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" "), areaPath: buildZeroAreaPath(points, zeroY) };
  }, [format, labels, values, width]);

  const active = activeIndex === null ? null : geometry?.points[activeIndex] ?? null;
  const tooltipWidth = Math.min(220, Math.max(170, width - 16));
  const tooltipX = active ? Math.max(8, Math.min(width - tooltipWidth - 8, active.x - tooltipWidth / 2)) : 0;
  const tooltipY = active ? Math.max(8, active.y - 64) : 0;
  const lineColor = "var(--financial-chart-line)";
  const gradientColor = "var(--financial-chart-gradient)";
  const markerColor = "var(--financial-chart-marker)";
  const guideColor = "var(--financial-chart-guide)";

  const selectNearestPeriod = (clientX: number, svg: SVGSVGElement) => {
    if (!geometry) return;
    const bounds = svg.getBoundingClientRect();
    const localX = clientX - bounds.left;
    setActiveIndex(nearestPeriodIndex(localX, MARGINS.left, geometry.plotWidth, values.length));
  };

  const moveActivePeriod = (key: string) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(key)) return;
    setActiveIndex((current) => movePeriodIndex(current, values.length, key as "ArrowLeft" | "ArrowRight" | "Home" | "End"));
  };

  return (
    <div ref={containerRef} className="h-[260px] w-full overflow-hidden" data-chart-measured-width={width || undefined}>
      {geometry ? (
        <svg width={width} height={CHART_HEIGHT} role="application" tabIndex={0} aria-describedby={descriptionId} aria-label={`${metricName} line chart. Use left and right arrow keys to move between periods.`} className="block outline-none" style={{ touchAction: "pan-y" }} data-responsive-line-chart="true" data-domain-lower={geometry.low} data-domain-upper={geometry.high} data-zero-baseline-y={geometry.zeroY} data-gradient-id={gradientId}
          onFocus={() => setActiveIndex((current) => current ?? 0)}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActiveIndex(null); }}
          onKeyDown={(event) => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) { event.preventDefault(); moveActivePeriod(event.key); } }}
          onPointerMove={(event) => selectNearestPeriod(event.clientX, event.currentTarget)}
          onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); selectNearestPeriod(event.clientX, event.currentTarget); }}
          onPointerLeave={(event) => { if (event.pointerType !== "touch") setActiveIndex(null); }}
        >
          <desc id={descriptionId}>{metricName} from {labels[0]} through {labels.at(-1)}. Move across the plot, focus a point, or use arrow keys for details.</desc>
          <defs>
            <linearGradient id={gradientId} x1="0" y1={MARGINS.top} x2="0" y2={MARGINS.top + geometry.plotHeight} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={gradientColor} stopOpacity={geometry.zeroY === MARGINS.top ? 0 : 0.18} />
              <stop offset={`${((geometry.zeroY - MARGINS.top) / geometry.plotHeight) * 100}%`} stopColor={gradientColor} stopOpacity="0" />
              <stop offset="100%" stopColor={gradientColor} stopOpacity={geometry.zeroY === MARGINS.top + geometry.plotHeight ? 0 : 0.18} />
            </linearGradient>
          </defs>
          <line x1={MARGINS.left + 0.5} y1={MARGINS.top} x2={MARGINS.left + 0.5} y2={CHART_HEIGHT - MARGINS.bottom} stroke="#e2e8f0" />
          <line x1={MARGINS.left} y1={CHART_HEIGHT - MARGINS.bottom + 0.5} x2={width - MARGINS.right} y2={CHART_HEIGHT - MARGINS.bottom + 0.5} stroke="#e2e8f0" />
          <line x1={MARGINS.left} y1={Math.round((MARGINS.top + CHART_HEIGHT - MARGINS.bottom) / 2) + 0.5} x2={width - MARGINS.right} y2={Math.round((MARGINS.top + CHART_HEIGHT - MARGINS.bottom) / 2) + 0.5} stroke="#f1f5f9" />
          <text x={6} y={MARGINS.top + 4} fontSize="10" fill="#94a3b8">{formatValue(geometry.axisMaximum, format)}</text>
          <text x={6} y={CHART_HEIGHT - MARGINS.bottom + 4} fontSize="10" fill="#94a3b8">{formatValue(geometry.axisMinimum, format)}</text>
          {values.length > 1 ? <path d={geometry.areaPath} fill={`url(#${gradientId})`} stroke="none" pointerEvents="none" /> : null}
          {active ? <line x1={active.x + 0.5} y1={MARGINS.top} x2={active.x + 0.5} y2={CHART_HEIGHT - MARGINS.bottom} stroke={guideColor} strokeOpacity="0.45" strokeDasharray="3 4" /> : null}
          {values.length > 1 ? <path d={geometry.path} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /> : null}
          {geometry.points.map((point, index) => (
            <g
              key={`${point.label}-${index}`}
              role="button"
              tabIndex={0}
              aria-label={`${tooltipPrefix} ${point.label}. ${metricName}: ${formatValue(point.value, format)}`}
              onFocus={() => setActiveIndex(index)}
              onKeyDown={(event) => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) { event.preventDefault(); moveActivePeriod(event.key); } }}
              className="cursor-pointer outline-none"
              data-period-index={index}
            >
              <circle cx={point.x} cy={point.y} r={activeIndex === index ? 6 : 4} fill={activeIndex === index ? "white" : lineColor} stroke={activeIndex === index ? markerColor : lineColor} strokeWidth={activeIndex === index ? 3 : 1.5} />
            </g>
          ))}
          {geometry.tickIndexes.map((index) => { const point = geometry.points[index]; return <text key={`tick-${index}`} x={point.x} y={CHART_HEIGHT - MARGINS.bottom + 16} textAnchor="end" dominantBaseline="middle" transform={`rotate(-40 ${point.x} ${CHART_HEIGHT - MARGINS.bottom + 16})`} fontSize="10" fill="#64748b">{axisLabel(point.label)}</text>; })}
          {active ? <g pointerEvents="none"><rect x={tooltipX} y={tooltipY} width={tooltipWidth} height="50" rx="8" fill="#0f172a" opacity="0.97" /><rect x={tooltipX} y={tooltipY} width={tooltipWidth} height="3" rx="1.5" fill={markerColor} /><text x={tooltipX + 12} y={tooltipY + 20} fontSize="11" fontWeight="600" fill="white">{tooltipPrefix} {active.label}</text><text x={tooltipX + 12} y={tooltipY + 38} fontSize="11" fill="#cbd5e1">{metricName}: {formatValue(active.value, format)}</text></g> : null}
        </svg>
      ) : null}
      <span className="sr-only" aria-live="polite">{active ? `${tooltipPrefix} ${active.label}. ${metricName}: ${formatValue(active.value, format)}` : ""}</span>
    </div>
  );
}
