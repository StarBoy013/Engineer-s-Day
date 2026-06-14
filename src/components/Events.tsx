import React from "react";
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

export const Events: React.FC<EventsProps> = ({ onJoinEvent }) => {
  return (
    <section className="py-24 px-margin-edge" id="events">
      <div className="max-w-max-width mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
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

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {challengeEvents.map((event) => (
            <div
              key={event.id}
              className="event-card group relative bg-surface p-8 flex flex-col justify-between"
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

                <h3 className="font-headline-md text-xl sm:text-2xl uppercase mb-3 text-primary">
                  {event.title}
                </h3>
                
                <p className="font-body-md text-on-surface-variant mb-8 leading-relaxed">
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
          ))}
        </div>
      </div>
    </section>
  );
};
