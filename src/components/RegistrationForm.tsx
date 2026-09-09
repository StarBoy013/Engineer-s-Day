import React, { useState } from "react";
import { challengeEvents } from "./Events";

interface TeamMember {
  id: string;
  name: string;
  rollNo: string;
}

interface RegistrationFormProps {
  selectedEvents: string[];
  onChangeEvents: (eventIds: string[]) => void;
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if any of the selected events is a team event
  const showTeamFields = selectedEvents.some((id) => {
    const ev = challengeEvents.find((e) => e.id === id);
    return ev?.isTeamEvent ?? false;
  });

  const handleCheckboxChange = (eventId: string, checked: boolean) => {
    if (checked) {
      onChangeEvents([...selectedEvents, eventId]);
    } else {
      onChangeEvents(selectedEvents.filter((id) => id !== eventId));
    }
  };

  const handleAddMember = () => {
    if (teamMembers.length < 4) {
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

  const handleMemberChange = (id: string, field: "name" | "rollNo", value: string) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (selectedEvents.length === 0) {
      alert("Please select at least one event to register.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name,
      rollNo,
      department,
      phone,
      email,
      selectedEvents,
      isTeamRegistration: showTeamFields,
      teamName: showTeamFields ? teamName : "",
      teamMembers: showTeamFields ? teamMembers.map((m) => ({ name: m.name, rollNo: m.rollNo })) : [],
    };

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
        // Reset form fields
        setName("");
        setRollNo("");
        setDepartment("");
        setPhone("");
        setEmail("");
        setTeamName("");
        setTeamMembers([{ id: "1", name: "", rollNo: "" }]);
        onChangeEvents([]);

        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      } else {
        alert(data.message || "Failed to submit registration.");
      }
    } catch (error) {
      console.error("[Registration Error]:", error);
      alert("Error connecting to backend server. Make sure your Express server is running.");
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
          <div className="relative border border-primary p-1 bg-background hard-shadow">
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
                      <span className="font-body-md text-[13px] text-on-surface-variant group-hover:text-primary transition-colors font-semibold flex items-center justify-between w-full pr-2">
                        <span>{event.id}: {event.title}</span>
                        {event.isTeamEvent && (
                          <span className="text-[9px] font-mono text-secondary font-bold">TEAM</span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dynamic Team Fields */}
              {showTeamFields && (
                <div className="space-y-6 transition-all duration-300 border-t border-primary/20 pt-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-label-caps text-xs uppercase tracking-widest text-primary font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-base">groups</span>
                      Team Details (1 to 4 Members)
                    </h3>
                    <span className="font-mono text-xs text-secondary font-bold bg-secondary/10 px-2.5 py-1 border border-secondary/30">
                      {teamMembers.length} / 4 Members
                    </span>
                  </div>

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
                        Team Members Roster
                      </span>

                      {/* Add Member Button with + Icon */}
                      <button
                        type="button"
                        onClick={handleAddMember}
                        disabled={teamMembers.length >= 4}
                        className="inline-flex items-center gap-1.5 font-label-caps text-[11px] tracking-wider text-secondary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-bold focus:outline-none border border-secondary/40 hover:border-secondary px-3 py-1 bg-surface"
                      >
                        <span className="material-symbols-outlined text-base font-bold">add</span>
                        ADD MEMBER
                      </button>
                    </div>

                    {teamMembers.map((member, index) => (
                      <div
                        key={member.id}
                        className="relative bracket-border bracket-tl bracket-tr bracket-bl bracket-br p-3 bg-surface border border-primary/15 space-y-3"
                      >
                        <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                          <span className="font-label-caps text-[10px] text-secondary font-bold uppercase tracking-wider">
                            {index === 0 ? "Member 1 (Team Leader)" : `Member ${index + 1}`}
                          </span>
                          {teamMembers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-on-surface-variant hover:text-red-600 transition-colors focus:outline-none flex items-center gap-1 text-[10px] font-label-caps uppercase"
                              title="Remove Member"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-label-caps text-[9px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                              Member Name
                            </label>
                            <input
                              type="text"
                              required
                              value={member.name}
                              onChange={(e) => handleMemberChange(member.id, "name", e.target.value)}
                              className="w-full bg-transparent border-t-0 border-x-0 border-b border-primary/40 focus:border-secondary focus:outline-none font-serif text-sm py-1 text-primary placeholder:text-outline-variant"
                              placeholder={index === 0 ? "e.g. John Doe (Leader)" : `Member ${index + 1} Name`}
                            />
                          </div>
                          <div>
                            <label className="block font-label-caps text-[9px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">
                              Member Roll No.
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

                    {teamMembers.length >= 4 && (
                      <p className="text-[11px] font-label-caps text-secondary font-bold tracking-widest uppercase text-right">
                        MAXIMUM 4 TEAM MEMBERS REACHED
                      </p>
                    )}
                  </div>
                </div>
              )}

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
