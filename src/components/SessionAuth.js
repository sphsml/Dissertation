import React, { useEffect, useState, useRef } from "react";
import { speak } from "../utils/speak";

export default function SessionAuthPrompt({onSuccess}) {
  const [method, setMethod] = useState("password");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const parseCookies = () => {
      return document.cookie.split(";").reduce((acc, cookie) => {
        const separatorIndex = cookie.indexOf("=");
        if (separatorIndex === -1) return acc;
        const name = cookie.slice(0, separatorIndex).trim();
        const value = cookie.slice(separatorIndex + 1).trim();
        acc[name] = value;
        return acc;
      }, {});
    };

    const cookies = parseCookies();
    const decoded = decodeURIComponent(cookies.accessibility);
    const accessibilityData = JSON.parse(decoded);
    if (accessibilityData.type === "vi") {
      // Voice prompt
      const utterance = "Say authorize or press Enter to confirm your identity";
      speak(utterance);

      // Start voice recognition
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
          const command = event.results[0][0].transcript.toLowerCase().trim();
          if (command.includes("authorize") || command.includes("continue")) {
            onSuccess();
          }
        };

        recognition.onerror = (err) => {
          console.error("Voice recognition error:", err);
        };

        recognition.start();
        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [method, onSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const cookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("userEmail="));
        const email = decodeURIComponent(cookie?.split("=")[1]);
        if(!email) throw new Error("User email not found");
      const res = await fetch("http://localhost:4000/verify-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Authentication failed");

      onSuccess();
    } catch (err) {
      setError("Invalid password. Try again.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "400px",
        }}
      >
        <h2>🔐 Session Authentication</h2>
        <p>Please confirm your identity to access Payments.</p>

        <div style={{ marginTop: "16px" }}>
          <button
            onClick={() => setMethod("password")}
            disabled={method === "password"}
          >
            Password
          </button>
          <button
            onClick={() => setMethod("easy")}
            style={{ marginLeft: "8px" }}
            disabled={method === "easy"}
          >
            Accessibility
          </button>
        </div>

        {method === "password" && (
          <form onSubmit={handleSubmit} style={{ marginTop: "16px" }}>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
              required
            />
            <button type="submit" style={{ marginTop: "12px" }}>
              Verify
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}