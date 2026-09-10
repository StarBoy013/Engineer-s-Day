import React from "react";
import type { ChallengeEvent } from "../types";
import { participantBadgeText } from "../eventConfig";

interface EventsProps {
  onJoinEvent: (eventId: string) => void;
}

export const challengeEvents: ChallengeEvent[] = [
  {
    id: "01",
    title: "Best out of Waste",
    description: "Transform discarded materials and scrap into innovative, functional engineering prototypes or eco-friendly structures.",
    icon: "recycling",
    isTeamEvent: true,
  },
  {
    id: "02",
    title: "Digi Mania- AI Prompt",
    description: "Showcase digital creativity, UI/UX conceptualization, digital media designs, and technical graphics in an engaging clash.",
    icon: "devices",
    isTeamEvent: false,
  },
  {
    id: "03",
    title: "Digi Mania- Game Developer",
    description: "Showcase digital creativity, UI/UX conceptualization, digital media designs, and technical graphics in an engaging clash.",
    icon: "devices",
    isTeamEvent: false,
  },
  {
    id: "04",
    title: "Poster Making",
    description: "Express future engineering concepts, sustainability innovations, and tech breakthroughs through visual poster art.",
    icon: "palette",
    isTeamEvent: false,
  },
  {
    id: "05",
    title: "Quiz Competition",
    description: "Test your speed, analytical aptitude, and knowledge across general engineering, historic inventions, and emerging tech.",
    icon: "quiz",
    isTeamEvent: true,
  },
  {
    id: "06",
    title: "Reel Making",
    description: "Capture the essence of innovation, engineering campus life, and technology in creative short video reels.",
    icon: "movie",
    isTeamEvent: true,
  },
];

const EventCard: React.FC<{
  event: ChallengeEvent;
  onJoinEvent: (eventId: string) => void;
}> = ({ event, onJoinEvent }) => {
  return (
    <div className="event-card group relative bg-surface p-8 flex flex-col justify-between h-full min-h-[320px]">
      {/* Event ID Badge */}
      <span className="absolute top-4 right-4 font-technical-numeral text-4xl text-primary/10 event-number select-none font-bold">
        {event.id}
      </span>

      <div>
        {/* Material Icon */}
        <span className="material-symbols-outlined text-4xl text-secondary mb-6 block transition-transform duration-500 group-hover:rotate-12 select-none">
          {event.icon}
        </span>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <h3 className="font-headline-md text-xl md:text-2xl uppercase text-primary">
            {event.title}
          </h3>
          <span className="font-label-caps text-[9px] uppercase px-2 py-0.5 bg-secondary/10 text-secondary border border-secondary/30 font-bold select-none whitespace-nowrap">
            {participantBadgeText(event.id)}
          </span>
        </div>
        
        <p className="font-body-md text-on-surface-variant leading-relaxed text-sm md:text-base mb-8">
          {event.description}
        </p>
      </div>

      {/* Action Trigger */}
      <button
        onClick={() => onJoinEvent(event.id)}
        className="inline-flex items-center gap-2 font-label-caps text-xs tracking-widest text-primary hover:text-secondary transition-colors group/link font-bold text-left focus:outline-none w-max mt-auto"
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
  return (
    <section className="py-24 px-margin-edge bg-background relative" id="events">
      <div className="max-w-max-width mx-auto w-full">
        {/* Title and Intro */}
        <div className="mb-16 border-b border-primary/20 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <span className="font-label-caps text-label-caps text-secondary block mb-2 tracking-[0.3em] font-bold">
              ANNOTATION 02
            </span>
            <h2 className="font-headline-lg text-4xl sm:text-headline-lg uppercase text-primary">
              Events &amp; Competitions
            </h2>
          </div>
          <p className="font-body-md text-on-surface-variant max-w-md font-serif text-lg leading-relaxed">
            Rigorous challenges designed to stress-test your creativity, technical proficiency, and problem-solving skill.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {challengeEvents.map((event) => (
            <EventCard key={event.id} event={event} onJoinEvent={onJoinEvent} />
          ))}
        </div>
      </div>
    </section>
  );
};
