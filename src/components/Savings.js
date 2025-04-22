import React, { useState } from "react";
import { Chart } from "react-google-charts";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Divider } from "@react-md/divider";
import Layout from "./Layout";
import "./components.css";

export default function Savings() {
  const totalSaved = 5728.35;
  const [showModal, setShowModal] = useState(false);

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