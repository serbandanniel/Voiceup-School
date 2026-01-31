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

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMagicMode, setIsMagicMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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

  useEffect(() => {
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
  }, []);

  return (
    <div className={`relative min-h-screen selection:bg-purple-500 selection:text-white bg-mesh transition-colors duration-700`}>
      <Header 
        activeSection={activeSection} 
        isMagicMode={isMagicMode} 
        setIsMagicMode={setIsMagicMode}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        playPop={playPop}
      />
      
      <main>
        <section id="hero">
          <Hero playPop={playPop} />
        </section>

        <SectionSeparator type="piano" />
        
        <section id="about" className="py-2 reveal-on-scroll opacity-0">
          <About />
        </section>

        <SectionSeparator type="paint" />

        <section id="courses" className="py-2 reveal-on-scroll opacity-0">
          <Courses playPop={playPop} />
        </section>

        <SectionSeparator type="notes" />

        <section id="teachers" className="py-2 reveal-on-scroll opacity-0">
          <Teachers />
        </section>

        <SectionSeparator type="paint" />

        <section id="gallery" className="py-2 reveal-on-scroll opacity-0">
          <Gallery />
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
      </main>

      <Footer />
    </div>
  );
};

export default App;