/**
 * Backend event participation rules — mirrors src/eventConfig.ts.
 * Never trust the client participant count; always validate against this config.
 */
export const EVENT_CONFIG = {
  "01": { id: "01", name: "Best out of Waste",           minParticipants: 3, maxParticipants: 4, type: "team" },
  "02": { id: "02", name: "Digi Mania - AI Prompt",      minParticipants: 1, maxParticipants: 1, type: "solo" },
  "03": { id: "03", name: "Digi Mania - Game Developer", minParticipants: 2, maxParticipants: 2, type: "team" },
  "04": { id: "04", name: "Poster Making",                minParticipants: 1, maxParticipants: 1, type: "solo" },
  "05": { id: "05", name: "Quiz Competition",             minParticipants: 3, maxParticipants: 4, type: "team" },
  "06": { id: "06", name: "Reel Making",                  minParticipants: 2, maxParticipants: 2, type: "team" },
};
