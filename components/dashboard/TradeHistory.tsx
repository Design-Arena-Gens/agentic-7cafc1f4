 "use client";

import { format } from "date-fns";
import { useTradingStore } from "@/store/tradingStore";

export function TradeHistory() {
  const { tradeHistory } = useTradingStore((state) => ({ tradeHistory: state.tradeHistory }));

  return (
    <section className="glass shadow card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxHeight: "420px", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Recent Trades</h3>
        <span className="muted" style={{ fontSize: "0.8rem" }}>
          Execution log
        </span>
      </div>
      <div style={{ overflow: "auto" }}>
        <table style={{ width: "100%", fontSize: "0.82rem", minWidth: "540px" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Time</th>
              <th style={{ textAlign: "left" }}>Symbol</th>
              <th style={{ textAlign: "left" }}>Side</th>
              <th style={{ textAlign: "right" }}>Quantity</th>
              <th style={{ textAlign: "right" }}>Price</th>
              <th style={{ textAlign: "right" }}>Type</th>
              <th style={{ textAlign: "right" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {tradeHistory.slice(0, 20).map((trade) => (
              <tr key={trade.id}>
                <td>{format(new Date(trade.timestamp), "MMM d • HH:mm")}</td>
                <td>
                  <strong>{trade.symbol}</strong>
                </td>
                <td>
                  <span className={`pill ${trade.side === "BUY" ? "success" : "danger"}`}>{trade.side}</span>
                </td>
                <td style={{ textAlign: "right" }}>{trade.quantity}</td>
                <td style={{ textAlign: "right" }}>${trade.price.toFixed(2)}</td>
                <td style={{ textAlign: "right" }}>{trade.type}</td>
                <td style={{ textAlign: "right" }}>
                  <span className="muted">{trade.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
