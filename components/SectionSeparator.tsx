import React, { useState, useRef, useEffect } from 'react';
import { Music, Palette, Piano, Star, Sparkles, Hand } from 'lucide-react';

interface SeparatorProps {
  type: 'piano' | 'notes' | 'paint';
}

interface FloatingNote {
  id: number;
  label: string;
  x: number;
  y: number;
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

const SectionSeparator: React.FC<SeparatorProps> = ({ type }) => {
  const [activeNotes, setActiveNotes] = useState<FloatingNote[]>([]);
  const [showHint, setShowHint] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  const isDragging = useRef(false);
  const lastKeyId = useRef<string | null>(null);
  const pianoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const playNoteSound = (label: string, octaveOffset: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const frequency = noteFrequencies[label] * Math.pow(2, octaveOffset);
      
      const masterGain = ctx.createGain();
      
      // Filter pentru a simula cutia de rezonanță a pianului
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(frequency * 8, now);
      filter.frequency.exponentialRampToValueAtTime(frequency * 1.2, now + 2.5);
      filter.Q.value = 0.5;

      // Un pian real are 3 corzi per notă care nu sunt perfect acordate (unison detune)
      // Acest lucru creează acel "chorus" natural și bogat
      const createString = (freq: number, gainValue: number, detune: number) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime(detune, now);
        
        g.gain.setValueAtTime(gainValue, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
        
        osc.connect(g);
        g.connect(masterGain);
        osc.start(now);
        osc.stop(now + 2.5);
      };

      // Corzile principale (fundamentala cu ușoară detunare)
      createString(frequency, 0.4, -1.5);
      createString(frequency, 0.4, 0);
      createString(frequency, 0.4, 1.5);

      // Adăugăm armonice pentru realism
      const harmonics = [
        { mult: 2, gain: 0.15, type: 'sine' as OscillatorType },   
        { mult: 3, gain: 0.08, type: 'sine' as OscillatorType },      
        { mult: 4, gain: 0.04, type: 'sine' as OscillatorType },      
      ];

      harmonics.forEach(h => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = h.type;
        osc.frequency.setValueAtTime(frequency * h.mult, now);
        g.gain.setValueAtTime(h.gain, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + (1.5 / h.mult));
        osc.connect(g);
        g.connect(masterGain);
        osc.start(now);
        osc.stop(now + 2.0);
      });

      // Zgomotul ciocănelului (atac percutiv)
      const hammer = ctx.createOscillator();
      const hammerGain = ctx.createGain();
      hammer.type = 'sine';
      hammer.frequency.setValueAtTime(frequency * 5, now);
      hammerGain.gain.setValueAtTime(0.08, now);
      hammerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      hammer.connect(hammerGain);
      hammerGain.connect(masterGain);
      hammer.start(now);
      hammer.stop(now + 0.1);

      masterGain.connect(filter);
      filter.connect(ctx.destination);

      // Plicul principal de volum
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.5, now + 0.005); 
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    } catch (error) {
      console.warn('Audio error:', error);
    }
  };

  const triggerNote = (label: string, octave: number, clientX: number, clientY: number) => {
    const keyId = `${label}-${octave}`;
    
    // Verificăm dacă aceeași clapă este deja sub deget/mouse
    if (lastKeyId.current === keyId) return;
    lastKeyId.current = keyId;

    if (showHint) setShowHint(false);

    playNoteSound(label, octave);

    const newNote = { id: Math.random() + Date.now(), label, x: clientX, y: clientY };
    setActiveNotes((prev) => [...prev, newNote]);
    
    setTimeout(() => {
      setActiveNotes((prev) => prev.filter((n) => n.id !== newNote.id));
    }, 1200);
  };

  // Evenimente Mouse
  const handleMouseDown = (label: string, octave: number, e: React.MouseEvent) => {
    isDragging.current = true;
    triggerNote(label, octave, e.clientX, e.clientY);
  };

  const handleMouseEnter = (label: string, octave: number, e: React.MouseEvent) => {
    if (isDragging.current) {
      triggerNote(label, octave, e.clientX, e.clientY);
    }
  };

  const handleMouseUpGlobal = () => {
    isDragging.current = false;
    lastKeyId.current = null;
  };

  // Evenimente Touch (Esențiale pentru mobil)
  const handleTouchStart = (label: string, octave: number, e: React.TouchEvent) => {
    // CRITICAL: PreventDefault oprește browserul din a simula un "click" (mousedown) după touch.
    // Acest lucru rezolvă problema dublei apăsări pe Android/iOS.
    if (e.cancelable) e.preventDefault();
    
    isDragging.current = true;
    const touch = e.touches[0];
    triggerNote(label, octave, touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    if (e.cancelable) e.preventDefault();
    
    const touch = e.touches[0];
    // Găsim elementul de sub deget în timpul glisării
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element && element instanceof HTMLElement) {
      const label = element.getAttribute('data-note');
      const octave = element.getAttribute('data-octave');
      
      if (label && octave !== null) {
        triggerNote(label, parseInt(octave), touch.clientX, touch.clientY);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Împiedicăm declanșarea oricărui mouse event rezidual
    if (e.cancelable) e.preventDefault();
    isDragging.current = false;
    lastKeyId.current = null;
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUpGlobal);
    return () => window.removeEventListener('mouseup', handleMouseUpGlobal);
  }, []);

  if (type === 'piano') {
    const whiteKeys = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'];
    const blackKeys = [
      { label: 'do#', left: '14.28%' },
      { label: 're#', left: '28.57%' },
      { label: 'fa#', left: '57.14%' },
      { label: 'sol#', left: '71.42%' },
      { label: 'la#', left: '85.71%' }
    ];

    return (
      <div 
        ref={pianoContainerRef}
        className="relative w-full flex flex-col items-center py-10 overflow-visible my-4 z-50 px-2 sm:px-0 touch-none"
        onMouseUp={handleMouseUpGlobal}
        onMouseLeave={handleMouseUpGlobal}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Visual Hint */}
        {showHint && (
          <div className="absolute -top-14 animate-bounce flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-[0_10px_25px_rgba(139,92,246,0.2)] border-2 border-purple-100 z-[60] cursor-default pointer-events-none">
            <div className="bg-yellow-400 p-1 rounded-full">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-sm font-black text-purple-700 whitespace-nowrap">Glisează pe clape! Glisando 🎹✨</span>
            <Hand size={18} className="text-purple-400 animate-pulse rotate-12" />
          </div>
        )}

        {/* Note animate */}
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

        {/* Keyboard Container */}
        <div className="w-full sm:max-w-4xl flex h-28 sm:h-40 relative px-1 sm:px-6 overflow-visible select-none shadow-2xl rounded-b-xl bg-gray-50 border-t-8 border-gray-900">
          {[...Array(2)].map((_, octaveIdx) => (
            <div key={octaveIdx} className="flex-1 relative h-full flex">
              {whiteKeys.map((label, i) => (
                <div
                  key={label + i}
                  data-note={label}
                  data-octave={octaveIdx}
                  onMouseDown={(e) => handleMouseDown(label, octaveIdx, e)}
                  onMouseEnter={(e) => handleMouseEnter(label, octaveIdx, e)}
                  onTouchStart={(e) => handleTouchStart(label, octaveIdx, e)}
                  className="piano-key-white bg-white flex-1 h-full border-r border-gray-200/50 last:border-r-0 cursor-pointer"
                />
              ))}
              {blackKeys.map((bk, i) => (
                <div
                  key={bk.label + i}
                  data-note={bk.label}
                  data-octave={octaveIdx}
                  onMouseDown={(e) => handleMouseDown(bk.label, octaveIdx, e)}
                  onMouseEnter={(e) => handleMouseEnter(bk.label, octaveIdx, e)}
                  onTouchStart={(e) => handleTouchStart(bk.label, octaveIdx, e)}
                  className="piano-key-black bg-gray-900 absolute w-[10%] h-[62%] z-10 -translate-x-1/2 cursor-pointer shadow-lg"
                  style={{ left: bk.left }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'paint') {
    return (
      <div className="relative w-full h-32 flex items-center justify-center overflow-visible my-8">
        <div className="absolute inset-0 flex justify-around items-center px-4 sm:px-[15%] pointer-events-none overflow-visible">
          <div className="animate-blink-blur" style={{ animationDelay: '0s' }}>
            <Piano className="text-blue-500/90 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]" size={80} />
          </div>
          <div className="animate-blink-blur" style={{ animationDelay: '0.8s' }}>
            <Music className="text-purple-500/90 drop-shadow-[0_0_20px_rgba(167,139,250,0.3)]" size={70} />
          </div>
          <div className="animate-blink-blur" style={{ animationDelay: '1.6s' }}>
            <Palette className="text-pink-500/90 drop-shadow-[0_0_20px_rgba(244,114,182,0.3)]" size={75} />
          </div>
        </div>
        <div className="absolute inset-0 flex gap-20 justify-center items-center opacity-20 blur-[80px] pointer-events-none">
          <div className="w-60 h-20 bg-blue-300 rounded-full rotate-12" />
          <div className="w-56 h-24 bg-purple-200 rounded-full -rotate-6" />
          <div className="w-60 h-20 bg-pink-300 rounded-full rotate-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-16 flex justify-center items-center relative overflow-visible my-8">
      <div className="absolute inset-0 flex justify-center items-center gap-20 sm:gap-64 pointer-events-none overflow-visible">
        <div className="animate-blink-blur" style={{ animationDelay: '0.5s' }}>
          <Music size={120} className="text-purple-400/30 drop-shadow-2xl" />
        </div>
        <div className="animate-blink-blur" style={{ animationDelay: '2.5s' }}>
          <Star size={100} className="text-yellow-300/30 drop-shadow-2xl" />
        </div>
      </div>
      <div className="relative z-10 flex items-center gap-6 sm:gap-16 opacity-100 drop-shadow-xl">
        <Music size={56} className="text-purple-600 animate-float" />
        <div className="h-1 w-16 sm:w-48 bg-gradient-to-r from-transparent via-purple-200 to-transparent rounded-full" />
        <Piano size={48} className="text-blue-500 animate-float" style={{ animationDelay: '0.6s' }} />
        <div className="h-1 w-16 sm:w-48 bg-gradient-to-r from-transparent via-pink-200 to-transparent rounded-full" />
        <Palette size={56} className="text-pink-600 animate-float" style={{ animationDelay: '1.2s' }} />
      </div>
    </div>
  );
};

export default SectionSeparator;