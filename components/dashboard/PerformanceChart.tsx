import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import type { Asset } from "@/data/market";
import type { ChartPoint } from "@/lib/marketData";

interface PerformanceChartProps {
  asset: Asset;
  data: ChartPoint[];
  range: "1H" | "4H" | "1D" | "1W";
  onRangeChange: (range: "1H" | "4H" | "1D" | "1W") => void;
}

const ranges: Array<{ label: string; value: "1H" | "4H" | "1D" | "1W" }> = [
  { label: "1H", value: "1H" },
  { label: "4H", value: "4H" },
  { label: "1D", value: "1D" },
  { label: "1W", value: "1W" }
];

export function PerformanceChart({ asset, data, range, onRangeChange }: PerformanceChartProps) {
  const first = data[0]?.price ?? asset.price;
  const last = data[data.length - 1]?.price ?? asset.price;
  const change = ((last - first) / first) * 100;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Market Structure</h2>
          <span className={change >= 0 ? "success" : "danger"} style={{ fontWeight: 600 }}>
            {change >= 0 ? "+" : ""}
            {change.toFixed(2)}%
          </span>
        </div>
        <div style={{ display: "inline-flex", gap: "0.5rem", background: "rgba(15, 23, 42, 0.5)", borderRadius: "999px", padding: "0.25rem" }}>
          {ranges.map((item) => (
            <button
              key={item.value}
              className="btn"
              style={{
                padding: "0.35rem 0.9rem",
                borderRadius: "999px",
                background: range === item.value ? "rgba(56, 189, 248, 0.15)" : "transparent",
                color: range === item.value ? "#38bdf8" : "#94a3b8",
                fontSize: "0.85rem"
              }}
              onClick={() => onRangeChange(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, minHeight: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(148, 163, 184, 0.15)"
            />
            <XAxis
              dataKey="time"
              stroke="rgba(148, 163, 184, 0.4)"
              tickLine={false}
              minTickGap={24}
            />
            <YAxis
              domain={["auto", "auto"]}
              stroke="rgba(148, 163, 184, 0.4)"
              tickFormatter={(value) => `$${value}`}
              tickLine={false}
              width={70}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(15, 23, 42, 0.9)",
                border: "1px solid rgba(148, 163, 184, 0.3)",
                borderRadius: "10px"
              }}
              labelStyle={{ color: "#94a3b8" }}
              formatter={(value: number, key) => {
                if (key === "price") return [`$${value.toFixed(2)}`, "Price"];
                if (key === "volume") return [`${value.toFixed(2)}`, "Volume"];
                return [value, key];
              }}
            />
            <ReferenceLine y={first} stroke="rgba(148, 163, 184, 0.25)" strokeDasharray="4 4" />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#38bdf8"
              strokeWidth={2.2}
              fillOpacity={1}
              fill="url(#gradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
