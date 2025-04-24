import React from "react";
import Layout from "./Layout";

export default function Insights() {
  const messages = [
    "Welcome to your personalized investment insights.",
    "Explore different options based on your financial goals.",
  ];

  const insights = [
    {
      title: "📈 Stocks",
      description:
        "Investing in stocks gives you partial ownership of a company. It’s great for long-term growth, but it can be volatile. Ideal if you’re comfortable with some risk.",
    },
    {
      title: "🏠 Real Estate",
      description:
        "Property investments can provide steady income through rent and long-term appreciation. You’ll need more capital upfront, but returns can be reliable.",
    },
    {
      title: "📉 Bonds",
      description:
        "Government or corporate bonds are safer than stocks and offer fixed interest over time. Best for risk-averse investors who value stability.",
    },
    {
      title: "🌱 Mutual Funds & ETFs",
      description:
        "These pool your money with other investors to buy a diversified set of assets. They’re managed by professionals and are great for beginners.",
    },
    {
      title: "🧠 Robo-Advisors",
      description:
        "Automated platforms that create and manage your investment portfolio based on your goals and risk tolerance. Simple and low-cost.",
    },
    {
      title: "💰 High-Interest Savings",
      description:
        "While not technically an investment, high-interest accounts let your savings grow with minimal risk. Ideal for short-term goals.",
    },
  ];

  return (
    <Layout messages={messages}>
      <div className="main-home" style={{ padding: "1.5rem" }}>
        <h1 style={{ marginBottom: "1rem" }}>💡 Investment Insights</h1>
        {insights.map((insight, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#f9fafb",
              padding: "16px",
              marginBottom: "12px",
              borderRadius: "10px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            }}
          >
            <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
              {insight.title}
            </h2>
            <p style={{ lineHeight: "1.5rem" }}>{insight.description}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}