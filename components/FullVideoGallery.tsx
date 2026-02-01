import React, { useEffect } from 'react';
import { ArrowLeft, Play, Instagram } from 'lucide-react';
import SectionHeader from './SectionHeader';

interface FullVideoGalleryProps {
  onBack: () => void;
}

const FullVideoGallery: React.FC<FullVideoGalleryProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const videos = [
    { id: 1, title: "Recital Canto Primăvară", color: "bg-pink-500", img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=400&q=80" },
    { id: 2, title: "Pian Session: Bach", color: "bg-blue-500", img: "https://images.unsplash.com/photo-1520527057854-13c3ee67d34c?auto=format&fit=crop&w=400&q=80" },
    { id: 3, title: "Pictură în aer liber", color: "bg-yellow-500", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80" },
    { id: 4, title: "Concert de Crăciun", color: "bg-red-500", img: "https://images.unsplash.com/photo-1460661419201-fd4ce186860d?auto=format&fit=crop&w=400&q=80" },
    { id: 5, title: "Backstage Fun", color: "bg-purple-500", img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=400&q=80" },
    { id: 6, title: "Lecția de Chitară", color: "bg-orange-500", img: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=400&q=80" },
    { id: 7, title: "Atelier de Creație", color: "bg-teal-500", img: "https://images.unsplash.com/photo-1560421683-6856ea585c78?auto=format&fit=crop&w=400&q=80" },
    { id: 8, title: "Vocea României Junior", color: "bg-indigo-500", img: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=400&q=80" },
  ];

  return (
    <div className="min-h-screen pt-32 md:pt-28 pb-12 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4">
        
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 mb-8 px-5 py-2.5 bg-white rounded-full shadow-md hover:shadow-lg transition-all text-gray-600 font-bold"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Înapoi acasă
        </button>

        <SectionHeader 
          title="Galeria Video Completă" 
          description="Urmărește progresul elevilor noștri și energia de la spectacole."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {videos.map((reel) => (
            <div key={reel.id} className="vertical-reel relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-2xl aspect-[9/16] bg-gray-900 border-4 border-white/50 hover:border-white transition-colors">
              <img src={reel.img} alt={reel.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
              
              <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                <Instagram size={20} />
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse scale-90 group-hover:scale-100 transition-transform">
                  <Play className="text-purple-600 ml-1" fill="currentColor" size={32} />
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <h4 className="text-white font-black text-lg md:text-xl mb-2 leading-tight">{reel.title}</h4>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${reel.color} animate-ping`}></div>
                  <span className="text-white/80 text-[10px] md:text-xs font-bold uppercase tracking-widest">Urmărește</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullVideoGallery;