import type { DepthLevel } from "@/lib/marketData";

interface DepthBookProps {
  symbol: string;
  depth: {
    bids: DepthLevel[];
    asks: DepthLevel[];
  };
}

export function DepthBook({ symbol, depth }: DepthBookProps) {
  return (
    <section className="glass shadow card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Order Book — {symbol}</h3>
        <span className="muted" style={{ fontSize: "0.8rem" }}>
          Live depth snapshot
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <DepthSide title="Asks" rows={depth.asks} tone="#f87171" />
        <DepthSide title="Bids" rows={depth.bids} tone="#4ade80" />
      </div>
    </section>
  );
}

function DepthSide({ title, rows, tone }: { title: string; rows: DepthLevel[]; tone: string }) {
  const maxTotal = Math.max(...rows.map((row) => row.total));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      <span className="muted" style={{ fontSize: "0.75rem", letterSpacing: "0.08em" }}>
        {title}
      </span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", fontSize: "0.75rem", color: "#94a3b8" }}>
        <span>Price</span>
        <span>Size</span>
        <span style={{ textAlign: "right" }}>Depth</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {rows.map((row) => (
          <div
            key={row.price}
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              fontSize: "0.78rem",
              padding: "0.3rem 0.4rem",
              borderRadius: "8px",
              overflow: "hidden"
            }}
          >
            <span style={{ color: tone }}>{row.price}</span>
            <span>{row.size}</span>
            <span style={{ textAlign: "right" }}>{row.total}</span>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `${tone}1A`,
                transformOrigin: "left",
                transform: `scaleX(${row.total / maxTotal})`,
                opacity: 0.5,
                zIndex: -1
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
