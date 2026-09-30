import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "./QRCode.jsx";
import ImagePicker from "./ImagePicker.jsx";
import Spinner from "./Spinner.jsx";
import { CheckIcon, CloseIcon, ScanIcon } from "./icons.jsx";
import { PAYMENT, paymentRef } from "../data/payment.js";
import { upiIntent } from "../lib/qr.js";
import { priceLabel, isFree } from "../lib/format.js";

/* ===========================================================================
   Attend, pay, confirmed.

   The QR is a UPI intent string encoded at render time, so any UPI app scans
   it with the amount and reference already filled in. On a phone, the same
   string opens the app directly, hence the button under the code.

   What this can't do: verify the money arrived. The seat is booked when the
   attendee uploads their payment screenshot, and the reference under the code
   is what the organisers match against their statement.
   =========================================================================== */

export default function AttendDialog({ event, user, onConfirm, onClose }) {
  const panelRef = useRef(null);
  const free = isFree(event.entryFee);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paymentImage, setPaymentImage] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // One reference per dialog; regenerating it mid-payment would be unhelpful.
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

    // RsvpContext.confirm() uploads the screenshot and records the RSVP, then
    // resolves to { ok, error }.
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
      const res = await onConfirm(submission);
      if (res && res.ok === false) {
        setPaymentError(res.error || "Unable to submit your RSVP. Please try again.");
        return;
      }
      setDone(true);
    } catch (error) {
      setPaymentError(error.message || "Unable to submit your RSVP.");
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
      className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-ink/50 p-0 sm:items-center sm:p-6"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="attend-title"
        tabIndex={-1}
        className="relative max-h-[calc(100dvh-0.75rem)] w-full max-w-[440px] overflow-y-auto rounded-t-panel border border-line bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-float outline-none [scrollbar-width:none] sm:max-h-[calc(100dvh-3rem)] sm:rounded-panel sm:p-7 [&::-webkit-scrollbar]:hidden"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="icon-btn absolute right-4 top-4 h-9 w-9"
        >
          <CloseIcon className="h-[18px] w-[18px]" />
        </button>

        {done ? (
          <Confirmed event={event} onClose={onClose} />
        ) : (
          <>
            <p className="text-[13.5px] font-semibold text-accent">{event.date}</p>
            <h2 id="attend-title" className="display-3 mt-1.5 pr-10">
              {free ? "Save your seat" : "Pay the entry fee"}
            </h2>

            {free ? (
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                This edition is free, so there is nothing to pay. Confirm below
                and we will count you in.
              </p>
            ) : (
              <>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  Scan with any UPI app. The amount and reference are already
                  filled in.
                </p>

                <div className="mt-5 flex flex-col items-center rounded-card border border-line bg-surface p-5">
                  <QRCode
                    value={intent}
                    title={`Pay ${priceLabel(event.entryFee)} to ${PAYMENT.displayName}`}
                    className="h-[168px] w-[168px] rounded-lg text-ink"
                  />

                  <div className="mt-4 text-center">
                    <div className="font-display text-[26px] font-semibold tracking-[-0.02em] text-ink tabular-nums">
                      {priceLabel(event.entryFee)}
                    </div>
                    <div className="mt-0.5 text-[13.5px] text-muted">{PAYMENT.displayName}</div>
                    <div className="mt-3 flex items-center justify-center gap-2 rounded-full border border-line-strong bg-white py-1 pl-3.5 pr-1">
                      <span className="font-mono text-[12.5px] text-ink">{PAYMENT.vpa}</span>
                      <button
                        type="button"
                        onClick={copyUpiId}
                        className="btn btn-primary h-7 px-3 text-[12px]"
                        aria-label="Copy UPI ID"
                      >
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>

                <a href={intent} className="btn btn-secondary mt-3 w-full sm:hidden">
                  <ScanIcon className="h-[18px] w-[18px]" />
                  Open my UPI app
                </a>

                <p className="mt-3 text-[12.5px] leading-relaxed text-subtle">
                  Reference <span className="font-mono text-ink">{reference}</span>.
                  Quote it if anything goes wrong with the transfer.
                </p>

                <div className="mt-5">
                  <div className="mb-2 flex items-baseline justify-between gap-3">
                    <span className="field-label">
                      Payment screenshot <span className="text-red-600">*</span>
                    </span>
                    {paymentImage && (
                      <button
                        type="button"
                        onClick={() => setPaymentImage("")}
                        className="text-[13px] font-semibold text-accent hover:text-ink"
                      >
                        Replace image
                      </button>
                    )}
                  </div>

                  {paymentImage ? (
                    <div className="flex items-center gap-3 rounded-card border border-line bg-surface p-3">
                      <img
                        src={paymentImage}
                        alt="Selected payment screenshot"
                        className="h-16 w-16 rounded-lg border border-line object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-ink">Screenshot attached</p>
                        <p className="mt-0.5 text-[12.5px] leading-relaxed text-subtle">
                          It will be sent with your RSVP.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <ImagePicker
                      preset="gallery"
                      label="Add payment screenshot"
                      hint="Required to submit your RSVP. A phone screenshot works best."
                      onError={setPaymentError}
                      onAdd={([image]) => {
                        setPaymentImage(image);
                        setPaymentError("");
                      }}
                    />
                  )}

                  {paymentError && (
                    <p role="alert" className="mt-2 text-[13px] font-semibold text-red-600">
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
              className="btn btn-primary btn-lg mt-5 w-full"
            >
              {submitting && <Spinner className="h-4 w-4" />}
              {submitting
                ? "Submitting…"
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

      <h2 id="attend-title" className="display-3 mt-5">
        You're going
      </h2>
      <p className="mx-auto mt-2 max-w-[320px] text-[15px] leading-relaxed text-muted">
        {event.when.headline}. Enter via {event.location.gate || "the main gate"}.
        We start on time.
      </p>

      <button type="button" onClick={onClose} className="btn btn-primary btn-lg mt-7 w-full">
        Done
      </button>
    </div>
  );
}
