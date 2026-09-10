import React from "react";
import type { AgendaItem } from "../types";


export const agendaItems: AgendaItem[] = [
  {
    time: "10:00 AM - 10:30 AM",
    hourLabel: "10",
    title: "Inaugural Assembly",
    description: "A ceremonial opening marking the beginning of the event, featuring the welcome address, introduction of the theme, and inaugural proceedings.",
  },
  {
    time: "11:00 AM - 1:00 PM",
    hourLabel: "11",
    title: "Events",
    description: "A vibrant lineup of competitions and activities designed to showcase creativity, technical skills, teamwork, and innovation.",
  },
  {
    time: "03:00 PM onwards",
    hourLabel: "15",
    title: "Valedictory",
    description: "A celebratory closing ceremony honoring the participants, recognizing outstanding achievements, and bringing the event to a memorable conclusion.",
  },
];

export const Agenda: React.FC = () => {
  return (
    <section className="py-24 px-margin-edge bg-surface-container-low/50" id="agenda">
      <div className="max-w-max-width mx-auto">
        <div className="flex justify-between items-end mb-16 border-b border-primary pb-4">
          <h2 className="font-headline-lg text-4xl sm:text-headline-lg uppercase text-primary">
            The Schedule
          </h2>
          <span className="font-label-caps text-label-caps text-on-surface-variant pb-2 select-none">
            SCHEDULE v.2026.1
          </span>
        </div>

        <div className="space-y-0">
          {agendaItems.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-gutter relative">
              {/* Left Column: Time Indicators */}
              <div className="md:col-span-3 pb-12 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start">
                <span className="font-technical-numeral text-[80px] md:text-technical-numeral text-primary/10 select-none font-light leading-none">
                  {item.hourLabel}
                </span>
                <span className="font-label-caps text-label-caps text-primary md:-mt-8 font-bold">
                  {item.time}
                </span>
              </div>

              {/* Middle Column: Timeline Line and Dots */}
              <div className="md:col-span-1 timeline-connector hidden md:block">
                <div className="timeline-node"></div>
              </div>

              {/* Right Column: Card Content */}
              <div className="md:col-span-8 pb-12 pt-0 md:pt-6">
                <h3 className="font-headline-md text-2xl uppercase mb-4 text-primary">
                  {item.title}
                </h3>
                
                <p className="text-on-surface-variant max-w-xl font-serif text-lg leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
