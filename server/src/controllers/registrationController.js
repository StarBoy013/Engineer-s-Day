import { Registration } from "../models/Registration.js";
import { EVENT_CONFIG } from "../eventConfig.js";

// @desc    Store new event registration with participant-count validation
// @route   POST /api/registrations
// @access  Public
export const createRegistration = async (req, res) => {
  try {
    const {
      name,
      rollNo,
      department,
      phone,
      email,
      selectedEvents,
      isTeamRegistration,
      teamName,
      teamMembers,
    } = req.body;

    // ── Basic field validation ────────────────────────────────────────────────
    if (!name || !rollNo || !department || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required participant fields.",
      });
    }

    if (!selectedEvents || !Array.isArray(selectedEvents) || selectedEvents.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one event.",
      });
    }

    // ── Per-event participant count validation (server-side, never trust client) ──
    const sanitizedMembers = Array.isArray(teamMembers) ? teamMembers : [];

    for (const eventId of selectedEvents) {
      const cfg = EVENT_CONFIG[eventId];
      if (!cfg) {
        return res.status(400).json({
          success: false,
          message: `Unknown event ID: ${eventId}. Please select a valid event.`,
        });
      }

      if (cfg.type === "solo") {
        // Solo events must have 0 team members (the main registrant IS the sole participant)
        if (sanitizedMembers.length > 0) {
          return res.status(400).json({
            success: false,
            message: `"${cfg.name}" is a solo event and cannot have additional team members.`,
          });
        }
      } else {
        // Team events — validate against this event's own min/max
        const count = sanitizedMembers.length;
        if (count < cfg.minParticipants) {
          return res.status(400).json({
            success: false,
            message: `"${cfg.name}" requires at least ${cfg.minParticipants} participant(s). Received ${count}.`,
          });
        }
        if (count > cfg.maxParticipants) {
          return res.status(400).json({
            success: false,
            message: `"${cfg.name}" allows a maximum of ${cfg.maxParticipants} participant(s). Received ${count}.`,
          });
        }
      }
    }

    // ── Persist to database ───────────────────────────────────────────────────
    const newRegistration = await Registration.create({
      name,
      rollNo,
      department,
      phone,
      email,
      selectedEvents,
      isTeamRegistration: Boolean(isTeamRegistration),
      teamName: isTeamRegistration ? (teamName || "") : "",
      teamMembers: isTeamRegistration ? sanitizedMembers : [],
    });

    return res.status(201).json({
      success: true,
      message: "Registration stored successfully!",
      data: newRegistration,
    });
  } catch (error) {
    console.error("[Registration Error]:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error storing registration.",
    });
  }
};
