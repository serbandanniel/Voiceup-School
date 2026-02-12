import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Courses from './components/Courses';
import Teachers from './components/Teachers';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Pricing from './components/Pricing';
import EnrollmentForm from './components/EnrollmentForm';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SectionSeparator from './components/SectionSeparator';
import CourseDetail from './components/CourseDetail';
import FloatingElements from './components/FloatingElements';
import FullPhotoGallery from './components/FullPhotoGallery';
import FullVideoGallery from './components/FullVideoGallery';
import CustomCursor from './components/CustomCursor';

type ThemeMode = 'light' | 'magic' | 'concert';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [isMuted, setIsMuted] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Spotlight Ref
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Audio Feedback
  const playPop = useCallback(() => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  }, [isMuted]);

  // Handle Theme Classes
  useEffect(() => {
    document.body.classList.remove('magic-mode', 'concert-mode');
    if (themeMode === 'magic') document.body.classList.add('magic-mode');
    if (themeMode === 'concert') document.body.classList.add('concert-mode');
  }, [themeMode]);

  // Handle Spotlight Move
  useEffect(() => {
    if (themeMode !== 'concert') return;

    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--spotlight-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--spotlight-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [themeMode]);

  // Restore Scroll
  useEffect(() => {
    if (currentView === 'home' && savedScrollPosition > 0 && !isTransitioning) {
      setTimeout(() => {
        window.scrollTo({ top: savedScrollPosition, behavior: 'auto' });
      }, 50);
    } else if (currentView !== 'home') {
      window.scrollTo(0, 0);
    }
  }, [currentView, savedScrollPosition, isTransitioning]);

  // Scroll Spy
  useEffect(() => {
    if (currentView !== 'home') return;
    const handleScroll = () => {
      const sections = ['hero', 'about', 'courses', 'teachers', 'gallery', 'reviews', 'pricing', 'enroll', 'contact'];
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveSection(section);
          break;
        }
      }
      const reveals = document.querySelectorAll('.reveal-on-scroll');
      reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        const revealTop = el.getBoundingClientRect().top;
        if (revealTop < windowHeight - revealPoint) {
          el.classList.add('reveal');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // Page Transition Handler
  const handleNavigateToView = (view: string) => {
    setIsTransitioning(true);
    setSavedScrollPosition(window.scrollY);
    
    setTimeout(() => {
      setCurrentView(view);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600); // Wait for curtain to go up
    }, 500); // Wait for curtain to cover
  };

  const handleBackToHome = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView('home');
      setTimeout(() => setIsTransitioning(false), 600);
    }, 500);
  };

  const handleEnrollFromDetail = () => {
    setSavedScrollPosition(0); 
    setIsTransitioning(true);
    setTimeout(() => {
        setCurrentView('home');
        setTimeout(() => {
            setIsTransitioning(false);
            document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' });
        }, 600);
    }, 500);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'canto':
      case 'piano':
      case 'painting':
        return <CourseDetail courseId={currentView} onBack={handleBackToHome} onEnroll={handleEnrollFromDetail} />;
      case 'gallery-photo':
        return <FullPhotoGallery onBack={handleBackToHome} />;
      case 'gallery-video':
        return <FullVideoGallery onBack={handleBackToHome} />;
      case 'home':
      default:
        return (
          <>
            <section id="hero"><Hero playPop={playPop} /></section>
            <SectionSeparator type="piano" />
            <section id="about" className="py-2 reveal-on-scroll opacity-0"><About /></section>
            <SectionSeparator type="paint" />
            <section id="courses" className="py-2 reveal-on-scroll opacity-0"><Courses playPop={playPop} onViewDetails={handleNavigateToView} /></section>
            <SectionSeparator type="notes" />
            <section id="teachers" className="py-2 reveal-on-scroll opacity-0"><Teachers /></section>
            <SectionSeparator type="paint" />
            <section id="gallery" className="py-2 reveal-on-scroll opacity-0"><Gallery onViewAll={(type) => handleNavigateToView(type === 'photo' ? 'gallery-photo' : 'gallery-video')} /></section>
            <SectionSeparator type="notes" />
            <section id="reviews" className="py-2 reveal-on-scroll opacity-0"><Reviews /></section>
            <SectionSeparator type="piano" />
            <section id="pricing" className="py-2 reveal-on-scroll opacity-0"><Pricing playPop={playPop} /></section>
            <SectionSeparator type="paint" />
            <section id="enroll" className="py-2 reveal-on-scroll opacity-0"><EnrollmentForm /></section>
            <SectionSeparator type="notes" />
            <section id="contact" className="py-2 reveal-on-scroll opacity-0"><Contact /></section>
          </>
        );
    }
  };

  return (
    <div className={`relative min-h-screen selection:bg-purple-500 selection:text-white bg-mesh transition-colors duration-700`}>
      <CustomCursor />
      
      {/* Page Transition Curtain */}
      <div className={`page-transition-curtain ${isTransitioning ? 'active' : ''}`}></div>

      {/* Concert Spotlight Overlay */}
      {themeMode === 'concert' && <div className="concert-overlay"></div>}

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <FloatingElements />
      </div>

      <Header 
        activeSection={activeSection} 
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        playPop={playPop}
      />
      
      <main className="relative z-10">
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
};

export default App;