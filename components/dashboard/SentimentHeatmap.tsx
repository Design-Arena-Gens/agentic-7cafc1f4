 "use client";

import { assets } from "@/data/market";
import { useMemo } from "react";

interface SentimentHeatmapProps {
  selected: string;
}

const sectors = ["Crypto", "Equities", "ETFs", "Forex", "Commodities"] as const;

export function SentimentHeatmap({ selected }: SentimentHeatmapProps) {
  const matrix = useMemo(() => {
    return sectors.map((sector) => {
      const sectorAssets = assets.filter((asset) => asset.sector === sector);
      const aggregated =
        sectorAssets.reduce(
          (acc, asset) => {
            const weight = asset.symbol === selected ? 1.5 : 1;
            return {
              change: acc.change + asset.change24h * weight,
              count: acc.count + weight
            };
          },
          { change: 0, count: 0 }
        );

      const score = aggregated.count ? aggregated.change / aggregated.count : 0;

      return {
        sector,
        score
      };
    });
  }, [selected]);

  return (
    <section className="glass shadow card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Sector Sentiment</h3>
        <span className="muted" style={{ fontSize: "0.8rem" }}>
          Weighted 24h momentum
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "0.8rem" }}>
        {matrix.map((item) => {
          const tone = item.score >= 1 ? "#4ade80" : item.score <= -1 ? "#f87171" : "#f97316";
          return (
            <div
              key={item.sector}
              className="glass"
              style={{
                padding: "1rem",
                borderRadius: "16px",
                background: "rgba(15, 23, 42, 0.65)",
                border: "1px solid rgba(148, 163, 184, 0.18)",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem"
              }}
            >
              <span className="muted" style={{ fontSize: "0.75rem", letterSpacing: "0.08em" }}>
                {item.sector}
              </span>
              <strong style={{ fontSize: "1.25rem", color: tone }}>{item.score.toFixed(2)}%</strong>
              <div
                style={{
                  height: "6px",
                  borderRadius: "999px",
                  background: "rgba(148, 163, 184, 0.25)",
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, Math.abs(item.score) * 9)}%`,
                    background: tone,
                    height: "100%"
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
