import React, { useEffect, useState, useRef } from 'react';
import { Music, Mic2, Palette, MousePointer2 } from 'lucide-react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hoverType, setHoverType] = useState<'default' | 'button' | 'text' | 'piano' | 'canto' | 'paint'>('default');
  const [isClicking, setIsClicking] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on desktop
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    document.body.classList.add('custom-cursor-active');

    const updatePosition = (e: MouseEvent) => {
      // Use requestAnimationFrame for smoother performance
      requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for data-cursor attribute first
      const cursorData = target.closest('[data-cursor]');
      if (cursorData) {
        const type = cursorData.getAttribute('data-cursor') as any;
        setHoverType(type);
        return;
      }

      // Default checks
      if (target.tagName.toLowerCase() === 'button' || target.closest('button') || target.tagName.toLowerCase() === 'a') {
        setHoverType('button');
      } else if (target.tagName.toLowerCase() === 'input' || target.tagName.toLowerCase() === 'textarea') {
        setHoverType('text');
      } else {
        setHoverType('default');
      }
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const getCursorStyle = () => {
    switch (hoverType) {
      case 'button':
        return 'w-12 h-12 bg-purple-500/20 border-purple-500 mix-blend-difference';
      case 'text':
        return 'w-1 h-8 bg-black rounded-none border-none';
      case 'piano':
        return 'w-16 h-16 bg-blue-500/20 border-blue-400';
      case 'canto':
        return 'w-16 h-16 bg-pink-500/20 border-pink-400';
      case 'paint':
        return 'w-16 h-16 bg-yellow-500/20 border-yellow-400';
      default:
        return 'w-6 h-6 bg-purple-500/50 border-white';
    }
  };

  const getIcon = () => {
    switch (hoverType) {
      case 'piano': return <Music size={24} className="text-blue-500 animate-bounce" />;
      case 'canto': return <Mic2 size={24} className="text-pink-500 animate-pulse" />;
      case 'paint': return <Palette size={24} className="text-yellow-600 animate-spin-slow" />;
      default: return null;
    }
  };

  // Hidden on mobile via CSS media query in parent, but double check here
  return (
    <div 
      className="fixed pointer-events-none z-[10000] hidden md:block"
      style={{ 
        left: position.x, 
        top: position.y,
        transform: 'translate(-50%, -50%)' 
      }}
    >
      <div 
        className={`
          rounded-full border-2 backdrop-blur-sm transition-all duration-300 ease-out flex items-center justify-center
          ${getCursorStyle()}
          ${isClicking ? 'scale-75' : 'scale-100'}
        `}
      >
        {getIcon()}
      </div>
      
      {/* Center dot for precision */}
      {hoverType === 'default' && (
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      )}
    </div>
  );
};

export default CustomCursor;