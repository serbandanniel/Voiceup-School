
import React from 'react';
import { Music, Piano, Palette, Star, Heart } from 'lucide-react';

const FloatingElements: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      <Music className="absolute top-20 left-[10%] text-purple-400 animate-blink-blur" size={48} />
      <Piano className="absolute top-[40%] right-[5%] text-blue-400 animate-blink-blur" size={64} style={{ animationDelay: '0.5s' }} />
      <Palette className="absolute bottom-[20%] left-[5%] text-yellow-400 animate-blink-blur" size={56} style={{ animationDelay: '1s' }} />
      <Star className="absolute top-[15%] right-[15%] text-pink-400 animate-blink-blur" size={32} style={{ animationDelay: '1.5s' }} />
      <Heart className="absolute bottom-[30%] right-[20%] text-red-400 animate-blink-blur" size={48} style={{ animationDelay: '2s' }} />
      <Music className="absolute bottom-10 left-[40%] text-green-400 animate-blink-blur" size={40} />
    </div>
  );
};

export default FloatingElements;
