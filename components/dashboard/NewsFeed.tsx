 "use client";

import { formatDistanceToNow } from "date-fns";

interface Story {
  title: string;
  source: string;
  timestamp: Date;
  summary: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
}

const stories: Story[] = [
  {
    title: "Bitcoin closes in on all-time highs as ETFs see record inflows",
    source: "CryptoSlate",
    timestamp: new Date(Date.now() - 1000 * 60 * 32),
    summary:
      "Institutional demand accelerated with three consecutive trading sessions above $700M net inflows. Market analysts eye $65K breakout with funding remaining neutral.",
    sentiment: "Bullish"
  },
  {
    title: "Apple expands AI silicon roadmap after Vision Pro momentum",
    source: "Bloomberg",
    timestamp: new Date(Date.now() - 1000 * 60 * 58),
    summary:
      "Sources indicate Apple is fast-tracking M4 series optimized for on-device AI with strategic partnerships in cloud inference. Supply chain capacity remains healthy.",
    sentiment: "Bullish"
  },
  {
    title: "Fed minutes signal patience while inflation stays sticky",
    source: "WSJ Markets",
    timestamp: new Date(Date.now() - 1000 * 60 * 86),
    summary:
      "FOMC minutes highlight improved labor resilience but caution on service inflation. Futures imply 59% probability of June cut, down from 72% last week.",
    sentiment: "Neutral"
  },
  {
    title: "Ethereum staking tops 25% as L2 usage surges",
    source: "The Block",
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    summary:
      "Layer-two activity hit all-time highs with Base leading daily volume. Liquid staking inflows steady while gas fees normalize after Dencun upgrade.",
    sentiment: "Bullish"
  }
];

export function NewsFeed() {
  return (
    <section className="glass shadow card" style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Market Intelligence</h3>
        <span className="muted" style={{ fontSize: "0.8rem" }}>
          Curated macro updates
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {stories.map((story) => (
          <article key={story.title} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: 600 }}>{story.title}</h4>
              <span
                className={`pill ${
                  story.sentiment === "Bullish" ? "success" : story.sentiment === "Bearish" ? "danger" : ""
                }`}
              >
                {story.sentiment}
              </span>
            </div>
            <p className="muted" style={{ fontSize: "0.85rem", lineHeight: 1.5 }}>
              {story.summary}
            </p>
            <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: "#94a3b8" }}>
              <span>{story.source}</span>
              <span>{formatDistanceToNow(story.timestamp, { addSuffix: true })}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
