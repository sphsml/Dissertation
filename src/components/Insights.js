import React, { useEffect, useState } from "react";
import { speak } from "../utils/speak";
import useAccessibilitySettings from "../utils/useAccessibilitySettings";
import Layout from "./Layout";

export default function Insights() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Regular descriptions
  const insights = [
    {
      title: "📈 Stocks",
      description:
        "Investing in stocks gives you partial ownership of a company. It’s great for long-term growth, but it can be volatile. Ideal if you’re comfortable with some risk.",
      simpleDescription:
        "Stocks let you own a small part of a company. They can grow over time, but the price can change a lot. Good if you're okay with some risk."
    },
    {
      title: "🏠 Real Estate",
      description:
        "Property investments can provide steady income through rent and long-term appreciation. You’ll need more capital upfront, but returns can be reliable.",
      simpleDescription:
        "Real estate is buying property to earn rent and watch it grow in value. It costs more at first, but can give steady returns."
    },
    {
      title: "📉 Bonds",
      description:
        "Government or corporate bonds are safer than stocks and offer fixed interest over time. Best for risk-averse investors who value stability.",
      simpleDescription:
        "Bonds are loans to governments or companies. They pay interest regularly and are safer than stocks. Good for people who want less risk."
    },
    {
      title: "🌱 Mutual Funds & ETFs",
      description:
        "These pool your money with other investors to buy a diversified set of assets. They’re managed by professionals and are great for beginners.",
      simpleDescription:
        "Mutual funds and ETFs let you invest your money with others. They buy different types of investments to spread the risk."
    },
    {
      title: "🧠 Robo-Advisors",
      description:
        "Automated platforms that create and manage your investment portfolio based on your goals and risk tolerance. Simple and low-cost.",
      simpleDescription:
        "Robo-advisors use a computer program to help pick investments based on what you want and how much risk you can handle."
    },
    {
      title: "💰 High-Interest Savings",
      description:
        "While not technically an investment, high-interest accounts let your savings grow with minimal risk. Ideal for short-term goals.",
      simpleDescription:
        "High-interest savings accounts let your money grow slowly with very little risk. Good for short-term saving goals."
    },
  ];

  // State to track if we need simple English
    const accessibilitySettings = useAccessibilitySettings();
  const simpleEnglish = accessibilitySettings?.data?.simple_english;

  useEffect(() => {
    const messages = [
      "Welcome to your personalized investment insights.",
      "Explore different options based on your financial goals.",
    ];
    speak(messages);
  }, []);

  // Handle key events
  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      setCurrentIndex((prevIndex) => {
        const newIndex = Math.min(prevIndex + 1, insights.length - 1);
        speak(simpleEnglish ? insights[newIndex].simpleDescription : insights[newIndex].description);
        return newIndex;
      });
    } else if (event.key === "ArrowLeft") {
      setCurrentIndex((prevIndex) => {
        const newIndex = Math.max(prevIndex - 1, 0);
        speak(simpleEnglish ? insights[newIndex].simpleDescription : insights[newIndex].description);
        return newIndex;
      });
    } else if (event.key === "ArrowDown") {
      setCurrentIndex((prevIndex) => {
        const newIndex = Math.min(prevIndex + 1, insights.length - 1);
        speak(simpleEnglish ? insights[newIndex].simpleDescription : insights[newIndex].description);
        return newIndex;
      });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [simpleEnglish, handleKeyDown]);

  return (
    <Layout messages={["Welcome to your personalized investment insights."]}>
      <div className="main-home" style={{ padding: "1.5rem" }}>
        <h1 style={{ marginBottom: "1rem" }}>💡 Investment Insights</h1>
        {insights.map((insight, index) => (
          <div
            key={index}
            style={{
              backgroundColor: index === currentIndex ? "#dbeafe" : "#f9fafb",
              padding: "16px",
              marginBottom: "12px",
              borderRadius: "10px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            }}
          >
            <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
              {insight.title}
            </h2>
            <p style={{ lineHeight: "1.5rem" }}>
              {simpleEnglish ? insight.simpleDescription : insight.description}
            </p>
          </div>
        ))}
      </div>
    </Layout>
  );
}