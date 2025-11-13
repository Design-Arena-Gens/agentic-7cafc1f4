"use client";

import { useState } from "react";
import type { Asset } from "@/data/market";
import { useTradingStore, type OrderType, type OrderSide } from "@/store/tradingStore";

interface TradingTerminalProps {
  asset: Asset;
}

const orderTypes: OrderType[] = ["MARKET", "LIMIT", "STOP"];

export function TradingTerminal({ asset }: TradingTerminalProps) {
  const { placeOrder } = useTradingStore((state) => ({ placeOrder: state.placeOrder }));
  const [side, setSide] = useState<OrderSide>("BUY");
  const [type, setType] = useState<OrderType>("MARKET");
  const [quantity, setQuantity] = useState<string>("1");
  const [limitPrice, setLimitPrice] = useState<string>(asset.price.toString());
  const [stopPrice, setStopPrice] = useState<string>((asset.price * 0.98).toFixed(2));
  const [submitting, setSubmitting] = useState(false);

  const notional = Number(quantity || "0") * Number(type === "MARKET" ? asset.price : limitPrice);

  function submitOrder() {
    if (!quantity || Number(quantity) <= 0) return;
    setSubmitting(true);
    setTimeout(() => {
      placeOrder({
        symbol: asset.symbol,
        side,
        quantity: Number(quantity),
        type,
        limitPrice: type !== "MARKET" ? Number(limitPrice) : undefined,
        stopPrice: type === "STOP" ? Number(stopPrice) : undefined
      });
      setSubmitting(false);
    }, 420);
  }

  return (
    <section className="glass card shadow" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Trading Terminal</h3>
        <div style={{ display: "inline-flex", gap: "0.35rem", background: "rgba(15, 23, 42, 0.55)", padding: "0.2rem", borderRadius: "999px" }}>
          {(["BUY", "SELL"] as OrderSide[]).map((option) => (
            <button
              key={option}
              className="btn"
              style={{
                padding: "0.35rem 0.8rem",
                fontSize: "0.8rem",
                borderRadius: "999px",
                background:
                  side === option
                    ? option === "BUY"
                      ? "rgba(74, 222, 128, 0.25)"
                      : "rgba(248, 113, 113, 0.25)"
                    : "transparent",
                color: side === option ? (option === "BUY" ? "#4ade80" : "#f87171") : "#94a3b8"
              }}
              onClick={() => setSide(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {orderTypes.map((option) => (
          <button
            key={option}
            className="btn"
            style={{
              flex: 1,
              background: type === option ? "rgba(56, 189, 248, 0.15)" : "rgba(148, 163, 184, 0.1)",
              color: type === option ? "#38bdf8" : "#cbd5f5",
              padding: "0.65rem 0.5rem",
              borderRadius: "12px",
              fontSize: "0.8rem"
            }}
            onClick={() => setType(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gap: "1rem" }}>
        <FormField label="Quantity">
          <input
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            type="number"
            min="0"
            step="0.01"
            style={inputStyle}
          />
        </FormField>
        {type !== "MARKET" && (
          <FormField label="Limit price">
            <input
              value={limitPrice}
              onChange={(event) => setLimitPrice(event.target.value)}
              type="number"
              min="0"
              step="0.01"
              style={inputStyle}
            />
          </FormField>
        )}
        {type === "STOP" && (
          <FormField label="Stop price">
            <input
              value={stopPrice}
              onChange={(event) => setStopPrice(event.target.value)}
              type="number"
              min="0"
              step="0.01"
              style={inputStyle}
            />
          </FormField>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
          <span className="muted">Estimated Cost</span>
          <strong>${Number.isFinite(notional) ? notional.toFixed(2) : "0.00"}</strong>
        </div>
      </div>
      <button
        onClick={submitOrder}
        className="btn btn-primary"
        style={{
          background: side === "BUY" ? "linear-gradient(135deg, #4ade80, #22c55e)" : "linear-gradient(135deg, #f87171, #ef4444)",
          color: "#0f172a"
        }}
        disabled={submitting}
      >
        {submitting ? "Submitting…" : `${side} ${asset.symbol}`}
      </button>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#94a3b8" }}>
        <span>Fees: 0.05%</span>
        <span>Margin Impact: {type === "MARKET" ? "Low" : "Medium"}</span>
        <span>Execution: Immediate</span>
      </div>
    </section>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.85rem" }}>
      <span className="muted" style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.7rem" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  background: "rgba(15, 23, 42, 0.65)",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  borderRadius: "12px",
  padding: "0.7rem 0.9rem",
  color: "#e2e8f0",
  fontSize: "0.95rem"
};
