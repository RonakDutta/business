import { query } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";
import { uploadBuffer } from "../config/cloudinary.js";

/* ---------------------------------------------------------------------------
   PAYMENTS — UPI entry-fee proofs (frontend client/src/lib/payment-submission
   .js + data/payment.js). A member uploads a screenshot; an admin verifies it
   against the bank statement using payment_ref.
   --------------------------------------------------------------------------- */

// POST /api/payments   (optional auth) — multipart "proof"
export const submitProof = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "Attach your payment screenshot.");
  const { eventId, payerName, payerEmail, paymentRef, amount } = req.body;

  const { url, publicId } = await uploadBuffer(req.file.buffer, "payments");

  const { rows } = await query(
    `insert into payments
       (event_id, user_id, payer_name, payer_email, payment_ref, amount, proof_url, proof_public_id)
     values ($1, $2, $3, $4, $5, $6, $7, $8) returning id, status, created_at`,
    [
      eventId || null,
      req.user?.id || null,
      payerName || null,
      payerEmail || null,
      paymentRef || null,
      amount != null ? Number(amount) : null,
      url,
      publicId,
    ],
  );
  res.status(201).json({ payment: rows[0] });
});

// GET /api/payments?status=pending   (admin)
export const listPayments = asyncHandler(async (req, res) => {
  const status = req.query.status;
  const { rows } = await query(
    `select * from payments ${status ? "where status = $1" : ""} order by created_at desc`,
    status ? [status] : [],
  );
  res.json({ payments: rows });
});

// PATCH /api/payments/:id   (admin) — { status: 'verified' | 'rejected' }
export const reviewPayment = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["verified", "rejected"].includes(status))
    throw new ApiError(400, "Status must be 'verified' or 'rejected'.");

  const { rows } = await query(
    "update payments set status = $2 where id = $1 returning id, status",
    [req.params.id, status],
  );
  if (!rows[0]) throw new ApiError(404, "Payment not found.");
  res.json({ payment: rows[0] });
});
