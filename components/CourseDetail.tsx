import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, HelpCircle, ChevronDown, ChevronUp, Sparkles, Mic2, Music, Palette } from 'lucide-react';

interface CourseDetailProps {
  courseId: string;
  onBack: () => void;
  onEnroll: () => void;
}

const courseData: Record<string, any> = {
  'canto': {
    title: "Canto Modern",
    subtitle: "Muzica e o super-putere",
    headline: "Descoperă-ți vocea și transformă emoțiile în muzică!",
    description: "Nu e vorba doar despre a cânta corect notele, ci despre a prinde curaj. La cursul de Canto Modern, transformăm „mi-e rușine” în „abia aștept să urc pe scenă”. Abordăm muzica actuală – de la hiturile de la radio până la piesele tale preferate din filme – și învățăm cum să ne folosim vocea ca pe cel mai versatil instrument.\n\nFie că ești genul care face spectacol în fața oglinzii sau, dimpotrivă, ai vrea să cânți dar ai emoții, aici găsești un mediu relaxat, fără critici aspre, unde vocea ta contează.",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=1200",
    icon: <Mic2 size={40} className="text-pink-500" />,
    color: "pink",
    learnings: [
      { title: "Respirație și Control", text: "Învățăm să nu „rămânem fără aer” la jumătatea refrenului și să ne protejăm corzile vocale." },
      { title: "Atitudine scenică", text: "Cum ținem microfonul, cum ne mișcăm și cum transmitem emoție celor care ne ascultă." },
      { title: "Repertoriu cool", text: "Nu cântăm piese de acum 100 de ani (decât dacă îți plac!), ci ne concentrăm pe stiluri moderne: Pop, Rock, Soul sau Jazz." },
      { title: "Încredere", text: "Cel mai mare câștig este încrederea în sine, care te va ajuta nu doar la muzică, ci și la școală sau în viața de zi cu zi." }
    ],
    faqs: [
      { q: "Trebuie să am „voce” sau talent nativ ca să mă înscriu?", a: "Absolut deloc! Vocea este un instrument care se educă. Chiar dacă acum crezi că nu poți atinge notele corecte, prin exercițiu și tehnică, oricine poate învăța să cânte corect și plăcut. Talentul e doar 10%, restul e pasiune și antrenament." },
      { q: "Ce fel de melodii vom cânta?", a: "Piesele care îți plac ție! Nu impunem un repertoriu învechit. Vom alege împreună melodii moderne, potrivite vârstei și preferințelor tale, pentru că înveți cel mai repede atunci când cânți ce iubești." },
      { q: "Îmi este foarte rușine să cânt în fața altora. Ce fac?", a: "Ești în locul potrivit. Majoritatea cursanților încep cu emoții. Lucrăm pas cu pas, într-un mediu sigur, și vei vedea că pe măsură ce înveți să-ți controlezi vocea, dispare și teama. Nu te forțăm să urci pe scenă până nu te simți pregătit." }
    ]
  },
  'piano': {
    title: "Pian Creativ",
    subtitle: "Adio lecții plictisitoare, bun venit distracție",
    headline: "Clapele devin prietenele tale – Muzică prin intuiție și joacă",
    description: "Uită de mitul că pianul este un instrument rigid și greu de învățat. Metoda noastră „Pian Creativ” pune accent pe bucuria de a cânta, nu pe tocit teorie muzicală aridă. Ne dorim ca elevii să se așeze la pian cu zâmbetul pe buze, nu din obligație.\n\nAbordarea noastră este intuitivă: conectăm sunetele cu povești și imagini, astfel încât degetele să înceapă să „danseze” pe clape mult mai repede decât în metodele clasice. Este locul unde disciplina întâlnește distracția.",
    image: "https://images.unsplash.com/photo-1520527057854-13c3ee67d34c?auto=format&fit=crop&q=80&w=1200",
    icon: <Music size={40} className="text-blue-500" />,
    color: "blue",
    learnings: [
      { title: "Învățare accelerată", text: "Vei putea cânta melodii simple și recunoscute încă de la primele ședințe. Satisfacția rezultatului imediat este cel mai bun motivator!" },
      { title: "Ritm și Coordonare", text: "Ne antrenăm creierul să facă două lucruri deodată (mâna stângă și mâna dreaptă), ceea ce ajută enorm la dezvoltarea concentrării." },
      { title: "Teorie aplicată (Funny)", text: "Învățăm limbajul muzical (note, pauze, chei) prin jocuri și asocieri logice, nu prin memorare mecanică." },
      { title: "Creativitate", text: "Nu doar reproducem partituri; te încurajăm să improvizăm și să descoperi sunete noi care îți plac." }
    ],
    faqs: [
      { q: "Trebuie să am pian acasă?", a: "Pentru început, nu este obligatoriu un pian clasic (care ocupă mult loc). O orgă electronică sau un pian digital cu clape grele este perfect pentru a exersa acasă ceea ce învățăm la curs." },
      { q: "Vom învăța și teorie muzicală? Pare complicat...", a: "Da, învățăm teorie, dar nu în stilul plictisitor de la școală. O „ascundem” în jocuri și explicații logice. Vei învăța să citești notele la fel de natural cum ai învățat să citești literele, fără să simți că tocești." },
      { q: "De la ce vârstă se poate începe?", a: "Metoda noastră creativă permite copiilor să înceapă chiar de la 4-5 ani. Pentru că folosim culori, asocieri și povești, cei mici nu au nevoie să știe să scrie sau să citească pentru a cânta la pian." }
    ]
  },
  'painting': {
    title: "Pictură & Desen",
    subtitle: "Nu există „nu am talent”, doar imaginație",
    headline: "Laboratorul de Imaginație – Aici greșelile sunt doar noi descoperiri",
    description: "Ai auzit vreodată expresia „eu nu știu să desenez”? Aici o ștergem din vocabular! La cursul de Pictură & Desen, credem că fiecare copil este un artist care doar are nevoie de instrumentele potrivite. Nu căutăm perfecțiunea geometrică, ci expresivitatea și libertatea de a pune pe hârtie ceea ce simți.\n\nEste un spațiu colorat și prietenos, unde ne murdărim pe mâini (la propriu!) și explorăm texturi, forme și tehnici diverse. Aici, o linie strâmbă poate fi începutul unei capodopere abstracte.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200",
    icon: <Palette size={40} className="text-yellow-500" />,
    color: "yellow",
    learnings: [
      { title: "Explorare totală", text: "Lucrăm cu acuarele, acrilice, creioane, cărbune și colaje. Nu ne plictisim niciodată cu un singur stil." },
      { title: "Curajul de a greși", text: "Învățăm că în artă nu există „greșit”, există doar „diferit”. Asta ajută enorm la scăderea anxietății de performanță." },
      { title: "Observație și Detaliu", text: "Învățăm să privim lumea altfel – să vedem lumina, umbrele și culorile pe care alții poate le ignoră." },
      { title: "Proiecte personale", text: "Fiecare cursant este încurajat să își aleagă temele care îl pasionează, de la personaje fantastice la peisaje sau artă abstractă." }
    ],
    faqs: [
      { q: "Copilul meu spune că „nu știe să deseneze”. Are rost să vină?", a: "Tocmai de aceea trebuie să vină! „Nu știu” înseamnă de fapt „mi-e teamă să nu greșesc”. Aici încurajăm procesul, nu perfecțiunea. Prin exerciții simple, orice copil descoperă că poate desena orice își imaginează." },
      { q: "Trebuie să aducem materiale de acasă?", a: "De cele mai multe ori, noi punem la dispoziție materialele necesare pentru a experimenta tehnici diverse. Voi trebuie să veniți doar cu haine comode (care se pot păta puțin, pentru că arta cere sacrificii!) și multă voie bună." },
      { q: "Ce facem cu lucrările la final?", a: "Le luați acasă, desigur! Încurajăm părinții să expună lucrările copiilor. Fiecare curs se termină cu o mică „vernisare” personală, iar portofoliul de artist va crește de la o ședință la alta." }
    ]
  }
};

const CourseDetail: React.FC<CourseDetailProps> = ({ courseId, onBack, onEnroll }) => {
  const data = courseData[courseId];
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!data) return <div>Curs inexistent</div>;

  const bgGradient = data.color === 'pink' ? 'from-pink-50 via-white to-pink-50' 
                   : data.color === 'blue' ? 'from-blue-50 via-white to-blue-50' 
                   : 'from-yellow-50 via-white to-yellow-50';

  const accentColor = data.color === 'pink' ? 'text-pink-600'
                    : data.color === 'blue' ? 'text-blue-600'
                    : 'text-yellow-600';
  
  const buttonColor = data.color === 'pink' ? 'bg-pink-600 hover:bg-pink-700'
                    : data.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-black';

  return (
    // Updated padding-top: pt-32 on mobile, pt-28 on desktop to avoid header overlap
    <div className={`min-h-screen bg-gradient-to-b ${bgGradient} pt-32 md:pt-28 pb-12 animate-fade-in`}>
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 mb-8 px-5 py-2.5 bg-white rounded-full shadow-md hover:shadow-lg transition-all text-gray-600 font-bold"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Înapoi la Cursuri
        </button>

        {/* Hero Section */}
        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl mb-12 border-8 border-white group">
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700 z-10"></div>
          {/* Reduced image height: h-[250px] on mobile, h-[400px] on desktop */}
          <img src={data.image} alt={data.title} className="w-full h-[250px] md:h-[400px] object-cover" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white">
            <div className="flex items-center gap-3 mb-4">
               <div className={`p-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30`}>
                 {data.icon}
               </div>
               <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/30">
                 {data.subtitle}
               </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-none drop-shadow-lg">{data.title}</h1>
            <p className="text-lg md:text-2xl font-medium text-gray-100 max-w-2xl leading-relaxed">{data.headline}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description */}
            <div className="prose prose-lg text-gray-700">
               <h3 className={`text-2xl font-black mb-4 flex items-center gap-2 ${accentColor}`}>
                 <Sparkles size={24} /> Povestea Cursului
               </h3>
               <p className="whitespace-pre-line leading-loose text-lg font-medium">
                 {data.description}
               </p>
            </div>

            {/* Learnings Grid */}
            <div>
              <h3 className={`text-2xl font-black mb-8 flex items-center gap-2 ${accentColor}`}>
                <CheckCircle2 size={24} /> Ce facem concret?
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {data.learnings.map((learn: any, i: number) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] shadow-lg border border-gray-100 hover:-translate-y-1 transition-transform">
                    <h4 className="font-black text-gray-900 text-lg mb-2">{learn.title}</h4>
                    <p className="text-gray-600 text-sm font-medium leading-relaxed">{learn.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h3 className={`text-2xl font-black mb-8 flex items-center gap-2 ${accentColor}`}>
                <HelpCircle size={24} /> Întrebări Frecvente
              </h3>
              <div className="space-y-4">
                {data.faqs.map((faq: any, i: number) => (
                  <div key={i} className="bg-white rounded-[1.5rem] shadow-md border border-gray-50 overflow-hidden transition-all duration-300">
                    <button 
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-800 hover:text-purple-600 transition-colors"
                    >
                      <span className="text-lg pr-4">{faq.q}</span>
                      {openFaq === i ? <ChevronUp className="shrink-0 text-purple-500" /> : <ChevronDown className="shrink-0 text-gray-400" />}
                    </button>
                    <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-gray-600 leading-relaxed font-medium">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sticky Sidebar CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-8 rounded-[2.5rem] shadow-2xl border-4 border-gray-50 text-center">
              <h3 className="text-2xl font-black text-gray-900 mb-2">Ți-a plăcut?</h3>
              <p className="text-gray-500 font-bold mb-8">Rezervă locul tău acum și începe aventura!</p>
              
              <button 
                onClick={onEnroll}
                className={`w-full py-4 rounded-xl font-black text-white shadow-xl ${buttonColor} transform hover:scale-105 active:scale-95 transition-all mb-4`}
              >
                Înscrie-te la {data.title}
              </button>
              
              <p className="text-xs text-gray-400 font-medium">
                Locuri limitate. Prima ședință de evaluare este gratuită!
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CourseDetail;
