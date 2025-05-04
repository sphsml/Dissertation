export function speak(text) {
  if (!text || typeof window === "undefined") return;

  const synth = window.speechSynthesis;
  synth.cancel(); // Cancel ongoing speech

  const trySpeak = () => {
    try {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessibility="));

      if (cookie) {
        const value = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
        if (value?.type === "hi") return;
        if (value?.type === "nd") {
          if (!value?.data?.text_to_speech) {
            return;
          }
        }
        if (value?.type === "vi" || value?.type === "nd") {
          const { voice, pitch, rate, volume } = value.data || {};

          const utterance = new SpeechSynthesisUtterance(text);

          const voices = synth.getVoices();
          const matchedVoice = voices.find((v) => v.name === voice);
          if (matchedVoice) {
            utterance.voice = matchedVoice;
          } else {
            console.warn(`Voice "${voice}" not found`);
          }

          if (pitch !== undefined) utterance.pitch = parseFloat(pitch);
          if (rate !== undefined) utterance.rate = parseFloat(rate);
          if (volume !== undefined) utterance.volume = parseFloat(volume);
          console.log(utterance);
          try {
            synth.speak(utterance);
          } catch (err) {
            console.error(
              "Speech synthesis failed. attempting fallback..",
              err
            );
            const fallbackUtterance = new SpeechSynthesisUtterance(text);
            fallbackUtterance.pitch = 1;
            fallbackUtterance.rate = 1;
            fallbackUtterance.volume = 1;
            synth.speak(fallbackUtterance);
          }
        }
      }
    } catch (err) {
      console.error("Error applying accessibility settings:", err);
    }
  };
  if (synth.getVoices().length > 0) {
    trySpeak();
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      trySpeak();
    };
  }
}
