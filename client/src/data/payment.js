/* ---------------------------------------------------------------------------
   ENTRY FEE PAYMENT

   The QR on the Attend dialog is generated from these values at render time ,
   it isn't a picture file, so changing the VPA here changes every code on the
   site immediately. Nothing to re-export, nothing to re-upload.

   `vpa` is the UPI id money actually lands in. Put the real one here before
   this goes live.
   --------------------------------------------------------------------------- */

export const PAYMENT = {
  vpa: "business4.community@upi",
  name: "Business 4.0 Community",

  /* Shown under the code so people can check they're paying the right handle
     before they hit send. */
  displayName: "Business 4.0 Community",
};

/**
 * A per-attempt reference the organisers can match against their bank
 * statement. UPI allows letters and digits only, up to 35 characters.
 */
export function paymentRef(eventId) {
  const compact = String(eventId).replace(/-/g, "");
  const salt = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `B4${compact}${salt}`;
}
