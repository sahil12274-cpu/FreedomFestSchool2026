import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, X, ChevronRight, ChevronLeft, Quote, Sparkles, FileText, Minimize2 } from 'lucide-react';
import { speakNarration, pauseSpeech, resumeSpeech, stopSpeech, playSoundEffect } from '../utils/audioSynthesizer';

export default function EventDrawer({ activeNode, activeSubNode, onClose, onNavigateNext, onNavigatePrev }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [replayAnimKey, setReplayAnimKey] = useState(0);

  const currentContent = activeSubNode || activeNode;
  const animType = currentContent?.animationType || activeNode?.subNodes?.[0]?.animationType || 'flag_unfurling';

  useEffect(() => {
    stopSpeech();
    setIsPlayingAudio(false);
    setShowTranscript(false);
    setReplayAnimKey(prev => prev + 1);

    return () => {
      stopSpeech();
    };
  }, [activeNode?.id, activeSubNode?.id]);

  if (!activeNode && !activeSubNode) return null;

  const handleToggleAudio = () => {
    playSoundEffect('click');
    if (isPlayingAudio) {
      pauseSpeech();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToSpeak = currentContent?.narrationText || activeNode?.summary || "";
      speakNarration(
        textToSpeak,
        () => setIsPlayingAudio(false),
        null
      );
    }
  };

  const handleReplayAnim = () => {
    playSoundEffect('click');
    setReplayAnimKey(prev => prev + 1);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed inset-0 z-[99999] w-screen h-screen bg-[#FDFBF7] flex flex-col overflow-hidden select-none shadow-2xl"
      >
        {/* Full-Screen Top Header Bar */}
        <div className="bg-[#000080] text-white px-8 py-4 flex items-center justify-between shadow-2xl z-20 border-b-4 border-[#FF9933]">
          <div className="flex items-center space-x-4">
            <span className="px-4 py-1.5 bg-[#FF9933] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md">
              {activeNode?.era || currentContent?.year}
            </span>
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                {activeNode?.name} {activeSubNode ? `— ${activeSubNode.name}` : ''}
              </h2>
              <p className="text-xs text-amber-200">Freedom Fest 2026 Full-Screen Kiosk View</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => { playSoundEffect('click'); onNavigatePrev(); }}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20"
              title="Previous Event"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            <button
              onClick={() => { playSoundEffect('click'); onNavigateNext(); }}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20"
              title="Next Event"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => { playSoundEffect('click'); onClose(); }}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#FF9933] hover:bg-[#D97706] text-white text-xs font-extrabold transition-all shadow-xl ml-3"
              title="Close Panel and Return to Map"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Back to Map</span>
            </button>
          </div>
        </div>

        {/* Full-Screen Main Split Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative z-10">
          
          {/* LEFT PANEL: Media Canvas (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-stone-950 via-slate-900 to-indigo-950 p-8 flex flex-col justify-between relative overflow-hidden text-white border-r border-stone-800">
            
            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-extrabold text-[#FF9933] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF9933]" /> Event Vector Media Canvas
              </span>
              <button
                onClick={handleReplayAnim}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold backdrop-blur-md border border-white/20 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Replay Animation</span>
              </button>
            </div>

            {/* VECTOR ANIMATION CANVAS */}
            <div key={replayAnimKey} className="flex-1 flex items-center justify-center my-6 relative">
              
              {/* Flag Unfurling (Stuttgart) */}
              {animType === 'flag_unfurling' && (
                <motion.div
                  initial={{ scale: 0.7, opacity: 0, rotate: -5 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="w-full max-w-md aspect-[4/3] rounded-3xl p-6 bg-black/50 border-2 border-amber-500/40 flex flex-col shadow-2xl relative animate-flag-wave overflow-hidden"
                >
                  <div className="h-1/3 bg-[#008000] flex items-center justify-around px-2 border-b-2 border-amber-400/40">
                    {[...Array(8)].map((_, i) => (
                      <span key={i} className="text-2xl text-amber-200" title="Lotus">🪷</span>
                    ))}
                  </div>
                  <div className="h-1/3 bg-[#FF9933] flex items-center justify-center border-b-2 border-amber-400/40">
                    <span className="text-white font-extrabold text-2xl sm:text-3xl tracking-widest font-heading drop-shadow-md">
                      वन्दे मातरम्
                    </span>
                  </div>
                  <div className="h-1/3 bg-[#D32F2F] flex items-center justify-between px-8">
                    <span className="text-amber-300 text-3xl">☀️</span>
                    <span className="text-amber-300 text-3xl">🌙</span>
                  </div>
                </motion.div>
              )}

              {/* Plague Ward (Bombay 1896) */}
              {animType === 'plague_ward' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="w-full max-w-md p-8 bg-emerald-950/80 rounded-3xl border-2 border-emerald-500/40 text-center flex flex-col items-center justify-center space-y-5 shadow-2xl"
                >
                  <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-5xl animate-pulse">
                    🏥
                  </div>
                  <h4 className="font-heading font-bold text-emerald-300 text-lg">Grant Medical College Epidemic Ward</h4>
                  <div className="w-full h-1.5 bg-emerald-900 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-emerald-400 animate-pulse"></div>
                  </div>
                  <p className="text-xs text-emerald-200/80 italic">Fearless Plague Care & Medical Sacrifice (1896)</p>
                </motion.div>
              )}

              {/* Grandfather Clock Smuggling (Paris 1909) */}
              {animType === 'clock_smuggling' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="w-full max-w-md p-8 bg-amber-950/80 rounded-3xl border-2 border-amber-500/40 text-center flex flex-col items-center justify-center space-y-4 shadow-2xl"
                >
                  <div className="text-6xl animate-bounce">🕰️</div>
                  <div className="p-4 bg-amber-900/70 rounded-2xl border border-amber-400/40 text-amber-200 text-xs flex items-center justify-center gap-3">
                    <span>⚙️ Secret Compartment Opened</span>
                    <span>📜 Bande Mataram Papers & Arms</span>
                  </div>
                  <p className="text-xs text-amber-300/80">Paris to Pondicherry Smuggling Route</p>
                </motion.div>
              )}

              {/* Marseille Rescue (Marseille 1910) */}
              {animType === 'marseille_rescue' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="w-full max-w-md p-8 bg-blue-950/80 rounded-3xl border-2 border-blue-400/40 text-center flex flex-col items-center justify-center space-y-5 shadow-2xl"
                >
                  <div className="text-6xl">⚓</div>
                  <div className="px-5 py-3 bg-blue-900/70 rounded-2xl border border-blue-400/40 text-blue-200 text-xs font-semibold">
                    Veer Savarkar Asylum Campaign (Marseille Harbor)
                  </div>
                </motion.div>
              )}

              {/* Default General Canvas */}
              {(animType === 'london_parliament' || animType === 'school_pupil' || animType === 'ship_departure') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full max-w-md p-8 bg-slate-800/80 rounded-3xl border-2 border-amber-500/30 text-center flex flex-col items-center justify-center space-y-4 shadow-2xl"
                >
                  <div className="text-6xl">🏛️</div>
                  <h4 className="font-heading font-bold text-amber-300 text-lg">{currentContent?.name}</h4>
                  <p className="text-xs text-slate-300">{currentContent?.shortDesc}</p>
                </motion.div>
              )}

            </div>

            <div className="text-center text-xs text-stone-400 border-t border-white/10 pt-3">
              Freedom Fest 2026 • Full-Screen Kiosk View
            </div>
          </div>

          {/* RIGHT PANEL: Audio & Historic Narrative (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between overflow-y-auto bg-[#FDFBF7]">
            
            <div className="space-y-6 max-w-3xl mx-auto w-full">
              
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#138808]/15 text-[#138808] border border-[#138808]/40">
                  {currentContent?.type || activeNode?.country}
                </span>
                <span className="text-xs font-semibold text-stone-500">
                  Location Node: <strong className="text-[#000080]">{activeNode?.name}</strong>
                </span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold font-heading text-stone-900 leading-tight">
                {currentContent?.name || activeNode?.name}
              </h3>

              {/* AUDIO NARRATION PLAYER BAR */}
              <div className="p-5 bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-emerald-500/15 rounded-3xl border-2 border-[#FF9933]/50 shadow-md flex items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleToggleAudio}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold transition-all shadow-xl ${
                      isPlayingAudio ? 'bg-red-600 animate-pulse' : 'bg-[#FF9933] hover:bg-[#D97706]'
                    }`}
                    title={isPlayingAudio ? "Pause Narration" : "Play Voiceover Narration"}
                  >
                    {isPlayingAudio ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                  </button>
                  <div>
                    <div className="text-xs font-extrabold text-[#000080] uppercase tracking-wider flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-[#FF9933]" /> Voiceover Narration
                    </div>
                    <div className="text-xs text-stone-700 font-semibold mt-1">
                      {isPlayingAudio ? "Playing Voiceover Speech..." : "Touch Play to Listen to Historical Voiceover"}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => { playSoundEffect('click'); setShowTranscript(!showTranscript); }}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-stone-300 rounded-2xl text-xs font-bold text-stone-800 hover:bg-stone-50 shadow-sm"
                >
                  <FileText className="w-4 h-4 text-[#000080]" />
                  <span>{showTranscript ? "Hide Transcript" : "Transcript"}</span>
                </button>
              </div>

              {showTranscript && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-5 bg-stone-100 rounded-2xl border border-stone-300 text-xs sm:text-sm text-stone-800 leading-relaxed italic"
                >
                  <strong>Voiceover Transcript:</strong> "{currentContent?.narrationText || activeNode?.narrationText}"
                </motion.div>
              )}

              {currentContent?.quote && (
                <div className="parchment-card-gold p-6 rounded-3xl relative my-4">
                  <Quote className="w-10 h-10 text-[#FF9933]/40 absolute top-4 left-4 -scale-x-100 pointer-events-none" />
                  <p className="text-stone-900 font-serif italic text-base sm:text-lg leading-relaxed pl-8 relative z-10">
                    "{currentContent.quote}"
                  </p>
                  <div className="text-right text-xs font-bold text-[#D97706] mt-3 font-heading">
                    — Madam Bhikaji Cama
                  </div>
                </div>
              )}

              <div className="prose prose-stone max-w-none text-stone-800 text-base sm:text-lg leading-relaxed pt-2">
                <p>{currentContent?.fullWriteup || activeNode?.fullWriteup || activeNode?.summary}</p>
              </div>

            </div>

            <div className="pt-8 border-t border-stone-300 mt-8 flex items-center justify-between max-w-3xl mx-auto w-full">
              <button
                onClick={() => { playSoundEffect('click'); onNavigatePrev(); }}
                className="flex items-center space-x-2 text-xs font-extrabold text-[#000080] hover:text-[#FF9933] transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Event</span>
              </button>
              <button
                onClick={() => { playSoundEffect('click'); onNavigateNext(); }}
                className="flex items-center space-x-2 text-xs font-extrabold text-[#000080] hover:text-[#FF9933] transition-all"
              >
                <span>Next Event</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
