import React, { useEffect } from 'react';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import SectionHeader from './SectionHeader';

interface FullPhotoGalleryProps {
  onBack: () => void;
}

const FullPhotoGallery: React.FC<FullPhotoGalleryProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Generăm mai multe imagini pentru a simula o galerie plină
  const photos = Array.from({ length: 12 }).map((_, i) => ({
    url: `https://picsum.photos/seed/gallery${i}/800/800`,
    caption: `Moment Artistic ${i + 1}`
  }));

  // Style similar to CourseDetail but generic purple theme
  const backBtnClass = "bg-white text-purple-600 border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 shadow-lg shadow-purple-100/50";

  return (
    <div className="min-h-screen pt-32 md:pt-28 pb-12 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Top Button - Centered */}
        <div className="flex justify-center mb-8">
            <button 
            onClick={onBack}
            className={`group flex items-center gap-2 px-6 py-3 rounded-full font-black uppercase tracking-wide transition-all active:scale-95 ${backBtnClass}`}
            >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Înapoi acasă
            </button>
        </div>

        <SectionHeader 
          title="Galeria Foto Completă" 
          description="Fiecare fotografie spune o poveste despre pasiune, muncă și bucuria de a fi pe scenă."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {photos.map((photo, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-[2rem] shadow-xl border-4 border-white cursor-pointer bg-white">
              <img 
                src={photo.url} 
                alt={photo.caption} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {photo.caption}
                </span>
              </div>
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                 <ImageIcon className="text-white" size={20} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
           <p className="text-gray-500 font-medium mb-8">Amintiri care durează o viață.</p>
           
           {/* Bottom Button - Centered */}
           <div className="flex justify-center border-t border-purple-100 pt-8">
                <button 
                onClick={onBack}
                className={`group flex items-center gap-2 px-8 py-4 rounded-full font-black uppercase tracking-wide transition-all active:scale-95 ${backBtnClass}`}
                >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Înapoi acasă
                </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FullPhotoGallery;