import React from 'react';
import SectionHeader from './SectionHeader';
import { Quote, Star } from 'lucide-react';

const Reviews: React.FC = () => {
  const reviews = [
    { name: "Anca Marinescu", role: "Părinte", text: "Fetița mea a început cursul de pictură acum 6 luni și suntem impresionați de progresul ei. Atmosfera este magică!", rating: 5 },
    { name: "Bogdan Petre", role: "Elev (Pian)", text: "Domnul Andrei este cel mai răbdător profesor. Am învățat primele piese mult mai repede decât mă așteptam.", rating: 5 },
    { name: "Elena Georgescu", role: "Părinte", text: "O școală unde copiii chiar se simt ascultați. Canto a devenit momentul preferat al săptămânii pentru fiul nostru.", rating: 5 },
  ];

  return (
    <div className="bg-purple-50 transition-colors duration-700 py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader 
          title="Recenziile Elevilor" 
          description="Părerile celor care fac deja parte din comunitatea VoiceUp School."
        />

        <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory gap-6 no-scrollbar md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {reviews.map((r, i) => (
            <div key={i} className="min-w-[85vw] sm:min-w-[400px] md:min-w-0 snap-center bg-white p-6 md:p-8 rounded-[2rem] shadow-xl relative mt-8 flex flex-col justify-between transition-colors duration-700">
              <div>
                <div className="absolute -top-6 left-8 p-3 md:p-4 bg-purple-600 rounded-2xl shadow-lg text-white">
                  <Quote size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="flex gap-1 mb-4 pt-4">
                  {[...Array(r.rating)].map((_, j) => (
                    <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic leading-relaxed text-sm md:text-base">
                  "{r.text}"
                </p>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-black text-gray-800">{r.name}</h4>
                <p className="text-xs md:text-sm text-purple-600 font-bold uppercase tracking-wider">{r.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Swipe Hint for Mobile */}
        <div className="flex justify-center gap-1 mt-6 md:hidden">
          {reviews.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-200"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;