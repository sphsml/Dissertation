import React, { useEffect, useState } from "react";
import axios from "axios";
import './components.css';
import { useNavigate } from "react-router-dom";
import { useCustomCursor } from "../utils/useCustomCursor";
import CustomCursor from "../utils/CustomCursor";


const HISetup = () => {
  const navigate = useNavigate();
  const [notification_type, setnotification_type] = useState("default");
  const [text_size, setTextSize] = useState("medium");
  const [simple_english, setSimpleEnglish] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const[custom_cursor, set_custom_cursor] = useState(false);

  useEffect(() =>  {
    const mouseMove = e => { 
        setMousePosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener("mousemove", mouseMove);

    return () => {
        window.removeEventListener("mousemove", mouseMove);
    }
}, []);
 
  const handleSave = async () => {
    const preferences = {
      notification_type,
      text_size,
      custom_cursor,
      simple_english,
    };
    try {
        const response = await axios.post("http://localhost:4000/hi_view", preferences,
          {withCredentials:true});
          if(response.ok) {
            console.log("Preferences saved successfully");
          } else {
            console.error("Failed to save preferences");
          }
      } catch (error) {
        console.error("Error saving preferences:", error);
      }

      navigate("/Home");
  };

  const textSizeMap = {
    small: "14px",
    medium: "16px",
    large: "18px",
    "x-large": "22px",
  };

  return (
    <div
      className="hi-setup-container"
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "auto",
        fontSize: textSizeMap[text_size],
        cursor: custom_cursor ? "none" : "auto",
      }}
    >
         {custom_cursor && (
            <CustomCursor mousex={mousePosition.x} mousey={mousePosition.y}/>)}
      <h2>Hearing Impaired Setup</h2>


      <div className="form-group">
        <label>
          <strong>Notification Style:</strong>
        </label>
        <select
          value={notification_type}
          onChange={(e) => setnotification_type(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="flashing">Flashing Notification</option>
          <option value="modal">Modal Notification</option>
        </select>
      </div>

      <div className="form-group" style={{ marginTop: "15px" }}>
        <label>
          <strong>Text Size:</strong>
        </label>
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
      onChange={(e) => set_custom_cursor(e.target.checked)}
    />
    <strong> Use Custom Cursor</strong>
  </label>
</div>

      <div className="form-group" style={{ marginTop: "15px" }}>
        <label>
          <input
            type="checkbox"
            checked={simple_english}
            onChange={(e) => setSimpleEnglish(e.target.checked)}
          />
          <strong> Use Simple English</strong>
        </label>
      </div>

      <button onClick={handleSave} style={{ marginTop: "20px" }}>
        Save Preferences
      </button>
    </div>
  );
};

export default HISetup;
