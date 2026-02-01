import React, { useState } from 'react';
import SectionHeader from './SectionHeader';
import { Play, Instagram, Music, ArrowRight, Image as ImageIcon } from 'lucide-react';

interface GalleryProps {
  onViewAll?: (type: 'photo' | 'video') => void;
}

const Gallery: React.FC<GalleryProps> = ({ onViewAll }) => {
  const [activeTab, setActiveTab] = useState<'photo' | 'video'>('video');

  const photos = [
    "https://picsum.photos/seed/v1/800/800",
    "https://picsum.photos/seed/v2/800/800",
    "https://picsum.photos/seed/v3/800/800",
    "https://picsum.photos/seed/v4/800/800",
    "https://picsum.photos/seed/v5/800/800",
    "https://picsum.photos/seed/v6/800/800",
  ];

  const reels = [
    { id: 1, title: "Recital Canto", color: "bg-pink-500", img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=400&q=80" },
    { id: 2, title: "Pian Session", color: "bg-blue-500", img: "https://images.unsplash.com/photo-1520527057854-13c3ee67d34c?auto=format&fit=crop&w=400&q=80" },
    { id: 3, title: "Masterclass", color: "bg-purple-500", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80" },
    { id: 4, title: "Art Day", color: "bg-yellow-500", img: "https://images.unsplash.com/photo-1460661419201-fd4ce186860d?auto=format&fit=crop&w=400&q=80" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeader 
        title="Momente Magice" 
        description="Explorează universul nostru prin imagini și clipuri scurte pline de energie!"
      />

      <div className="flex justify-center mb-12">
        <div className="bg-gray-100/50 backdrop-blur p-1 rounded-full inline-flex border border-white/20">
          <button 
            onClick={() => setActiveTab('video')}
            className={`px-8 py-2.5 rounded-full font-black transition-all flex items-center gap-2 ${activeTab === 'video' ? 'bg-purple-600 shadow-lg text-white' : 'text-gray-500 hover:text-purple-600'}`}
          >
            <Music size={18} /> Vertical Reels
          </button>
          <button 
            onClick={() => setActiveTab('photo')}
            className={`px-8 py-2.5 rounded-full font-black transition-all flex items-center gap-2 ${activeTab === 'photo' ? 'bg-purple-600 shadow-lg text-white' : 'text-gray-500 hover:text-purple-600'}`}
          >
            <ImageIcon size={18} /> Foto
          </button>
        </div>
      </div>

      {activeTab === 'photo' ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {photos.map((url, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-[2.5rem] shadow-xl border-4 border-white cursor-pointer group">
                <img src={url} alt="Gallery item" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button 
              onClick={() => onViewAll?.('photo')}
              className="flex items-center gap-2 px-8 py-4 bg-white text-gray-800 rounded-2xl font-black shadow-xl border-2 border-gray-100 hover:border-purple-200 hover:text-purple-600 transition-all active:scale-95 group"
            >
              Vezi Toată Galeria Foto
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-8">
            {reels.map((reel) => (
              <div key={reel.id} className="vertical-reel relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-2xl aspect-[9/16]">
                <img src={reel.img} alt={reel.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                  <Instagram size={20} />
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                    <Play className="text-purple-600 ml-1" fill="currentColor" size={32} />
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <h4 className="text-white font-black text-xl mb-1">{reel.title}</h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${reel.color} animate-ping`}></div>
                    <span className="text-white/70 text-xs font-bold uppercase tracking-widest">Vezi Video</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button 
              onClick={() => onViewAll?.('video')}
              className="flex items-center gap-2 px-8 py-4 bg-white text-gray-800 rounded-2xl font-black shadow-xl border-2 border-gray-100 hover:border-purple-200 hover:text-purple-600 transition-all active:scale-95 group"
            >
              Vezi Toată Galeria Video
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Gallery;