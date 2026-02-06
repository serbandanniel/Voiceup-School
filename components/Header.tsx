import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Volume2, VolumeX, Sparkles, Phone, MessageCircle, ArrowRight } from 'lucide-react';

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

  const Logo = ({ large = false }) => (
    <div className="p-2 hover:scale-105 transition-transform duration-300 cursor-pointer">
      <img 
        src="https://voiceup-festival.ro/voiceup_school_final.png" 
        alt="VoiceUp Logo" 
        className={`${large ? 'h-20 md:h-24' : 'h-12 md:h-16'} w-auto object-contain`} 
      />
    </div>
  );

  return (
    <header className="fixed top-4 left-4 right-4 z-[100]">
      <nav className={`max-w-6xl mx-auto flex items-center justify-between px-4 py-2.5 rounded-[2rem] border transition-all duration-500 hover:shadow-[0_20px_40px_rgba(139,92,246,0.15)] hover:scale-[1.005] hover:border-purple-200 ${isMagicMode ? 'bg-indigo-950/90 border-indigo-400/20 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.2)]' : 'bg-white/95 border-white backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.08)]'}`}>
        <div onClick={() => scrollTo('hero')}>
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              onMouseEnter={playPop}
              className={`px-3 xl:px-4 py-2.5 rounded-full text-xs xl:text-sm font-black uppercase tracking-wider transition-all duration-300 ${
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
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={() => { setIsMuted(!isMuted); playPop(); }}
            className={`p-2.5 md:p-3 rounded-full transition-all ${isMagicMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-500'}`}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          
          <button 
            onClick={() => { setIsMagicMode(!isMagicMode); playPop(); }}
            className={`p-2.5 md:p-3 rounded-full transition-all flex items-center gap-2 ${isMagicMode ? 'bg-yellow-400 text-indigo-950 shadow-lg' : 'bg-indigo-950 text-white shadow-md'}`}
          >
            {isMagicMode ? <Sun size={18} className="animate-spin-slow" /> : <Moon size={18} />}
          </button>

          <button 
            className={`lg:hidden p-2.5 rounded-xl transition-all ${isOpen ? 'bg-pink-500 text-white' : isMagicMode ? 'bg-white/10 text-white' : 'bg-purple-50 text-purple-600'}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* High-End Mobile Menu */}
      {isOpen && (
        <div className={`fixed inset-0 z-[110] lg:hidden flex flex-col ${isMagicMode ? 'bg-[#060111]' : 'bg-[#fffdfd]'}`}>
           {/* Dynamic Background */}
           <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
              <div className="absolute top-[10%] left-[-10%] w-[120%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse"></div>
              <div className="absolute bottom-[10%] right-[-10%] w-[120%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
           </div>

           {/* Top Bar with LARGE LOGO */}
           <div className="flex items-center justify-between p-6 relative z-10">
              <Logo large={true} />
              <button 
                className={`p-4 rounded-2xl shadow-xl transition-all active:scale-75 ${isMagicMode ? 'bg-white/10 text-white' : 'bg-white text-gray-900 border border-purple-50'}`}
                onClick={() => setIsOpen(false)}
              >
                <X size={28} />
              </button>
           </div>

           {/* Menu Grid */}
           <div className="flex-grow flex items-center justify-center px-6 relative z-10 overflow-y-auto">
              {/* Reduced gaps and padding for compactness */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 w-full max-w-sm py-4">
                {menuItems.map((item, idx) => {
                  const firstLetter = item.name.charAt(0);
                  const restOfName = item.name.slice(1);
                  const isActive = activeSection === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollTo(item.id)}
                      className="relative flex flex-col items-center justify-center group touch-manipulation hover-rubber"
                    >
                      <div className="flex items-center justify-center relative z-10">
                        {/* Font size reduced: text-6xl -> text-4xl/5xl */}
                        <span className={`text-4xl md:text-5xl font-[900] leading-none ${item.color} ${isMagicMode ? 'text-glow' : 'drop-shadow-sm'}`}>
                          {firstLetter}
                        </span>
                        
                        {/* Font size reduced: text-2xl -> text-lg */}
                        <span className={`text-lg md:text-xl font-[900] ml-0.5 tracking-tight ${isActive ? 'text-purple-600' : isMagicMode ? 'text-white' : 'text-gray-800'}`}>
                          {restOfName}
                        </span>
                        
                        {isActive && (
                          <div className="absolute -top-3 -right-2 text-yellow-400 animate-bounce">
                            <Sparkles size={14} />
                          </div>
                        )}
                      </div>
                      
                      <div className={`h-1.5 rounded-full mt-1.5 transition-all duration-500 ${isActive ? `w-8 ${item.color.replace('text', 'bg')}` : 'w-0 opacity-0'}`}></div>
                    </button>
                  );
                })}
              </div>
           </div>

           {/* Footer Buttons - Single Row Layout */}
           <div className="p-6 relative z-10 mt-auto pb-8">
              <div className="flex items-center gap-3">
                 {/* WhatsApp Button */}
                 <a href="https://wa.me/40712345678" className="flex-1 py-3 bg-[#25D366] text-white rounded-2xl shadow-lg shadow-green-200 font-black text-sm md:text-base active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    <MessageCircle size={20} fill="white" />
                    <span>WhatsApp</span>
                 </a>
                 
                 {/* Call Button */}
                 <a href="tel:0712345678" className={`flex-1 py-3 rounded-2xl font-black text-sm md:text-base active:scale-[0.98] transition-all flex items-center justify-center gap-2 border-2 ${isMagicMode ? 'bg-white/10 text-white border-white/20' : 'bg-white text-gray-800 border-gray-100 shadow-md'}`}>
                    <Phone size={20} className="text-blue-500" />
                    <span>Sună-ne</span>
                 </a>
              </div>
           </div>
        </div>
      )}
    </header>
  );
}

export default Header;