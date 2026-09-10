import React, { useState, useEffect } from "react";
import { challengeEvents } from "./Events";
import { EVENT_CONFIG, participantBadgeText } from "../eventConfig";

interface TeamMember {
  id: string;
  name: string;
  rollNo: string;
}

interface RegistrationFormProps {
  selectedEvents: string[];
  onChangeEvents: (eventIds: string[]) => void;
}

/**
 * Derive the effective participant constraints for the current selection.
 * Each event enforces its own min/max independently.
 * When multiple events are selected, we require the strictest combined rules:
 *   - maxParticipants = lowest max across all selected events
 *   - minParticipants = highest min across all selected events
 * If only solo events are selected, show solo UI.
 * If any team event is selected, show team UI.
 */
function deriveConstraints(selectedIds: string[]) {
  if (selectedIds.length === 0) {
    return { needsTeam: false, minParticipants: 1, maxParticipants: 1, label: "" };
  }

  let minParticipants = 1;
  let maxParticipants = Infinity;
  let hasTeam = false;

  for (const id of selectedIds) {
    const cfg = EVENT_CONFIG[id];
    if (!cfg) continue;
    if (cfg.type === "team") hasTeam = true;
    minParticipants = Math.max(minParticipants, cfg.minParticipants);
    maxParticipants = Math.min(maxParticipants, cfg.maxParticipants);
  }

  // Clamp max to a sensible upper bound
  if (!isFinite(maxParticipants)) maxParticipants = 4;

  // Build a summary label for the header
  let label = "";
  if (!hasTeam) {
    label = "Solo Event — 1 Participant";
  } else if (minParticipants === maxParticipants) {
    label = `Team Event — ${maxParticipants} Participant${maxParticipants > 1 ? "s" : ""}`;
  } else {
    label = `Team Event — ${minParticipants}–${maxParticipants} Participants`;
  }

  return { needsTeam: hasTeam, minParticipants, maxParticipants, label };
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  selectedEvents,
  onChangeEvents,
}) => {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Team states
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "1", name: "", rollNo: "" },
  ]);

  const [participantError, setParticipantError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Derive constraints from the current event selection
  const { needsTeam, minParticipants, maxParticipants, label } =
    deriveConstraints(selectedEvents);

  // When the selected events change, trim or reset team members to satisfy new constraints
  useEffect(() => {
    setParticipantError("");
    if (!needsTeam) {
      // Solo — always reset to 1 empty member slot (kept for data consistency, not rendered)
      setTeamMembers([{ id: "1", name: "", rollNo: "" }]);
      setTeamName("");
      return;
    }
    setTeamMembers((prev) => {
      // Trim to maxParticipants
      const trimmed = prev.slice(0, maxParticipants);
      // Ensure at least 1 slot exists
      if (trimmed.length === 0) return [{ id: Date.now().toString(), name: "", rollNo: "" }];
      return trimmed;
    });
  }, [selectedEvents.join(","), needsTeam, maxParticipants]);

  // Live participant count validation message
  useEffect(() => {
    if (!needsTeam) {
      setParticipantError("");
      return;
    }
    const count = teamMembers.length;
    if (count < minParticipants) {
      setParticipantError(
        `This event requires at least ${minParticipants} participant${minParticipants > 1 ? "s" : ""}. Please add ${minParticipants - count} more.`
      );
    } else if (count > maxParticipants) {
      setParticipantError(
        `This event allows a maximum of ${maxParticipants} participant${maxParticipants > 1 ? "s" : ""}.`
      );
    } else {
      setParticipantError("");
    }
  }, [teamMembers.length, needsTeam, minParticipants, maxParticipants]);

  const handleRadioChange = (eventId: string) => {
    onChangeEvents([eventId]);
  };

  const handleAddMember = () => {
    if (teamMembers.length < maxParticipants) {
      setTeamMembers((prev) => [
        ...prev,
        { id: Date.now().toString(), name: "", rollNo: "" },
      ]);
    }
  };

  const handleRemoveMember = (id: string) => {
    if (teamMembers.length > 1) {
      setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleMemberChange = (
    id: string,
    field: "name" | "rollNo",
    value: string
  ) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const isSubmitDisabled =
    isSubmitting || (needsTeam && participantError !== "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    if (selectedEvents.length === 0) {
      alert("Please select an event to register.");
      return;
    }

    // Final frontend participant count guard
    if (needsTeam) {
      const count = teamMembers.length;
      if (count < minParticipants || count > maxParticipants) {
        setParticipantError(
          `Please provide ${minParticipants === maxParticipants ? minParticipants : `${minParticipants}–${maxParticipants}`} participant(s) for the selected event(s).`
        );
        return;
      }
    }

    setIsSubmitting(true);

    const payload = {
      name,
      rollNo,
      department,
      phone,
      email,
      selectedEvents,
      isTeamRegistration: needsTeam,
      teamName: needsTeam ? teamName : "",
      teamMembers: needsTeam
        ? teamMembers.map((m) => ({ name: m.name, rollNo: m.rollNo }))
        : [],
    };

    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE}/api/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
        setName("");
        setRollNo("");
        setDepartment("");
        setPhone("");
        setEmail("");
        setTeamName("");
        setTeamMembers([{ id: "1", name: "", rollNo: "" }]);
        onChangeEvents([]);
      } else {
        alert(data.message || "Failed to submit registration.");
      }
    } catch (error) {
      console.error("[Registration Error]:", error);
      alert(
        "Error connecting to backend server. Make sure your Express server is running."
      );
    } finally {
      setIsSubmitting(false);
    }
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
              Secure your place at the Engineers Day celebrations. Fill in your academic details and select your events below.
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
                school
              </span>
              <span className="font-label-caps text-xs sm:text-label-caps tracking-widest font-bold">
                RIMT University Campus
              </span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="md:w-1/2">
          <div className="relative border border-primary p-1 bg-background hard-shadow min-h-[480px] flex flex-col justify-center">
            {isSuccess ? (
              /* Success View */
              <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-600 flex items-center justify-center animate-bounce-slow">
                  <span className="material-symbols-outlined text-5xl text-green-600 select-none">
                    check_circle
                  </span>
                </div>

                <div>
                  <span className="font-label-caps text-xs text-secondary tracking-[0.3em] uppercase block mb-2 font-bold">
                    SYSTEM CONFIRMATION
                  </span>
                  <h3 className="font-headline-lg text-2xl sm:text-3xl uppercase text-primary font-bold">
                    Successful Registration!
                  </h3>
                </div>

                <p className="font-body-md text-on-surface-variant max-w-md font-serif text-base sm:text-lg leading-relaxed">
                  Your event registration has been successfully received and recorded in the system database. We look forward to your participation at Engineer's Day!
                </p>

                <div className="w-full bracket-border bracket-tl bracket-tr bracket-bl bracket-br p-4 bg-surface border border-primary/20 text-left font-mono text-xs text-on-surface-variant space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-secondary font-bold">STATUS:</span>
                    <span className="text-green-600 font-bold">TRANSMISSION_CONFIRMED</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary font-bold">TIMESTAMP:</span>
                    <span>{new Date().toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 inline-flex items-center gap-2 font-label-caps text-xs tracking-widest text-primary hover:text-secondary transition-colors border-2 border-primary px-6 py-3 font-bold hover:border-secondary focus:outline-none bg-surface"
                >
                  <span className="material-symbols-outlined text-base">refresh</span>
                  REGISTER ANOTHER PARTICIPANT
                </button>
              </div>
            ) : (
              /* Active Registration Form */
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                {/* Row 1: Full Name & Roll No */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="relative bracket-border bracket-tl bracket-tr bracket-bl bracket-br p-2 bg-surface">
                    <label className="block font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant px-2 mb-1 font-bold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-primary focus:ring-0 focus:border-secondary focus:outline-none transition-colors font-body-md py-2 px-2 text-primary placeholder:text-outline-variant font-serif text-base sm:text-lg"
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div className="relative bracket-border bracket-tl bracket-tr bracket-bl bracket-br p-2 bg-surface">
                    <label className="block font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant px-2 mb-1 font-bold">
                      Roll No.
                    </label>
                    <input
                      type="text"
                      required
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-primary focus:ring-0 focus:border-secondary focus:outline-none transition-colors font-body-md py-2 px-2 text-primary placeholder:text-outline-variant font-serif text-base sm:text-lg"
                      placeholder="e.g. 2x-xxx-xxx"
                    />
                  </div>
                </div>

                {/* Row 2: Department & Phone No */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="relative bracket-border bracket-tl bracket-tr bracket-bl bracket-br p-2 bg-surface">
                    <label className="block font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant px-2 mb-1 font-bold">
                      Department (Dept.)
                    </label>
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-primary focus:ring-0 focus:border-secondary focus:outline-none transition-colors font-body-md py-2 px-2 text-primary placeholder:text-outline-variant font-serif text-base sm:text-lg"
                      placeholder="e.g. CSE / Mechanical"
                    />
                  </div>

                  <div className="relative bracket-border bracket-tl bracket-tr bracket-bl bracket-br p-2 bg-surface">
                    <label className="block font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant px-2 mb-1 font-bold">
                      Phone No.
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-primary focus:ring-0 focus:border-secondary focus:outline-none transition-colors font-body-md py-2 px-2 text-primary placeholder:text-outline-variant font-serif text-base sm:text-lg"
                      placeholder="e.g. 98783 10681"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="relative bracket-border bracket-tl bracket-tr bracket-bl bracket-br p-2 bg-surface">
                  <label className="block font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant px-2 mb-1 font-bold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-primary focus:ring-0 focus:border-secondary focus:outline-none transition-colors font-body-md py-2 px-2 text-primary placeholder:text-outline-variant font-serif text-base sm:text-lg"
                    placeholder="email@organization.com"
                  />
                </div>

                {/* Event Checklist Multi-Select */}
                <div className="relative bracket-border bracket-tl bracket-tr bracket-bl bracket-br p-4 bg-surface-container-low">
                  <label className="block font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant mb-4 px-2 font-bold">
                    Select Event
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {challengeEvents.map((event) => (
                      <label key={event.id} className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="event-selection"
                          checked={selectedEvents.includes(event.id)}
                          onChange={() => handleRadioChange(event.id)}
                          className="w-4 h-4 mt-0.5 border-2 border-primary rounded-full text-secondary focus:ring-0 focus:ring-offset-0 transition-colors accent-secondary bg-surface flex-shrink-0"
                        />
                        <span className="font-body-md text-[13px] text-on-surface-variant group-hover:text-primary transition-colors font-semibold flex flex-col gap-0.5 w-full">
                          <span>{event.id}: {event.title}</span>
                          <span className="text-[9px] font-mono text-secondary font-bold tracking-wider">
                            {participantBadgeText(event.id)}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dynamic Participant Fields */}
                {selectedEvents.length > 0 && needsTeam && (
                  <div className="space-y-6 transition-all duration-300 border-t border-primary/20 pt-6">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <h3 className="font-label-caps text-xs uppercase tracking-widest text-primary font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-base">groups</span>
                        {label}
                      </h3>
                      <span className={`font-mono text-xs font-bold px-2.5 py-1 border ${participantError ? "text-red-600 bg-red-50 border-red-300" : "text-secondary bg-secondary/10 border-secondary/30"}`}>
                        {teamMembers.length} / {maxParticipants} Members
                      </span>
                    </div>

                    {/* Participant count error */}
                    {participantError && (
                      <div className="flex items-start gap-2 bg-red-50 border border-red-200 px-3 py-2.5">
                        <span className="material-symbols-outlined text-red-500 text-sm mt-0.5 select-none">error</span>
                        <p className="font-label-caps text-[10px] text-red-600 font-bold tracking-wider uppercase leading-relaxed">
                          {participantError}
                        </p>
                      </div>
                    )}

                    {/* Team Name */}
                    <div className="relative bracket-border bracket-tl bracket-tr bracket-bl bracket-br p-2 bg-surface">
                      <label className="block font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 px-2 font-bold">
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

                    {/* Dynamic Team Members List */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center px-1">
                        <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                          Participants Roster
                        </span>

                        {/* Add Member Button */}
                        {teamMembers.length < maxParticipants && (
                          <button
                            type="button"
                            onClick={handleAddMember}
                            className="inline-flex items-center gap-1.5 font-label-caps text-[11px] tracking-wider text-secondary hover:text-primary transition-colors font-bold focus:outline-none border border-secondary/40 hover:border-secondary px-3 py-1 bg-surface"
                          >
                            <span className="material-symbols-outlined text-base font-bold">add</span>
                            ADD MEMBER
                          </button>
                        )}
                      </div>

                      {teamMembers.map((member, index) => (
                        <div
                          key={member.id}
                          className="relative bracket-border bracket-tl bracket-tr bracket-bl bracket-br p-3 bg-surface border border-primary/15 space-y-3"
                        >
                          <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                            <span className="font-label-caps text-[10px] text-secondary font-bold uppercase tracking-wider">
                              {index === 0 ? "Participant 1 (Team Leader)" : `Participant ${index + 1}`}
                            </span>
                            {teamMembers.length > Math.max(1, minParticipants - 1) && teamMembers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMember(member.id)}
                                className="text-on-surface-variant hover:text-red-600 transition-colors focus:outline-none flex items-center gap-1 text-[10px] font-label-caps uppercase"
                                title="Remove Participant"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block font-label-caps text-[9px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                                Name
                              </label>
                              <input
                                type="text"
                                required
                                value={member.name}
                                onChange={(e) => handleMemberChange(member.id, "name", e.target.value)}
                                className="w-full bg-transparent border-t-0 border-x-0 border-b border-primary/40 focus:border-secondary focus:outline-none font-serif text-sm py-1 text-primary placeholder:text-outline-variant"
                                placeholder={index === 0 ? "e.g. John Doe (Leader)" : `Participant ${index + 1} Name`}
                              />
                            </div>
                            <div>
                              <label className="block font-label-caps text-[9px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                                Roll No.
                              </label>
                              <input
                                type="text"
                                required
                                value={member.rollNo}
                                onChange={(e) => handleMemberChange(member.id, "rollNo", e.target.value)}
                                className="w-full bg-transparent border-t-0 border-x-0 border-b border-primary/40 focus:border-secondary focus:outline-none font-serif text-sm py-1 text-primary placeholder:text-outline-variant"
                                placeholder="e.g. 2x-xxx-xxx"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {teamMembers.length >= maxParticipants && (
                        <p className="text-[11px] font-label-caps text-secondary font-bold tracking-widest uppercase text-right">
                          MAXIMUM {maxParticipants} PARTICIPANT{maxParticipants > 1 ? "S" : ""} REACHED
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Solo event indicator */}
                {selectedEvents.length > 0 && !needsTeam && (
                  <div className="flex items-center gap-2 border-t border-primary/20 pt-4">
                    <span className="material-symbols-outlined text-secondary text-base select-none">person</span>
                    <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary font-bold">
                      Solo Event — 1 Participant (You)
                    </span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="group/btn relative w-full bg-secondary text-on-secondary font-label-caps text-label-caps tracking-[0.2em] transition-all hover:bg-primary hover:text-on-primary active:scale-95 uppercase flex items-center justify-center gap-3 overflow-hidden py-4 border border-secondary hover:border-primary disabled:opacity-75 disabled:cursor-not-allowed font-bold"
                >
                  <span className="btn-text">
                    {isSubmitting ? "Registering..." : "Register"}
                  </span>
                  {isSubmitting && (
                    <span className="material-symbols-outlined spin-gear select-none">
                      settings
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
