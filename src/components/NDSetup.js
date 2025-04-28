import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCustomCursor } from "../utils/useCustomCursor";
import CustomCursor from "../utils/CustomCursor";

const NDSetup = () => {
  const [notification_type, setNotificationType] = useState("default");
  const [text_size, setTextSize] = useState("medium");
  const [custom_cursor, setCustomCursor] = useState(false);
  const [bionic_reading, setBionicReading] = useState(false);
  const [text_to_speech, setTextToSpeech] = useState(false);

  const [text_colour, setTextColour] = useState("#000000");
  const [component_colour, setComponentColour] = useState("#ffffff");

  const [voices, setVoices] = useState([]);
  const [voice, setVoice] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setVoice(availableVoices[0]);
      }
    };

    synth.onvoiceschanged = loadVoices;
    loadVoices();

    const mouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  const handleSave = async () => {
    const preferences = {
      notification_type,
      text_size,
      custom_cursor,
      bionic_reading,
      text_to_speech,
      voice: voice?.name || "",
      pitch,
      rate,
      volume,
      text_colour,
      component_colour,
    };
    try {
      const response = await axios.post("http://localhost:4000/nd_view", preferences, {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log("Preferences saved successfully");
      } else {
        console.error("Failed to save preferences");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const textSizeMap = {
    small: "14px",
    medium: "16px",
    large: "18px",
    "x-large": "22px",
  };

  return (
    <div
      className="nd-setup-container"
      style={{
        padding: "20px",
        maxWidth: "700px",
        margin: "auto",
        fontSize: textSizeMap[text_size],
        color: text_colour,
        backgroundcolor: component_colour,
        cursor: custom_cursor ? "none" : "auto",
      }}
    >
      {custom_cursor && <CustomCursor mousex={mousePosition.x} mousey={mousePosition.y} />}
      <h2>Neurodivergent Setup</h2>

      <div className="form-group">
        <label><strong>Notification Style:</strong></label>
        <select value={notification_type} onChange={(e) => setNotificationType(e.target.value)}>
          <option value="default">Default</option>
          <option value="flashing">Flashing</option>
          <option value="modal">Modal</option>
        </select>
      </div>

      <div className="form-group" style={{ marginTop: "15px" }}>
        <label><strong>Text Size:</strong></label>
        <select value={text_size} onChange={(e) => setTextSize(e.target.value)}>
          <option value="small">Small</option>
          <option value="medium">Medium (Default)</option>
          <option value="large">Large</option>
          <option value="x-large">Extra Large</option>
        </select>
      </div>

      <div className="form-group" style={{ marginTop: "15px" }}>
        <label>
          <input
            type="checkbox"
            checked={custom_cursor}
            onChange={(e) => setCustomCursor(e.target.checked)}
          />
          <strong> Use Custom Cursor</strong>
        </label>
      </div>

      <div className="form-group" style={{ marginTop: "15px" }}>
        <label>
          <input
            type="checkbox"
            checked={bionic_reading}
            onChange={(e) => setBionicReading(e.target.checked)}
          />
          <strong> Enable Bionic Reading</strong>
        </label>
      </div>

      <div className="form-group" style={{ marginTop: "15px" }}>
        <label>
          <input
            type="checkbox"
            checked={text_to_speech}
            onChange={(e) => setTextToSpeech(e.target.checked)}
          />
          <strong> Enable Text to Speech</strong>
        </label>
      </div>

      {text_to_speech && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <h3>Text-to-Speech Settings</h3>

          <label>Voice:</label>
          <select value={voice?.name} onChange={(e) => {
            const selectedVoice = voices.find(v => v.name === e.target.value);
            setVoice(selectedVoice);
          }}>
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>

          <br /><br />

          <label>Pitch:</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
          />

          <br /><br />

          <label>Rate (Speed):</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
          />

          <br /><br />

          <label>Volume:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </div>
      )}

      <div className="form-group" style={{ marginTop: "20px" }}>
        <label><strong>Text colour:</strong></label>
        <input
          type="color"
          value={text_colour}
          onChange={(e) => setTextColour(e.target.value)}
        />
      </div>

      <div className="form-group" style={{ marginTop: "15px" }}>
        <label><strong>Background colour:</strong></label>
        <input
          type="color"
          value={component_colour}
          onChange={(e) => setComponentColour(e.target.value)}
        />
      </div>

      <button onClick={handleSave} style={{ marginTop: "30px" }}>
        Save Preferences
      </button>
    </div>
  );
};

export default NDSetup;