import React, { useState } from 'react';
import SectionHeader from './SectionHeader';
import { Check, Hand } from 'lucide-react';

const Pricing: React.FC = () => {
  const [activeTab, setActiveTab] = useState(1); // Default to 'Pro' (index 1) on mobile

  const plans = [
    {
      name: "Standard",
      price: "250",
      features: ["1 Ședință / Săptămână", "Durată: 50 minute", "Materiale suport incluse", "Acces la evenimente periodice"],
      color: "border-blue-200",
      btnColor: "bg-blue-500",
      textColor: "text-blue-500",
      tabBg: "bg-blue-50"
    },
    {
      name: "Pro",
      price: "450",
      features: ["2 Ședințe / Săptămână", "Durată: 50 minute", "Plan de studiu personalizat", "Acces la workshop-uri gratuite", "Asistență online"],
      popular: true,
      color: "border-purple-400 shadow-purple-100",
      btnColor: "bg-purple-600",
      textColor: "text-purple-600",
      tabBg: "bg-purple-50"
    },
    {
      name: "Intensiv",
      price: "800",
      features: ["3 Ședințe / Săptămână", "Toate disciplinele incluse", "Înregistrări audio/video profesionale", "Diplomă de participare"],
      color: "border-pink-200",
      btnColor: "bg-pink-500",
      textColor: "text-pink-500",
      tabBg: "bg-pink-50"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <SectionHeader 
        title="Tarife Cursuri" 
        description="Investește în talentul copilului tău cu pachete flexibile și avantajoase."
      />

      {/* Mobile: Tabs Layout to save space */}
      <div className="md:hidden">
        {/* Visual Hint for Tabs */}
        <div className="flex justify-center mb-2 animate-bounce">
           <span className="bg-yellow-400 text-indigo-900 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
             <Hand size={12} className="rotate-180" /> Alege pachetul potrivit
           </span>
        </div>

        <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6 shadow-inner border border-gray-200">
          {plans.map((plan, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all duration-300 relative overflow-hidden ${
                activeTab === i 
                ? 'bg-white shadow-md text-gray-900 scale-100' 
                : 'text-gray-400 hover:text-gray-600 scale-95'
              }`}
            >
              {activeTab === i && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
              )}
              {plan.name}
            </button>
          ))}
        </div>

        {/* Active Mobile Card */}
        <div className={`bg-white rounded-[2rem] p-6 border-4 ${plans[activeTab].color} shadow-2xl relative overflow-hidden animate-fade-in`}>
           {plans[activeTab].popular && (
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-black px-4 py-2 rounded-bl-xl uppercase tracking-widest z-20">
                Recomandat
              </div>
            )}
            <h3 className={`text-2xl font-black mb-2 ${plans[activeTab].textColor}`}>{plans[activeTab].name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-gray-900">{plans[activeTab].price}</span>
              <span className="text-gray-500 font-bold text-sm">RON / lună</span>
            </div>
            
            <ul className="space-y-3 mb-6">
              {plans[activeTab].features.map((f, j) => (
                <li key={j} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                  <div className={`shrink-0 p-1 rounded-full ${plans[activeTab].btnColor} text-white mt-0.5`}>
                    <Check size={10} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })}
              className={`w-full py-3 rounded-xl font-black text-white shadow-lg ${plans[activeTab].btnColor}`}
            >
              Alege Planul
            </button>
        </div>
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan, i) => (
          <div key={i} className={`bg-white rounded-[2.5rem] p-8 md:p-10 border-4 ${plan.color} relative overflow-hidden transition-transform md:hover:scale-105 shadow-2xl flex flex-col`}>
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
    </div>
  );
};

export default Pricing;