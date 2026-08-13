import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flag, Sparkles, Volume2, Info, CheckCircle2, ShieldCheck, Sun, Moon } from 'lucide-react';
import { playSoundEffect } from '../utils/audioSynthesizer';

export default function FlagGallery({ flagInfo }) {
  const [selectedStripe, setSelectedStripe] = useState(0);

  const handleSelectStripe = (index) => {
    playSoundEffect('click');
    setSelectedStripe(index);
  };

  const handlePlayFanfare = () => {
    playSoundEffect('flag_unfurl');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 py-2 px-4 sm:px-6 overflow-y-auto h-full flex flex-col min-h-0 pb-[10px]">
      
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FF9933]/15 border border-[#FF9933]/40 text-[#D97706] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#FF9933]" /> Historic National Symbol
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-stone-900 tracking-tight">
          The 1907 Vande Mataram Flag
        </h2>
        <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto">
          First unfurled on international soil in Stuttgart, Germany on August 22, 1907 by Madam Bhikaji Cama, consecrated as the precursor to India's National Flag.
        </p>
      </div>

      {/* Flag Display & Interactive Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: Animated Vector Flag (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-xl aspect-[16/10] bg-stone-900 p-6 rounded-3xl border-4 border-[#FF9933]/40 shadow-2xl relative overflow-hidden flex flex-col justify-between animate-flag-wave cursor-pointer"
            onClick={handlePlayFanfare}
            title="Click to play Flag Fanfare sound!"
          >
            {/* Stripe 1: Green Top */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={(e) => { e.stopPropagation(); handleSelectStripe(0); }}
              className={`h-1/3 bg-[#008000] flex items-center justify-around px-4 rounded-t-xl transition-all border-b-2 border-amber-300/40 cursor-pointer ${
                selectedStripe === 0 ? 'ring-4 ring-white shadow-xl scale-[1.01]' : 'opacity-90'
              }`}
            >
              {[...Array(8)].map((_, i) => (
                <span key={i} className="text-xl sm:text-2xl drop-shadow-md text-amber-200" title="Lotus">🪷</span>
              ))}
            </motion.div>

            {/* Stripe 2: Saffron Center */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={(e) => { e.stopPropagation(); handleSelectStripe(1); }}
              className={`h-1/3 bg-[#FF9933] flex items-center justify-center transition-all border-b-2 border-amber-300/40 cursor-pointer ${
                selectedStripe === 1 ? 'ring-4 ring-white shadow-xl scale-[1.01]' : 'opacity-90'
              }`}
            >
              <span className="text-white font-extrabold text-2xl sm:text-3xl tracking-widest font-heading drop-shadow-lg">
                वन्दे मातरम्
              </span>
            </motion.div>

            {/* Stripe 3: Red Bottom */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={(e) => { e.stopPropagation(); handleSelectStripe(2); }}
              className={`h-1/3 bg-[#D32F2F] flex items-center justify-between px-10 rounded-b-xl transition-all cursor-pointer ${
                selectedStripe === 2 ? 'ring-4 ring-white shadow-xl scale-[1.01]' : 'opacity-90'
              }`}
            >
              <span className="text-amber-300 text-3xl sm:text-4xl drop-shadow-md">☀️</span>
              <span className="text-amber-300 text-3xl sm:text-4xl drop-shadow-md">🌙</span>
            </motion.div>
          </motion.div>

          {/* Interactive Hint */}
          <button
            onClick={handlePlayFanfare}
            className="mt-4 flex items-center space-x-2 px-4 py-2 bg-[#FF9933] text-white rounded-2xl font-bold text-xs shadow-md hover:bg-[#D97706] transition-all"
          >
            <Volume2 className="w-4 h-4" />
            <span>Play Flag Fanfare Sound</span>
          </button>
        </div>

        {/* RIGHT COLUMN: Stripe Breakdown Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-heading text-lg font-bold text-[#000080] flex items-center gap-2">
            <Info className="w-5 h-5 text-[#FF9933]" /> Touch a stripe to explore symbolism:
          </h3>

          {flagInfo.stripes.map((stripe, index) => {
            const isSelected = selectedStripe === index;
            return (
              <motion.div
                key={index}
                onClick={() => handleSelectStripe(index)}
                whileHover={{ scale: 1.02 }}
                className={`p-5 rounded-2xl cursor-pointer transition-all border-2 ${
                  isSelected
                    ? 'bg-white border-[#FF9933] shadow-xl ring-2 ring-[#FF9933]/30'
                    : 'bg-white/70 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span
                      className="w-5 h-5 rounded-full border border-stone-300 shadow-sm"
                      style={{ backgroundColor: stripe.hex }}
                    ></span>
                    <h4 className="font-heading font-bold text-base text-stone-900">{stripe.color} Stripe</h4>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-[#138808]" />}
                </div>

                <div className="text-xs font-bold text-[#D97706] mb-1 font-heading">
                  Symbol: {stripe.symbol}
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {stripe.meaning}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Historic Context Banner */}
      <div className="parchment-card p-6 sm:p-8 rounded-3xl border border-[#FF9933]/30 shadow-lg space-y-4 mb-8">
        <div className="flex items-center space-x-3 text-[#000080]">
          <ShieldCheck className="w-6 h-6 text-[#FF9933]" />
          <h4 className="font-heading text-lg font-bold">Historical Legacy & Consecration</h4>
        </div>
        <p className="text-sm text-stone-800 leading-relaxed">
          Designed by Madam Bhikaji Cama, Shyamji Krishna Varma, and fellow patriots in Paris, this flag was smuggled into Germany and raised at Stuttgart in 1907. Later brought back secretly to India by Indulal Yagnik, it is preserved today at the Maratha Mandir museum in Pune. Its tricolor layout directly inspired the 1921 Swaraj flag and the modern Tricolor of Independent India.
        </p>
      </div>

    </div>
  );
}
