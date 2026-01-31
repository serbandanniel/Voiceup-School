import React from 'react';
import SectionHeader from './SectionHeader';
import { Mic2, Music, Palette, ArrowRight } from 'lucide-react';

interface CoursesProps {
  playPop: () => void;
}

const Courses: React.FC<CoursesProps> = ({ playPop }) => {
  const courses = [
    {
      title: "Canto Modern",
      icon: <Mic2 className="text-white" size={40} />,
      color: "from-pink-400 to-pink-600",
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=600",
      description: "Îți antrenăm vocea și încrederea! De la respirație la interpretare pe scenă.",
      border: "border-pink-100"
    },
    {
      title: "Pian Creativ",
      icon: <Music className="text-white" size={40} />,
      color: "from-blue-400 to-blue-600",
      image: "https://images.unsplash.com/photo-1520527057854-13c3ee67d34c?auto=format&fit=crop&q=80&w=600",
      description: "Clapele prind viață sub degetele tale. Învățăm prin joc și melodii cunoscute.",
      border: "border-blue-100"
    },
    {
      title: "Pictură & Desen",
      icon: <Palette className="text-white" size={40} />,
      color: "from-yellow-400 to-yellow-600",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600",
      description: "Curcubeul este limita! Explorăm pensula, culorile și creativitatea fără bariere.",
      border: "border-yellow-100"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <SectionHeader 
        title="Lumea Noastră Creativă" 
        description="Aici nu doar învățăm, ci ne distrăm și creăm amintiri de neuitat prin artă."
      />

      <div className="grid md:grid-cols-3 gap-10">
        {courses.map((course, idx) => (
          <div key={idx} className={`card-bubble group bg-white border-[6px] ${course.border} p-5 overflow-hidden shadow-2xl relative rounded-[3rem] transition-all hover:-translate-y-4`}>
            <div className="relative h-80 rounded-[2.5rem] overflow-hidden mb-6">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className={`absolute top-4 right-4 p-5 bg-gradient-to-br ${course.color} rounded-[1.5rem] shadow-xl group-hover:rotate-12 transition-transform`}>
                {course.icon}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                 <button className="text-white font-black flex items-center gap-3 text-lg">
                   DETALII CURS <ArrowRight size={24} />
                 </button>
              </div>
            </div>
            
            <div className="px-2 pb-2">
              <h3 className="text-3xl font-black mb-4 text-gray-800">{course.title}</h3>
              <p className="text-lg text-gray-600 font-bold leading-relaxed mb-8">
                {course.description}
              </p>
              <button 
                onMouseEnter={playPop}
                onClick={() => document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })}
                className={`w-full py-5 rounded-2xl font-black text-white text-lg shadow-xl bg-gradient-to-r ${course.color} hover:brightness-110 transition-all active:scale-95`}
              >
                Vreau să Încep!
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;