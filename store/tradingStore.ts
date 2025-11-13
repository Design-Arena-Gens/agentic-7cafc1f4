import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addMinutes, formatISO } from "date-fns";
import { assets, type AssetSymbol, type Trade } from "@/data/market";

export type OrderSide = "BUY" | "SELL";
export type OrderType = "MARKET" | "LIMIT" | "STOP";

export interface Order {
  id: string;
  symbol: AssetSymbol;
  side: OrderSide;
  quantity: number;
  type: OrderType;
  limitPrice?: number;
  stopPrice?: number;
  status: "Open" | "Filled" | "Cancelled" | "Rejected";
  createdAt: string;
}

export interface Position {
  symbol: AssetSymbol;
  quantity: number;
  averagePrice: number;
  todaysPnL: number;
  totalPnL: number;
}

export interface Portfolio {
  balance: number;
  buyingPower: number;
  pnlToday: number;
  pnlTotal: number;
  positions: Position[];
}

interface TradingState {
  selectedSymbol: AssetSymbol;
  portfolio: Portfolio;
  watchlist: AssetSymbol[];
  openOrders: Order[];
  tradeHistory: Trade[];
  setSelectedSymbol: (symbol: AssetSymbol) => void;
  placeOrder: (order: Omit<Order, "id" | "status" | "createdAt">) => void;
  cancelOrder: (orderId: string) => void;
  seedInitialState: () => void;
}

const defaultPositions: Position[] = [
  {
    symbol: "BTC-USD",
    quantity: 0.65,
    averagePrice: 60320,
    todaysPnL: 512,
    totalPnL: 17840
  },
  {
    symbol: "ETH-USD",
    quantity: 5.4,
    averagePrice: 2890,
    todaysPnL: 84,
    totalPnL: 2095
  },
  {
    symbol: "AAPL",
    quantity: 140,
    averagePrice: 183.2,
    todaysPnL: 225,
    totalPnL: 2130
  }
];

const defaultTrades = addMockLatencyTrend();

function addMockLatencyTrend(): Trade[] {
  return Array.from({ length: 18 }).map((_, idx) => {
    const baseDate = addMinutes(new Date(), -idx * 30);
    const isCrypto = idx % 2 === 0;
    const symbol: AssetSymbol = (isCrypto ? ["BTC-USD", "ETH-USD", "SOL-USD"] : ["AAPL", "TSLA", "QQQ"])[
      idx % 3
    ] as AssetSymbol;
    const side: OrderSide = idx % 2 === 0 ? "BUY" : "SELL";
    const price =
      assets.find((asset) => asset.symbol === symbol)?.price ?? 100 + Math.random() * 50;

    return {
      id: `HIST-${idx.toString().padStart(3, "0")}`,
      timestamp: formatISO(baseDate),
      symbol,
      side,
      quantity: Number((Math.random() * (isCrypto ? 1.2 : 180)).toFixed(isCrypto ? 2 : 0)),
      price: Number(price.toFixed(isCrypto ? 2 : 2)),
      type: idx % 3 === 0 ? "LIMIT" : "MARKET",
      status: "Filled" as const
    };
  });
}

export const useTradingStore = create<TradingState>()(
  persist(
    (set, get) => ({
      selectedSymbol: "BTC-USD",
      portfolio: {
        balance: 150000,
        buyingPower: 94000,
        pnlToday: 1125,
        pnlTotal: 30240,
        positions: defaultPositions
      },
      watchlist: assets.map((asset) => asset.symbol),
      openOrders: [],
      tradeHistory: defaultTrades,
      setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
      placeOrder: (orderInput) => {
        const id = `ORD-${Date.now()}`;
        const createdAt = new Date().toISOString();
        const newOrder: Order = {
          id,
          createdAt,
          status: "Filled",
          ...orderInput
        };

        const { portfolio, tradeHistory } = get();
        const assetPrice = assets.find((asset) => asset.symbol === orderInput.symbol)?.price ?? 0;
        const fillPrice = orderInput.type === "MARKET" ? assetPrice : orderInput.limitPrice ?? assetPrice;
        const trade: Trade = {
          id: `TRD-${Date.now()}`,
          timestamp: createdAt,
          symbol: orderInput.symbol,
          side: orderInput.side,
          quantity: orderInput.quantity,
          price: fillPrice,
          type: orderInput.type,
          status: "Filled"
        };

        const nextPositions = portfolio.positions.map((position) => ({ ...position }));
        const positionIndex = nextPositions.findIndex((p) => p.symbol === orderInput.symbol);
        const signedQty = orderInput.side === "BUY" ? orderInput.quantity : -orderInput.quantity;
        const tradeValue = fillPrice * signedQty;
        const fees = Math.abs(fillPrice * orderInput.quantity) * 0.0005;
        let updatedBuyingPower = portfolio.buyingPower - tradeValue - fees;

        if (positionIndex >= 0) {
          const target = nextPositions[positionIndex];
          const totalQuantity = target.quantity + signedQty;
          const newAvg =
            totalQuantity === 0
              ? 0
              : (target.averagePrice * target.quantity + fillPrice * orderInput.quantity) / Math.abs(totalQuantity);
          target.quantity = Number(totalQuantity.toFixed(4));
          target.averagePrice = Number(newAvg.toFixed(2));
          target.todaysPnL += Number((fillPrice - target.averagePrice) * signedQty);
          target.totalPnL += Number(((fillPrice - target.averagePrice) * signedQty).toFixed(2));

          if (Math.abs(target.quantity) < 0.0001) {
            nextPositions.splice(positionIndex, 1);
          }
        } else if (orderInput.side === "BUY") {
          nextPositions.push({
            symbol: orderInput.symbol,
            quantity: Number(orderInput.quantity.toFixed(4)),
            averagePrice: Number(fillPrice.toFixed(2)),
            todaysPnL: 0,
            totalPnL: 0
          });
        } else {
          updatedBuyingPower += tradeValue * -1;
        }

        set({
          openOrders: [newOrder, ...get().openOrders],
          tradeHistory: [trade, ...tradeHistory],
          portfolio: {
            ...portfolio,
            buyingPower: Number(updatedBuyingPower.toFixed(2)),
            positions: nextPositions
          }
        });
      },
      cancelOrder: (orderId) =>
        set({
          openOrders: get().openOrders.map((order) =>
            order.id === orderId ? { ...order, status: "Cancelled" } : order
          )
        }),
      seedInitialState: () => {
        // re-hydrate defaults if storage cleared
        set({
          selectedSymbol: "BTC-USD",
          portfolio: {
            balance: 150000,
            buyingPower: 94000,
            pnlToday: 1125,
            pnlTotal: 30240,
            positions: defaultPositions
          },
          watchlist: assets.map((asset) => asset.symbol),
          openOrders: [],
          tradeHistory: defaultTrades
        });
      }
    }),
    { name: "nebula-trading-store" }
  )
);
