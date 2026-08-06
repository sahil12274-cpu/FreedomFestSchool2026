import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Play, X, ChevronRight } from 'lucide-react';
import { playSoundEffect } from '../utils/audioSynthesizer';

export default function AttractMode({ globalNodes, onExitAttractMode, onSelectNodeFromAttract }) {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % globalNodes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [globalNodes.length]);

  const currentSlide = globalNodes[slideIndex];

  const handleStartInteractive = () => {
    playSoundEffect('click');
    onSelectNodeFromAttract(currentSlide);
    onExitAttractMode();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl text-white flex flex-col justify-between p-6 sm:p-12 overflow-hidden cursor-pointer"
      onClick={handleStartInteractive}
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#FF9933] flex items-center justify-center font-bold text-white text-xl">
            म
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-white">Freedom Fest 2026 Museum Kiosk</h3>
            <p className="text-xs text-amber-300">Automated Museum Attract Showcase</p>
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); handleStartInteractive(); }}
          className="flex items-center space-x-2 px-4 py-2 bg-[#FF9933] hover:bg-[#D97706] text-white text-xs font-bold rounded-xl shadow-lg transition-all"
        >
          <X className="w-4 h-4" />
          <span>Exit Auto Tour</span>
        </button>
      </div>

      {/* Main Slide Content */}
      <div className="max-w-4xl mx-auto text-center space-y-6 my-auto z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FF9933]/20 border border-[#FF9933]/50 text-[#FF9933] text-xs font-extrabold uppercase tracking-widest">
              <MapPin className="w-4 h-4 text-[#FF9933]" /> {currentSlide.country} • {currentSlide.era}
            </div>

            <h2 className="text-4xl sm:text-6xl font-black font-heading tracking-tight text-white">
              {currentSlide.name}
            </h2>

            <p className="text-lg sm:text-2xl font-light text-stone-200 max-w-2xl mx-auto leading-relaxed">
              "{currentSlide.summary}"
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Touch Prompt Button */}
        <div className="pt-8">
          <button
            onClick={handleStartInteractive}
            className="inline-flex items-center space-x-3 px-10 py-5 rounded-3xl bg-gradient-to-r from-[#FF9933] via-amber-500 to-[#138808] text-white font-extrabold text-lg shadow-2xl hover:scale-105 transition-all animate-pulse"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>Touch Anywhere to Explore Interactive Display</span>
          </button>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center space-x-3 z-10">
        {globalNodes.map((node, i) => (
          <div
            key={node.id}
            className={`h-2 rounded-full transition-all duration-500 ${i === slideIndex ? 'w-10 bg-[#FF9933]' : 'w-2 bg-stone-700'
              }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
