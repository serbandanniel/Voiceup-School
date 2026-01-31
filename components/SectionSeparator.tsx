import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Mic, Palette, Trash2, Brush, Music2, Loader2 } from 'lucide-react';

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

const createReverbBuffer = (ctx: AudioContext) => {
  const duration = 2.5;
  const decay = 2.0;
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const impulse = ctx.createBuffer(2, length, sampleRate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);

  for (let i = 0; i < length; i++) {
    const n = i / length;
    left[i] = (Math.random() * 2 - 1) * Math.pow(1 - n, decay);
    right[i] = (Math.random() * 2 - 1) * Math.pow(1 - n, decay);
  }
  return impulse;
};

const SectionSeparator: React.FC<SeparatorProps> = ({ type }) => {
  const [activeNotes, setActiveNotes] = useState<FloatingNote[]>([]);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(true);
  
  // Audio Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sampleBufferRef = useRef<AudioBuffer | null>(null);
  const reverbNodeRef = useRef<ConvolverNode | null>(null);
  const [isSampleLoaded, setIsSampleLoaded] = useState(false);
  
  // Interaction Refs
  const isDragging = useRef(false);
  const lastKeyId = useRef<string | null>(null);
  const pianoContainerRef = useRef<HTMLDivElement>(null);

  // Paint Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const hueRef = useRef(0);

  // Choir State
  const [activeSingers, setActiveSingers] = useState<number[]>([]);
  
  // Definiția vocilor bazată pe Pitch Shifting (Base Note: C4)
  const voices = [
    { 
      id: 0, 
      label: 'Bas', 
      desc: 'Voce Gravă',
      color: 'bg-blue-600', 
      mouth: 'w-8 h-3 rounded-full',
      playbackRate: 0.5, // Octavă mai jos (C3)
      gain: 1.2
    },
    { 
      id: 1, 
      label: 'Tenor', 
      desc: 'Voce Medie',
      color: 'bg-green-500', 
      mouth: 'w-7 h-5 rounded-[1rem]',
      playbackRate: 0.749, // Aprox G3
      gain: 1.0
    },
    { 
      id: 2, 
      label: 'Alto', 
      desc: 'Voce Caldă',
      color: 'bg-pink-500', 
      mouth: 'w-6 h-6 rounded-full',
      playbackRate: 1.25, // Aprox E4
      gain: 0.9
    },
    { 
      id: 3, 
      label: 'Sopran', 
      desc: 'Voce Înaltă',
      color: 'bg-yellow-400', 
      mouth: 'w-5 h-7 rounded-[2rem]',
      playbackRate: 2.0, // Octavă mai sus (C5)
      gain: 0.8
    }
  ];

  const activeVoicesRef = useRef<Record<number, { source: AudioBufferSourceNode, gain: GainNode } | null>>({});

  // Init Audio Context & Load Sample
  useEffect(() => {
    const loadAudio = async () => {
      try {
        const ctx = getAudioContext();
        audioCtxRef.current = ctx;

        // Create Reverb
        const reverb = ctx.createConvolver();
        reverb.buffer = createReverbBuffer(ctx);
        reverbNodeRef.current = reverb;
        reverb.connect(ctx.destination);

        // Load Choir Sample (C4 Note - High Quality)
        // Using a reliable raw github source for a Choir Aah sound
        const response = await fetch('https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/MusyngKite/choir_aahs-mp3/C4.mp3');
        const arrayBuffer = await response.arrayBuffer();
        const decodedAudio = await ctx.decodeAudioData(arrayBuffer);
        
        sampleBufferRef.current = decodedAudio;
        setIsSampleLoaded(true);
      } catch (error) {
        console.error("Failed to load vocal sample:", error);
      }
    };

    // Only load audio if we are in the 'notes' section or 'piano'
    if (type === 'notes' || type === 'piano') {
      loadAudio();
    }

    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, [type]);

  const initAudioCtx = () => {
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // --- PIANO LOGIC ---
  const playPianoNote = (label: string, octaveOffset: number) => {
    try {
      initAudioCtx();
      const ctx = audioCtxRef.current!;
      const now = ctx.currentTime;
      const frequency = noteFrequencies[label] * Math.pow(2, octaveOffset);
      
      const masterGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(frequency * 4, now);
      filter.frequency.exponentialRampToValueAtTime(frequency, now + 0.5);
      
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, now);
      
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.3, now + 0.01); 
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      osc.connect(masterGain);
      masterGain.connect(filter);
      filter.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 1.6);
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

  // --- CHOIR LOGIC (SAMPLER ENGINE) ---
  const startSinging = (singerId: number) => {
    try {
      if (!isSampleLoaded || !sampleBufferRef.current || !audioCtxRef.current) return;
      initAudioCtx();
      
      if (activeVoicesRef.current[singerId]) return;

      const voiceData = voices.find(v => v.id === singerId);
      if (!voiceData) return;

      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      // Create Source
      const source = ctx.createBufferSource();
      source.buffer = sampleBufferRef.current;
      source.playbackRate.value = voiceData.playbackRate;
      source.loop = true; // Loop the sample for continuous singing

      // Create Gain (Volume Envelope)
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(voiceData.gain, now + 0.4); // Slow attack (human breath)

      // Routing: Source -> Gain -> Reverb -> Destination
      source.connect(gainNode);
      
      if (reverbNodeRef.current) {
        // Wet Mix (through reverb)
        const reverbGain = ctx.createGain();
        reverbGain.gain.value = 0.5;
        gainNode.connect(reverbGain);
        reverbGain.connect(reverbNodeRef.current);
        
        // Dry Mix (direct)
        const dryGain = ctx.createGain();
        dryGain.gain.value = 0.6;
        gainNode.connect(dryGain);
        dryGain.connect(ctx.destination);
      } else {
        gainNode.connect(ctx.destination);
      }

      source.start(now);
      
      activeVoicesRef.current[singerId] = { source, gain: gainNode };
      setActiveSingers(prev => [...prev, singerId]);
    } catch (e) { console.error(e); }
  };

  const stopSinging = (singerId: number) => {
    const voiceNode = activeVoicesRef.current[singerId];
    const ctx = audioCtxRef.current;
    if (voiceNode && ctx) {
      const { source, gain } = voiceNode;
      const now = ctx.currentTime;
      
      // Release Envelope (Natural fade out)
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.3);

      source.stop(now + 0.35);
    }
    activeVoicesRef.current[singerId] = null;
    setActiveSingers(prev => prev.filter(id => id !== singerId));
  };

  // --- PAINT LOGIC ---
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
    lastPos.current = { x: clientX - rect.left, y: clientY - rect.top };
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

  const stopDrawing = () => { isDrawing.current = false; lastPos.current = null; };
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setShowHint(true);
    }
  };
  const handleStart = (fn: () => void) => { isDragging.current = true; fn(); };
  const handleEnd = () => { isDragging.current = false; lastKeyId.current = null; setPressedKey(null); };

  // --- RENDERERS ---

  if (type === 'notes') { 
    return (
      <div className="relative w-full py-16 flex flex-col items-center justify-center my-8 select-none">
        {showHint && (
          <div className="absolute top-0 animate-bounce flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border border-purple-100 z-20">
            <Music2 size={14} className="text-purple-500" />
            <span className="text-xs font-bold text-purple-600">Ascultă vocile reale! 🎵</span>
          </div>
        )}
        
        {!isSampleLoaded ? (
            <div className="flex flex-col items-center gap-2 animate-pulse text-purple-400">
                <Loader2 className="animate-spin" />
                <span className="text-xs font-bold uppercase tracking-widest">Se încarcă vocile...</span>
            </div>
        ) : (
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
                    <div className={`
                        w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-xl flex items-center justify-center 
                        transition-all duration-200 border-4 border-white cursor-pointer
                        ${voice.color} ${isSinging ? 'ring-4 ring-offset-2 ring-purple-300 brightness-110' : 'hover:brightness-105'}
                    `}>
                        <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-3">
                            <div className={`bg-white rounded-full transition-all ${isSinging ? 'w-2 h-2' : 'w-2 h-1'}`}></div>
                            <div className={`bg-white rounded-full transition-all ${isSinging ? 'w-2 h-2' : 'w-2 h-1'}`}></div>
                        </div>
                        <div className={`bg-gray-900 transition-all duration-200 ${isSinging ? `${voice.mouth} border-2 border-white scale-125` : 'w-4 h-1 rounded-full'}`}></div>
                        </div>
                    </div>
                    
                    <div className="w-1.5 h-10 bg-gray-200 mt-[-2px] -z-10 group-hover:bg-gray-300 transition-colors"></div>
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full group-hover:bg-gray-300 transition-colors"></div>

                    {isSinging && (
                    <div className="absolute -top-12 animate-float opacity-80 flex flex-col items-center">
                        <Mic size={28} className={voice.color.replace('bg-', 'text-')} />
                    </div>
                    )}
                    
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
        )}
      </div>
    );
  }

  if (type === 'paint') { 
    return (
      <div className="relative w-full h-48 sm:h-72 my-8 bg-gray-50/50 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ccc 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
        <div className="absolute inset-0 border-y-2 border-dashed border-gray-200 pointer-events-none"></div>

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