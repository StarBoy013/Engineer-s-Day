import React, { useState } from "react";
import { challengeEvents } from "./Events";

interface RegistrationFormProps {
  selectedEvents: string[];
  onChangeEvents: (eventIds: string[]) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  selectedEvents,
  onChangeEvents,
}) => {
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [discipline, setDiscipline] = useState("Structural");
  const [teamName, setTeamName] = useState("");
  const [teamRoster, setTeamRoster] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if any of the selected events is a team event (ID: 01, 04, 06, 09)
  const teamEventIds = ["01", "04", "06", "09"];
  const showTeamFields = selectedEvents.some((id) => teamEventIds.includes(id));

  const handleCheckboxChange = (eventId: string, checked: boolean) => {
    if (checked) {
      onChangeEvents([...selectedEvents, eventId]);
    } else {
      onChangeEvents(selectedEvents.filter((id) => id !== eventId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    // Mock API transmission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form fields
      setDesignation("");
      setEmail("");
      setDiscipline("Structural");
      setTeamName("");
      setTeamRoster("");
      onChangeEvents([]);

      // Reset success message after 2.5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 2500);
    }, 2500);
  };

  return (
    <section className="py-24 px-margin-edge bg-surface-container-highest/20" id="register">
      <div className="max-w-max-width mx-auto flex flex-col md:flex-row gap-16">
        {/* Left Info Panel */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <span className="font-label-caps text-[10px] text-secondary tracking-[0.3em] uppercase block mb-4 font-bold">
              Submission Portal
            </span>
            <h2 className="font-headline-lg text-4xl sm:text-headline-lg uppercase text-primary mb-6">
              Join the Assembly
            </h2>
            <p className="font-body-lg text-lg sm:text-xl md:text-body-lg text-on-surface-variant mb-8 leading-relaxed font-serif">
              Secure your place at the largest gathering of technical minds this year. Attendance is limited by the physical capacity of our structural assembly space.
            </p>
          </div>
          
          <div className="space-y-6 pt-6 border-t border-primary/20">
            <div className="flex items-center gap-4 text-on-surface-variant">
              <span className="material-symbols-outlined text-secondary select-none">
                calendar_today
              </span>
              <span className="font-label-caps text-xs sm:text-label-caps tracking-widest font-bold">
                September 15, 2026
              </span>
            </div>
            <div className="flex items-center gap-4 text-on-surface-variant">
              <span className="material-symbols-outlined text-secondary select-none">
                location_on
              </span>
              <span className="font-label-caps text-xs sm:text-label-caps tracking-widest font-bold">
                The Industrial Union Hall, NY
              </span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="md:w-1/2">
          <div className="relative border border-primary p-1 bg-background hard-shadow">
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
              <div className="grid grid-cols-1 gap-8">
                {/* Designation Field */}
                <div className="relative bracket-border bracket-tl bracket-tr bracket-bl bracket-br p-2 bg-surface">
                  <label className="block font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant px-2 mb-1 font-bold">
                    Full Designation
                  </label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-primary focus:ring-0 focus:border-secondary focus:outline-none transition-colors font-body-md py-2 px-2 text-primary placeholder:text-outline-variant font-serif text-lg"
                    placeholder="e.g. John Doe, P.E."
                  />
                </div>

                {/* Email Field */}
                <div className="relative bracket-border bracket-tl bracket-tr bracket-bl bracket-br p-2 bg-surface">
                  <label className="block font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant px-2 mb-1 font-bold">
                    Comm-Link Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-primary focus:ring-0 focus:border-secondary focus:outline-none transition-colors font-body-md py-2 px-2 text-primary placeholder:text-outline-variant font-serif text-lg"
                    placeholder="email@organization.com"
                  />
                </div>
              </div>

              {/* Event Checklist Multi-Select */}
              <div className="relative bracket-border bracket-tl bracket-tr bracket-bl bracket-br p-4 bg-surface-container-low">
                <label className="block font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant mb-4 px-2 font-bold">
                  Event Participation (Multi-Select)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {challengeEvents.map((event) => (
                    <label key={event.id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(event.id)}
                        onChange={(e) => handleCheckboxChange(event.id, e.target.checked)}
                        className="w-4 h-4 border-2 border-primary rounded-none text-secondary focus:ring-0 focus:ring-offset-0 transition-colors accent-secondary bg-surface"
                      />
                      <span className="font-body-md text-[13px] text-on-surface-variant group-hover:text-primary transition-colors font-semibold">
                        {event.id}: {event.title.split(" ")[0]} {event.title.split(" ")[1] || ""}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dynamic Team Fields */}
              {showTeamFields && (
                <div className="space-y-6 transition-all duration-300">
                  <div className="relative bracket-border bracket-tl bracket-tr bracket-bl bracket-br p-2 bg-surface">
                    <label className="block font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 px-2 font-bold">
                      Team Name
                    </label>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-primary focus:ring-0 focus:border-secondary focus:outline-none transition-colors font-body-md py-2 px-2 text-primary placeholder:text-outline-variant font-serif text-lg"
                      placeholder="e.g. Apex Dynamics"
                    />
                  </div>
                  <div className="relative bracket-border bracket-tl bracket-tr bracket-bl bracket-br p-2 bg-surface">
                    <label className="block font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 px-2 font-bold">
                      Team Roster
                    </label>
                    <textarea
                      required
                      value={teamRoster}
                      onChange={(e) => setTeamRoster(e.target.value)}
                      className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-primary focus:ring-0 focus:border-secondary focus:outline-none transition-colors font-body-md py-2 px-2 text-primary placeholder:text-outline-variant resize-none h-16 font-serif text-lg"
                      placeholder="List names and emails of team members..."
                    />
                  </div>
                </div>
              )}

              {/* Discipline Dropdown */}
              <div className="relative bracket-border bracket-tl bracket-tr bracket-bl bracket-br p-2 bg-surface">
                <label className="block font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 px-2 font-bold">
                  Primary Discipline
                </label>
                <select
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-primary focus:ring-0 focus:border-secondary focus:outline-none transition-colors font-body-md py-2 px-2 text-primary appearance-none cursor-pointer font-serif text-lg"
                >
                  <option className="bg-surface text-primary">Structural</option>
                  <option className="bg-surface text-primary">Mechanical</option>
                  <option className="bg-surface text-primary">Electrical</option>
                  <option className="bg-surface text-primary">Software</option>
                  <option className="bg-surface text-primary">Civil</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group/btn relative w-full bg-secondary text-on-secondary font-label-caps text-label-caps tracking-[0.2em] transition-all hover:bg-primary hover:text-on-primary active:scale-95 uppercase flex items-center justify-center gap-3 overflow-hidden py-4 border border-secondary hover:border-primary disabled:opacity-75 font-bold"
              >
                <span className="btn-text">
                  {isSubmitting
                    ? "Transmitting..."
                    : isSuccess
                    ? "Transmission Complete"
                    : "Transmit Registration"}
                </span>
                {isSubmitting && (
                  <span className="material-symbols-outlined spin-gear select-none">
                    settings
                  </span>
                )}
                {isSuccess && !isSubmitting && (
                  <span className="material-symbols-outlined select-none text-green-500">
                    check_circle
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
