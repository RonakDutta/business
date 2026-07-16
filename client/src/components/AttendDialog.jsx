import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "./QRCode.jsx";
import ImagePicker from "./ImagePicker.jsx";
import { CheckIcon, CloseIcon, ScanIcon } from "./icons.jsx";
import { PAYMENT, paymentRef } from "../data/payment.js";
import { upiIntent } from "../lib/qr.js";
import { priceLabel, isFree } from "../lib/format.js";
import { submitPaymentProof } from "../lib/payment-submission.js";

/* ===========================================================================
   Attend → pay → confirmed.

   The QR is a UPI intent string encoded at render time, so any UPI app scans
   it with the amount and reference already filled in. On a phone, the same
   string opens the app directly , hence the button under the code.

   What this can't do without a backend: verify the money arrived. The seat is
   booked when the attendee says they've paid, and the reference under the code
   is what the organisers match against their statement. When a payment gateway
   lands, `confirm` moves behind its webhook and the rest of this file stands.
   =========================================================================== */

export default function AttendDialog({ event, user, onConfirm, onClose }) {
  const panelRef = useRef(null);
  const free = isFree(event.entryFee);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paymentImage, setPaymentImage] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // One reference per dialog , regenerating it mid-payment would be unhelpful.
  const reference = useMemo(() => paymentRef(event.id), [event.id]);

  const intent = useMemo(
    () =>
      upiIntent({
        vpa: PAYMENT.vpa,
        name: PAYMENT.name,
        amount: event.entryFee,
        note: `Business 4.0 meetup ${event.id}`,
        ref: reference,
      }),
    [event.entryFee, event.id, reference],
  );

  // Escape closes; focus moves into the panel so the keyboard starts here.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const confirm = async () => {
    if (!free && !paymentImage) {
      setPaymentError("Please add a screenshot of your payment to continue.");
      return;
    }

    /*
      This is intentionally only assembled on the client today. When the
      backend is ready, POST this exact object to a protected endpoint: upload
      `paymentProof.imageDataUrl` to storage, then append its URL plus payer
      name/email and payment fields to Google Sheets on the server. Never send
      a Sheets credential or accept payment proof directly from the browser.
    */
    const submission = {
      eventId: event.id,
      payer: { name: user?.name || "", email: user?.email || "" },
      payment: {
        amount: event.entryFee,
        vpa: PAYMENT.vpa,
        reference,
      },
      paymentProof: {
        imageDataUrl: paymentImage,
        submittedAt: new Date().toISOString(),
      },
    };

    try {
      setSubmitting(true);
      setPaymentError("");
      await submitPaymentProof(submission);
      onConfirm(submission);
      setDone(true);
    } catch (error) {
      setPaymentError(error.message || "Unable to submit payment proof.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT.vpa);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-ink/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="attend-title"
        tabIndex={-1}
        className="relative max-h-[calc(100dvh-0.75rem)] w-full max-w-[420px] overflow-y-auto rounded-t-panel bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0_40px_80px_-30px_rgba(15,23,42,.5)] outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:max-h-[calc(100dvh-3rem)] sm:rounded-panel sm:p-6"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-subtle transition-colors duration-200 hover:bg-line hover:text-ink"
        >
          <CloseIcon className="h-[18px] w-[18px]" />
        </button>

        {done ? (
          <Confirmed event={event} onClose={onClose} />
        ) : (
          <>
            <div className="text-[11px] font-bold uppercase tracking-[0.09em] text-subtle">
              {event.date}
            </div>
            <h2
              id="attend-title"
              className="mt-1.5 pr-8 text-[22px] font-extrabold leading-tight tracking-[-0.03em]"
            >
              {free ? "Save your seat" : "Pay the entry fee"}
            </h2>

            {free ? (
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                This edition is free , no payment needed. Confirm below and
                we'll count you in.
              </p>
            ) : (
              <>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  Scan with any UPI app. The amount and reference are already
                  filled in.
                </p>

                <div className="mt-5 flex flex-col items-center rounded-card border border-line bg-[#fafbfc] p-4 sm:mt-5 sm:p-3">
                  <QRCode
                    value={intent}
                    title={`Pay ${priceLabel(event.entryFee)} to ${PAYMENT.displayName}`}
                    className="h-[160px] w-[160px] rounded-lg text-ink sm:h-[160px] sm:w-[160px]"
                  />

                  <div className="mt-3 text-center">
                    <div className="text-[24px] font-extrabold tracking-[-0.03em] tabular-nums text-ink">
                      {priceLabel(event.entryFee)}
                    </div>
                    <div className="mt-0.5 text-[13px] font-semibold text-muted">
                      {PAYMENT.displayName}
                    </div>
                    <div className="mt-1.5 flex items-center justify-center gap-2 rounded-lg border border-line-strong bg-white px-2.5 py-1.5">
                      <span className="font-mono text-[12px] font-bold text-ink">
                        {PAYMENT.vpa}
                      </span>
                      <button
                        type="button"
                        onClick={copyUpiId}
                        className="shrink-0 rounded-md bg-ink px-2 py-1 text-[10px] font-bold text-white transition-colors hover:bg-accent"
                        aria-label="Copy UPI ID"
                      >
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>

                <a
                  href={intent}
                  className="mt-3 flex items-center justify-center gap-2 rounded-btn border border-line-strong px-5 py-3 text-sm font-bold text-ink transition-colors duration-200 hover:border-ink sm:hidden"
                >
                  <ScanIcon className="h-[18px] w-[18px]" />
                  Open my UPI app
                </a>

                <p className="mt-3 text-[12px] leading-relaxed text-subtle">
                  Reference{" "}
                  <span className="font-mono text-ink">{reference}</span> ,
                  quote it if anything goes wrong with the transfer.
                </p>

                <div className="mt-4">
                  <div className="mb-2 flex items-baseline justify-between gap-3">
                    <label className="text-[13px] font-bold text-ink">
                      Payment screenshot <span className="text-red-600">*</span>
                    </label>
                    {paymentImage && (
                      <button
                        type="button"
                        onClick={() => setPaymentImage("")}
                        className="text-[12px] font-bold text-accent hover:text-ink"
                      >
                        Replace image
                      </button>
                    )}
                  </div>

                  {paymentImage ? (
                    <div className="flex items-center gap-3 rounded-card border border-line bg-[#fafbfc] p-3">
                      <img
                        src={paymentImage}
                        alt="Selected payment screenshot"
                        className="h-16 w-16 rounded-lg border border-line object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-ink">Screenshot attached</p>
                        <p className="mt-0.5 text-[11.5px] leading-relaxed text-subtle">
                          Your payment proof will be submitted with your RSVP.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <ImagePicker
                      preset="gallery"
                      label="Add payment screenshot"
                      hint="Required to submit your RSVP. PNG, JPG, or a phone screenshot work best."
                      onError={setPaymentError}
                      onAdd={([image]) => {
                        setPaymentImage(image);
                        setPaymentError("");
                      }}
                    />
                  )}

                  {paymentError && (
                    <p role="alert" className="mt-2 text-[12px] font-semibold text-red-600">
                      {paymentError}
                    </p>
                  )}
                </div>
              </>
            )}

            <button
              type="button"
              onClick={confirm}
              disabled={submitting}
              className="mt-4 w-full rounded-btn bg-ink px-6 py-3.5 text-[15px] font-bold text-white transition-[translate,background] duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-accent"
            >
              {submitting
                ? "Submitting payment proof…"
                : free
                  ? "Count me in"
                  : "Submit payment proof"}
            </button>

          </>
        )}
      </div>
    </div>
  );
}

function Confirmed({ event, onClose }) {
  return (
    <div className="py-4 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent/10 text-accent">
        <CheckIcon className="h-7 w-7" />
      </span>

      <h2
        id="attend-title"
        className="mt-5 text-[22px] font-extrabold tracking-[-0.03em]"
      >
        You're going
      </h2>
      <p className="mx-auto mt-2 max-w-[300px] text-[15px] leading-relaxed text-muted">
        {event.when.headline}. Enter via{" "}
        {event.location.gate || "the main gate"} , we start on time.
      </p>

      <button
        type="button"
        onClick={onClose}
        className="mt-7 w-full rounded-btn bg-ink px-6 py-4 text-[15px] font-bold text-white transition-[translate,background] duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-accent"
      >
        Done
      </button>
    </div>
  );
}
