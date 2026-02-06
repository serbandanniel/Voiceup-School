import React, { useState } from 'react';
import SectionHeader from './SectionHeader';
import { Check, Hand, Mic2, Music, Palette, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface PricingProps {
  playPop: () => void;
}

const Pricing: React.FC<PricingProps> = ({ playPop }) => {
  const [activeCategory, setActiveCategory] = useState<'canto' | 'piano' | 'art'>('canto');
  const [showLogistics, setShowLogistics] = useState(false);

  // Configurația prețurilor și a temelor pentru fiecare disciplină
  const pricingConfig = {
    canto: {
      label: 'Canto',
      icon: <Mic2 size={24} />,
      themeColor: 'purple', // Folosim purple ca bază, dar accente pink
      prices: { standard: '250', pro: '450', intensiv: '800' },
      features: {
        standard: ["Tehnică vocală de bază", "Respirație diafragmatică", "Repertoriu Pop/Jazz"],
        pro: ["Interpretare scenică", "Microfon technique", "Pregătire concursuri"],
        intensiv: ["Înregistrare studio", "Video performance", "Masterclass lunar"]
      }
    },
    piano: {
      label: 'Pian',
      icon: <Music size={24} />,
      themeColor: 'blue',
      prices: { standard: '280', pro: '500', intensiv: '900' },
      features: {
        standard: ["Citire partituri", "Poziția mâinii", "Melodii simple"],
        pro: ["Teorie muzicală avansată", "Improvizație", "Piese clasice & moderne"],
        intensiv: ["Compoziție muzicală", "Recital solo", "Tehnică avansată"]
      }
    },
    art: {
      label: 'Pictură',
      icon: <Palette size={24} />,
      themeColor: 'yellow',
      prices: { standard: '200', pro: '380', intensiv: '700' },
      features: {
        standard: ["Desen în creion", "Teoria culorilor", "Natură statică"],
        pro: ["Acuarelă & Acrilic", "Studiul anatomiei", "Peisagistică"],
        intensiv: ["Pictură pe pânză", "Expoziție personală", "Tehnici mixte"]
      }
    }
  };

  const currentConfig = pricingConfig[activeCategory];

  // Generarea dinamică a planurilor pe baza categoriei selectate
  const plans = [
    {
      name: "Standard",
      price: currentConfig.prices.standard,
      features: ["1 Ședință / Săptămână", "Durată: 50 minute", ...currentConfig.features.standard],
      color: activeCategory === 'piano' ? "border-blue-200" : activeCategory === 'art' ? "border-yellow-200" : "border-pink-200",
      bgHeader: activeCategory === 'piano' ? "bg-blue-50" : activeCategory === 'art' ? "bg-yellow-50" : "bg-pink-50",
      btnColor: activeCategory === 'piano' ? "bg-blue-500" : activeCategory === 'art' ? "bg-yellow-500 text-black" : "bg-pink-500",
      textColor: activeCategory === 'piano' ? "text-blue-500" : activeCategory === 'art' ? "text-yellow-600" : "text-pink-500",
    },
    {
      name: "Pro",
      price: currentConfig.prices.pro,
      features: ["2 Ședințe / Săptămână", "Durată: 50 minute", "Plan personalizat", ...currentConfig.features.pro],
      popular: true,
      color: activeCategory === 'piano' ? "border-blue-400 shadow-blue-100" : activeCategory === 'art' ? "border-yellow-400 shadow-yellow-100" : "border-purple-400 shadow-purple-100",
      bgHeader: activeCategory === 'piano' ? "bg-blue-100" : activeCategory === 'art' ? "bg-yellow-100" : "bg-purple-100",
      btnColor: activeCategory === 'piano' ? "bg-blue-600" : activeCategory === 'art' ? "bg-yellow-400 text-black" : "bg-purple-600",
      textColor: activeCategory === 'piano' ? "text-blue-600" : activeCategory === 'art' ? "text-yellow-700" : "text-purple-600",
    },
    {
      name: "Intensiv",
      price: currentConfig.prices.intensiv,
      features: ["3 Ședințe / Săptămână", "Toate materialele incluse", "Diplomă absolvire", ...currentConfig.features.intensiv],
      color: activeCategory === 'piano' ? "border-indigo-200" : activeCategory === 'art' ? "border-orange-200" : "border-indigo-200",
      bgHeader: activeCategory === 'piano' ? "bg-indigo-50" : activeCategory === 'art' ? "bg-orange-50" : "bg-indigo-50",
      btnColor: activeCategory === 'piano' ? "bg-indigo-500" : activeCategory === 'art' ? "bg-orange-500" : "bg-indigo-500",
      textColor: activeCategory === 'piano' ? "text-indigo-500" : activeCategory === 'art' ? "text-orange-600" : "text-indigo-500",
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <SectionHeader 
        title="Investiție în Viitor" 
        description="Alege pachetul potrivit. Fără costuri ascunse."
      />

      {/* DISCIPLINE SELECTOR - TABS (UPDATED: Bigger, Bolder) */}
      <div className="flex justify-center mb-10 md:mb-16">
        <div className="bg-white p-2 rounded-2xl shadow-xl border-2 border-gray-100 inline-flex flex-wrap justify-center gap-2 md:gap-3 w-full md:w-auto">
          {(Object.keys(pricingConfig) as Array<'canto' | 'piano' | 'art'>).map((key) => {
            const isActive = activeCategory === key;
            const item = pricingConfig[key];
            
            let activeStyle = "bg-gray-50 text-gray-400 hover:bg-gray-100";
            if (isActive) {
               if (key === 'canto') activeStyle = "bg-pink-500 text-white shadow-lg shadow-pink-200 scale-105";
               if (key === 'piano') activeStyle = "bg-blue-500 text-white shadow-lg shadow-blue-200 scale-105";
               if (key === 'art') activeStyle = "bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-200 scale-105";
            }

            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                onMouseEnter={playPop}
                className={`flex-1 md:flex-none px-6 py-3 md:px-10 md:py-4 rounded-xl font-black text-sm md:text-lg flex items-center justify-center gap-2 md:gap-3 transition-all duration-300 ${activeStyle}`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile: Compact Layout */}
      <div className="md:hidden flex flex-col gap-4">
        {plans.map((plan, i) => (
          <div key={i} className={`bg-white rounded-3xl border-2 ${plan.color} shadow-lg relative overflow-hidden animate-fade-in`}>
             {/* Compact Header: Name + Price Inline */}
             <div className={`flex justify-between items-center px-5 py-4 ${plan.bgHeader} border-b border-gray-100`}>
                <div className="flex flex-col">
                    <h3 className={`text-xl font-black leading-none ${plan.textColor}`}>{plan.name}</h3>
                    {plan.popular && <span className="text-[10px] uppercase font-bold text-gray-500 mt-1">⭐ Recomandat</span>}
                </div>
                <div className="text-right">
                    <span className="block text-3xl font-black text-gray-900 leading-none">{plan.price} <span className="text-sm text-gray-500 font-bold align-middle">RON</span></span>
                </div>
             </div>
             
             <div className="p-5 flex flex-col gap-4">
                {/* Dense Features List */}
                <ul className="grid grid-cols-1 gap-2">
                    {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-gray-600 font-bold leading-tight">
                        <div className={`shrink-0 p-0.5 rounded-full ${plan.btnColor} ${activeCategory === 'art' && plan.name !== 'Standard' ? 'text-black' : 'text-white'} mt-0.5`}>
                        <Check size={10} />
                        </div>
                        {f}
                    </li>
                    ))}
                </ul>

                {/* Compact Button */}
                <button 
                    onClick={() => document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })}
                    onMouseEnter={playPop}
                    className={`w-full py-3.5 rounded-2xl font-black text-base ${activeCategory === 'art' ? 'text-gray-900' : 'text-white'} shadow-lg active:scale-95 transition-transform ${plan.btnColor}`}
                >
                    Alege {plan.name}
                </button>
             </div>
          </div>
        ))}
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 items-stretch mb-12">
        {plans.map((plan, i) => (
          <div key={i} className={`bg-white rounded-[2.5rem] p-8 md:p-10 border-4 ${plan.color} relative overflow-hidden transition-transform md:hover:scale-105 shadow-2xl flex flex-col`}>
            {plan.popular && (
              <div className={`absolute top-0 right-0 ${activeCategory === 'piano' ? 'bg-blue-600' : activeCategory === 'art' ? 'bg-yellow-500 text-black' : 'bg-purple-600'} text-white text-[10px] font-black px-4 py-2 rounded-bl-xl uppercase tracking-widest z-20`}>
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
                  <div className={`shrink-0 p-1 rounded-full ${plan.btnColor} ${activeCategory === 'art' && plan.name !== 'Standard' ? 'text-black' : 'text-white'}`}>
                    <Check size={12} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' })}
              onMouseEnter={playPop}
              className={`w-full py-4 rounded-2xl font-black ${activeCategory === 'art' ? 'text-gray-900' : 'text-white'} shadow-lg transition-transform active:scale-95 ${plan.btnColor} mt-auto`}
            >
              Alege Planul
            </button>
          </div>
        ))}
      </div>

      {/* Logistics & Policies - Collapsible for Mobile */}
      <div className="mt-8 md:mt-16 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <button 
          onClick={() => setShowLogistics(!showLogistics)}
          className="w-full flex items-center justify-between p-6 md:p-8 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
               <Clock size={24} />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-black text-gray-800">Logistică și Întrebări Frecvente</h3>
              <p className="text-sm text-gray-500 font-medium">Orar, absențe și detalii importante.</p>
            </div>
          </div>
          {showLogistics ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
        </button>
        
        <div className={`transition-all duration-300 ease-in-out ${showLogistics ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8 border-t border-gray-100">
            <div>
               <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                 <Clock size={18} className="text-blue-500" /> Program General
               </h4>
               <ul className="space-y-2 text-gray-600 text-sm font-medium">
                 <li className="flex justify-between border-b border-gray-100 pb-2"><span>Luni - Vineri:</span> <span className="font-bold text-gray-900">10:00 - 20:00</span></li>
                 <li className="flex justify-between border-b border-gray-100 pb-2"><span>Sâmbătă:</span> <span className="font-bold text-gray-900">09:00 - 16:00</span></li>
                 <li className="text-xs text-gray-400 pt-1">*Lecțiile se programează individual sau în grupe mici.</li>
               </ul>
            </div>
            <div>
               <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                 <AlertCircle size={18} className="text-red-500" /> Politici
               </h4>
               <ul className="space-y-3 text-gray-600 text-sm font-medium">
                 <li className="flex gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></div>
                   <span><strong>Absențe:</strong> O ședință poate fi reprogramată dacă suntem anunțați cu 24h înainte.</span>
                 </li>
                 <li className="flex gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></div>
                   <span><strong>Recuperări:</strong> Ședințele anulate pe motiv medical se recuperează în limita disponibilității.</span>
                 </li>
                 <li className="flex gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></div>
                   <span><strong>Plata:</strong> Abonamentele se achită la începutul lunii (1-5 ale lunii).</span>
                 </li>
               </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;