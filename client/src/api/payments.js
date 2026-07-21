import { api, toBody } from "./client.js";

/* PAYMENTS — UPI entry-fee proofs. Members submit a screenshot (`proof` File);
   admins list and review. Mirrors server/src/routes/payment.routes.js. */

export async function submitProof(payload) {
  // payload: { proof: File, eventId, payerName, payerEmail, paymentRef, amount }
  const { payment } = await api.post("/payments", toBody(payload));
  return payment;
}

export async function list(status) {
  const { payments } = await api.get("/payments", { params: { status } });
  return payments;
}

export async function review(id, status) {
  // status: 'verified' | 'rejected'
  const { payment } = await api.patch(`/payments/${id}`, { status });
  return payment;
}
