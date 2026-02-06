import React from 'react';
import SectionHeader from './SectionHeader';
import { Mic2, Music, Palette, ArrowRight, ChevronRight, GraduationCap, Users } from 'lucide-react';

interface CoursesProps {
  playPop: () => void;
  onViewDetails?: (id: string) => void;
}

const Courses: React.FC<CoursesProps> = ({ playPop, onViewDetails }) => {
  const courses = [
    {
      id: 'canto',
      title: "Canto Modern",
      icon: <Mic2 className="text-white" size={16} />, 
      desktopIcon: <Mic2 className="text-white" size={28} />,
      color: "from-pink-400 to-pink-600",
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=600",
      description: "Îți antrenăm vocea și încrederea! De la respirație la interpretare pe scenă.",
      ageGroup: "6-18 Ani",
      benefit: "Dezvoltă dicția & încrederea",
      border: "border-pink-100",
      textAccent: "text-pink-600",
      btnBg: "bg-pink-50 text-pink-700",
      btnBorder: "border-pink-200"
    },
    {
      id: 'piano',
      title: "Pian Creativ",
      icon: <Music className="text-white" size={16} />,
      desktopIcon: <Music className="text-white" size={28} />,
      color: "from-blue-400 to-blue-600",
      image: "https://images.unsplash.com/photo-1520527057854-13c3ee67d34c?auto=format&fit=crop&q=80&w=600",
      description: "Clapele prind viață sub degetele tale. Melodii de la prima lecție.",
      ageGroup: "4-18 Ani",
      benefit: "Îmbunătățește logica & concentrarea",
      border: "border-blue-100",
      textAccent: "text-blue-600",
      btnBg: "bg-blue-50 text-blue-700",
      btnBorder: "border-blue-200"
    },
    {
      id: 'painting',
      title: "Pictură & Desen",
      icon: <Palette className="text-white" size={16} />,
      desktopIcon: <Palette className="text-white" size={28} />,
      color: "from-yellow-400 to-yellow-600",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600",
      description: "Curcubeul este limita! Explorăm culorile și tehnici diverse.",
      ageGroup: "5-18 Ani",
      benefit: "Stimulează creativitatea & răbdarea",
      border: "border-yellow-100",
      textAccent: "text-yellow-600",
      btnBg: "bg-yellow-50 text-yellow-800",
      btnBorder: "border-yellow-200"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <SectionHeader 
        title="Lumea Noastră Creativă" 
        description="Aici nu doar învățăm, ci ne distrăm și creăm amintiri de neuitat prin artă."
      />

      {/* --- MOBILE VIEW: Compact List (No Slider) --- */}
      <div className="flex flex-col gap-4 md:hidden">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className={`bg-white rounded-2xl p-3 shadow-lg border-2 ${course.border} flex flex-col gap-3 animate-fade-in active:scale-[0.99] transition-transform`}
          >
            <div className="flex gap-3 items-stretch">
                {/* Small Left Image */}
                <div 
                onClick={() => onViewDetails?.(course.id)}
                className="relative w-24 shrink-0 rounded-xl overflow-hidden cursor-pointer h-24"
                >
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                <div className={`absolute top-1 left-1 p-1.5 bg-gradient-to-br ${course.color} rounded-lg shadow-sm`}>
                    {course.icon}
                </div>
                </div>

                {/* Right Content */}
                <div className="flex flex-col justify-between flex-grow py-0.5">
                <div onClick={() => onViewDetails?.(course.id)}>
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-black text-gray-800 leading-tight mb-1">{course.title}</h3>
                        <span className="text-[10px] font-black bg-gray-100 px-2 py-0.5 rounded-md text-gray-600 whitespace-nowrap">{course.ageGroup}</span>
                    </div>
                    
                    <p className="text-xs text-gray-500 font-bold leading-snug line-clamp-2 mb-1">
                    {course.description}
                    </p>

                    <div className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg w-fit">
                        <GraduationCap size={12} />
                        {course.benefit}
                    </div>
                </div>
                </div>
            </div>

            {/* Compact Buttons Full Width */}
            <div className="flex items-center gap-2">
            <button 
                onClick={() => onViewDetails?.(course.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide border ${course.btnBorder} ${course.btnBg}`}
            >
                Detalii
            </button>
            <button 
                onMouseEnter={playPop}
                onClick={() => document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })}
                className={`flex-1 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r ${course.color} shadow-sm flex items-center justify-center gap-1`}
            >
                Evaluare Gratuită <ChevronRight size={12} />
            </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- DESKTOP VIEW: Large Grid (Hidden on Mobile) --- */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-10">
        {courses.map((course, idx) => (
          <div key={idx} className={`group bg-white border-[6px] ${course.border} p-5 overflow-hidden shadow-xl relative rounded-[3rem] transition-all hover:-translate-y-2 flex flex-col`}>
            <div className={`relative h-80 rounded-[2.5rem] overflow-hidden mb-4 cursor-pointer shrink-0`} onClick={() => onViewDetails?.(course.id)}>
              <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              
              {/* Icon Bubble */}
              <div className={`absolute top-4 right-4 p-5 bg-gradient-to-br ${course.color} rounded-[1.5rem] shadow-lg group-hover:rotate-12 transition-transform`}>
                {course.desktopIcon}
              </div>

               {/* Age Badge */}
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-black text-gray-800 shadow-lg flex items-center gap-2">
                 <Users size={16} className="text-purple-500" />
                 {course.ageGroup}
               </div>
              
              {/* Desktop Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <button className="text-white font-black flex items-center gap-3 text-lg">
                    DETALII CURS <ArrowRight size={24} />
                  </button>
              </div>
            </div>
            
            <div className="px-2 pb-2 flex flex-col flex-grow">
              <h3 className="text-3xl font-black mb-2 text-gray-800 leading-tight">{course.title}</h3>
              
              <div className="flex items-center gap-2 mb-4 text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg w-fit">
                  <GraduationCap size={16} />
                  {course.benefit}
              </div>

              <p className="text-lg text-gray-600 font-bold leading-snug mb-6 flex-grow">
                {course.description}
              </p>
              
              <div className="flex flex-col gap-3 mt-auto">
                <button 
                  onClick={() => onViewDetails?.(course.id)}
                  className={`w-full py-3 rounded-2xl font-bold text-gray-600 border-2 border-gray-100 hover:border-gray-300 transition-all text-sm uppercase tracking-wide`}
                >
                  Detalii
                </button>
                <button 
                  onMouseEnter={playPop}
                  onClick={() => document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })}
                  className={`w-full py-5 rounded-2xl font-black text-white text-lg shadow-xl bg-gradient-to-r ${course.color} hover:brightness-110 transition-all active:scale-95`}
                >
                  Evaluare Gratuită
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;