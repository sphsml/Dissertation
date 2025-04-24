import React, { useEffect } from "react";
import { Chart } from "react-google-charts";
import Layout from "./Layout";
import "./components.css";

export default function Savings() {
  const totalSaved = 5728.35;

  const monthlySavings = [
    ["Month", "Amount Saved"],
    ["Jan", 400],
    ["Feb", 350],
    ["Mar", 500],
    ["Apr", 430],
    ["May", 470],
    ["Jun", 520],
  ];

  const savingsByGoal = [
    { goal: "Emergency Fund", amount: 2500 },
    { goal: "Holiday", amount: 1200 },
    { goal: "Retirement", amount: 2028.35 },
  ];

  const tips = [
    "Try automating your savings each payday.",
    "Set specific goals to stay motivated.",
    "Track your spending to find more to save.",
  ];

  const messages = [
    "The new tax year starts soon.",
    "Interest rates have been updated.",
    "You have unread insights from your advisor.",
  ];

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    speak("Welcome to your savings overview. Press 1 for overview, 2 for monthly contributions, 3 for savings by goal, or 4 for tips.");
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "1":
          speak(`Total saved is £${totalSaved.toLocaleString()}`);
          break;
        case "2":
          const monthly = monthlySavings
            .slice(1)
            .map(([month, amount]) => `${month}: £${amount}`)
            .join(", ");
          speak("Monthly Contributions: " + monthly);
          break;
        case "3":
          const goals = savingsByGoal
            .map((item) => `${item.goal}: £${item.amount.toLocaleString()}`)
            .join(", ");
          speak("Savings by Goal: " + goals);
          break;
        case "4":
          speak("Tips: " + tips.join(" ... "));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Layout messages={messages}>
      <div className="main-home" style={{ flex: 2 }}>
        <div className="bordered-div">
          <h1>Your Savings Overview</h1>
          <p>Total saved across all accounts:</p>
          <h2>£{totalSaved.toLocaleString()}</h2>
        </div>

        <div className="bordered-div" style={{ minWidth: "600px" }}>
          <h2>Monthly Contributions</h2>
          <Chart
            chartType="Line"
            width="100%"
            height="300px"
            data={monthlySavings}
            options={{
              chart: { title: "Savings Growth Over Time" },
              legend: { position: "bottom" },
            }}
          />
        </div>
        <div style={{ display: "flex" }}>
        <div className="bordered-div">
          <h2>Savings Breakdown by Goal</h2>
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            {savingsByGoal.map((item, idx) => (
              <li key={idx} style={{ marginBottom: "10px" }}>
                <strong>{item.goal}:</strong> £{item.amount.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>

        <div className="bordered-div">
          <h2>Insights & Tips</h2>
          <ul>
            {tips.map((tip, index) => (
              <li key={index}>💡 {tip}</li>
            ))}
          </ul>
        </div>
        </div>
      </div>
    </Layout>
  );
}