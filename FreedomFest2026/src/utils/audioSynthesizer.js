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

// Web Speech API Voiceover Engine - Single Voice Lock
let currentUtterance = null;
let selectedSingleFemaleVoice = null;

// Helper to select and lock a single high-quality female voice
function getBestFemaleVoice() {
  if (selectedSingleFemaleVoice) return selectedSingleFemaleVoice;
  if (!('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const englishVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
  const candidatePool = englishVoices.length > 0 ? englishVoices : voices;

  const femaleKeywords = ['female', 'zira', 'heera', 'samantha', 'veena', 'victoria', 'karen', 'fiona', 'hazel', 'moira', 'susan', 'ava', 'aria', 'jenny'];
  const qualityKeywords = ['natural', 'neural', 'google', 'premium', 'enhanced', 'online'];

  // Priority 1: High Quality + Female
  let chosen = candidatePool.find(v => {
    const nameLower = v.name.toLowerCase();
    const isFemale = femaleKeywords.some(kw => nameLower.includes(kw));
    const isQuality = qualityKeywords.some(kw => nameLower.includes(kw));
    return isFemale && isQuality;
  });

  // Priority 2: Standard Female Voice
  if (!chosen) {
    chosen = candidatePool.find(v => {
      const nameLower = v.name.toLowerCase();
      return femaleKeywords.some(kw => nameLower.includes(kw));
    });
  }

  // Priority 3: Google UK or US English Female explicit check
  if (!chosen) {
    chosen = candidatePool.find(v => v.name.includes('Google UK English Female') || v.name.includes('Google US English Female'));
  }

  // Priority 4: High Quality English voice fallback
  if (!chosen) {
    chosen = candidatePool.find(v => qualityKeywords.some(kw => v.name.toLowerCase().includes(kw)));
  }

  // Priority 5: Indian or British English voice
  if (!chosen) {
    chosen = candidatePool.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB')) || candidatePool[0];
  }

  if (chosen) {
    selectedSingleFemaleVoice = chosen;
  }
  return chosen;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    if (!selectedSingleFemaleVoice) {
      getBestFemaleVoice();
    }
  };
}

export function speakNarration(text, onEnd, onBoundary) {
  stopSpeech();

  if (!('speechSynthesis' in window)) {
    console.warn('Web Speech API not supported in this browser.');
    if (onEnd) onEnd();
    return;
  }

  // Small delay after stopSpeech/cancel to prevent Chrome immediate cancellation error
  setTimeout(() => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.90; // Slower, calm, crystal-clear museum narration pace
      utterance.pitch = 1.15; // Natural female pitch

      const femaleVoice = getBestFemaleVoice();
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      let endCalled = false;
      const safeOnEnd = () => {
        if (!endCalled) {
          endCalled = true;
          currentUtterance = null;
          if (onEnd) onEnd();
        }
      };

      utterance.onend = safeOnEnd;

      utterance.onerror = (err) => {
        currentUtterance = null;
        // Do not trigger onEnd if speech was explicitly canceled/interrupted
        if (err && (err.error === 'canceled' || err.error === 'interrupted')) {
          return;
        }
        console.warn('Speech error:', err);
        safeOnEnd();
      };

      if (onBoundary) {
        utterance.onboundary = onBoundary;
      }

      currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speak error:', e);
      if (onEnd) onEnd();
    }
  }, 60);
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
    try {
      window.speechSynthesis.cancel();
      // Ensure speech synthesis cancels queued utterances in Chrome/Windows
      setTimeout(() => {
        if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
      }, 30);
    } catch (e) {
      console.warn('Speech cancellation error:', e);
    }
    currentUtterance = null;
  }
}
