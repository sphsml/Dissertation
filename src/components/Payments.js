import React, { useState } from "react";
import Layout from "./Layout";
import axios from "axios";

export default function Payments() {
  const [amount, setAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const messages = [
    "The new tax year starts soon.",
    "Interest rates have been updated.",
    "You have unread insights from your advisor.",
  ];

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/payments",
        { amount: parseFloat(amount) },
        { withCredentials: true }
      );
      setResponse(res.data);
      setError("");
      setAmount("");
    } catch (err) {
      setResponse(null);
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/transfer",
        { amount: parseFloat(transferAmount) },
        { withCredentials: true }
      );
      setResponse(res.data);
      setError("");
      setTransferAmount("");
    } catch (err) {
      setResponse(null);
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <Layout messages={messages}>
      <div className="main-home" style={{ flex: 2 }}>
        <div className="bordered-div" style={{ maxWidth: "500px" }}>
          <h1>💳 Make a Payment</h1>
          <form onSubmit={handlePayment}>
            <label>Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to pay"
              min="0.01"
              step="0.01"
              required
              style={{ width: "100%", padding: "8px", marginTop: "8px" }}
            />
            <button
              type="submit"
              style={{
                marginTop: "16px",
                backgroundColor: "#3b82f6",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Submit Payment
            </button>
          </form>
          <hr style={{ margin: "24px 0" }} />

          <h1>💰 Transfer Funds</h1>
          <form onSubmit={handleTransfer}>
            <label>Amount:</label>
            <input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Enter amount to transfer"
              min="0.01"
              step="0.01"
              required
              style={{ width: "100%", padding: "8px", marginTop: "8px" }}
            />
            <button
              type="submit"
              style={{
                marginTop: "16px",
                backgroundColor: "#10b981",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Transfer Funds
            </button>
          </form>
          {response && (
            <div style={{ marginTop: "20px", color: "green" }}>
              ✅ {response.message}. New balance: £
              {response.newBalance.toFixed(2)}
            </div>
          )}
          {error && (
            <div style={{ marginTop: "20px", color: "red" }}>❌ {error}</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
