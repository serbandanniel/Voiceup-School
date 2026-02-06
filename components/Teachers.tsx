import React from 'react';
import SectionHeader from './SectionHeader';
import { Quote } from 'lucide-react';

const Teachers: React.FC = () => {
  const teachers = [
    { name: "Elena Popescu", role: "Profesor Canto", image: "https://picsum.photos/seed/teacher1/400/400", philosophy: "„Nu există copil care să nu poată cânta, există doar încredere care trebuie construită.”" },
    { name: "Andrei Ionescu", role: "Profesor Pian", image: "https://picsum.photos/seed/teacher2/400/400", philosophy: "„Învățăm pianul prin joacă, nu prin constrângere. Așa se nasc pasiunile reale.”" },
    { name: "Maria Stan", role: "Profesor Pictură", image: "https://picsum.photos/seed/teacher3/400/400", philosophy: "„În artă nu există greșeli, doar noi moduri de a vedea lumea.”" },
    { name: "Radu Vasile", role: "Profesor Chitară", image: "https://picsum.photos/seed/teacher4/400/400", philosophy: "„Răbdarea este cheia. Sărbătorim fiecare mic progres al elevului.”" }
  ];

  return (
    <div className="bg-white py-12 md:py-32">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader 
          title="Mentorii Noștri" 
          description="Oameni calzi, pedagogi dedicați, care pun suflet în relația cu fiecare copil."
        />

        {/* Compact Grid on Mobile (2 cols), Standard on Desktop (4 cols) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {teachers.map((t, idx) => (
            <div key={idx} className="text-center group bg-gray-50 p-4 md:p-0 rounded-[2rem] md:bg-transparent md:rounded-none flex flex-col items-center">
              <div className="relative mb-3 md:mb-8 w-24 h-24 md:w-48 md:h-48 lg:w-56 lg:h-56">
                <div className="absolute inset-0 bg-purple-500 rounded-full scale-110 opacity-0 group-hover:opacity-20 transition-all duration-500 hidden md:block"></div>
                <img 
                  src={t.image} 
                  alt={t.name} 
                  className="w-full h-full object-cover rounded-full border-[3px] md:border-[8px] border-white shadow-lg md:shadow-2xl group-hover:border-purple-200 transition-all duration-500"
                />
              </div>
              <h3 className="text-base md:text-2xl font-black text-gray-800 mb-0.5 md:mb-1 leading-tight">{t.name}</h3>
              <p className="text-xs md:text-base text-purple-600 font-black mb-3 uppercase tracking-wide">{t.role}</p>
              
              <div className="relative bg-white p-3 rounded-xl border border-gray-100 shadow-sm md:shadow-none md:border-none md:bg-transparent">
                  <Quote size={12} className="text-purple-300 absolute top-1 left-1 hidden md:block" />
                  <p className="text-xs md:text-base text-gray-500 font-medium italic leading-snug">
                    {t.philosophy}
                  </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Teachers;