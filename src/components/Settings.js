import React, { useState, useEffect, useCallback } from "react";
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
  
    const textList = [
      "Account Settings. You can change your password here.",
      "Accessibility preferences. Choose a voice.",
      "Adjust pitch with left and right arrows while holding shift.",
      "Adjust rate of speech the same way.",
      "Set volume here. Use shift and arrow keys.",
    ];
  
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
    }, [currentTextIndex, voice, pitch, rate, volume]);
  
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
  
    const handleKeyDown = useCallback((e) => {
      if (e.ctrlKey) {
        setCurrentTextIndex((prev) =>
          (prev + 1) % textList.length);
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
    }, [currentTextIndex, utterance, voiceIndex]);
  
    useEffect(() => {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

  const handleUpdate = async () => {
    try {
      await axios.post("http://localhost:4000/update-settings", {
        password,
        voice: voice? voice.name : null,
        pitch,
        rate,
        volume,
      }, {withCredentials: true});
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

      <div className="form-group">
        <label>Voice</label>
        <select value={voice ? voice.name : ""} onChange={handleVoiceChange}>
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

      <button onClick={handleUpdate} style={{ marginTop: "20px" }}>
        Save Changes
      </button>
    </div>
  );
};

export default Settings;