/**
 * Centralized event participation rules.
 * Single source of truth for min/max participants and event type.
 * The backend mirrors this in server/src/eventConfig.js
 */
export interface EventConfig {
  id: string;
  name: string;
  minParticipants: number;
  maxParticipants: number;
  type: "solo" | "team";
}

export const EVENT_CONFIG: Record<string, EventConfig> = {
  "01": { id: "01", name: "Best out of Waste",          minParticipants: 3, maxParticipants: 4, type: "team" },
  "02": { id: "02", name: "Digi Mania - AI Prompt",     minParticipants: 1, maxParticipants: 1, type: "solo" },
  "03": { id: "03", name: "Digi Mania - Game Developer",minParticipants: 2, maxParticipants: 2, type: "team" },
  "04": { id: "04", name: "Poster Making",               minParticipants: 1, maxParticipants: 1, type: "solo" },
  "05": { id: "05", name: "Quiz Competition",            minParticipants: 3, maxParticipants: 4, type: "team" },
  "06": { id: "06", name: "Reel Making",                 minParticipants: 2, maxParticipants: 2, type: "team" },
};

/** Human-readable badge text shown in event cards and the registration checklist */
export function participantBadgeText(eventId: string): string {
  const cfg = EVENT_CONFIG[eventId];
  if (!cfg) return "";
  if (cfg.type === "solo") return "SOLO \u2022 1 PARTICIPANT";
  if (cfg.minParticipants === cfg.maxParticipants) {
    return `TEAM \u2022 ${cfg.maxParticipants} PARTICIPANTS`;
  }
  return `TEAM \u2022 ${cfg.minParticipants}\u2013${cfg.maxParticipants} PARTICIPANTS`;
}
