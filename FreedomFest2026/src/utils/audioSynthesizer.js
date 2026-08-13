// Web Audio & Speech Synthesis Utility for Museum Kiosk

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function pickBestVoice() {
  if (!('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const preferredPatterns = [
    /microsoft aria|microsoft jenny|google.*(female|uk english|us english)|samantha|victoria|daniel|alex/i,
    /en-us|en-gb|en-in/i,
    /english/i,
  ];

  for (const pattern of preferredPatterns) {
    const match = voices.find(voice => pattern.test(voice.name) || pattern.test(voice.lang));
    if (match) return match;
  }

  return voices.find(voice => /en/i.test(voice.lang)) || voices[0];
}

export function playSoundEffect(type) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'success') {
      // Emerald victory chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'error') {
      // Saffron alert tone
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.25);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'flag_unfurl') {
      // Fanfare sweep
      osc.type = 'sine';
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.4);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch (e) {
    console.warn('Audio synthesis error:', e);
  }
}

// Web Speech API Voiceover Engine
let currentUtterance = null;

export function speakNarration(text, onEnd, onBoundary) {
  stopSpeech();

  if (!('speechSynthesis' in window)) {
    console.warn('Web Speech API not supported in this browser.');
    if (onEnd) onEnd();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  utterance.volume = 1;

  const preferredVoice = pickBestVoice();
  if (preferredVoice) {
    utterance.voice = preferredVoice;
    utterance.lang = preferredVoice.lang;
  }

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (err) => {
    console.warn('Speech error:', err);
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  if (onBoundary) {
    utterance.onboundary = onBoundary;
  }

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function pauseSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
}

export function resumeSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}

export function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}
