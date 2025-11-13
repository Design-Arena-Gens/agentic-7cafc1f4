"use client";

import type { Asset, AssetSymbol } from "@/data/market";

interface PriceTickerProps {
  assets: Asset[];
  selected: AssetSymbol;
  onSelect: (symbol: AssetSymbol) => void;
}

export function PriceTicker({ assets, selected, onSelect }: PriceTickerProps) {
  return (
    <div className="glass shadow" style={{ display: "flex", gap: "1rem", overflowX: "auto", padding: "1rem 1.25rem", borderRadius: "16px" }}>
      {assets.map((asset) => {
        const tone = asset.change24h >= 0 ? "#4ade80" : "#f87171";
        const active = selected === asset.symbol;
        return (
          <button
            key={asset.symbol}
            className="btn"
            onClick={() => onSelect(asset.symbol)}
            style={{
              minWidth: "160px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "0.3rem",
              background: active ? "rgba(56, 189, 248, 0.12)" : "transparent",
              borderRadius: "14px",
              padding: "0.4rem 0.75rem",
              cursor: "pointer",
              border: active ? "1px solid rgba(56, 189, 248, 0.35)" : "1px solid transparent"
            }}
          >
            <span style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <strong>{asset.symbol}</strong>
              <span className="muted" style={{ fontSize: "0.7rem" }}>
                {asset.sector}
              </span>
            </span>
            <span style={{ fontSize: "0.9rem" }}>${asset.price.toLocaleString()}</span>
            <span style={{ fontSize: "0.75rem", color: tone }}>
              {asset.change24h >= 0 ? "+" : ""}
              {asset.change24h.toFixed(2)}%
            </span>
          </button>
        );
      })}
    </div>
  );
}
