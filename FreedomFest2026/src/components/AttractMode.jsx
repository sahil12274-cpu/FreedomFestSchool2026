import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Play, Pause, X, ChevronRight, ChevronLeft, Volume2, VolumeX } from 'lucide-react';
import { playSoundEffect, speakNarration, stopSpeech } from '../utils/audioSynthesizer';

export default function AttractMode({ globalNodes, onExitAttractMode, onSelectNodeFromAttract }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const timerRef = useRef(null);
  const currentSlide = globalNodes[slideIndex];

  // Clear active timers helper
  const clearActiveTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Slide transition & audio narration controller
  useEffect(() => {
    clearActiveTimer();
    stopSpeech();

    if (!isPlaying) return;

    let isEffectActive = true;

    if (isAudioEnabled && currentSlide) {
      const textToSpeak = currentSlide.narrationText || currentSlide.summary;

      // Trigger voiceover narration
      speakNarration(
        textToSpeak,
        () => {
          if (!isEffectActive) return;
          stopSpeech();
          clearActiveTimer();
          // Smooth transition 1.5s after narration completes
          timerRef.current = setTimeout(() => {
            if (isEffectActive) {
              setSlideIndex(prev => (prev + 1) % globalNodes.length);
            }
          }, 1500);
        },
        null
      );

      // Fallback timer if speech synthesis takes longer or stalls
      timerRef.current = setTimeout(() => {
        if (!isEffectActive) return;
        stopSpeech();
        setSlideIndex(prev => (prev + 1) % globalNodes.length);
      }, 15000);

    } else {
      // Muted audio: fixed comfortable 10-second slide timer
      timerRef.current = setTimeout(() => {
        if (!isEffectActive) return;
        setSlideIndex(prev => (prev + 1) % globalNodes.length);
      }, 10000);
    }

    return () => {
      isEffectActive = false;
      clearActiveTimer();
      stopSpeech();
    };
  }, [slideIndex, isPlaying, isAudioEnabled, globalNodes.length]);

  const handleExit = (nodeToSelect = null) => {
    clearActiveTimer();
    stopSpeech();
    playSoundEffect('click');
    if (nodeToSelect) {
      onSelectNodeFromAttract(nodeToSelect);
    }
    onExitAttractMode();
  };

  const handlePrevSlide = (e) => {
    e.stopPropagation();
    playSoundEffect('click');
    clearActiveTimer();
    stopSpeech();
    setSlideIndex(prev => (prev - 1 + globalNodes.length) % globalNodes.length);
  };

  const handleNextSlide = (e) => {
    e.stopPropagation();
    playSoundEffect('click');
    clearActiveTimer();
    stopSpeech();
    setSlideIndex(prev => (prev + 1) % globalNodes.length);
  };

  const handleTogglePlay = (e) => {
    e.stopPropagation();
    playSoundEffect('click');
    if (isPlaying) {
      clearActiveTimer();
      stopSpeech();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleToggleAudio = (e) => {
    e.stopPropagation();
    playSoundEffect('click');
    if (isAudioEnabled) {
      stopSpeech();
      setIsAudioEnabled(false);
    } else {
      setIsAudioEnabled(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100000] bg-slate-950/95 backdrop-blur-xl text-white flex flex-col justify-between p-6 sm:p-10 overflow-hidden select-none"
      onClick={() => handleExit(currentSlide)}
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#000080] via-[#FF9933] to-[#138808] p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <span className="text-[#FF9933] font-black text-xl font-heading">म</span>
            </div>
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              Freedom Fest 2026 Kiosk
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FF9933]/20 text-[#FF9933] border border-[#FF9933]/40">
                AUTOPLAY MODE
              </span>
            </h3>
            <p className="text-xs text-amber-300">Automated Museum Attract Showcase & Heritage Tour</p>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center space-x-3" onClick={e => e.stopPropagation()}>
          {/* Audio Toggle */}
          <button
            onClick={handleToggleAudio}
            className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isAudioEnabled
                ? 'bg-[#138808]/20 border-[#138808]/50 text-emerald-400 hover:bg-[#138808]/30'
                : 'bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-700'
            }`}
            title={isAudioEnabled ? "Mute Autoplay Voiceover" : "Enable Autoplay Voiceover"}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            <span className="hidden sm:inline">{isAudioEnabled ? "Voice On" : "Voice Off"}</span>
          </button>

          {/* Exit Button */}
          <button
            onClick={(e) => { e.stopPropagation(); handleExit(null); }}
            className="flex items-center space-x-2 px-4 py-2 bg-[#FF9933] hover:bg-[#D97706] text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Exit Auto Tour</span>
          </button>
        </div>
      </div>

      {/* Main Slide Content & Nav Controls */}
      <div className="relative max-w-4xl mx-auto w-full text-center space-y-6 my-auto z-10 flex items-center justify-between">
        
        {/* Previous Button */}
        <button
          onClick={handlePrevSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all shadow-xl hover:scale-110 shrink-0 mr-2 cursor-pointer"
          title="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Slide Inner Box */}
        <div className="flex-1 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ scale: 0.85, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.05, opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FF9933]/20 border border-[#FF9933]/50 text-[#FF9933] text-xs font-extrabold uppercase tracking-widest">
                <MapPin className="w-4 h-4 text-[#FF9933]" /> {currentSlide.country} • {currentSlide.era}
              </div>

              <h2 className="text-4xl sm:text-6xl font-black font-heading tracking-tight text-white">
                {currentSlide.name}
              </h2>

              <p className="text-lg sm:text-2xl font-light text-stone-200 max-w-2xl mx-auto leading-relaxed italic">
                "{currentSlide.summary}"
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Touch Prompt Button */}
          <div className="pt-8" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => handleExit(currentSlide)}
              className="inline-flex items-center space-x-3 px-8 py-4 sm:px-10 sm:py-5 rounded-3xl bg-gradient-to-r from-[#FF9933] via-amber-500 to-[#138808] text-white font-extrabold text-base sm:text-lg shadow-2xl hover:scale-105 transition-all animate-pulse cursor-pointer"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>Touch to Explore Interactive Event Map</span>
            </button>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNextSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all shadow-xl hover:scale-110 shrink-0 ml-2 cursor-pointer"
          title="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Slide Indicators & Play/Pause Bar */}
      <div className="flex flex-col items-center space-y-4 z-10" onClick={e => e.stopPropagation()}>
        <div className="flex items-center space-x-3 bg-stone-900/80 backdrop-blur-md px-5 py-2 rounded-2xl border border-stone-800">
          
          <button
            onClick={handleTogglePlay}
            className="p-1.5 rounded-lg text-amber-400 hover:text-amber-300 transition-all cursor-pointer"
            title={isPlaying ? "Pause Autoplay" : "Play Autoplay"}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
          </button>

          <div className="h-4 w-px bg-stone-700 mx-1"></div>

          <div className="flex space-x-2 items-center">
            {globalNodes.map((node, i) => (
              <button
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  playSoundEffect('click');
                  clearActiveTimer();
                  stopSpeech();
                  setSlideIndex(i);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === slideIndex ? 'w-8 bg-[#FF9933]' : 'w-2.5 bg-stone-700 hover:bg-stone-500'
                }`}
                title={`Go to ${node.name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
