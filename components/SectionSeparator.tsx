import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Mic, Palette, Trash2 } from 'lucide-react';

interface SeparatorProps {
  type: 'piano' | 'notes' | 'paint';
}

interface FloatingNote {
  id: number;
  label: string;
  x: number;
  y: number;
}

interface PaintParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  shape: string;
}

const noteFrequencies: Record<string, number> = {
  'do': 261.63, // C4
  'do#': 277.18,
  're': 293.66,
  're#': 311.13,
  'mi': 329.63,
  'fa': 349.23,
  'fa#': 369.99,
  'sol': 392.00,
  'sol#': 415.30,
  'la': 440.00,
  'la#': 466.16,
  'si': 493.88
};

// --- AUDIO UTILS ---
const getAudioContext = () => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  return new AudioContextClass();
};

const SectionSeparator: React.FC<SeparatorProps> = ({ type }) => {
  const [activeNotes, setActiveNotes] = useState<FloatingNote[]>([]);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Refs for interactions
  const isDragging = useRef(false);
  const lastKeyId = useRef<string | null>(null);
  const pianoContainerRef = useRef<HTMLDivElement>(null);

  // --- PAINT STATE ---
  const [particles, setParticles] = useState<PaintParticle[]>([]);
  const hueRef = useRef(0);

  // --- CHOIR STATE ---
  const [activeSingers, setActiveSingers] = useState<number[]>([]);
  
  // Definiții voci cu frecvențe și formanți specifici
  // Frecvențele notelor formează un acord de Do Major (C Major) extins
  const voices = [
    { 
      id: 0, 
      note: 130.81, // C3 (Bas profund)
      label: 'Bas', 
      color: 'bg-blue-600', 
      mouth: 'w-8 h-3 rounded-full',
      formants: [600, 1000, 2400], // Rezonanță de piept
      gains: [1, 0.5, 0.2] 
    },
    { 
      id: 1, 
      note: 196.00, // G3 (Tenor)
      label: 'Tenor', 
      color: 'bg-green-500', 
      mouth: 'w-7 h-5 rounded-[1rem]',
      formants: [650, 1100, 2600],
      gains: [1, 0.6, 0.3]
    },
    { 
      id: 2, 
      note: 329.63, // E4 (Alto)
      label: 'Alto', 
      color: 'bg-pink-500', 
      mouth: 'w-6 h-6 rounded-full',
      formants: [800, 1150, 2800], // Rezonanță mai caldă
      gains: [1, 0.7, 0.4]
    },
    { 
      id: 3, 
      note: 523.25, // C5 (Sopran)
      label: 'Sopran', 
      color: 'bg-yellow-400', 
      mouth: 'w-5 h-7 rounded-[2rem]',
      formants: [850, 1200, 3000], // Rezonanță de cap (head voice)
      gains: [0.8, 0.5, 0.2]
    }
  ];

  // Păstrăm referințe către nodurile audio pentru a le putea opri individual
  const activeVoicesRef = useRef<Record<number, { osc: OscillatorNode, gain: GainNode, lfo: OscillatorNode, filters: BiquadFilterNode[] } | null>>({});

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = getAudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // --- PIANO LOGIC ---
  const playPianoNote = (label: string, octaveOffset: number) => {
    try {
      initAudio();
      const ctx = audioCtxRef.current!;
      const now = ctx.currentTime;
      const frequency = noteFrequencies[label] * Math.pow(2, octaveOffset);
      
      const masterGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(frequency * 6, now);
      filter.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + 1.5);
      
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, now);
      
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.3, now + 0.02); 
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      osc.connect(masterGain);
      masterGain.connect(filter);
      filter.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 2.1);
    } catch (e) {}
  };

  const triggerPianoNote = (label: string, octave: number, clientX: number, clientY: number) => {
    const keyId = `${label}-${octave}`;
    if (lastKeyId.current === keyId) return;
    lastKeyId.current = keyId;
    setPressedKey(keyId);
    if (showHint) setShowHint(false);
    playPianoNote(label, octave);

    const newNote = { id: Math.random() + Date.now(), label, x: clientX, y: clientY };
    setActiveNotes((prev) => [...prev, newNote]);
    setTimeout(() => setActiveNotes((prev) => prev.filter((n) => n.id !== newNote.id)), 1200);
  };

  // --- CHOIR LOGIC (FORMANT SYNTHESIS) ---
  const startSinging = (singerId: number) => {
    try {
      initAudio();
      const ctx = audioCtxRef.current!;
      
      if (activeVoicesRef.current[singerId]) return; // Deja cântă

      const voiceData = voices.find(v => v.id === singerId);
      if (!voiceData) return;

      const now = ctx.currentTime;
      
      // 1. Sursa Principală (Sawtooth Wave - bogată în armonice)
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(voiceData.note, now);

      // 2. Vibrato (LFO) - oscilație fină a pitch-ului pentru realism
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 5.5; // Vibrato speed (Hz)
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = voiceData.note * 0.015; // Vibrato depth (mai mare la note înalte)
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(now);

      // 3. Filtre Formante (Vocal Tract) - Modelează "Ahhh"
      // Creăm 3 filtre bandpass paralele
      const filters: BiquadFilterNode[] = [];
      const filterGains: GainNode[] = [];
      
      const masterVoiceGain = ctx.createGain();
      masterVoiceGain.gain.setValueAtTime(0, now);
      masterVoiceGain.gain.linearRampToValueAtTime(0.2, now + 0.2); // Attack mai lent (human-like)

      voiceData.formants.forEach((freq, idx) => {
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.value = 4; // Rezonanță
        filter.frequency.value = freq;
        
        // Conectăm oscilatorul la filtru
        osc.connect(filter);
        
        // Ajustăm volumul formantului
        const fGain = ctx.createGain();
        fGain.gain.value = voiceData.gains[idx];
        filter.connect(fGain);
        fGain.connect(masterVoiceGain);
        
        filters.push(filter);
        filterGains.push(fGain);
      });

      // Conectăm la ieșire
      const compressor = ctx.createDynamicsCompressor(); // Previne distorsiunea când cântă toți
      masterVoiceGain.connect(compressor);
      compressor.connect(ctx.destination);

      osc.start(now);
      
      // Salvăm referințele
      activeVoicesRef.current[singerId] = { osc, gain: masterVoiceGain, lfo, filters };
      setActiveSingers(prev => [...prev, singerId]);
    } catch (e) {
      console.error(e);
    }
  };

  const stopSinging = (singerId: number) => {
    const voiceNode = activeVoicesRef.current[singerId];
    const ctx = audioCtxRef.current;

    if (voiceNode && ctx) {
      const { osc, gain, lfo } = voiceNode;
      const now = ctx.currentTime;
      
      // Release natural (coadă scurtă)
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.3); // 300ms release

      osc.stop(now + 0.35);
      lfo.stop(now + 0.35);
    }

    activeVoicesRef.current[singerId] = null;
    setActiveSingers(prev => prev.filter(id => id !== singerId));
  };

  // --- PAINT LOGIC ---
  const addPaintParticle = (x: number, y: number) => {
    hueRef.current = (hueRef.current + 5) % 360;
    const color = `hsl(${hueRef.current}, 85%, 65%)`;
    const id = Date.now() + Math.random();
    
    const r = () => Math.floor(Math.random() * 40 + 30);
    const shape = `${r()}% ${r()}% ${r()}% ${r()}% / ${r()}% ${r()}% ${r()}% ${r()}%`;

    const newParticle: PaintParticle = {
      id,
      x,
      y,
      size: Math.random() * 25 + 15,
      color,
      rotation: Math.random() * 360,
      shape: shape
    };

    setParticles(prev => [...prev, newParticle].slice(-200));
    if (showHint) setShowHint(false);
  };

  const clearCanvas = () => {
    setParticles([]);
    setShowHint(true);
  };

  // --- EVENT HANDLERS ---
  const handleStart = (fn: () => void) => {
    isDragging.current = true;
    fn();
  };
  
  const handleEnd = () => {
    isDragging.current = false;
    lastKeyId.current = null;
    setPressedKey(null);
  };

  // --- RENDERERS ---

  if (type === 'notes') { // CANTO - THE CHOIR
    return (
      <div className="relative w-full py-16 flex flex-col items-center justify-center my-8 select-none">
        {showHint && (
          <div className="absolute top-0 animate-bounce flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border border-purple-100 z-20">
            <Sparkles size={14} className="text-yellow-500" />
            <span className="text-xs font-bold text-purple-600">Trece mouse-ul peste fețe! 🎤</span>
          </div>
        )}
        
        <div className="flex gap-4 sm:gap-8 items-end h-48 sm:h-52">
          {voices.map((voice) => {
            const isSinging = activeSingers.includes(voice.id);
            return (
              <div 
                key={voice.id}
                onMouseEnter={() => startSinging(voice.id)}
                onMouseLeave={() => stopSinging(voice.id)}
                onTouchStart={(e) => { e.preventDefault(); startSinging(voice.id); }}
                onTouchEnd={(e) => { e.preventDefault(); stopSinging(voice.id); }}
                className={`relative flex flex-col items-center justify-end transition-all duration-300 ${isSinging ? '-translate-y-4 scale-110' : 'hover:-translate-y-2'}`}
              >
                 {/* Voice Bubble */}
                 <div className={`
                    w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-xl flex items-center justify-center 
                    transition-all duration-200 border-4 border-white
                    ${voice.color} ${isSinging ? 'ring-4 ring-offset-2 ring-purple-300 brightness-110' : ''}
                 `}>
                    <div className="flex flex-col items-center gap-1">
                      {/* Eyes - blink on sing */}
                      <div className="flex gap-2">
                        <div className={`bg-white rounded-full transition-all ${isSinging ? 'w-2 h-2' : 'w-2 h-1'}`}></div>
                        <div className={`bg-white rounded-full transition-all ${isSinging ? 'w-2 h-2' : 'w-2 h-1'}`}></div>
                      </div>
                      {/* Mouth - animated opening */}
                      <div className={`bg-gray-900 transition-all duration-200 ${isSinging ? `${voice.mouth} border-2 border-white scale-125` : 'w-3 h-1 rounded-full'}`}></div>
                    </div>
                 </div>
                 
                 {/* Body/Stand */}
                 <div className="w-1 h-8 bg-gray-300 mt-[-2px] -z-10"></div>
                 <div className="w-8 h-1 bg-gray-300 rounded-full"></div>

                 {/* Musical Note Particles */}
                 {isSinging && (
                   <div className="absolute -top-12 animate-float opacity-80 flex flex-col items-center">
                     <Mic size={24} className={voice.color.replace('bg-', 'text-')} />
                   </div>
                 )}
                 
                 <span className={`mt-3 text-xs font-black uppercase tracking-wider ${isSinging ? 'text-purple-600' : 'text-gray-400'}`}>
                   {voice.label}
                 </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === 'paint') { // PAINTING
    return (
      <div 
        className="relative w-full h-48 sm:h-72 flex flex-col items-center justify-center overflow-hidden my-8 touch-none cursor-crosshair bg-gray-50/50"
        onMouseMove={(e) => {
          if ((e.target as HTMLElement).closest('button')) return;
          const rect = e.currentTarget.getBoundingClientRect();
          addPaintParticle(e.clientX - rect.left, e.clientY - rect.top);
        }}
        onTouchMove={(e) => {
          if ((e.target as HTMLElement).closest('button')) return;
          e.preventDefault(); 
          const rect = e.currentTarget.getBoundingClientRect();
          const touch = e.touches[0];
          addPaintParticle(touch.clientX - rect.left, touch.clientY - rect.top);
        }}
      >
        <div className="absolute inset-0 border-y-2 border-dashed border-gray-200 pointer-events-none"></div>
        
        <button 
          onClick={clearCanvas}
          className="absolute top-4 right-4 z-20 bg-white p-2.5 rounded-xl shadow-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-100 transition-all active:scale-95 flex items-center gap-2 group"
          title="Șterge tot"
        >
          <span className="text-xs font-bold uppercase hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">Șterge</span>
          <Trash2 size={20} />
        </button>

        {showHint && (
          <div className="pointer-events-none absolute flex flex-col items-center gap-2 animate-pulse opacity-60 z-10">
            <Palette size={48} className="text-gray-300" />
            <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Desenează cu degetul! 🎨</span>
          </div>
        )}

        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute pointer-events-none animate-rebound"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.shape,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
              boxShadow: `inset -2px -2px 4px rgba(0,0,0,0.1), 0 2px 5px ${p.color}40`
            }}
          />
        ))}
      </div>
    );
  }

  // PIANO (unchanged visual structure, using updated helpers)
  const whiteKeys = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'];
  const blackKeys = [
    { label: 'do#', left: '14.28%' },
    { label: 're#', left: '28.57%' },
    { label: 'fa#', left: '57.14%' },
    { label: 'sol#', left: '71.42%' },
    { label: 'la#', left: '85.71%' }
  ];

  const handlePianoTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element instanceof HTMLElement) {
      const label = element.getAttribute('data-note');
      const octave = element.getAttribute('data-octave');
      if (label && octave) triggerPianoNote(label, parseInt(octave), touch.clientX, touch.clientY);
    }
  };

  return (
    <div 
      ref={pianoContainerRef}
      className="relative w-full flex flex-col items-center py-10 overflow-visible my-4 z-50 px-2 sm:px-0 touch-none"
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchMove={handlePianoTouchMove}
      onTouchEnd={handleEnd}
    >
      {showHint && (
        <div className="absolute -top-14 animate-bounce flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-[0_10px_25px_rgba(139,92,246,0.2)] border-2 border-purple-100 z-[60] cursor-default pointer-events-none">
          <div className="bg-yellow-400 p-1 rounded-full">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-sm font-black text-purple-700 whitespace-nowrap">Glisează pe clape! 🎹</span>
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none z-[9999]">
        {activeNotes.map((note) => (
          <div
            key={note.id}
            className="absolute animate-note-pop text-purple-600 font-black text-4xl drop-shadow-2xl italic uppercase tracking-widest select-none"
            style={{ left: note.x, top: note.y }}
          >
            {note.label}
          </div>
        ))}
      </div>

      <div className="w-full sm:max-w-4xl flex h-28 sm:h-40 relative px-1 sm:px-6 overflow-visible select-none shadow-2xl rounded-b-xl bg-gray-50 border-t-8 border-gray-900">
        {[...Array(2)].map((_, octaveIdx) => (
          <div key={octaveIdx} className="flex-1 relative h-full flex">
            {whiteKeys.map((label) => {
              const keyId = `${label}-${octaveIdx}`;
              const isPressed = pressedKey === keyId;
              return (
                <div
                  key={keyId}
                  data-note={label}
                  data-octave={octaveIdx}
                  onMouseDown={(e) => handleStart(() => triggerPianoNote(label, octaveIdx, e.clientX, e.clientY))}
                  onMouseEnter={(e) => isDragging.current && triggerPianoNote(label, octaveIdx, e.clientX, e.clientY)}
                  onTouchStart={(e) => handleStart(() => triggerPianoNote(label, octaveIdx, e.touches[0].clientX, e.touches[0].clientY))}
                  className={`piano-key-white flex-1 h-full border-r border-gray-200/50 last:border-r-0 cursor-pointer transition-colors duration-75 
                    ${isPressed ? '!bg-purple-400 !scale-[0.98] shadow-inner' : 'bg-white'}`}
                />
              );
            })}
            {blackKeys.map((bk) => {
              const keyId = `${bk.label}-${octaveIdx}`;
              const isPressed = pressedKey === keyId;
              return (
                <div
                  key={keyId}
                  data-note={bk.label}
                  data-octave={octaveIdx}
                  onMouseDown={(e) => handleStart(() => triggerPianoNote(bk.label, octaveIdx, e.clientX, e.clientY))}
                  onMouseEnter={(e) => isDragging.current && triggerPianoNote(bk.label, octaveIdx, e.clientX, e.clientY)}
                  onTouchStart={(e) => handleStart(() => triggerPianoNote(bk.label, octaveIdx, e.touches[0].clientX, e.touches[0].clientY))}
                  className={`piano-key-black absolute w-[10%] h-[62%] z-10 -translate-x-1/2 cursor-pointer shadow-lg transition-transform duration-75
                    ${isPressed ? '!bg-gray-700 !scale-95' : 'bg-gray-900'}`}
                  style={{ left: bk.left }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionSeparator;