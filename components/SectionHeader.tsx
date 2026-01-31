import React, { useEffect, useRef, useState } from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  colorClass?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description, colorClass = "text-purple-600" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={headerRef}
      className={`text-center mb-12 px-4 transition-all duration-1000 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <h2 className={`text-4xl md:text-6xl font-black mb-4 ${colorClass} tracking-tight drop-shadow-sm text-glow`}>
        {title}
      </h2>
      {description && (
        <p className="text-gray-600 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
          {description}
        </p>
      )}
      <div className="flex justify-center mt-6 gap-3">
        <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce shadow-md" style={{ animationDelay: '0s' }}></div>
        <div className="w-3 h-3 rounded-full bg-purple-500 animate-bounce shadow-md" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-3 rounded-full bg-pink-400 animate-bounce shadow-md" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default SectionHeader;