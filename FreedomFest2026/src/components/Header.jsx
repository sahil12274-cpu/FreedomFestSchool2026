import React, { useState, useEffect } from 'react';
import { Map, Flag, Award, Volume2, VolumeX, Maximize, Minimize, PlayCircle, Sparkles } from 'lucide-react';
import { playSoundEffect } from '../utils/audioSynthesizer';

export default function Header({ activeTab, setActiveTab, onStartAttractMode }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    playSoundEffect('click');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen().catch(err => console.log(err));
    }
  };

  const toggleMute = () => {
    playSoundEffect('click');
    setIsAudioMuted(!isAudioMuted);
    window.isGlobalMuted = !isAudioMuted;
  };

  const navItems = [
    { id: 'map', label: 'Interactive Story Map', icon: Map },
    { id: 'flag', label: '1907 Flag Gallery', icon: Flag },
    { id: 'quiz', label: 'Freedom Fest Quiz', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-[9999] bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#FF9933]/30 shadow-sm">
      {/* Tricolor Accent Stripe */}
      <div className="h-1.5 w-full grid grid-cols-3">
        <div className="bg-[#FF9933]"></div>
        <div className="bg-white border-y border-gray-100"></div>
        <div className="bg-[#138808]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Kiosk Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { playSoundEffect('click'); setActiveTab('map'); }}>
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#000080] via-[#FF9933] to-[#138808] p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#FDFBF7] rounded-full flex items-center justify-center">
              <span className="text-[#000080] font-black text-xl tracking-tighter font-heading">म</span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold font-heading text-gray-900 tracking-tight">
                Madam Bhikaji Cama
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FF9933]/15 text-[#D97706] border border-[#FF9933]/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FF9933]" /> Freedom Fest 2026
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Mother of the Indian Revolution (1861–1936) • Interactive Kiosk
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-stone-200/60 p-1 rounded-2xl border border-stone-300/60 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playSoundEffect('click');
                  setActiveTab(item.id);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-[#FF9933] text-white shadow-md transform scale-[1.02]'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#000080]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Kiosk Controls */}
        <div className="flex items-center space-x-2">
          {/* Attract Mode / Auto Tour */}
          <button
            onClick={() => {
              playSoundEffect('click');
              if (onStartAttractMode) onStartAttractMode();
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#138808]/10 text-[#138808] hover:bg-[#138808]/20 border border-[#138808]/30 transition-all"
            title="Start Museum Auto-Tour"
          >
            <PlayCircle className="w-4 h-4 text-[#138808]" />
            <span className="hidden sm:inline">Auto Tour</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl text-stone-700 hover:bg-stone-200/70 border border-stone-300 transition-all"
            title={isAudioMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4 text-[#000080]" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-stone-700 hover:bg-stone-200/70 border border-stone-300 transition-all"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-[#000080]" /> : <Maximize className="w-4 h-4 text-[#000080]" />}
          </button>
        </div>

      </div>
    </header>
  );
}
