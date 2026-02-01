import React from 'react';
import SectionHeader from './SectionHeader';
import { Heart, Users, Lightbulb } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    { icon: <Heart className="text-red-500" size={32} />, title: "Pasiune", text: "Punem suflet în tot ceea ce facem." },
    { icon: <Users className="text-blue-500" size={32} />, title: "Comunitate", text: "Copiii cresc împreună prin artă." },
    { icon: <Lightbulb className="text-yellow-500" size={32} />, title: "Creativitate", text: "Încurajăm ideile noi și imaginația." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <SectionHeader 
        title="Despre VoiceUp School" 
        description="Misiunea noastră este să transformăm fiecare talent într-o formă de expresie unică, oferind un mediu cald și plin de inspirație."
      />
      
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="space-y-8">
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
            Fondată în 2020, <span className="font-black text-purple-600">VoiceUp School</span> a pornit din dorința de a aduce arta mai aproape de copii într-un mod ludic și modern. Nu suntem doar o școală, ci o a doua familie unde micii artiști sunt încurajați să exploreze.
          </p>
          
          {/* Modified layout for mobile: Grid with 2 columns. First item spans 2, others span 1. */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {values.map((v, i) => (
              <div 
                key={i} 
                className={`
                  p-6 bg-white rounded-[2rem] shadow-xl border-2 border-purple-50 
                  hover:shadow-2xl hover:scale-105 transition-all duration-300
                  flex flex-col items-center text-center
                  ${i === 0 ? 'col-span-2' : 'col-span-1'} 
                  ${i === 0 ? 'md:col-span-2 lg:col-span-1' : 'md:col-span-1 lg:col-span-1'} 
                `}
              >
                <div className="mb-4">{v.icon}</div>
                <h4 className="text-lg font-black text-gray-800 mb-1">{v.title}</h4>
                <p className="text-sm text-gray-500 font-bold leading-tight">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Images hidden on mobile (hidden md:grid) */}
        <div className="hidden md:grid grid-cols-2 gap-4 md:gap-6">
          <img src="https://picsum.photos/seed/about1/500/600" className="rounded-[2.5rem] shadow-2xl mt-8 border-4 md:border-8 border-white transform -rotate-3 hover:rotate-0 transition-transform duration-500" alt="Study" />
          <img src="https://picsum.photos/seed/about2/500/600" className="rounded-[2.5rem] shadow-2xl border-4 md:border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500" alt="Study 2" />
        </div>
      </div>
    </div>
  );
};

export default About;