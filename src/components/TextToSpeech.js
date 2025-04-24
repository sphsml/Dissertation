import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TextToSpeech = ({ textList }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [voice, setVoice] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [voices, setVoices] = useState([]);
  const [voiceIndex, setVoiceIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if(availableVoices.length >0) {setVoice(availableVoices[0]);}
    };
    
    synth.onvoiceschanged = loadVoices;
    loadVoices();

    synth.onvoiceschanged = () => {
      loadVoices();
    }

    return () => {
      synth.cancel();
    };
  }, []);

  useEffect(() => {
    if (textList && textList.length > 0 && voice) {
      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(textList[currentTextIndex]);
      u.voice = voice;
      u.pitch = pitch;
      u.rate = rate;
      u.volume = volume;
      setUtterance(u);
      if(voices.length >0) {
        synth.speak(u);
      }

    }
  }, [currentTextIndex, voice, voices, pitch, rate, volume, textList]);

  const savePreferences = async () => {
    const preferences = {
      voice: voice?.name || "",
      pitch,
      rate,
      volume,
    };
    
    try {
      const response = await axios.post("http://localhost:4000/vi_view", preferences,
        {withCredentials:true});
        if(response.ok) {
          console.log("Preferences saved successfully");
        } else {
          console.error("Failed to save preferences");
        }
    } catch (error) {
      console.error("Error saving preferences:", error);
    }

  };

  const handlePlay = () => {
    if (!utterance) return;
    const synth = window.speechSynthesis;

    if (isPaused) {
      synth.resume();
    } else {
      synth.speak(utterance);
    }
    setIsPaused(false);
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPaused(false);
  };

  const handleVoiceChange = (direction) => {
    let newIndex = voiceIndex;

    if (direction === "next") {
      newIndex = (voiceIndex + 1) % voices.length;
    } else if (direction === "previous") {
      newIndex = (voiceIndex - 1 + voices.length) % voices.length;
    }

    setVoice(voices[newIndex]);
    setVoiceIndex(newIndex);
  };

  const handleNextText = () => {
    setCurrentTextIndex((prevIndex) => (prevIndex + 1));
    if(currentTextIndex>textList.length) {
        savePreferences();
        navigate("/Home");
    }
  }

  const handleKeyDown = useCallback(
    (event) => {
      if (event.shiftKey) {
        if (event.key === "ArrowRight") {
          if(currentTextIndex ===1) {
            handleVoiceChange("next");
          }
          if(currentTextIndex ===2) {
            setPitch((prev) => Math.min(prev + 0.1, 2));
          }
          if(currentTextIndex ===3) {
            setRate((prev) => Math.min(prev + 0.1, 2));
          }
          if(currentTextIndex ===4) {
            setVolume((prev) => Math.min(prev + 0.1, 1));
          }
        } else if (event.key === "ArrowLeft") {
          if (currentTextIndex === 1) {
            handleVoiceChange("previous");
          } else if (currentTextIndex === 2) {
            setPitch((prev) => Math.max(prev - 0.1, 0.5));
          } else if (currentTextIndex === 3) {
            setRate((prev) => Math.max(prev - 0.1, 0.5));
          } else if (currentTextIndex === 4) {
            setVolume((prev) => Math.max(prev - 0.1, 0));
          }
        }
      } else if(event.ctrlKey) {
        handleNextText();
      } else {
        if (event.key === "ArrowUp") {
          handlePlay();
        } else if (event.key === "ArrowLeft") {
          handlePause();
        } else if (event.key === "ArrowDown") {
          handleStop();
        } else if (event.key === "ArrowRight") {
          handleStop();
          handlePlay();
        }
      }
    },
    [handlePlay, currentTextIndex, handlePause, handleStop, handleNextText, handleVoiceChange]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handlePitchChange  = (event) => {
    setPitch(parseFloat(event.target.value));
  };

  const handleRateChange = (event) => {
    setRate(parseFloat(event.target.value));
  };

  const handleVolumeChange = (event) => {
    setVolume(parseFloat(event.target.value));
  };

  return (
    <div>
      <label>
        Voice:
        <select value={voice?.name} onChange={handleVoiceChange}>
          {window.speechSynthesis.getVoices().map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
      </label>

      <br />

      <label>
        Pitch:
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={pitch}
          onChange={handlePitchChange}
        />
      </label>

      <br />

      <label>
        Speed:
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          onChange={handleRateChange}
        />
      </label>
      <br />
      <label>
        Volume:
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
        />
      </label>

      <br />

      <button onClick={handlePlay}>{isPaused ? "Resume" : "Play"}</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleStop}>Stop</button>
    </div>
  );
};

export default TextToSpeech;
