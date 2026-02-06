import React from 'react';
import { PlayCircle, Music, Sparkles, CalendarCheck } from 'lucide-react';

interface HeroProps {
  playPop: () => void;
}

const Hero: React.FC<HeroProps> = ({ playPop }) => {
  return (
    // Increased top padding (pt-32) on mobile to push image down from menu
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-36 md:pt-28 pb-12 px-4">
      
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-200/40 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-200/40 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center z-10">
        
        {/* Mobile Image Block - Visible only on mobile */}
        <div className="block lg:hidden w-full max-w-[280px] mx-auto relative mb-6">
             <div className="relative rounded-[2rem] overflow-hidden border-[6px] border-white shadow-xl transform rotate-2 bg-white/20 backdrop-blur-sm flex items-center justify-center aspect-square">
                <img 
                  src="https://voiceup-festival.ro/voiceup_school_final.png" 
                  alt="VoiceUp Logo Main" 
                  className="w-full h-full object-contain p-4"
                />
             </div>
             <div className="absolute -top-3 -right-3 w-16 h-16 bg-indigo-950 rounded-2xl shadow-lg flex items-center justify-center animate-float border-2 border-white">
                <Music className="text-white" size={24} />
             </div>
        </div>

        <div className="text-center lg:text-left space-y-6 md:space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-2 md:mb-4">
            <div className="inline-flex items-center gap-2 md:gap-3 px-6 py-2 md:px-8 md:py-3 bg-white rounded-full shadow-xl border-2 border-purple-100 animate-bounce">
              <Sparkles className="text-yellow-500" size={16} />
              <span className="text-xs md:text-sm font-black text-purple-700 uppercase tracking-widest">Lideri în educație artistică</span>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-fluid-h1 font-black leading-[0.95] tracking-tighter">
            <span className="block mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 pb-2">Cântă. Creează.</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">Strălucește.</span>
          </h1>
          
          <p className="text-lg md:text-2xl opacity-90 max-w-xl mx-auto lg:mx-0 font-bold leading-relaxed px-2 md:px-0">
            VoiceUp School este locul unde talentul nu are reguli. Mentorat personalizat pentru copii între 4 și 18 ani.
          </p>

          {/* Added extra bottom margin (mb-12) on mobile to clear the piano hint */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 mb-12 lg:mb-0">
            <button 
              onMouseEnter={playPop}
              onClick={() => document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto group relative px-8 py-4 md:px-10 md:py-5 bg-purple-600 text-white rounded-[1.5rem] md:rounded-[2rem] font-black text-lg md:text-xl shadow-2xl hover:scale-105 transition-all active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 uppercase flex items-center justify-center gap-2">
                <CalendarCheck size={24} />
                Evaluare Gratuită
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <button 
              onMouseEnter={playPop}
              onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 md:px-8 md:py-5 bg-white text-gray-800 rounded-[1.5rem] md:rounded-[2rem] font-black text-lg border-2 border-gray-100 hover:border-purple-400 transition-all shadow-xl"
            >
              <PlayCircle size={24} className="text-purple-500" />
              Cursuri
            </button>
          </div>
        </div>

        {/* Desktop Image Block */}
        <div className="relative group hidden lg:block reveal-on-scroll opacity-0 xl:ml-auto w-full flex justify-center lg:justify-end">
          <div className="absolute -inset-10 bg-gradient-to-tr from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-[100px] animate-pulse"></div>
          
          <div className="relative z-10 w-full max-w-[550px]">
             <div className="relative rounded-[3rem] overflow-hidden border-[8px] border-white shadow-2xl transform rotate-2 group-hover:rotate-0 transition-transform duration-700 bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-purple-500/20 aspect-square">
                <img 
                  src="https://voiceup-festival.ro/voiceup_school_final.png" 
                  alt="VoiceUp Logo Main" 
                  className="w-full h-full object-contain p-4"
                />
             </div>
             <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-950 rounded-[2rem] shadow-2xl flex items-center justify-center animate-float border-4 border-white">
                <Music className="text-white" size={32} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;