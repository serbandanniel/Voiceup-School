import React from 'react';
import { PlayCircle, Star, Music, Sparkles } from 'lucide-react';
import FloatingElements from './FloatingElements';

interface HeroProps {
  playPop: () => void;
}

const Hero: React.FC<HeroProps> = ({ playPop }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-12 px-4">
      <FloatingElements />
      
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-200/40 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-200/40 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center z-10">
        <div className="text-center lg:text-left space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-4">
            <div className="inline-flex items-center gap-3 px-8 py-3 bg-white rounded-full shadow-xl border-2 border-purple-100 animate-bounce">
              <Sparkles className="text-yellow-500" size={20} />
              <span className="text-sm font-black text-purple-700 uppercase tracking-widest">Lideri în educație artistică</span>
            </div>
          </div>
          
          <h1 className="text-fluid-h1 font-black leading-[0.95] tracking-tighter">
            <span className="block mb-2">Descoperă</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500">Muzica din Tine</span>
          </h1>
          
          <p className="text-xl md:text-2xl opacity-90 max-w-xl mx-auto lg:mx-0 font-bold leading-relaxed">
            VoiceUp School: locul unde canto, pianul și pictura se întâlnesc pentru a crea viitorii artiști. Începe călătoria ta azi!
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-6">
            <button 
              onMouseEnter={playPop}
              onClick={() => document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-10 py-5 bg-purple-600 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:scale-105 transition-all active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 uppercase">Înscriere Gratuită!</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <button 
              onMouseEnter={playPop}
              onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-3 px-8 py-5 bg-white text-gray-800 rounded-[2rem] font-black text-lg border-2 border-gray-100 hover:border-purple-400 transition-all shadow-xl"
            >
              <PlayCircle size={28} className="text-purple-500" />
              Cursuri
            </button>
          </div>
        </div>

        <div className="relative group hidden lg:block reveal-on-scroll opacity-0 xl:ml-auto">
          <div className="absolute -inset-10 bg-gradient-to-tr from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-[100px] animate-pulse"></div>
          
          <div className="relative z-10">
             {/* Reduced height from 500px to 420px to prevent overlap */}
             <div className="relative rounded-[3rem] overflow-hidden border-[10px] border-white shadow-2xl transform rotate-2 group-hover:rotate-0 transition-transform duration-700 max-w-[500px]">
                <img 
                  src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800" 
                  alt="VoiceUp Main" 
                  className="w-full h-[420px] object-cover"
                />
             </div>
             <div className="absolute -top-8 -right-8 w-28 h-28 bg-indigo-950 rounded-[2rem] shadow-2xl flex items-center justify-center animate-float border-6 border-white p-4">
                <Music className="text-white" size={40} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;