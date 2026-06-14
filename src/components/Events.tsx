import React, { useEffect, useRef } from "react";
import type { ChallengeEvent } from "../types";

interface EventsProps {
  onJoinEvent: (eventId: string) => void;
}

export const challengeEvents: ChallengeEvent[] = [
  {
    id: "01",
    title: "Bridge Prototype Challenge",
    description: "Design and construct a load-bearing structure using limited composite materials under strict time constraints.",
    icon: "architecture",
    isTeamEvent: true,
  },
  {
    id: "02",
    title: "Circuit Sprint",
    description: "Rapid assembly of logic gates and signal processing units to solve a complex hardware communication puzzle.",
    icon: "memory",
    isTeamEvent: false,
  },
  {
    id: "03",
    title: "CAD Speed-Model",
    description: "Transform technical 2D schematics into optimized 3D models with precision and speed.",
    icon: "draw",
    isTeamEvent: false,
  },
  {
    id: "04",
    title: "Code Debugging Relay",
    description: "A collaborative marathon to identify and rectify systemic flaws in legacy infrastructure codebases.",
    icon: "terminal",
    isTeamEvent: true,
  },
  {
    id: "05",
    title: "Sustainable Energy Pitch",
    description: "Present viable engineering solutions for energy harvesting in off-grid industrial environments.",
    icon: "eco",
    isTeamEvent: false,
  },
  {
    id: "06",
    title: "Robotics Sumo",
    description: "Autonomous unit combat where structural durability meets algorithmic superiority.",
    icon: "smart_toy",
    isTeamEvent: true,
  },
  {
    id: "07",
    title: "Material Science Trivia",
    description: "A high-velocity quiz on atomic structures, stress-strain curves, and phase diagrams.",
    icon: "quiz",
    isTeamEvent: false,
  },
  {
    id: "08",
    title: "Technical Paper Presentation",
    description: "Defend your original research before a jury of senior industrial analysts.",
    icon: "description",
    isTeamEvent: false,
  },
  {
    id: "09",
    title: "Hydraulic Lift Design",
    description: "Engineer a fluid-driven mechanism capable of elevating varied payloads with maximum efficiency.",
    icon: "settings_input_component",
    isTeamEvent: true,
  },
  {
    id: "10",
    title: "Engineering Ethics Debate",
    description: "Formal argumentation on the moral implications of large-scale environmental engineering.",
    icon: "balance",
    isTeamEvent: false,
  },
];

const EventCard: React.FC<{
  event: ChallengeEvent;
  onJoinEvent: (eventId: string) => void;
}> = ({ event, onJoinEvent }) => {
  return (
    <div
      className="event-card group relative bg-surface p-8 flex flex-col justify-between w-[290px] sm:w-[360px] md:w-[400px] h-[320px] md:h-[360px] flex-shrink-0"
    >
      {/* Event ID Badge */}
      <span className="absolute top-4 right-4 font-technical-numeral text-4xl text-primary/10 event-number select-none font-bold">
        {event.id}
      </span>

      <div>
        {/* Material Icon */}
        <span className="material-symbols-outlined text-4xl text-secondary mb-6 block transition-transform duration-500 group-hover:rotate-12 select-none">
          {event.icon}
        </span>

        <h3 className="font-headline-md text-lg sm:text-xl md:text-2xl uppercase mb-3 text-primary truncate">
          {event.title}
        </h3>
        
        <p className="font-body-md text-on-surface-variant mb-8 leading-relaxed text-sm md:text-base line-clamp-3 md:line-clamp-4">
          {event.description}
        </p>
      </div>

      {/* Dynamic Action Trigger */}
      <button
        onClick={() => onJoinEvent(event.id)}
        className="inline-flex items-center gap-2 font-label-caps text-xs tracking-widest text-primary hover:text-secondary transition-colors group/link font-bold text-left focus:outline-none w-max"
      >
        JOIN EVENT 
        <span className="material-symbols-outlined text-sm translate-x-0 group-hover/link:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </button>
    </div>
  );
};

export const Events: React.FC<EventsProps> = ({ onJoinEvent }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const telemetryXRef = useRef<HTMLSpanElement>(null);
  const telemetryProgressRef = useRef<HTMLSpanElement>(null);
  const telemetryCardRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    let targetX = 0;
    let currentX = 0;
    let animationFrameId: number;

    const updatePosition = () => {
      // Smooth lerp (10% adjustment per frame)
      currentX += (targetX - currentX) * 0.1;

      // Apply translation to track
      track.style.transform = `translateX(${currentX}px)`;

      // Calculate progress and update telemetry/progress bar
      const viewportWidth = window.innerWidth;
      const trackWidth = track.scrollWidth;
      const maxTranslate = Math.max(trackWidth - viewportWidth, 0);

      if (maxTranslate > 0) {
        const pct = Math.abs(currentX) / maxTranslate;
        if (progressLineRef.current) {
          progressLineRef.current.style.transform = `scaleX(${pct})`;
        }
        if (telemetryProgressRef.current) {
          telemetryProgressRef.current.textContent = `${Math.round(pct * 100)}%`;
        }
        if (telemetryCardRef.current) {
          const activeCard = Math.min(Math.max(Math.round(pct * 9) + 1, 1), 10);
          telemetryCardRef.current.textContent = activeCard.toString().padStart(2, '0');
        }
      }

      if (telemetryXRef.current) {
        telemetryXRef.current.textContent = `${Math.round(currentX)}px`;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // When the sticky container is pinned (top of container <= 0 and bottom >= viewport)
      if (rect.top <= 0 && rect.bottom >= viewportHeight) {
        const scrollableDistance = rect.height - viewportHeight;
        const scrolled = -rect.top;
        const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);

        // Maximum translation needed to show all cards up to the 10th card's right boundary
        const trackWidth = track.scrollWidth;
        const maxTranslate = Math.max(trackWidth - viewportWidth, 0);

        targetX = progress * -maxTranslate;
      } else if (rect.top > 0) {
        // Before pinning starts
        targetX = 0;
      } else if (rect.bottom < viewportHeight) {
        // After unpinning (fully scrolled through)
        const trackWidth = track.scrollWidth;
        const maxTranslate = Math.max(trackWidth - viewportWidth, 0);
        targetX = -maxTranslate;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(updatePosition);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-[300vh]" id="events">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center bg-background pt-24 pb-16 relative">
        {/* Schematic Corner Brackets / Crosshairs */}
        <div className="absolute top-28 left-8 text-outline/35 font-mono text-[9px] pointer-events-none select-none hidden md:block">
          [+] SYS.LOC: CH-02_SECT
        </div>
        <div className="absolute top-28 right-8 text-outline/35 font-mono text-[9px] pointer-events-none select-none hidden md:block">
          GRID_RESOLUTION: 8PX // COMP_UNIT
        </div>
        <div className="absolute bottom-24 left-8 text-outline/35 font-mono text-[9px] pointer-events-none select-none hidden md:block">
          CALIBRATION_PT: 02.979_HZ
        </div>
        <div className="absolute bottom-24 right-8 text-outline/35 font-mono text-[9px] pointer-events-none select-none hidden md:block">
          TELEMETRY_LINK: SECURE_128B
        </div>

        {/* Title and Intro */}
        <div className="max-w-max-width mx-auto px-margin-edge w-full mb-12 flex-shrink-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <span className="font-label-caps text-label-caps text-secondary block mb-2 tracking-[0.3em]">
                ANNOTATION 02
              </span>
              <h2 className="font-headline-lg text-4xl sm:text-headline-lg uppercase text-primary">
                Events &amp; Games
              </h2>
            </div>
            <p className="font-body-md text-on-surface-variant max-w-md">
              Rigorous trials designed to stress-test your technical proficiency across diverse engineering disciplines.
            </p>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div className="marquee-container w-full overflow-hidden marquee-mask flex-grow flex items-center">
          <div ref={trackRef} className="flex gap-8 px-margin-edge marquee-track">
            {challengeEvents.map((event) => (
              <EventCard key={event.id} event={event} onJoinEvent={onJoinEvent} />
            ))}
          </div>
        </div>

        {/* Technical Progress Bar & Telemetry Panel */}
        <div className="max-w-max-width mx-auto px-margin-edge w-full mt-12 flex-shrink-0 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-outline/20 pt-8 z-10">
          {/* Left: Real-time Coordinate Telemetry */}
          <div className="flex gap-8 font-technical-numeral text-[10px] uppercase tracking-widest text-on-surface-variant w-full md:w-auto justify-between md:justify-start">
            <div>
              <span className="text-secondary block font-bold mb-1">AXIS_X_OFFSET</span>
              <span ref={telemetryXRef} className="font-mono text-primary font-bold text-xs">0px</span>
            </div>
            <div>
              <span className="text-secondary block font-bold mb-1">PROG_PERCENT</span>
              <span ref={telemetryProgressRef} className="font-mono text-primary font-bold text-xs">0%</span>
            </div>
            <div>
              <span className="text-secondary block font-bold mb-1">FOCUS_EVENT</span>
              <span className="font-mono text-primary font-bold text-xs">
                #<span ref={telemetryCardRef}>01</span>
              </span>
            </div>
          </div>

          {/* Center: Sleek technical progress track with numeric guides */}
          <div className="flex-grow max-w-md w-full flex flex-col gap-2">
            <div className="h-2 w-full flex justify-between text-[8px] font-mono text-outline/50 select-none px-1">
              <span>01</span>
              <span>02</span>
              <span>03</span>
              <span>04</span>
              <span>05</span>
              <span>06</span>
              <span>07</span>
              <span>08</span>
              <span>09</span>
              <span>10</span>
            </div>
            <div className="relative h-[2px] bg-outline-variant/30 w-full overflow-hidden">
              <div 
                ref={progressLineRef} 
                className="absolute left-0 top-0 h-full w-full bg-secondary origin-left" 
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
          </div>

          {/* Right: Technical Metadata Info */}
          <div className="hidden md:flex font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase gap-4 items-center">
            <span>SYS_PINNED: TRUE</span>
            <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
            <span>DRAG_LOCK: AUTO</span>
          </div>
        </div>
      </div>
    </section>
  );
};
