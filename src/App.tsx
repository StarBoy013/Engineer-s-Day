import { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Events } from "./components/Events";
import { Agenda } from "./components/Agenda";
import { RegistrationForm } from "./components/RegistrationForm";

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

        <Events onJoinEvent={handleJoinEvent} />

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
      <footer className="bg-surface-container-highest py-16 border-t border-outline/30 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter px-margin-edge max-w-max-width mx-auto">
          <div>
            <button
              onClick={() => scrollToSection("top")}
              className="font-headline-md text-xl md:text-2xl font-bold text-primary mb-6 block hover:text-secondary transition-colors focus:outline-none"
            >
              ENGINEERS DAY
            </button>
            <p className="font-body-md text-on-surface-variant max-w-xs mb-8 font-serif leading-relaxed text-lg">
              An annual assembly dedicated to the rigorous pursuit of knowledge and the expansion of our built environment.
            </p>
            <p className="text-[12px] font-label-caps text-on-surface-variant uppercase tracking-widest font-bold">
              © {new Date().getFullYear()} National Engineers Association. Built with Industrial Precision.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:justify-items-end">
            <div className="space-y-4">
              <h5 className="font-label-caps text-label-caps text-primary font-bold">Information</h5>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="text-on-surface-variant hover:text-secondary transition-colors font-serif text-base focus:outline-none"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="text-on-surface-variant hover:text-secondary transition-colors font-serif text-base focus:outline-none"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("agenda")}
                    className="text-on-surface-variant hover:text-secondary transition-colors font-serif text-base focus:outline-none"
                  >
                    Technical Schematics
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="font-label-caps text-label-caps text-primary font-bold">Resources</h5>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("events")}
                    className="text-on-surface-variant hover:text-secondary transition-colors font-serif text-base focus:outline-none"
                  >
                    Archive
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("register")}
                    className="text-on-surface-variant hover:text-secondary transition-colors font-serif text-base focus:outline-none"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("register")}
                    className="text-on-surface-variant hover:text-secondary transition-colors font-serif text-base focus:outline-none"
                  >
                    Press Kit
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
