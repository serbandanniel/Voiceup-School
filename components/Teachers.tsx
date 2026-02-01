import React from 'react';
import SectionHeader from './SectionHeader';

const Teachers: React.FC = () => {
  const teachers = [
    { name: "Elena Popescu", role: "Profesor Canto", image: "https://picsum.photos/seed/teacher1/400/400", bio: "Absolventă de Conservator, pasionată de jazz." },
    { name: "Andrei Ionescu", role: "Profesor Pian", image: "https://picsum.photos/seed/teacher2/400/400", bio: "10 ani experiență în pian pentru copii." },
    { name: "Maria Stan", role: "Profesor Pictură", image: "https://picsum.photos/seed/teacher3/400/400", bio: "Artist vizual, iubește culorile." },
    { name: "Radu Vasile", role: "Profesor Chitară", image: "https://picsum.photos/seed/teacher4/400/400", bio: "Tehnică clasică și stiluri moderne." }
  ];

  return (
    <div className="bg-white py-12 md:py-32">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader 
          title="Profesorii Noștri" 
          description="Echipa noastră este formată din mentori dedicați, artiști activi care vor să transmită mai departe magia artei."
        />

        {/* Compact Grid on Mobile (2 cols), Standard on Desktop (4 cols) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {teachers.map((t, idx) => (
            <div key={idx} className="text-center group bg-gray-50/50 md:bg-transparent p-4 md:p-0 rounded-[2rem] md:rounded-none">
              <div className="relative mb-3 md:mb-10 mx-auto w-24 h-24 md:w-48 md:h-48 lg:w-64 lg:h-64">
                <div className="absolute inset-0 bg-purple-500 rounded-full scale-110 opacity-0 group-hover:opacity-20 transition-all duration-500 hidden md:block"></div>
                <img 
                  src={t.image} 
                  alt={t.name} 
                  className="w-full h-full object-cover rounded-full border-[3px] md:border-[10px] border-white shadow-lg md:shadow-2xl group-hover:border-purple-200 transition-all duration-500"
                />
              </div>
              <h3 className="text-base md:text-2xl font-black text-gray-800 mb-0.5 md:mb-1 leading-tight">{t.name}</h3>
              <p className="text-xs md:text-lg text-purple-600 font-black mb-2 uppercase tracking-wide">{t.role}</p>
              <p className="text-xs md:text-lg text-gray-600 px-1 font-medium line-clamp-2 md:line-clamp-none leading-snug">{t.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Teachers;