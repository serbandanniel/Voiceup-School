import React, { useState, useEffect, useCallback } from 'react';
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

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMagicMode, setIsMagicMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'canto', 'piano', 'painting', 'gallery-photo', 'gallery-video'
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);

  // Audio Feedback Logic
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

  useEffect(() => {
    if (isMagicMode) {
      document.body.classList.add('magic-mode');
    } else {
      document.body.classList.remove('magic-mode');
    }
  }, [isMagicMode]);

  // Restore scroll position when returning to home
  useEffect(() => {
    if (currentView === 'home' && savedScrollPosition > 0) {
      // Small timeout to ensure DOM is rendered before scrolling
      const timer = setTimeout(() => {
        window.scrollTo({
          top: savedScrollPosition,
          behavior: 'auto' // Instant jump allows for better UX in restoration
        });
      }, 50);
      return () => clearTimeout(timer);
    } else if (currentView !== 'home') {
      // When entering a detail view, we usually want to start at the top
      window.scrollTo(0, 0);
    }
  }, [currentView, savedScrollPosition]);

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

      // Scroll Reveal logic
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
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // Navigation Handlers
  const handleNavigateToView = (view: string) => {
    setSavedScrollPosition(window.scrollY);
    setCurrentView(view);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const handleEnrollFromDetail = () => {
    setSavedScrollPosition(0); // Reset saved position so we don't jump to it
    setCurrentView('home');
    setTimeout(() => {
      document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Render content based on currentView
  const renderContent = () => {
    switch (currentView) {
      case 'canto':
      case 'piano':
      case 'painting':
        return (
          <CourseDetail 
            courseId={currentView} 
            onBack={handleBackToHome} 
            onEnroll={handleEnrollFromDetail} 
          />
        );
      case 'gallery-photo':
        return <FullPhotoGallery onBack={handleBackToHome} />;
      case 'gallery-video':
        return <FullVideoGallery onBack={handleBackToHome} />;
      case 'home':
      default:
        return (
          <>
            <section id="hero">
              <Hero playPop={playPop} />
            </section>

            <SectionSeparator type="piano" />
            
            <section id="about" className="py-2 reveal-on-scroll opacity-0">
              <About />
            </section>

            <SectionSeparator type="paint" />

            <section id="courses" className="py-2 reveal-on-scroll opacity-0">
              <Courses playPop={playPop} onViewDetails={handleNavigateToView} />
            </section>

            <SectionSeparator type="notes" />

            <section id="teachers" className="py-2 reveal-on-scroll opacity-0">
              <Teachers />
            </section>

            <SectionSeparator type="paint" />

            <section id="gallery" className="py-2 reveal-on-scroll opacity-0">
              <Gallery onViewAll={(type) => handleNavigateToView(type === 'photo' ? 'gallery-photo' : 'gallery-video')} />
            </section>

            <SectionSeparator type="notes" />

            <section id="reviews" className="py-2 reveal-on-scroll opacity-0">
              <Reviews />
            </section>

            <SectionSeparator type="piano" />

            <section id="pricing" className="py-2 reveal-on-scroll opacity-0">
              <Pricing playPop={playPop} />
            </section>

            <SectionSeparator type="paint" />

            <section id="enroll" className="py-2 reveal-on-scroll opacity-0">
              <EnrollmentForm />
            </section>

            <SectionSeparator type="notes" />

            <section id="contact" className="py-2 reveal-on-scroll opacity-0">
              <Contact />
            </section>
          </>
        );
    }
  };

  return (
    <div className={`relative min-h-screen selection:bg-purple-500 selection:text-white bg-mesh transition-colors duration-700`}>
      {/* GLOBAL FLOATING ELEMENTS - Fixed position to appear everywhere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <FloatingElements />
      </div>

      <Header 
        activeSection={activeSection} 
        isMagicMode={isMagicMode} 
        setIsMagicMode={setIsMagicMode}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        playPop={playPop}
      />
      
      <main className="relative z-10">
        {renderContent()}
      </main>

      {/* Only show Footer on Home or dedicated pages, but usually good everywhere */}
      <Footer />
    </div>
  );
};

export default App;