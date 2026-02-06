import React, { useEffect, useRef } from 'react';
import SectionHeader from './SectionHeader';
import { Heart, Users, Lightbulb, Coffee, ShieldCheck, Wifi, Map, MessageCircle, Hand } from 'lucide-react';

const About: React.FC = () => {
  const steps = [
    { num: 1, title: "Programezi", desc: "Completezi formularul pentru o evaluare gratuită.", color: "bg-blue-500" },
    { num: 2, title: "Cunoști", desc: "Vii la sediu, cunoști profesorul și atmosfera.", color: "bg-purple-500" },
    { num: 3, title: "Începi", desc: "Primești recomandarea personalizată și orarul.", color: "bg-pink-500" }
  ];

  const facilities = [
    { icon: <ShieldCheck size={20} />, text: "Supraveghere Video" },
    { icon: <Coffee size={20} />, text: "Zonă Așteptare Părinți" },
    { icon: <Wifi size={20} />, text: "Wi-Fi Gratuit" },
    { icon: <MessageCircle size={20} />, text: "Feedback Lunar" }
  ];

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic for the onboarding steps
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollInterval: ReturnType<typeof setInterval>;

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }, 3500); // Scroll every 3.5 seconds
    };

    startAutoScroll();

    // Stop scrolling on interaction
    const stopAutoScroll = () => clearInterval(scrollInterval);

    container.addEventListener('touchstart', stopAutoScroll);
    container.addEventListener('mouseenter', stopAutoScroll);

    return () => {
      clearInterval(scrollInterval);
      if (container) {
        container.removeEventListener('touchstart', stopAutoScroll);
        container.removeEventListener('mouseenter', stopAutoScroll);
      }
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <SectionHeader 
        title="Mai mult decât o școală" 
        description="Un mediu sigur și creativ unde copilul tău se dezvoltă armonios."
      />
      
      {/* ONBOARDING SECTION - Enhanced Visibility & Auto-Scroll */}
      <div className="mb-16 relative">
        <h3 className="text-xl md:text-2xl font-black text-gray-800 mb-8 text-center">Cum decurge prima vizită?</h3>
        
        {/* Swipe Hint - Mobile Only */}
        <div className="md:hidden absolute top-0 right-0 flex items-center gap-1 text-gray-400 animate-pulse text-xs font-bold">
           <span>Swipe</span> <Hand size={14} className="rotate-90" />
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-10 pt-4 gap-6 md:grid md:grid-cols-3 snap-x snap-mandatory no-scrollbar px-4 -mx-4 md:mx-0"
        >
          {steps.map((s, i) => (
             <div key={i} className="min-w-[280px] snap-center bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col items-center text-center relative hover:scale-105 transition-transform duration-300">
                <div className={`absolute -top-6 w-12 h-12 ${s.color} text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg rotate-3`}>
                  {s.num}
                </div>
                <h4 className="mt-6 font-black text-xl text-gray-800 mb-3">{s.title}</h4>
                <p className="text-base text-gray-600 font-bold leading-snug">{s.desc}</p>
             </div>
          ))}
        </div>
        
        {/* Scroll Indicators (Dots) */}
        <div className="flex justify-center gap-2 mt-[-20px] md:hidden">
          {steps.map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-gray-300 first:bg-purple-500"></div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div className="space-y-8">
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
            Fondată în 2020, <span className="font-black text-purple-600">VoiceUp School</span> a pornit din dorința de a aduce arta mai aproape de copii. Nu suntem doar o școală, ci o a doua familie.
          </p>
          
          {/* PARENTS FACILITIES - Compact Grid */}
          <div className="bg-purple-50 p-6 rounded-[2rem]">
            <h4 className="font-black text-purple-800 mb-4 flex items-center gap-2">
              <Heart size={20} className="text-pink-500" /> Pentru Părinți & Siguranță
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {facilities.map((f, i) => (
                <div key={i} className="bg-white p-3 rounded-xl flex items-center gap-2 shadow-sm text-sm font-bold text-gray-600">
                  <span className="text-purple-500">{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>
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