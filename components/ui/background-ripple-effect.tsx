"use client";

import React, { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./background-ripple-effect.module.css";

/**
 * Aceternity BackgroundRippleEffect, adapted for JOLT:
 * - Stone-tinted cells on the light hero (no new hues, no orange
 *   flood — the orange balance stays with the stage).
 * - Radial mask fades the grid at its edges (bottom-floor usage).
 * - Click/tap triggers the distance-staggered ripple wave; the
 *   global reduced-motion kill-switch freezes the animation.
 */
export const BackgroundRippleEffect = ({
  rows = 7,
  cols = 30,
  cellSize = 44,
  className,
}: {
  rows?: number;
  cols?: number;
  cellSize?: number;
  className?: string;
}) => {
  const [clickedCell, setClickedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [rippleKey, setRippleKey] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={ref}
      className={cn("absolute inset-0 h-full w-full", className)}
      style={
        {
          "--cell-border": "rgba(12,14,9,0.08)",
          "--cell-fill": "rgba(12,14,9,0.015)",
        } as React.CSSProperties
      }
    >
      <div className="relative h-full w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-hidden" />
        <DivGrid
          key={`base-${rippleKey}`}
          className={styles.grid}
          rows={rows}
          cols={cols}
          cellSize={cellSize}
          borderColor="var(--cell-border)"
          fillColor="var(--cell-fill)"
          clickedCell={clickedCell}
          onCellClick={(row, col) => {
            setClickedCell({ row, col });
            setRippleKey((k) => k + 1);
          }}
          interactive
        />
      </div>
    </div>
  );
};

type DivGridProps = {
  className?: string;
  rows: number;
  cols: number;
  cellSize: number;
  borderColor: string;
  fillColor: string;
  clickedCell: { row: number; col: number } | null;
  onCellClick?: (row: number, col: number) => void;
  interactive?: boolean;
};

type CellStyle = React.CSSProperties & {
  "--delay"?: string;
  "--duration"?: string;
};

const DivGrid = ({
  className,
  rows = 7,
  cols = 30,
  cellSize = 44,
  borderColor = "rgba(12,14,9,0.08)",
  fillColor = "rgba(12,14,9,0.015)",
  clickedCell = null,
  onCellClick = () => {},
  interactive = true,
}: DivGridProps) => {
  const cells = useMemo(
    () => Array.from({ length: rows * cols }, (_, idx) => idx),
    [rows, cols],
  );

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: cols * cellSize,
    height: rows * cellSize,
    marginInline: "auto",
  };

  return (
    <div className={cn("relative z-[3]", className)} style={gridStyle}>
      {cells.map((idx) => {
        const rowIdx = Math.floor(idx / cols);
        const colIdx = idx % cols;
        const distance = clickedCell
          ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
          : 0;
        const delay = clickedCell ? Math.max(0, distance * 45) : 0; // ms
        const duration = 220 + distance * 70; // ms

        const style: CellStyle = clickedCell
          ? { "--delay": `${delay}ms`, "--duration": `${duration}ms` }
          : {};

        return (
          <div
            key={idx}
            className={cn(
              styles.cell,
              clickedCell && styles.cellRipple,
              !interactive && "pointer-events-none",
            )}
            style={{
              backgroundColor: fillColor,
              borderColor,
              ...style,
            }}
            onClick={
              interactive ? () => onCellClick?.(rowIdx, colIdx) : undefined
            }
          />
        );
      })}
    </div>
  );
};
