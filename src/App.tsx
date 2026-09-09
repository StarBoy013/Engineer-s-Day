import { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Events } from "./components/Events";
import { Agenda } from "./components/Agenda";
import { RegistrationForm } from "./components/RegistrationForm";
import { Footer } from "./components/Footer";

function App() {
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  // Smooth scroll helper used across the whole app
  const scrollToSection = useCallback((sectionId: string) => {
    if (sectionId === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  // Function to handle "JOIN EVENT" click in Events list
  const handleJoinEvent = (eventId: string) => {
    if (!selectedEvents.includes(eventId)) {
      setSelectedEvents((prev) => [...prev, eventId]);
    }
    scrollToSection("register");
  };

  // Scroll Reveal Logic
  useEffect(() => {
    const handleScrollReveal = () => {
      const revealElements = document.querySelectorAll(".reveal-on-scroll");
      const triggerBottom = (window.innerHeight / 5) * 4.5;

      revealElements.forEach((el) => {
        const elTop = el.getBoundingClientRect().top;
        if (elTop < triggerBottom) {
          el.classList.add("active");
        } else {
          el.classList.remove("active");
        }
      });
    };

    window.addEventListener("scroll", handleScrollReveal);
    setTimeout(handleScrollReveal, 100);

    return () => window.removeEventListener("scroll", handleScrollReveal);
  }, []);

  return (
    <div className="bg-background text-on-surface font-body-md blueprint-grid min-h-screen">
      {/* Navigation Header */}
      <Navbar onRegisterClick={() => scrollToSection("register")} />

      {/* Main Sections */}
      <main>
        <div className="reveal-on-scroll reveal">
          <Hero />
        </div>

        <div className="reveal-on-scroll reveal">
          <About />
        </div>

        <div className="reveal-on-scroll reveal">
          <Events onJoinEvent={handleJoinEvent} />
        </div>

        <div className="reveal-on-scroll reveal">
          <Agenda />
        </div>

        <div className="reveal-on-scroll reveal">
          <RegistrationForm
            selectedEvents={selectedEvents}
            onChangeEvents={setSelectedEvents}
          />
        </div>
      </main>

      {/* Footer Section */}
      <Footer onNavigate={scrollToSection} />
    </div>
  );
}

export default App;
