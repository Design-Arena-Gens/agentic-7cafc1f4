 "use client";

import type { Asset } from "@/data/market";
import { useTradingStore } from "@/store/tradingStore";

interface HeaderProps {
  asset: Asset;
}

export function Header({ asset }: HeaderProps) {
  const { portfolio } = useTradingStore((state) => ({ portfolio: state.portfolio }));

  return (
    <header className="glass shadow card" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 700 }}>{asset.name}</h1>
            <span className="tag">{asset.symbol}</span>
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <PriceBlock label="Last Price" value={`$${formatNumber(asset.price)}`} />
            <PriceBlock
              label="24h Change"
              value={`${asset.change24h > 0 ? "+" : ""}${asset.change24h.toFixed(2)}%`}
              tone={asset.change24h >= 0 ? "success" : "danger"}
            />
            <PriceBlock label="24h Volume" value={formatCompact(asset.volume24h)} />
          </div>
        </div>
        <div style={{ display: "grid", gridAutoFlow: "column", gap: "1rem" }}>
          <QuickStat label="Account Balance" value={`$${formatNumber(portfolio.balance)}`} />
          <QuickStat label="Buying Power" value={`$${formatNumber(portfolio.buyingPower)}`} />
          <QuickStat
            label="Today"
            value={`${portfolio.pnlToday >= 0 ? "+" : "-"}$${formatNumber(Math.abs(portfolio.pnlToday))}`}
            tone={portfolio.pnlToday >= 0 ? "success" : "danger"}
          />
          <QuickStat
            label="Total P/L"
            value={`${portfolio.pnlTotal >= 0 ? "+" : "-"}$${formatNumber(Math.abs(portfolio.pnlTotal))}`}
            tone={portfolio.pnlTotal >= 0 ? "success" : "danger"}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <button className="btn btn-primary">Deposit Funds</button>
        <button className="btn btn-secondary">Create Automation</button>
      </div>
    </header>
  );
}

function PriceBlock({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone?: "success" | "danger";
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <span className="muted" style={{ fontSize: "0.85rem" }}>
        {label}
      </span>
      <span className={tone ? tone : ""} style={{ fontSize: "1.3rem", fontWeight: 600 }}>
        {value}
      </span>
    </div>
  );
}

function QuickStat({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone?: "success" | "danger";
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <span className="muted" style={{ fontSize: "0.75rem" }}>
        {label}
      </span>
      <strong className={tone}> {value}</strong>
    </div>
  );
}

function formatNumber(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 5 : 2
  });
}

function formatCompact(value: number) {
  if (!value) return "-";
  return Intl.NumberFormat("en", { notation: "compact", compactDisplay: "short", maximumFractionDigits: 1 }).format(
    value
  );
}
