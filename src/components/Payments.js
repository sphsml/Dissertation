import React, { useState, useEffect, useRef } from "react";
import Layout from "./Layout";
import axios from "axios";

export default function Payments() {
  const [amount, setAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [mode, setMode] = useState(null); // 'payment' or 'transfer'

  const amountRef = useRef(null);
  const transferRef = useRef(null);

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
      speak(`Payment submitted. ${res.data.message}. New balance: £${res.data.newBalance.toFixed(2)}`);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Something went wrong";
      setResponse(null);
      setError(errMsg);
      speak(`Error: ${errMsg}`);
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
      speak(`Transfer complete. ${res.data.message}. New balance: £${res.data.newBalance.toFixed(2)}`);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Something went wrong";
      setResponse(null);
      setError(errMsg);
      speak(`Error: ${errMsg}`);
    }
  };

  useEffect(() => {
    if(!mode) speak("Welcome. Press the left arrow key for Make a Payment or the right arrow key for Transfer Funds.");

    const handleKeyDown = (e) => {
      if (!mode) {
        if (e.key === "ArrowLeft") {
          setMode("payment");
          amountRef.current.focus();
          speak("Make a Payment. Use the up and down arrow keys to set amount, Enter to submit.");
        } else if (e.key === "ArrowRight") {
          setMode("transfer");
          transferRef.current.focus();
          speak("Transfer Funds. Use the up and down arrow keys to set amount, Enter to submit.");
        }
        return;
      }

      const step = 1;

      if (mode === "payment") {
        let val = parseFloat(amount) || 0;
        if (e.key === "ArrowUp") {
          val += step;
          setAmount(val.toFixed(2));
          speak(`Amount: £${val.toFixed(2)}`);
        } else if (e.key === "ArrowDown") {
          val = Math.max(0, val - step);
          setAmount(val.toFixed(2));
          speak(`Amount: £${val.toFixed(2)}`);
        } else if (e.key === "Enter") {
          handlePayment(new Event("submit"));
        }
      }

      if (mode === "transfer") {
        let val = parseFloat(transferAmount) || 0;
        if (e.key === "ArrowUp") {
          val += step;
          setTransferAmount(val.toFixed(2));
          speak(`Amount: £${val.toFixed(2)}`);
        } else if (e.key === "ArrowDown") {
          val = Math.max(0, val - step);
          setTransferAmount(val.toFixed(2));
          speak(`Amount: £${val.toFixed(2)}`);
        } else if (e.key === "Enter") {
          handleTransfer(new Event("submit"));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, amount, transferAmount]);

  return (
    <Layout messages={messages}>
      <div className="main-home" style={{ flex: 2 }}>
        <div className="bordered-div" style={{ maxWidth: "500px" }}>
          <h1>💳 Make a Payment</h1>
          <form onSubmit={handlePayment}>
            <label>Amount:</label>
            <input
              ref={amountRef}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to pay"
              min="1"
              step="1"
              required
              style={{ width: "100%", padding: "8px", marginTop: "8px" }}
            />
            <button type="submit" style={buttonStyle("#3b82f6")}>
              Submit Payment
            </button>
          </form>

          <hr style={{ margin: "24px 0" }} />

          <h1>💰 Transfer Funds</h1>
          <form onSubmit={handleTransfer}>
            <label>Amount:</label>
            <input
              ref={transferRef}
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Enter amount to transfer"
              min="0.01"
              step="0.01"
              required
              style={{ width: "100%", padding: "8px", marginTop: "8px" }}
            />
            <button type="submit" style={buttonStyle("#10b981")}>
              Transfer Funds
            </button>
          </form>

          {response && (
            <div style={{ marginTop: "20px", color: "green" }}>
              ✅ {response.message}. New balance: £{response.newBalance.toFixed(2)}
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

function buttonStyle(color) {
  return {
    marginTop: "16px",
    backgroundColor: color,
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  };
}