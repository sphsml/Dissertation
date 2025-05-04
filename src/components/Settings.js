import React, { useState, useEffect, useCallback } from "react";
import useAccessibilitySettings from "../utils/useAccessibilitySettings";
import axios from "axios";

const Settings = () => {
  const [password, setPassword] = useState("");
  const [voice, setVoice] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [voices, setVoices] = useState([]);
  const [voiceIndex, setVoiceIndex] = useState(0);

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const accessibilitySettings = useAccessibilitySettings();
  const [accessibilityType, setAccessibilityType] = useState("vi");

  const [notificationType, setNotificationType] = useState("default");
  const [textSize, setTextSize] = useState("medium");
  const [customCursor, setCustomCursor] = useState(false);
  const [simpleEnglish, setSimpleEnglish] = useState(false);

  const [bionicReading, setBionicReading] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [textColour, setTextColour] = useState("#000000");
  const [componentColour, setComponentColour] = useState("#ffffff");

  const textList = [
    "Account Settings. You can change your password here.",
    "Accessibility preferences. Choose a voice.",
    "Adjust pitch with left and right arrows while holding shift.",
    "Adjust rate of speech the same way.",
    "Set volume here. Use shift and arrow keys.",
  ];

  useEffect(() => {
    if (accessibilitySettings?.type) {
      try {
        console.log(accessibilitySettings?.type);
        setAccessibilityType(accessibilitySettings?.type);
      } catch (e) {
        console.error("Failed to parse accessibility cookie:", e);
      }
    }
  }, []);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setVoice(availableVoices[0]);
        setVoiceIndex(0);
      }
    };
    loadVoices();
    synth.onvoiceschanged = loadVoices;
    return () => synth.cancel();
  }, []);

  useEffect(() => {
    if (textList[currentTextIndex] && voice) {
      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(textList[currentTextIndex]);
      u.voice = voice;
      u.pitch = pitch;
      u.rate = rate;
      u.volume = volume;
      setUtterance(u);
      synth.cancel();
      synth.speak(u);
    }
  }, []);

  const speak = () => {
    if (!utterance) return;
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
    setIsPaused(false);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPaused(false);
  };

  const nextVoice = () => {
    const newIndex = (voiceIndex + 1) % voices.length;
    setVoice(voices[newIndex]);
    setVoiceIndex(newIndex);
  };

  const prevVoice = () => {
    const newIndex = (voiceIndex - 1 + voices.length) % voices.length;
    setVoice(voices[newIndex]);
    setVoiceIndex(newIndex);
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (e.ctrlKey) {
        setCurrentTextIndex((prev) => (prev + 1) % textList.length);
      } else if (e.key === "ArrowUp") {
        speak();
      } else if (e.key === "ArrowDown") {
        stop();
      } else if (e.key === "ArrowLeft") {
        pause();
      } else if (e.shiftKey) {
        if (e.key === "ArrowRight") {
          if (currentTextIndex === 1) nextVoice();
          if (currentTextIndex === 2) setPitch((p) => Math.min(p + 0.1, 2));
          if (currentTextIndex === 3) setRate((r) => Math.min(r + 0.1, 2));
          if (currentTextIndex === 4) setVolume((v) => Math.min(v + 0.1, 1));
        }
        if (e.key === "ArrowLeft") {
          if (currentTextIndex === 1) prevVoice();
          if (currentTextIndex === 2) setPitch((p) => Math.max(p - 0.1, 0));
          if (currentTextIndex === 3) setRate((r) => Math.max(r - 0.1, 0.5));
          if (currentTextIndex === 4) setVolume((v) => Math.max(v - 0.1, 0));
        }
      }
    },
    [currentTextIndex, nextVoice, prevVoice, speak, textList.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleUpdate = async () => {
    try {
      let payload = { password };

      if (accessibilityType === "hi") {
        payload = {
          ...payload,
          notification_type: notificationType,
          text_size: textSize,
          custom_cursor: customCursor,
          simple_english: simpleEnglish,
        };
      }
      if (accessibilityType === "vi") {
        payload = {
          ...payload,
          voice: voice ? voice.name : null,
          pitch,
          rate,
          volume,
        };
      }
      if (accessibilityType === "nd") {
        payload = {
          ...payload,
          notification_type: notificationType,
          text_size: textSize,
          custom_cursor: customCursor,
          bionic_reading: bionicReading,
          text_to_speech: textToSpeech,
          voice: voice ? voice.name : null,
          pitch,
          rate,
          volume,
          text_colour: textColour,
          component_colour: componentColour,
        };
      }

      await axios.post("http://localhost:4000/update-settings", payload, {
        withCredentials: true,
      });

      alert("Settings updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to update settings.");
    }
  };

  const handleVoiceChange = (e) => {
    const selectedVoiceName = e.target.value;
    const selectedVoice = voices.find((v) => v.name === selectedVoiceName);
    setVoice(selectedVoice); // Set the full voice object
  };

  return (
    <div className="settings-container" style={{ padding: "20px" }}>
      <h2>Account Settings</h2>

      <div className="form-group">
        <label>New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <h2>Accessibility Preferences</h2>

      {!accessibilitySettings && (
        <p>No accessibility preferences detected. </p>
      )}

      {accessibilityType === "hi" && (
        <>
          <div className="form-group">
            <label>Notification Style</label>
            <select
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="flashing">Flashing Notification</option>
              <option value="modal">Modal Notification</option>
            </select>
          </div>

          <div className="form-group">
            <label>Text Size</label>
            <select
              value={textSize}
              onChange={(e) => setTextSize(e.target.value)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="x-large">Extra Large</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={customCursor}
                onChange={(e) => setCustomCursor(e.target.checked)}
              />
              Use Custom Cursor
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={simpleEnglish}
                onChange={(e) => setSimpleEnglish(e.target.checked)}
              />
              Use Simple English
            </label>
          </div>
        </>
      )}
      {accessibilityType === "vi" && (
        <>
          <div className="form-group">
            <label>Voice</label>
            <select
              value={voice ? voice.name : ""}
              onChange={handleVoiceChange}
            >
              <option value="">Select a voice</option>
              {voices.map((v, i) => (
                <option key={i} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Pitch ({pitch})</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Rate ({rate})</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Volume ({volume})</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            />
          </div>
        </>
      )}

      {accessibilityType === "nd" && (
        <>
          {/* Notification + Text Size */}
          <div className="form-group">
            <label>Notification Style</label>
            <select
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="flashing">Flashing</option>
              <option value="modal">Modal</option>
            </select>
          </div>
          <div className="form-group">
            <label>Text Size</label>
            <select
              value={textSize}
              onChange={(e) => setTextSize(e.target.value)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="x-large">Extra Large</option>
            </select>
          </div>
          {/* ND-specific toggles */}
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={customCursor}
                onChange={(e) => setCustomCursor(e.target.checked)}
              />{" "}
              Use Custom Cursor
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={bionicReading}
                onChange={(e) => setBionicReading(e.target.checked)}
              />{" "}
              Enable Bionic Reading
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={textToSpeech}
                onChange={(e) => setTextToSpeech(e.target.checked)}
              />{" "}
              Enable Text to Speech
            </label>
          </div>
          {/* TTS options if enabled */}
          {textToSpeech && (
            <>
              <div className="form-group">
                <label>Voice</label>
                <select
                  value={voice ? voice.name : ""}
                  onChange={handleVoiceChange}
                >
                  <option value="">Select a voice</option>
                  {voices.map((v, i) => (
                    <option key={i} value={v.name}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Pitch ({pitch})</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label>Rate ({rate})</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label>Volume ({volume})</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                />
              </div>
            </>
          )}{" "}
          {/* Color selectors */}
          <div className="form-group">
            <label>Text Colour</label>
            <input
              type="color"
              value={textColour}
              onChange={(e) => setTextColour(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Background Colour</label>
            <input
              type="color"
              value={componentColour}
              onChange={(e) => setComponentColour(e.target.value)}
            />
          </div>
        </>
      )}

      <button onClick={handleUpdate} style={{ marginTop: "20px" }}>
        Save Changes
      </button>
    </div>
  );
};

export default Settings;
