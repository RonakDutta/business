import { query } from "../config/db.js";
import { asyncHandler, ApiError } from "../utils/asyncHandler.js";
import { uploadImage } from "../config/cloudinary.js";

// POST /api/payments  - a member uploads their UPI payment screenshot
export const submitPayment = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "Attach your payment screenshot.");

  const { eventId, payerName, payerEmail, paymentRef, amount } = req.body;
  const image = await uploadImage(req.file.buffer, "payments");

  const result = await query(
    `insert into payments
       (event_id, user_id, payer_name, payer_email, payment_ref, amount, proof_url, proof_public_id)
     values ($1, $2, $3, $4, $5, $6, $7, $8)
     returning id, status, created_at`,
    [
      eventId || null,
      req.user?.id || null,
      payerName || null,
      payerEmail || null,
      paymentRef || null,
      Number(amount) || null,
      image.url,
      image.publicId,
    ],
  );

  res.status(201).json({ payment: result.rows[0] });
});

// GET /api/payments  (admin)
export const listPayments = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const result = status
    ? await query("select * from payments where status = $1 order by created_at desc", [status])
    : await query("select * from payments order by created_at desc");

  res.json({ payments: result.rows });
});

// PATCH /api/payments/:id  (admin) - mark a payment verified or rejected
export const reviewPayment = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (status !== "verified" && status !== "rejected") {
    throw new ApiError(400, "Status must be 'verified' or 'rejected'.");
  }

  const result = await query(
    "update payments set status = $2 where id = $1 returning id, status",
    [req.params.id, status],
  );
  if (result.rows.length === 0) throw new ApiError(404, "Payment not found.");

  res.json({ payment: result.rows[0] });
});
