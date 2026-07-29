import { api, buildRequestBody } from "./client.js";

export function submitPayment(fields) {
  return api.post("/payments", buildRequestBody(fields));
}

export async function getPayments() {
  const data = await api.get("/payments");
  return data.payments;
}
