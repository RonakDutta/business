/*
  Payment-proof transport boundary.

  Keep Google Sheets and storage credentials on the server. The eventual API
  should upload `paymentProof.imageDataUrl`, then add a row to the sheet with
  `payer`, `payment`, and the resulting image URL. Setting
  VITE_PAYMENT_PROOF_ENDPOINT makes the existing UI POST this object without
  further component changes. Until then, the app deliberately stays local.
*/
export async function submitPaymentProof(submission) {
  const endpoint = import.meta.env.VITE_PAYMENT_PROOF_ENDPOINT;
  if (!endpoint) return { delivered: false, localOnly: true };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission),
  });

  if (!response.ok) {
    throw new Error("We couldn't submit your payment proof. Please try again.");
  }

  return { delivered: true, response: await response.json().catch(() => null) };
}
