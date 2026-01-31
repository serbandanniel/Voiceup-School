import React from 'react';
import SectionHeader from './SectionHeader';

const Teachers: React.FC = () => {
  const teachers = [
    { name: "Elena Popescu", role: "Profesor Canto", image: "https://picsum.photos/seed/teacher1/400/400", bio: "Absolventă de Conservator, pasionată de jazz și muzică pop." },
    { name: "Andrei Ionescu", role: "Profesor Pian", image: "https://picsum.photos/seed/teacher2/400/400", bio: "Cu o experiență de peste 10 ani în predarea pianului pentru copii." },
    { name: "Maria Stan", role: "Profesor Pictură", image: "https://picsum.photos/seed/teacher3/400/400", bio: "Artist vizual care iubește să descopere lumi noi prin pensulă." },
    { name: "Radu Vasile", role: "Profesor Chitară", image: "https://picsum.photos/seed/teacher4/400/400", bio: "Îmbină tehnica clasică cu stilurile moderne de chitară." }
  ];

  return (
    <div className="bg-white py-16 md:py-32">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader 
          title="Profesorii Noștri" 
          description="Echipa noastră este formată din mentori dedicați, artiști activi care vor să transmită mai departe magia artei."
        />

        <div className="flex overflow-x-auto pb-12 snap-x snap-mandatory gap-8 no-scrollbar md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
          {teachers.map((t, idx) => (
            <div key={idx} className="min-w-[300px] sm:min-w-[350px] md:min-w-0 snap-center text-center group bg-gray-50/50 md:bg-transparent p-10 md:p-0 rounded-[3rem] md:rounded-none">
              <div className="relative mb-6 md:mb-10 mx-auto w-48 h-48 lg:w-64 lg:h-64">
                <div className="absolute inset-0 bg-purple-500 rounded-full scale-110 opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
                <img 
                  src={t.image} 
                  alt={t.name} 
                  className="w-full h-full object-cover rounded-full border-[6px] md:border-[10px] border-white shadow-2xl group-hover:border-purple-200 transition-all duration-500"
                />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-1">{t.name}</h3>
              <p className="text-purple-600 font-black text-lg mb-4">{t.role}</p>
              <p className="text-lg text-gray-600 px-2 font-medium line-clamp-3 md:line-clamp-none">{t.bio}</p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-2 mt-8 md:hidden">
          {teachers.map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-purple-200"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Teachers;