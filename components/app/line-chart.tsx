"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

type LineChartProps = {
  values: number[];
  labels: string[];
  format: "percentage" | "currency";
  metricName: string;
  tooltipPrefix: string;
  tone?: "blue" | "green";
};

const CHART_HEIGHT = 224;
const MARGINS = { top: 18, right: 18, bottom: 42, left: 58 };

function formatValue(value: number, format: LineChartProps["format"]) {
  if (format === "percentage") return `${value.toFixed(1)}%`;
  const magnitude = Math.abs(value);
  const sign = value < 0 ? "−" : "";
  if (magnitude >= 1_000_000) return `${sign}$${(magnitude / 1_000_000).toFixed(2)}M`;
  if (magnitude >= 1_000) return `${sign}$${Math.round(magnitude / 1_000)}K`;
  return `${sign}$${Math.round(magnitude)}`;
}

function selectTickIndexes(length: number, width: number) {
  if (length <= 1) return [0];
  const count = Math.max(2, Math.min(6, length, Math.floor(width / 86)));
  return Array.from(new Set(Array.from({ length: count }, (_, index) => Math.round((index * (length - 1)) / (count - 1)))));
}

export function LineChart({ values, labels, format, metricName, tooltipPrefix, tone = "blue" }: LineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const descriptionId = useId();

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
    const padding = Math.max((maximum - minimum) * 0.15, Math.abs(maximum) * 0.03, 1);
    const low = minimum - padding;
    const high = maximum + padding;
    const range = high - low || 1;
    const points = values.map((value, index) => ({
      x: Math.round(values.length === 1 ? MARGINS.left + plotWidth / 2 : MARGINS.left + (index / (values.length - 1)) * plotWidth),
      y: Math.round(MARGINS.top + ((high - value) / range) * plotHeight),
      value,
      label: labels[index],
    }));
    return { minimum, maximum, points, path: points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" "), tickIndexes: selectTickIndexes(values.length, plotWidth) };
  }, [labels, values, width]);

  const active = activeIndex === null ? null : geometry?.points[activeIndex] ?? null;
  const tooltipWidth = Math.min(220, Math.max(170, width - 16));
  const tooltipX = active ? Math.max(8, Math.min(width - tooltipWidth - 8, active.x - tooltipWidth / 2)) : 0;
  const tooltipY = active ? Math.max(8, active.y - 64) : 0;
  const lineColor = tone === "green" ? "#059669" : "#2563eb";

  return (
    <div ref={containerRef} className="h-56 w-full overflow-hidden" data-chart-measured-width={width || undefined}>
      {geometry ? (
        <svg width={width} height={CHART_HEIGHT} role="img" aria-describedby={descriptionId} className="block" data-responsive-line-chart="true">
          <desc id={descriptionId}>{metricName} from {labels[0]} through {labels.at(-1)}. Focus or tap a point for details.</desc>
          <line x1={MARGINS.left + 0.5} y1={MARGINS.top} x2={MARGINS.left + 0.5} y2={CHART_HEIGHT - MARGINS.bottom} stroke="#e2e8f0" />
          <line x1={MARGINS.left} y1={CHART_HEIGHT - MARGINS.bottom + 0.5} x2={width - MARGINS.right} y2={CHART_HEIGHT - MARGINS.bottom + 0.5} stroke="#e2e8f0" />
          <line x1={MARGINS.left} y1={Math.round((MARGINS.top + CHART_HEIGHT - MARGINS.bottom) / 2) + 0.5} x2={width - MARGINS.right} y2={Math.round((MARGINS.top + CHART_HEIGHT - MARGINS.bottom) / 2) + 0.5} stroke="#f1f5f9" />
          <text x={6} y={MARGINS.top + 4} fontSize="10" fill="#94a3b8">{formatValue(geometry.maximum, format)}</text>
          <text x={6} y={CHART_HEIGHT - MARGINS.bottom + 4} fontSize="10" fill="#94a3b8">{formatValue(geometry.minimum, format)}</text>
          {active ? <line x1={active.x + 0.5} y1={MARGINS.top} x2={active.x + 0.5} y2={CHART_HEIGHT - MARGINS.bottom} stroke="#94a3b8" strokeDasharray="3 4" /> : null}
          {values.length > 1 ? <path d={geometry.path} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /> : null}
          {geometry.points.map((point, index) => (
            <g
              key={`${point.label}-${index}`}
              role="button"
              tabIndex={0}
              aria-label={`${tooltipPrefix} ${point.label}. ${metricName}: ${formatValue(point.value, format)}`}
              onPointerEnter={() => setActiveIndex(index)}
              onPointerLeave={(event) => { if (event.pointerType !== "touch") setActiveIndex(null); }}
              onPointerDown={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
              className="cursor-pointer outline-none"
            >
              <circle cx={point.x} cy={point.y} r="12" fill="transparent" />
              <circle cx={point.x} cy={point.y} r={activeIndex === index ? 6 : 4} fill={activeIndex === index ? "white" : lineColor} stroke={lineColor} strokeWidth={activeIndex === index ? 3 : 1.5} />
            </g>
          ))}
          {geometry.tickIndexes.map((index) => <text key={index} x={geometry.points[index].x} y={CHART_HEIGHT - 16} textAnchor={index === 0 ? "start" : index === values.length - 1 ? "end" : "middle"} fontSize="10" fill="#64748b">{labels[index]}</text>)}
          {active ? <g pointerEvents="none"><rect x={tooltipX} y={tooltipY} width={tooltipWidth} height="50" rx="8" fill="#0f172a" opacity="0.97" /><text x={tooltipX + 12} y={tooltipY + 20} fontSize="11" fontWeight="600" fill="white">{tooltipPrefix} {active.label}</text><text x={tooltipX + 12} y={tooltipY + 38} fontSize="11" fill="#cbd5e1">{metricName}: {formatValue(active.value, format)}</text></g> : null}
        </svg>
      ) : null}
    </div>
  );
}
