import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | 'ok' | 'error'

  const subscribe = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    // TODO: wire to your mailing-list endpoint
    setStatus("ok");
    setEmail("");
  };

  return (
    <div className="grid grid-cols-1 items-center gap-10 border-b border-white/10 px-8 py-16 md:grid-cols-2 md:px-14">
      <div>
        <div className="mb-2.5 text-[26px] font-extrabold tracking-[-0.025em] md:text-[30px]">
          Join the community
        </div>
        <p className="max-w-[360px] text-base leading-relaxed opacity-[0.66]">
          Get new events and community notes in your inbox. No noise.
        </p>
      </div>

      <div>
        <div className="flex w-full flex-col gap-2.5 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setStatus(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && subscribe()}
            placeholder="you@email.com"
            className="flex-1 rounded-btn border border-white/25 bg-transparent px-5 py-[15px] text-[15px] text-white transition-colors duration-300 placeholder:text-white/40 focus:border-accent focus:outline-none"
          />
          <button
            type="button"
            onClick={subscribe}
            className="whitespace-nowrap rounded-btn bg-accent px-7 py-[15px] text-[15px] font-bold text-white transition-transform duration-300 ease-smooth hover:-translate-y-0.5"
          >
            Subscribe
          </button>
        </div>

        {status === "ok" && (
          <p className="mt-3 text-sm text-white/70">
            You're on the list. Watch your inbox for the next event.
          </p>
        )}
        {status === "error" && (
          <p className="mt-3 text-sm text-red-300">
            That email doesn't look right. Check it and try again.
          </p>
        )}
      </div>
    </div>
  );
}
