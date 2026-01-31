import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Mic, Palette, Trash2, Brush } from 'lucide-react';

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

// --- AUDIO UTILS ---
const getAudioContext = () => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  return new AudioContextClass();
};

// Create an Impulse Response for Reverb (Simulates a large hall)
const createReverbBuffer = (ctx: AudioContext) => {
  const duration = 2.0;
  const decay = 2.0;
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const impulse = ctx.createBuffer(2, length, sampleRate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);

  for (let i = 0; i < length; i++) {
    const n = i / length;
    // Exponential decay noise
    left[i] = (Math.random() * 2 - 1) * Math.pow(1 - n, decay);
    right[i] = (Math.random() * 2 - 1) * Math.pow(1 - n, decay);
  }
  return impulse;
};

const SectionSeparator: React.FC<SeparatorProps> = ({ type }) => {
  const [activeNotes, setActiveNotes] = useState<FloatingNote[]>([]);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(true);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const reverbNodeRef = useRef<ConvolverNode | null>(null);
  const masterCompressorRef = useRef<DynamicsCompressorNode | null>(null);
  
  // Refs for interactions
  const isDragging = useRef(false);
  const lastKeyId = useRef<string | null>(null);
  const pianoContainerRef = useRef<HTMLDivElement>(null);

  // --- PAINT STATE (CANVAS) ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const hueRef = useRef(0);

  // --- CHOIR STATE ---
  const [activeSingers, setActiveSingers] = useState<number[]>([]);
  
  const voices = [
    { 
      id: 0, 
      note: 130.81, // C3 (Bas)
      label: 'Bas', 
      desc: 'Voce Groasă',
      color: 'bg-blue-600', 
      mouth: 'w-8 h-3 rounded-full',
      waveType: 'sawtooth' as OscillatorType, // Richer harmonics for male voice
      filterFreq: 600
    },
    { 
      id: 1, 
      note: 196.00, // G3 (Tenor)
      label: 'Tenor', 
      desc: 'Voce Medie',
      color: 'bg-green-500', 
      mouth: 'w-7 h-5 rounded-[1rem]',
      waveType: 'sawtooth' as OscillatorType,
      filterFreq: 900
    },
    { 
      id: 2, 
      note: 329.63, // E4 (Alto)
      label: 'Alto', 
      desc: 'Voce Caldă',
      color: 'bg-pink-500', 
      mouth: 'w-6 h-6 rounded-full',
      waveType: 'triangle' as OscillatorType, // Softer for female low voice
      filterFreq: 1500
    },
    { 
      id: 3, 
      note: 523.25, // C5 (Sopran)
      label: 'Sopran', 
      desc: 'Voce Înaltă',
      color: 'bg-yellow-400', 
      mouth: 'w-5 h-7 rounded-[2rem]',
      waveType: 'sine' as OscillatorType, // Purest for high voice
      filterFreq: 3000
    }
  ];

  // Store references to stop sounds later
  const activeVoicesRef = useRef<Record<number, { oscs: OscillatorNode[], gain: GainNode } | null>>({});

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const ctx = getAudioContext();
      audioCtxRef.current = ctx;

      // Setup Master Effects Chain: Voices -> Compressor -> Reverb -> Destination
      
      // 1. Compressor (Glue everything together)
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -20;
      compressor.knee.value = 40;
      compressor.ratio.value = 12;
      compressor.attack.value = 0;
      compressor.release.value = 0.25;
      
      // 2. Reverb (Hall simulation)
      const reverb = ctx.createConvolver();
      reverb.buffer = createReverbBuffer(ctx);
      
      // 3. Dry/Wet Mix
      // We connect compressor to destination (Dry) AND to Reverb (Wet)
      compressor.connect(ctx.destination);
      
      // Reverb gain (Wet level)
      const reverbGain = ctx.createGain();
      reverbGain.gain.value = 0.4; // 40% reverb mix
      
      compressor.connect(reverb);
      reverb.connect(reverbGain);
      reverbGain.connect(ctx.destination);

      masterCompressorRef.current = compressor;
      reverbNodeRef.current = reverb;
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
      
      // Simple Piano Synthesis
      const masterGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(frequency * 6, now);
      filter.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + 1.5);
      
      const osc = ctx.createOscillator();
      osc.type = 'triangle'; // Triangle is good for piano-like basic sound
      osc.frequency.setValueAtTime(frequency, now);
      
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.2, now + 0.02); 
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

  // --- CHOIR LOGIC (ENSEMBLE SYNTHESIS) ---
  const startSinging = (singerId: number) => {
    try {
      initAudio();
      const ctx = audioCtxRef.current!;
      const masterDest = masterCompressorRef.current || ctx.destination;

      if (activeVoicesRef.current[singerId]) return;

      const voiceData = voices.find(v => v.id === singerId);
      if (!voiceData) return;

      const now = ctx.currentTime;
      
      // --- THE ENSEMBLE ENGINE ---
      // We create 3 oscillators slightly detuned to simulate a group of singers (Chorus effect)
      // This creates a "thick", natural sound instead of a robotic thin beep.
      
      const oscs: OscillatorNode[] = [];
      const voiceGain = ctx.createGain();
      
      // Filter the sound to make it sound like a voice (remove harsh high frequencies)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = voiceData.filterFreq;
      filter.Q.value = 1;

      // 1. Center Pitch
      const osc1 = ctx.createOscillator();
      osc1.type = voiceData.waveType;
      osc1.frequency.value = voiceData.note;
      
      // 2. Slightly Flat (-8 cents)
      const osc2 = ctx.createOscillator();
      osc2.type = voiceData.waveType;
      osc2.frequency.value = voiceData.note;
      osc2.detune.value = -8; 

      // 3. Slightly Sharp (+8 cents)
      const osc3 = ctx.createOscillator();
      osc3.type = voiceData.waveType;
      osc3.frequency.value = voiceData.note;
      osc3.detune.value = 8;

      oscs.push(osc1, osc2, osc3);

      // Connect everything
      oscs.forEach(osc => {
        osc.connect(filter);
        osc.start(now);
      });

      filter.connect(voiceGain);
      voiceGain.connect(masterDest);

      // Envelope (Attack) - Soft Fade In
      voiceGain.gain.setValueAtTime(0, now);
      voiceGain.gain.linearRampToValueAtTime(0.15, now + 0.3); // Slower attack = more human

      // Add Vibrato (LFO)
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 4.5; // Hz (Vibrato speed)
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 4; // Vibrato depth
      lfo.connect(lfoGain);
      
      // Connect vibrato to all oscillators
      oscs.forEach(osc => lfoGain.connect(osc.frequency));
      lfo.start(now);
      oscs.push(lfo); // Add LFO to array to stop it later

      activeVoicesRef.current[singerId] = { oscs, gain: voiceGain };
      setActiveSingers(prev => [...prev, singerId]);
    } catch (e) { console.error(e); }
  };

  const stopSinging = (singerId: number) => {
    const voiceNode = activeVoicesRef.current[singerId];
    const ctx = audioCtxRef.current;
    if (voiceNode && ctx) {
      const { oscs, gain } = voiceNode;
      const now = ctx.currentTime;
      
      // Release (Fade Out)
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.4); // Natural release

      // Stop oscillators after release
      oscs.forEach(osc => {
        try { osc.stop(now + 0.5); } catch(e){}
      });
    }
    activeVoicesRef.current[singerId] = null;
    setActiveSingers(prev => prev.filter(id => id !== singerId));
  };

  // --- PAINT LOGIC (CANVAS BRUSH) ---
  
  useEffect(() => {
    if (type !== 'paint') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const setSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    setSize();
    window.addEventListener('resize', setSize);
    return () => window.removeEventListener('resize', setSize);
  }, [type]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    isDrawing.current = true;
    setShowHint(false);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    lastPos.current = {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
    
    draw(e); 
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || !lastPos.current || !canvasRef.current) return;
    if ((e.target as HTMLElement).closest('button')) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;

    hueRef.current = (hueRef.current + 2) % 360;
    
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(currentX, currentY);
    
    ctx.strokeStyle = `hsl(${hueRef.current}, 75%, 60%)`;
    ctx.lineWidth = 20; 
    ctx.lineCap = 'round'; 
    ctx.lineJoin = 'round';
    
    ctx.shadowBlur = 2;
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    
    ctx.stroke();

    lastPos.current = { x: currentX, y: currentY };
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    lastPos.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setShowHint(true);
    }
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
            <span className="text-xs font-bold text-purple-600">Ascultă diferența! 🎵</span>
          </div>
        )}
        
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 items-end min-h-[220px]">
          {voices.map((voice) => {
            const isSinging = activeSingers.includes(voice.id);
            return (
              <div 
                key={voice.id}
                onMouseEnter={() => startSinging(voice.id)}
                onMouseLeave={() => stopSinging(voice.id)}
                onTouchStart={(e) => { e.preventDefault(); startSinging(voice.id); }}
                onTouchEnd={(e) => { e.preventDefault(); stopSinging(voice.id); }}
                className={`relative group flex flex-col items-center justify-end transition-all duration-300 ${isSinging ? '-translate-y-4 scale-110' : 'hover:-translate-y-2'}`}
              >
                 {/* Voice Bubble */}
                 <div className={`
                    w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-xl flex items-center justify-center 
                    transition-all duration-200 border-4 border-white cursor-pointer
                    ${voice.color} ${isSinging ? 'ring-4 ring-offset-2 ring-purple-300 brightness-110' : 'hover:brightness-105'}
                 `}>
                    <div className="flex flex-col items-center gap-2">
                      {/* Eyes */}
                      <div className="flex gap-3">
                        <div className={`bg-white rounded-full transition-all ${isSinging ? 'w-2 h-2' : 'w-2 h-1'}`}></div>
                        <div className={`bg-white rounded-full transition-all ${isSinging ? 'w-2 h-2' : 'w-2 h-1'}`}></div>
                      </div>
                      {/* Mouth */}
                      <div className={`bg-gray-900 transition-all duration-200 ${isSinging ? `${voice.mouth} border-2 border-white scale-125` : 'w-4 h-1 rounded-full'}`}></div>
                    </div>
                 </div>
                 
                 {/* Body Stand */}
                 <div className="w-1.5 h-10 bg-gray-200 mt-[-2px] -z-10 group-hover:bg-gray-300 transition-colors"></div>
                 <div className="w-12 h-1.5 bg-gray-200 rounded-full group-hover:bg-gray-300 transition-colors"></div>

                 {/* Feedback Particles */}
                 {isSinging && (
                   <div className="absolute -top-12 animate-float opacity-80 flex flex-col items-center">
                     <Mic size={28} className={voice.color.replace('bg-', 'text-')} />
                   </div>
                 )}
                 
                 {/* Labels */}
                 <div className="mt-3 text-center">
                    <span className={`block text-sm font-black uppercase tracking-wider ${isSinging ? 'text-purple-600' : 'text-gray-800'}`}>
                      {voice.label}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {voice.desc}
                    </span>
                 </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === 'paint') { // PAINTING - CANVAS MODE
    return (
      <div className="relative w-full h-48 sm:h-72 my-8 bg-gray-50/50 flex items-center justify-center overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ccc 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
        <div className="absolute inset-0 border-y-2 border-dashed border-gray-200 pointer-events-none"></div>

        {/* Clear Button */}
        <button 
          onClick={clearCanvas}
          className="absolute top-4 right-4 z-20 bg-white p-2.5 rounded-xl shadow-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-100 transition-all active:scale-95 flex items-center gap-2 group"
          title="Curăță Pânza"
        >
          <span className="text-xs font-bold uppercase hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">Șterge Tot</span>
          <Trash2 size={20} />
        </button>

        {showHint && (
          <div className="pointer-events-none absolute flex flex-col items-center gap-2 animate-pulse opacity-60 z-10">
            <Brush size={40} className="text-gray-400 rotate-12" />
            <span className="text-sm font-black text-gray-400 uppercase tracking-widest bg-white/80 px-2 py-1 rounded-md">Desenează liber! 🎨</span>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    );
  }

  // PIANO
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