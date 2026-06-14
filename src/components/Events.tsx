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
  const row1 = challengeEvents.slice(0, 5);
  const row2 = challengeEvents.slice(5, 10);

  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track1 = track1Ref.current;
    const track2 = track2Ref.current;
    const section = document.getElementById("events");
    if (!track1 || !track2 || !section) return;

    let targetX1 = 0;
    let targetX2 = 0;
    let currentX1 = 0;
    let currentX2 = 0;
    let animationFrameId: number;

    const updatePosition = () => {
      // Smooth lerp (10% adjustment per frame)
      currentX1 += (targetX1 - currentX1) * 0.1;
      currentX2 += (targetX2 - currentX2) * 0.1;

      // Apply translation to tracks
      track1.style.transform = `translateX(${currentX1}px)`;
      track2.style.transform = `translateX(${currentX2}px)`;

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Only calculate when section is visible
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const scrollRange = rect.height + viewportHeight;
        const scrolledAmount = viewportHeight - rect.top;
        const progress = Math.min(Math.max(scrolledAmount / scrollRange, 0), 1);

        // Map progress [0, 1] to translation range.
        // Row 1 slides left (moves towards -300px), row 2 slides right (moves towards +300px).
        // Let's set a maximum travel distance of 300px on desktop, smaller on mobile.
        const isMobile = window.innerWidth < 768;
        const maxTranslate = isMobile ? 180 : 350;
        
        targetX1 = (progress - 0.5) * -maxTranslate;
        targetX2 = (progress - 0.5) * maxTranslate;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(updatePosition);
    handleScroll(); // Initial position check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="py-24" id="events">
      <div className="max-w-max-width mx-auto px-margin-edge mb-16">
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

      {/* Sliding Tracks Linked to Scroll */}
      <div className="flex flex-col gap-8 overflow-hidden w-full py-4">
        {/* Row 1: Sliding Left on Scroll */}
        <div className="marquee-container w-full overflow-hidden marquee-mask">
          <div ref={track1Ref} className="flex gap-8 marquee-track">
            {row1.map((event) => (
              <EventCard key={event.id} event={event} onJoinEvent={onJoinEvent} />
            ))}
          </div>
        </div>

        {/* Row 2: Sliding Right on Scroll */}
        <div className="marquee-container w-full overflow-hidden marquee-mask">
          <div ref={track2Ref} className="flex gap-8 marquee-track">
            {row2.map((event) => (
              <EventCard key={event.id} event={event} onJoinEvent={onJoinEvent} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
