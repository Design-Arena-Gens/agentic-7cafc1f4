"use client";

import { useEffect, useMemo, useState } from "react";
import { assets } from "@/data/market";
import { generateChartData, generateDepth } from "@/lib/marketData";
import { useTradingStore } from "@/store/tradingStore";
import { Header } from "./Header";
import { Watchlist } from "./Watchlist";
import { PerformanceChart } from "./PerformanceChart";
import { DepthBook } from "./DepthBook";
import { TradingTerminal } from "./TradingTerminal";
import { PortfolioOverview } from "./PortfolioOverview";
import { TradeHistory } from "./TradeHistory";
import { NewsFeed } from "./NewsFeed";
import { SentimentHeatmap } from "./SentimentHeatmap";
import { PriceTicker } from "./PriceTicker";

export function Dashboard() {
  const { selectedSymbol, setSelectedSymbol, tradeHistory } = useTradingStore((state) => ({
    selectedSymbol: state.selectedSymbol,
    setSelectedSymbol: state.setSelectedSymbol,
    tradeHistory: state.tradeHistory
  }));

  const [chartRange, setChartRange] = useState<"1H" | "4H" | "1D" | "1W">("4H");
  const asset = useMemo(() => assets.find((item) => item.symbol === selectedSymbol) ?? assets[0], [selectedSymbol]);
  const chartData = useMemo(
    () => generateChartData(selectedSymbol, rangeToPoints(chartRange)),
    [selectedSymbol, chartRange]
  );
  const topTradeId = tradeHistory[0]?.id ?? "baseline";
  const [depth, setDepth] = useState(() => generateDepth(selectedSymbol));

  useEffect(() => {
    setDepth(generateDepth(selectedSymbol));
  }, [selectedSymbol, topTradeId]);

  return (
    <div style={{ padding: "2.5rem", maxWidth: "1400px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
      <Header asset={asset} />
      <PriceTicker assets={assets} onSelect={setSelectedSymbol} selected={selectedSymbol} />
      <div className="grid grid-2">
        <div className="glass shadow card" style={{ minHeight: "460px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <PerformanceChart
            asset={asset}
            data={chartData}
            range={chartRange}
            onRangeChange={setChartRange}
          />
        </div>
        <div className="grid" style={{ gap: "1.5rem" }}>
          <TradingTerminal asset={asset} />
          <SentimentHeatmap selected={selectedSymbol} />
        </div>
      </div>
      <div className="grid grid-2">
        <DepthBook symbol={selectedSymbol} depth={depth} />
        <PortfolioOverview />
      </div>
      <div className="grid grid-2" style={{ alignItems: "flex-start" }}>
        <TradeHistory />
        <NewsFeed />
      </div>
      <Watchlist selected={selectedSymbol} onSelect={setSelectedSymbol} />
    </div>
  );
}

function rangeToPoints(range: "1H" | "4H" | "1D" | "1W"): number {
  switch (range) {
    case "1H":
      return 60;
    case "4H":
      return 240;
    case "1D":
      return 24 * 12;
    case "1W":
    default:
      return 7 * 24;
  }
}
