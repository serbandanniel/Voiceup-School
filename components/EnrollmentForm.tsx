import React, { useState } from 'react';
import { Mic2, Music, Palette, CheckCircle2, User, Sparkles, Trophy, CalendarClock } from 'lucide-react';

const EnrollmentForm: React.FC = () => {
  const [status, setStatus] = useState<null | 'success' | 'loading'>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) {
      alert("Te rugăm să alegi un curs!");
      return;
    }
    // Daca nu a ales plan, consideram Evaluare Gratuita
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1500);
  };

  const courses = [
    { id: 'Canto', fullName: 'Canto Modern', icon: Mic2, color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-200', active: 'ring-pink-400 bg-pink-100' },
    { id: 'Pian', fullName: 'Pian Creativ', icon: Music, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', active: 'ring-blue-400 bg-blue-100' },
    { id: 'Pictură', fullName: 'Pictură & Desen', icon: Palette, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200', active: 'ring-yellow-400 bg-yellow-100' }
  ];

  const plans = [
    { id: 'Evaluare', price: 'GRATUIT', sessions: 'Ședință de cunoaștere (30 min)', recommended: true },
    { id: 'Standard', price: '250 Lei', sessions: '1 ședință / săptămână' },
    { id: 'Pro', price: '450 Lei', sessions: '2 ședințe / săptămână' },
  ];

  const currentPlanDetails = plans.find(p => p.id === selectedPlan);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 relative">
        
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-gray-900 to-indigo-900 p-8 text-center text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Rezervă un loc</h2>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/30"></div>
            <p className="text-blue-100 text-sm md:text-base font-medium">Primul pas spre scenă începe aici.</p>
          </div>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-500 via-transparent to-transparent"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 grid lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Coloana Stânga: Date Personale */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <User size={16} />
              </div>
              <h3 className="text-lg font-black text-gray-800">Date Contact</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Părinte</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all font-bold text-gray-700 text-sm" placeholder="Ex: Popescu Ion" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Telefon</label>
                <input required type="tel" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all font-bold text-gray-700 text-sm" placeholder="07XX..." />
              </div>
            </div>
            
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8 space-y-1.5">
                <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Nume Copil</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all font-bold text-gray-700 text-sm" placeholder="Ex: Andrei" />
              </div>
              <div className="col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Vârstă</label>
                <input required type="number" min="3" max="18" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all font-bold text-gray-700 text-sm" placeholder="Ani" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Email</label>
              <input required type="email" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all font-bold text-gray-700 text-sm" placeholder="email@exemplu.com" />
            </div>
          </div>

          {/* Coloana Dreapta: Selecții */}
          <div className="space-y-6 relative">
             <div className="hidden lg:block absolute left-[-24px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

             {/* Selector Curs */}
             <div>
                <div className="flex items-center gap-2 mb-3">
                  <Music size={18} className="text-blue-500" />
                  <h3 className="text-lg font-black text-gray-800">Alege Cursul</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {courses.map((course) => {
                    const isSelected = selectedCourse === course.id;
                    const Icon = course.icon;
                    return (
                      <button
                        key={course.id}
                        type="button"
                        onClick={() => setSelectedCourse(course.id)}
                        className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 ${
                          isSelected 
                            ? `${course.active} ring-2 ring-offset-1 border-transparent scale-105 shadow-md z-10` 
                            : `bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50`
                        }`}
                      >
                        {isSelected && <div className="absolute top-1 right-1"><CheckCircle2 size={16} className="text-gray-900" /></div>}
                        <Icon size={28} className={`mb-2 ${course.color}`} />
                        <span className={`text-xs font-black leading-tight ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>{course.id}</span>
                      </button>
                    );
                  })}
                </div>
             </div>

             {/* Selector Abonament */}
             <div className={`transition-all duration-500 ${selectedCourse ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Trophy size={18} className="text-yellow-500" />
                    <h3 className="text-lg font-black text-gray-800">Tip Rezervare</h3>
                  </div>
                </div>

                {/* Updated Layout: Vertical Stack with Horizontal Item Content */}
                <div className="flex flex-col gap-3">
                  {plans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    const isEvaluare = plan.id === 'Evaluare';
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`relative w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 
                          ${isSelected 
                            ? 'bg-gray-900 border-gray-900 text-white shadow-lg scale-[1.02] z-10' 
                            : 'bg-white border-gray-100 text-gray-600 hover:border-purple-200 hover:bg-gray-50'
                          } 
                          ${isEvaluare && !isSelected ? 'border-green-200 shadow-green-100 bg-green-50/50' : ''}
                        `}
                      >
                        {isEvaluare && !isSelected && (
                          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-black px-3 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                            Recomandat pentru început
                          </div>
                        )}
                        
                        <div className="flex flex-col text-left">
                            <span className="text-base font-black tracking-tight">{plan.id}</span>
                            <span className={`text-[10px] font-bold ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>{plan.sessions}</span>
                        </div>
                        
                        <span className={`text-lg font-black ${isSelected ? 'text-white' : 'text-purple-600'}`}>{plan.price}</span>
                      </button>
                    );
                  })}
                </div>
             </div>

             {/* Submit Button */}
             <button 
                disabled={status === 'loading'}
                className="w-full py-4 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-purple-500/20 active:scale-[0.98] transition-all disabled:opacity-70 group relative overflow-hidden"
              >
                 <span className="relative z-10 flex items-center justify-center gap-2">
                   {status === 'loading' ? 'Se procesează...' : status === 'success' ? 'Trimis! 🎉' : 'Trimite Solicitarea'}
                   {status !== 'loading' && status !== 'success' && <Sparkles size={18} className="text-yellow-300 animate-pulse" />}
                 </span>
                 <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentForm;