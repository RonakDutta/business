import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "./QRCode.jsx";
import { CheckIcon, CloseIcon, ScanIcon } from "./icons.jsx";
import { PAYMENT, paymentRef } from "../data/payment.js";
import { upiIntent } from "../lib/qr.js";
import { priceLabel, isFree } from "../lib/format.js";

/* ===========================================================================
   Attend → pay → confirmed.

   The QR is a UPI intent string encoded at render time, so any UPI app scans
   it with the amount and reference already filled in. On a phone, the same
   string opens the app directly — hence the button under the code.

   What this can't do without a backend: verify the money arrived. The seat is
   booked when the attendee says they've paid, and the reference under the code
   is what the organisers match against their statement. When a payment gateway
   lands, `confirm` moves behind its webhook and the rest of this file stands.
   =========================================================================== */

export default function AttendDialog({ event, onConfirm, onClose }) {
  const panelRef = useRef(null);
  const free = isFree(event.entryFee);
  const [done, setDone] = useState(false);

  // One reference per dialog — regenerating it mid-payment would be unhelpful.
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

  const confirm = () => {
    onConfirm();
    setDone(true);
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
        className="relative w-full max-w-[420px] rounded-t-panel bg-white p-6 shadow-[0_40px_80px_-30px_rgba(15,23,42,.5)] outline-none sm:rounded-panel sm:p-8"
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
                This edition is free — no payment needed. Confirm below and
                we'll count you in.
              </p>
            ) : (
              <>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  Scan with any UPI app. The amount and reference are already
                  filled in.
                </p>

                <div className="mt-6 flex flex-col items-center rounded-card border border-line bg-[#fafbfc] p-5">
                  <QRCode
                    value={intent}
                    title={`Pay ${priceLabel(event.entryFee)} to ${PAYMENT.displayName}`}
                    className="h-[188px] w-[188px] rounded-lg text-ink"
                  />

                  <div className="mt-4 text-center">
                    <div className="text-[26px] font-extrabold tracking-[-0.03em] tabular-nums text-ink">
                      {priceLabel(event.entryFee)}
                    </div>
                    <div className="mt-0.5 text-[13px] font-semibold text-muted">
                      {PAYMENT.displayName}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-subtle">
                      {PAYMENT.vpa}
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

                <p className="mt-4 text-[12px] leading-relaxed text-subtle">
                  Reference{" "}
                  <span className="font-mono text-ink">{reference}</span> — quote
                  it if anything goes wrong with the transfer.
                </p>
              </>
            )}

            <button
              type="button"
              onClick={confirm}
              className="mt-5 w-full rounded-btn bg-ink px-6 py-4 text-[15px] font-bold text-white transition-[translate,background] duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-accent"
            >
              {free ? "Count me in" : "I've paid — confirm my seat"}
            </button>

            {!free && (
              <p className="mt-3 text-center text-[12px] text-subtle">
                Pay at the door instead if you'd rather — cash or UPI.
              </p>
            )}
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
        {event.when.headline}. Enter via {event.location.gate || "the main gate"}{" "}
        — we start on time.
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
