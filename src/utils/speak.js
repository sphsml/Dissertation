export function speak(text) {
    if (!text || typeof window === "undefined") return;
  
    const synth = window.speechSynthesis;
    synth.cancel(); // Cancel ongoing speech
  
    const utterance = new SpeechSynthesisUtterance(text);
  
    try {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessibility="));
  
      if (cookie) {
        const value = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
        if (value?.type === "vi") {
          const { voice, pitch, rate, volume } = value.data;
  
          // Get matching voice if available
          const voices = synth.getVoices();
          const matchedVoice = voices.find((v) => v.name === voice);
          if (matchedVoice) utterance.voice = matchedVoice;
  
          if (pitch !== undefined) utterance.pitch = parseFloat(pitch);
          if (rate !== undefined) utterance.rate = parseFloat(rate);
          if (volume !== undefined) utterance.volume = parseFloat(volume);
        }
      }
    } catch (err) {
      console.error("Error applying accessibility settings:", err);
    }
  
    synth.speak(utterance);
  }