import React from 'react';
import SectionHeader from './SectionHeader';
import { Mic2, Music, Palette, ArrowRight } from 'lucide-react';

interface CoursesProps {
  playPop: () => void;
  onViewDetails?: (id: string) => void;
}

const Courses: React.FC<CoursesProps> = ({ playPop, onViewDetails }) => {
  const courses = [
    {
      id: 'canto',
      title: "Canto Modern",
      icon: <Mic2 className="text-white" size={28} />, 
      color: "from-pink-400 to-pink-600",
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=600",
      description: "Îți antrenăm vocea și încrederea! De la respirație la interpretare pe scenă.",
      border: "border-pink-100"
    },
    {
      id: 'piano',
      title: "Pian Creativ",
      icon: <Music className="text-white" size={28} />,
      color: "from-blue-400 to-blue-600",
      image: "https://images.unsplash.com/photo-1520527057854-13c3ee67d34c?auto=format&fit=crop&q=80&w=600",
      description: "Clapele prind viață sub degetele tale.",
      border: "border-blue-100"
    },
    {
      id: 'painting',
      title: "Pictură & Desen",
      icon: <Palette className="text-white" size={28} />,
      color: "from-yellow-400 to-yellow-600",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600",
      description: "Curcubeul este limita! Explorăm culorile.",
      border: "border-yellow-100"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <SectionHeader 
        title="Lumea Noastră Creativă" 
        description="Aici nu doar învățăm, ci ne distrăm și creăm amintiri de neuitat prin artă."
      />

      {/* Mobile: 1 Column (Stack) for perfect alignment. Desktop: 3 Columns. */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {courses.map((course, idx) => {
          // Height logic: consistent on desktop, moderate on mobile
          const imgHeight = "h-48 md:h-80";
          
          return (
            <div key={idx} className={`card-bubble group bg-white border-[4px] md:border-[6px] ${course.border} p-3 md:p-5 overflow-hidden shadow-xl relative rounded-[2rem] md:rounded-[3rem] transition-all hover:-translate-y-2 flex flex-col`}>
              <div className={`relative ${imgHeight} rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden mb-4 cursor-pointer shrink-0`} onClick={() => onViewDetails?.(course.id)}>
                <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                
                {/* Icon Bubble */}
                <div className={`absolute top-2 right-2 md:top-4 md:right-4 p-3 md:p-5 bg-gradient-to-br ${course.color} rounded-xl md:rounded-[1.5rem] shadow-lg group-hover:rotate-12 transition-transform`}>
                  {course.icon}
                </div>
                
                {/* Desktop Hover Overlay */}
                <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity items-end p-8">
                   <button className="text-white font-black flex items-center gap-3 text-lg">
                     DETALII CURS <ArrowRight size={24} />
                   </button>
                </div>
              </div>
              
              <div className="px-2 pb-2 flex flex-col flex-grow">
                <h3 className="text-2xl md:text-3xl font-black mb-2 text-gray-800 leading-tight">{course.title}</h3>
                <p className="text-base md:text-lg text-gray-600 font-bold leading-snug mb-6 flex-grow">
                  {course.description}
                </p>
                
                <div className="flex flex-col gap-3 mt-auto">
                  <button 
                    onClick={() => onViewDetails?.(course.id)}
                    className={`w-full py-3 md:py-3 rounded-xl md:rounded-2xl font-bold text-gray-600 border-2 border-gray-100 hover:border-gray-300 transition-all text-sm uppercase tracking-wide`}
                  >
                    Detalii
                  </button>
                  <button 
                    onMouseEnter={playPop}
                    onClick={() => document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })}
                    className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-white text-lg shadow-xl bg-gradient-to-r ${course.color} hover:brightness-110 transition-all active:scale-95`}
                  >
                    Mă Înscriu!
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Courses;