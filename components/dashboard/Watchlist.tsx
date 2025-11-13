"use client";

import { assets, type AssetSymbol } from "@/data/market";

interface WatchlistProps {
  selected: AssetSymbol;
  onSelect: (symbol: AssetSymbol) => void;
}

export function Watchlist({ selected, onSelect }: WatchlistProps) {
  return (
    <section className="glass shadow card" style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Global Watchlist</h3>
        <span className="muted" style={{ fontSize: "0.8rem" }}>
          Multi-asset coverage
        </span>
      </div>
      <div className="grid grid-3">
        {assets.map((asset) => {
          const positive = asset.change24h >= 0;
          return (
            <button
              key={asset.symbol}
              onClick={() => onSelect(asset.symbol)}
              style={{
                textAlign: "left",
                padding: "1.1rem",
                borderRadius: "16px",
                background: selected === asset.symbol ? "rgba(56, 189, 248, 0.14)" : "rgba(15, 23, 42, 0.7)",
                border: selected === asset.symbol ? "1px solid rgba(56, 189, 248, 0.35)" : "1px solid rgba(148, 163, 184, 0.12)",
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>{asset.symbol}</strong>
                <span className="muted" style={{ fontSize: "0.7rem" }}>
                  {asset.sector}
                </span>
              </div>
              <span style={{ fontSize: "0.9rem" }}>${asset.price.toLocaleString()}</span>
              <span style={{ fontSize: "0.75rem", color: positive ? "#4ade80" : "#f87171" }}>
                {positive ? "+" : ""}
                {asset.change24h.toFixed(2)}% • 7d {asset.change7d >= 0 ? "+" : "-"}
                {Math.abs(asset.change7d).toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
