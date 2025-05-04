const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.SpeechSynthesisUtterance = function (text) {
    this.text = text;
    this.pitch = 1;
    this.rate = 1;
    this.volume = 1;
  };
  global.speechSynthesis = {
    speak: jest.fn(),
    cancel: jest.fn(),
  };