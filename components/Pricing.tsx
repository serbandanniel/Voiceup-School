import React from 'react';
import SectionHeader from './SectionHeader';
import { Check } from 'lucide-react';

const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Standard",
      price: "250",
      features: ["1 Ședință / Săptămână", "Durată: 50 minute", "Materiale suport incluse", "Acces la evenimente periodice"],
      color: "border-blue-200",
      btnColor: "bg-blue-500"
    },
    {
      name: "Pro",
      price: "450",
      features: ["2 Ședințe / Săptămână", "Durată: 50 minute", "Plan de studiu personalizat", "Acces la workshop-uri gratuite", "Asistență online"],
      popular: true,
      color: "border-purple-400 shadow-purple-100",
      btnColor: "bg-purple-600"
    },
    {
      name: "Intensiv",
      price: "800",
      features: ["3 Ședințe / Săptămână", "Toate disciplinele incluse", "Înregistrări audio/video profesionale", "Diplomă de participare"],
      color: "border-pink-200",
      btnColor: "bg-pink-500"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <SectionHeader 
        title="Tarife Cursuri" 
        description="Investește în talentul copilului tău cu pachete flexibile și avantajoase."
      />

      <div className="flex overflow-x-auto pb-10 snap-x snap-mandatory gap-6 no-scrollbar md:grid md:grid-cols-3 md:overflow-visible md:pb-0 items-stretch">
        {plans.map((plan, i) => (
          <div key={i} className={`min-w-[85vw] sm:min-w-[350px] md:min-w-0 snap-center bg-white rounded-[2.5rem] p-8 md:p-10 border-4 ${plan.color} relative overflow-hidden transition-transform md:hover:scale-105 shadow-2xl flex flex-col`}>
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-black px-4 py-2 rounded-bl-xl uppercase tracking-widest z-20">
                Recomandat
              </div>
            )}
            <h3 className="text-2xl font-black text-gray-800 mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6 md:mb-8">
              <span className="text-4xl md:text-5xl font-black text-gray-900 price-glow">{plan.price}</span>
              <span className="text-gray-500 font-bold">RON / lună</span>
            </div>
            
            <ul className="space-y-4 mb-8 md:mb-10 flex-grow">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-3 text-sm md:text-base text-gray-600 font-medium">
                  <div className={`shrink-0 p-1 rounded-full ${plan.btnColor} text-white`}>
                    <Check size={12} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })}
              className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-transform active:scale-95 ${plan.btnColor} mt-auto`}
            >
              Alege Planul
            </button>
          </div>
        ))}
      </div>

      {/* Mobile Indicator */}
      <div className="flex justify-center gap-1.5 mt-2 md:hidden">
        {plans.map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-purple-200"></div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;