import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  isMagicMode: boolean;
  setIsMagicMode: (v: boolean) => void;
  isMuted: boolean;
  setIsMuted: (v: boolean) => void;
  playPop: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeSection, 
  isMagicMode, 
  setIsMagicMode, 
  isMuted, 
  setIsMuted,
  playPop
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Acasă', id: 'hero', color: 'text-pink-500', shadow: 'bg-pink-400/10' },
    { name: 'Despre', id: 'about', color: 'text-purple-500', shadow: 'bg-purple-400/10' },
    { name: 'Cursuri', id: 'courses', color: 'text-blue-500', shadow: 'bg-blue-400/10' },
    { name: 'Profesori', id: 'teachers', color: 'text-yellow-500', shadow: 'bg-yellow-400/10' },
    { name: 'Galerie', id: 'gallery', color: 'text-green-500', shadow: 'bg-green-400/10' },
    { name: 'Prețuri', id: 'pricing', color: 'text-orange-500', shadow: 'bg-orange-400/10' },
    { name: 'Înscriere', id: 'enroll', color: 'text-indigo-500', shadow: 'bg-indigo-400/10' },
    { name: 'Contact', id: 'contact', color: 'text-red-500', shadow: 'bg-red-400/10' },
  ];

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
    playPop();
  };

  const Logo = () => (
    <div className="flex items-center gap-2 cursor-pointer group">
      <div className="relative w-10 h-10 flex items-center justify-center bg-gray-900 rounded-xl overflow-hidden shadow-xl transform group-hover:rotate-12 transition-transform duration-300">
        <span className="text-white font-black text-xl italic leading-none">V</span>
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/40 to-pink-500/40"></div>
      </div>
      <div className="flex flex-col leading-none">
        <span className={`text-xl font-black tracking-tight ${isMagicMode || isOpen ? 'text-white' : 'text-gray-900'}`}>VoiceUp</span>
        <span className="text-[8px] font-black text-purple-500 tracking-[0.25em] uppercase">School of Arts</span>
      </div>
    </div>
  );

  return (
    <header className="fixed top-4 left-4 right-4 z-[100]">
      <nav className={`max-w-6xl mx-auto flex items-center justify-between px-5 py-3 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.08)] border transition-all duration-700 ${isMagicMode ? 'bg-indigo-950/90 border-indigo-400/20 backdrop-blur-xl' : 'bg-white/95 border-white backdrop-blur-md'}`}>
        <div onClick={() => scrollTo('hero')}>
          <Logo />
        </div>

        {/* Desktop Navigation - Kept larger text size as requested for the menu */}
        <div className="hidden lg:flex items-center gap-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              onMouseEnter={playPop}
              className={`px-4 py-2.5 rounded-full text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                activeSection === item.id 
                ? 'bg-purple-600 text-white shadow-lg' 
                : isMagicMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setIsMuted(!isMuted); playPop(); }}
            className={`p-3 rounded-full transition-all ${isMagicMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-500'}`}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          <button 
            onClick={() => { setIsMagicMode(!isMagicMode); playPop(); }}
            className={`p-3 rounded-full transition-all flex items-center gap-2 ${isMagicMode ? 'bg-yellow-400 text-indigo-950 shadow-lg' : 'bg-indigo-950 text-white shadow-md'}`}
          >
            {isMagicMode ? <Sun size={20} className="animate-spin-slow" /> : <Moon size={20} />}
          </button>

          <button 
            className={`lg:hidden p-3 rounded-xl transition-all ${isOpen ? 'bg-pink-500 text-white' : isMagicMode ? 'bg-white/10 text-white' : 'bg-purple-50 text-purple-600'}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* High-End Mobile Menu with Vibrant Bold Typography */}
      {isOpen && (
        <div className={`fixed inset-0 z-[110] lg:hidden flex flex-col ${isMagicMode ? 'bg-[#060111]' : 'bg-[#fffdfd]'}`}>
           {/* Dynamic Background */}
           <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
              <div className="absolute top-[10%] left-[-10%] w-[120%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse"></div>
              <div className="absolute bottom-[10%] right-[-10%] w-[120%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
           </div>

           {/* Top Bar */}
           <div className="flex items-center justify-between p-6 relative z-10">
              <Logo />
              <button 
                className={`p-4 rounded-2xl shadow-xl transition-all active:scale-75 ${isMagicMode ? 'bg-white/10 text-white' : 'bg-white text-gray-900 border border-purple-50'}`}
                onClick={() => setIsOpen(false)}
              >
                <X size={28} />
              </button>
           </div>

           {/* Balanced Grid - Legible Bold Text */}
           <div className="flex-grow flex items-center justify-center px-6 relative z-10">
              <div className="grid grid-cols-2 gap-x-8 gap-y-12 w-full max-w-sm">
                {menuItems.map((item, idx) => {
                  const firstLetter = item.name.charAt(0);
                  const restOfName = item.name.slice(1);
                  const isActive = activeSection === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollTo(item.id)}
                      className="relative flex flex-col items-center justify-center group touch-manipulation hover-rubber animate-rebound opacity-0"
                      style={{ animationDelay: `${idx * 0.08}s` }}
                    >
                      {/* Active Indicator Glow */}
                      <div className={`absolute inset-[-15px] rounded-full blur-2xl opacity-0 transition-opacity duration-300 group-active:opacity-100 ${item.shadow}`}></div>

                      {/* Professional Typographic Layout - No overlap */}
                      <div className="flex items-center justify-center relative z-10">
                        <span className={`text-6xl font-[900] leading-none ${item.color} ${isMagicMode ? 'text-glow' : 'drop-shadow-sm'}`}>
                          {firstLetter}
                        </span>
                        
                        <span className={`text-2xl font-[900] ml-1 tracking-tight transition-colors duration-500 ${isActive ? 'text-purple-600' : isMagicMode ? 'text-white' : 'text-gray-900'}`}>
                          {restOfName}
                        </span>
                        
                        {isActive && (
                          <div className="absolute -top-4 -right-3 text-yellow-400 animate-bounce">
                            <Sparkles size={16} />
                          </div>
                        )}
                      </div>
                      
                      <div className={`h-2 rounded-full mt-2 transition-all duration-500 ${isActive ? `w-12 ${item.color.replace('text', 'bg')}` : 'w-0 opacity-0'}`}></div>
                    </button>
                  );
                })}
              </div>
           </div>

           {/* Minimal Menu Footer */}
           <div className="p-10 text-center relative z-10 mt-auto">
              <div className="inline-block px-10 py-4 rounded-full border border-purple-100/30 bg-purple-500/5 backdrop-blur-md">
                <span className="text-purple-600 font-[900] text-[12px] uppercase tracking-[0.5em] opacity-60">
                  VoiceUp &bull; Explore Art
                </span>
              </div>
           </div>
        </div>
      )}
    </header>
  );
}

export default Header;