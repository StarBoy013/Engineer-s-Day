import React from "react";

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-surface-container-highest/80 py-16 border-t-2 border-primary/30 z-10 relative">
      <div className="max-w-max-width mx-auto px-margin-edge">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-secondary text-3xl select-none">
                  engineering
                </span>
                <button
                  onClick={() => onNavigate("top")}
                  className="font-headline-md text-2xl font-bold text-primary hover:text-secondary transition-colors focus:outline-none text-left tracking-tight"
                >
                  ENGINEERS DAY '26
                </button>
              </div>
              
              <p className="font-body-md text-on-surface-variant max-w-sm mb-6 leading-relaxed text-base font-serif">
                An annual assembly dedicated to the rigorous pursuit of knowledge, technological innovation, and structural ingenuity at RIMT University.
              </p>
            </div>

            <button
              onClick={() => onNavigate("top")}
              className="inline-flex items-center gap-2 font-label-caps text-xs tracking-widest text-secondary hover:text-primary transition-colors font-bold w-max group focus:outline-none"
            >
              <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-y-1">
                arrow_upward
              </span>
              BACK TO TOP
            </button>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="font-label-caps text-xs tracking-[0.2em] text-primary uppercase font-bold mb-6 border-b border-primary/20 pb-2">
              Navigation
            </h4>
            <ul className="space-y-3 font-serif">
              <li>
                <button
                  onClick={() => onNavigate("hero")}
                  className="text-on-surface-variant hover:text-secondary transition-colors text-base focus:outline-none flex items-center gap-2"
                >
                  <span className="text-secondary font-mono text-xs">01.</span> Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("about")}
                  className="text-on-surface-variant hover:text-secondary transition-colors text-base focus:outline-none flex items-center gap-2"
                >
                  <span className="text-secondary font-mono text-xs">02.</span> About Event
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("events")}
                  className="text-on-surface-variant hover:text-secondary transition-colors text-base focus:outline-none flex items-center gap-2"
                >
                  <span className="text-secondary font-mono text-xs">03.</span> Competitions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("agenda")}
                  className="text-on-surface-variant hover:text-secondary transition-colors text-base focus:outline-none flex items-center gap-2"
                >
                  <span className="text-secondary font-mono text-xs">04.</span> Schedule
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("register")}
                  className="text-on-surface-variant hover:text-secondary transition-colors text-base focus:outline-none flex items-center gap-2"
                >
                  <span className="text-secondary font-mono text-xs">05.</span> Registration
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info (Parikshit Jajwan) */}
          <div className="md:col-span-4">
            <h4 className="font-label-caps text-xs tracking-[0.2em] text-primary uppercase font-bold mb-6 border-b border-primary/20 pb-2">
              Event Contact &amp; Support
            </h4>

            <div className="bracket-border bracket-tl bracket-tr bracket-bl bracket-br p-5 bg-surface border border-primary/20 space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-2xl select-none">
                  account_circle
                </span>
                <div>
                  <span className="font-label-caps text-[9px] uppercase tracking-widest text-on-surface-variant block font-bold">
                    Event Coordinator
                  </span>
                  <span className="font-headline-md text-base text-primary font-bold">
                    Parikshit Jajwan
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-outline/20 space-y-2.5">
                <a
                  href="mailto:rimt233742@rimt.ac.in"
                  className="flex items-center gap-3 text-on-surface-variant hover:text-secondary transition-colors text-sm font-sans group"
                >
                  <span className="material-symbols-outlined text-secondary text-lg select-none group-hover:scale-110 transition-transform">
                    mail
                  </span>
                  <span className="font-mono text-xs sm:text-sm underline decoration-dotted">
                    rimt233742@rimt.ac.in
                  </span>
                </a>

                <a
                  href="tel:+919878310681"
                  className="flex items-center gap-3 text-on-surface-variant hover:text-secondary transition-colors text-sm font-sans group"
                >
                  <span className="material-symbols-outlined text-secondary text-lg select-none group-hover:scale-110 transition-transform">
                    call
                  </span>
                  <span className="font-mono text-xs sm:text-sm">
                    +91 98783 10681
                  </span>
                </a>

                {/* <div className="flex items-center gap-3 text-on-surface-variant text-sm font-sans">
                  <span className="material-symbols-outlined text-secondary text-lg select-none">
                    school
                  </span>
                  <span className="font-serif text-xs sm:text-sm">
                    RIMT University
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 border-t border-outline/20 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-label-caps text-on-surface-variant">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <p className="tracking-widest uppercase font-bold">
              © {new Date().getFullYear()} Engineers Day | RIMT University.
            </p>
            <span className="hidden sm:inline text-outline/30">•</span>
            <span className="text-[10px] font-mono text-outline/60 hover:text-primary transition-colors cursor-default tracking-wide font-normal">
              Designed &amp; Developed by <span className="font-semibold text-on-surface-variant">Parikshit Jajwan - StarBoy</span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] text-secondary font-bold">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse inline-block"></span>
            REGISTRATION OPEN // ALL SYSTEMS GO
          </div>
        </div>
      </div>
    </footer>
  );
};
