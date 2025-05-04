const { speak } = require("../utils/speak");

describe("speak()", () => {
  global.SpeechSynthesisUtterance = function () {};
  global.speechSynthesis = {
    speak: jest.fn(),
    getVoices: () => [{ name: "TestVoice" }],
  };
  let mockSpeak, mockCancel;

  beforeAll(() => {
    global.speechSynthesis = {
      speak: jest.fn(),
      cancel: jest.fn(),
      getVoices: jest.fn().mockReturnValue([{ name: "Test Voice" }]),
    };
  });

  beforeEach(() => {
    mockSpeak = jest.fn();
    mockCancel = jest.fn();
    global.window.speechSynthesis = {
      speak: mockSpeak,
      cancel: mockCancel,
      getVoices: () => [{ name: "Test Voice" }],
      onvoiceschanged: null,
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
    document.cookie = "";
  });

  it("should do nothing if no text is provided", () => {
    speak("");
    expect(mockSpeak).not.toHaveBeenCalled();
  });

  it("should cancel previous speech", () => {
    document.cookie =
      "accessibility=" +
      encodeURIComponent(
        JSON.stringify({
          type: "vi",
          data: { pitch: 1, rate: 1, volume: 1 },
        })
      );
    speak("Hello world");
    expect(mockCancel).toHaveBeenCalled();
  });

  it('should not speak if type is "hi"', () => {
    document.cookie =
      "accessibility=" + encodeURIComponent(JSON.stringify({ type: "hi" }));
    speak("Hello");
    expect(mockSpeak).not.toHaveBeenCalled();
  });

  it("should not speak if nd and text_to_speech is false", () => {
    document.cookie =
      "accessibility=" +
      encodeURIComponent(
        JSON.stringify({
          type: "nd",
          data: { text_to_speech: false },
        })
      );
    speak("Hello");
    expect(mockSpeak).not.toHaveBeenCalled();
  });

  it('should speak if type is "vi" and all settings are defined', () => {
    document.cookie =
      "accessibility=" +
      encodeURIComponent(
        JSON.stringify({
          type: "vi",
          data: { pitch: 1.2, rate: 0.8, volume: 0.5 },
        })
      );
    speak("Testing");
    expect(mockSpeak).toHaveBeenCalled();
  });
});
