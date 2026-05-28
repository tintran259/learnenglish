"use client";

import { useState } from "react";

interface DayData {
  date: string;
  day: string;
  reviewed: number;
  correct: number;
}

export function WeeklyChart({ data, target }: { data: DayData[]; target: number }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const today = new Date().toISOString().split("T")[0];
  const maxVal = Math.max(...data.map((d) => d.reviewed), target, 1);

  const VW = 420;
  const CH = 160;
  const PB = 28;
  const n = data.length;
  const GAP = 10;
  const barW = (VW - GAP * (n - 1)) / n;
  const targetY = CH - (target / maxVal) * CH;

  const hovered = hoveredIdx !== null ? data[hoveredIdx] : null;

  return (
    <div className="space-y-2">
      {/* Info row — updates on hover */}
      <div className="h-7 flex items-center">
        {hovered && hovered.reviewed > 0 ? (
          <div className="flex items-center gap-3 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs">
            <span className="font-extrabold">{hovered.day}</span>
            <span className="font-bold text-[#58cc02]">{hovered.correct} correct</span>
            <span className="text-muted-foreground">{hovered.reviewed} total</span>
            <span className="text-muted-foreground">
              · {Math.round((hovered.correct / hovered.reviewed) * 100)}% acc
            </span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Hover a bar to see details</p>
        )}
      </div>

      {/* SVG bar chart */}
      <svg
        viewBox={`0 0 ${VW} ${CH + PB}`}
        className="w-full overflow-visible"
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={0} y1={CH * (1 - f)} x2={VW} y2={CH * (1 - f)}
            strokeWidth={1}
            style={{ stroke: "var(--border)" }}
            opacity={0.5}
          />
        ))}

        {/* Target line */}
        <line
          x1={0} y1={targetY} x2={VW} y2={targetY}
          stroke="#58cc02" strokeWidth={1.5} strokeDasharray="5 4" opacity={0.6}
        />
        <text
          x={VW} y={targetY - 5}
          textAnchor="end" fontSize={9} fill="#58cc02" opacity={0.8} fontWeight="700"
        >
          {target}
        </text>

        {data.map((d, i) => {
          const x = i * (barW + GAP);
          const isToday = d.date === today;
          const isHovered = hoveredIdx === i;
          const metTarget = d.reviewed >= target;

          const totalBarH = d.reviewed > 0
            ? Math.max((d.reviewed / maxVal) * CH, 6)
            : 3;
          const correctBarH = d.reviewed > 0
            ? (d.correct / d.reviewed) * totalBarH
            : 0;

          return (
            <g
              key={d.date}
              onMouseEnter={() => setHoveredIdx(i)}
              style={{ cursor: "default" }}
            >
              {/* Invisible hit zone */}
              <rect x={x} y={0} width={barW} height={CH + PB} fill="transparent" />

              {/* Total reviewed bar */}
              <rect
                x={x} y={CH - totalBarH} width={barW} height={totalBarH}
                rx={5} ry={5}
                fill={isToday ? "#1cb0f6" : "currentColor"}
                style={isToday ? undefined : { fill: "var(--muted)" }}
                opacity={isToday ? 0.2 : isHovered ? 0.9 : 0.7}
              />

              {/* Correct bar */}
              {correctBarH > 0 && (
                <rect
                  x={x} y={CH - correctBarH} width={barW} height={correctBarH}
                  rx={5} ry={5}
                  fill="#58cc02"
                  opacity={metTarget ? (isHovered ? 1 : 0.9) : (isHovered ? 0.65 : 0.5)}
                />
              )}

              {/* Count label above bar on hover */}
              {isHovered && d.reviewed > 0 && (
                <text
                  x={x + barW / 2}
                  y={CH - totalBarH - 6}
                  textAnchor="middle" fontSize={10} fontWeight="800"
                  style={{ fill: "var(--foreground)" }}
                >
                  {d.reviewed}
                </text>
              )}

              {/* Day label */}
              <text
                x={x + barW / 2}
                y={CH + PB - 2}
                textAnchor="middle"
                fontSize={10}
                fontWeight={isToday ? "800" : "600"}
                fill={isToday ? "#1cb0f6" : "currentColor"}
                style={isToday ? undefined : { fill: "var(--muted-foreground)" }}
              >
                {isToday ? "Today" : d.day}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
