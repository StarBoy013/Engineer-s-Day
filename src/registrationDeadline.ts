/**
 * Centralized registration deadline configuration.
 *
 * Deadline: 13 September 2026 at 11:59 PM IST (Asia/Kolkata, UTC+05:30)
 * Equivalent UTC: 2026-09-13T18:29:00.000Z
 *
 * Using an explicit UTC ISO string guarantees the deadline is
 * timezone-safe and unaffected by the user's local device timezone.
 */

/** The registration deadline as a UTC ISO string. */
export const REGISTRATION_DEADLINE_UTC = "2026-09-13T18:29:00.000Z";

/** Returns true if the current moment is AFTER the registration deadline. */
export function isRegistrationClosed(): boolean {
  const now = new Date();
  const deadline = new Date(REGISTRATION_DEADLINE_UTC);
  return now.getTime() > deadline.getTime();
}

/** Formatted deadline string for display in the UI. */
export const DEADLINE_DISPLAY = "13 September 2026 at 11:59 PM IST";
