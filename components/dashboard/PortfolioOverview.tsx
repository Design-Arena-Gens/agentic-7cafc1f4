 "use client";

import { assets } from "@/data/market";
import { useTradingStore } from "@/store/tradingStore";

export function PortfolioOverview() {
  const { portfolio } = useTradingStore((state) => ({ portfolio: state.portfolio }));

  return (
    <section className="glass shadow card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Portfolio</h3>
        <span className="muted" style={{ fontSize: "0.8rem" }}>
          {portfolio.positions.length} Open positions
        </span>
      </div>
      <table style={{ fontSize: "0.85rem" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Symbol</th>
            <th style={{ textAlign: "right" }}>Quantity</th>
            <th style={{ textAlign: "right" }}>Avg. Price</th>
            <th style={{ textAlign: "right" }}>Mark</th>
            <th style={{ textAlign: "right" }}>Today</th>
            <th style={{ textAlign: "right" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.positions.map((position) => {
            const asset = assets.find((item) => item.symbol === position.symbol);
            const mark = asset?.price ?? position.averagePrice;
            const today = position.todaysPnL;
            const total = position.totalPnL;

            return (
              <tr key={position.symbol}>
                <td>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <strong>{position.symbol}</strong>
                    <span className="muted" style={{ fontSize: "0.7rem" }}>
                      {asset?.name}
                    </span>
                  </div>
                </td>
                <td style={{ textAlign: "right" }}>{position.quantity}</td>
                <td style={{ textAlign: "right" }}>${position.averagePrice.toFixed(2)}</td>
                <td style={{ textAlign: "right" }}>${mark.toFixed(2)}</td>
                <td style={{ textAlign: "right" }}>
                  <span className={today >= 0 ? "success" : "danger"}>
                    {today >= 0 ? "+" : "-"}${Math.abs(today).toFixed(2)}
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <span className={total >= 0 ? "success" : "danger"}>
                    {total >= 0 ? "+" : "-"}${Math.abs(total).toFixed(2)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
