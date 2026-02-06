import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 text-white pt-20 pb-10 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 border-b border-gray-800/50 pb-12 mb-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {/* Transparent background for logo */}
            <div className="w-16 h-16 p-2 flex items-center justify-center">
               <img 
                 src="https://voiceup-festival.ro/voiceup_school_final.png" 
                 alt="Footer Logo" 
                 className="w-full h-full object-contain"
               />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight">VoiceUp</span>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">School of Arts</span>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed font-medium">
            Descoperim talente, formăm caractere și colorăm viitorul prin muzică și artă. Locul unde visele devin realitate.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-black mb-6 text-white/90">Link-uri Rapide</h4>
          <ul className="space-y-3 text-gray-400 font-medium">
            <li><a href="#about" className="hover:text-purple-400 transition-colors">Despre Noi</a></li>
            <li><a href="#courses" className="hover:text-purple-400 transition-colors">Cursuri</a></li>
            <li><a href="#gallery" className="hover:text-purple-400 transition-colors">Galerie</a></li>
            <li><a href="#contact" className="hover:text-purple-400 transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-black mb-6 text-white/90">Program</h4>
          <ul className="space-y-3 text-gray-400 font-medium">
            <li className="flex justify-between"><span>Luni - Vineri:</span> <span className="text-purple-400">10:00 - 20:00</span></li>
            <li className="flex justify-between"><span>Sâmbătă:</span> <span className="text-purple-400">09:00 - 16:00</span></li>
            <li className="flex justify-between"><span>Duminică:</span> <span className="text-gray-600 italic">Închis</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-black mb-6 text-white/90">Newsletter</h4>
          <p className="text-sm text-gray-500 mb-4 font-medium">Fii la curent cu evenimentele și spectacolele noastre!</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email-ul tău" 
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none w-full text-white"
            />
            <button className="bg-purple-600 px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-bold shadow-lg shadow-purple-900/20">Ok</button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-medium">&copy; {new Date().getFullYear()} VoiceUp School. Toate drepturile rezervate.</p>
        <p className="flex items-center gap-1 font-medium">
          Creat cu <Heart size={14} className="text-pink-500 fill-pink-500" /> pentru micii artiști ai viitorului.
        </p>
      </div>
    </footer>
  );
};

export default Footer;