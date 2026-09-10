/**
 * Centralized registration deadline — backend mirror of src/registrationDeadline.ts.
 *
 * Deadline: 13 September 2026 at 11:59 PM IST (Asia/Kolkata, UTC+05:30)
 * Equivalent UTC: 2026-09-13T18:29:00.000Z
 */

/** The registration deadline as a UTC ISO string. */
export const REGISTRATION_DEADLINE_UTC = "2026-09-13T18:29:00.000Z";

/** Returns true if the current moment is AFTER the registration deadline. */
export function isRegistrationClosed() {
  const now = new Date();
  const deadline = new Date(REGISTRATION_DEADLINE_UTC);
  return now.getTime() > deadline.getTime();
}
