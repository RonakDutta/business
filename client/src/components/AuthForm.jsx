import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

/** Shared shell for the Login and Signup pages. */
export default function AuthForm({ mode = "login", onSubmit }) {
  const isSignup = mode === "signup";
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const next = params.get("next") || "/";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (isSignup && !name.trim()) return setError("Tell us your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("That email doesn't look right.");
    if (password.length < 6)
      return setError("Password needs to be at least 6 characters.");

    setError("");
    onSubmit({ name: name.trim(), email: email.trim() });
    navigate(next, { replace: true });
  };

  const field =
    "w-full rounded-btn border border-line-strong bg-white px-5 py-3.5 text-[15px] text-ink transition-colors duration-200 placeholder:text-faint focus:border-accent focus:outline-none";

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[440px] flex-col justify-center px-6 py-16">
      <Link to="/" className="text-sm font-bold text-accent">
        ↩ Back home
      </Link>

      <h1 className="mt-6 text-[32px] font-extrabold tracking-[-0.03em] md:text-[38px]">
        {isSignup ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        {isSignup
          ? "You'll need an account to RSVP for a meetup."
          : "Sign in to RSVP and keep track of the meetups you're attending."}
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {isSignup && (
          <input
            className={field}
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          className={field}
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className={field}
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />

        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

        <button
          type="button"
          onClick={submit}
          className="mt-2 rounded-btn bg-ink px-8 py-4 text-[15px] font-bold text-white transition-[translate,background] duration-300 ease-smooth hover:-translate-y-0.5 hover:bg-accent"
        >
          {isSignup ? "Create account" : "Sign in"}
        </button>
      </div>

      <p className="mt-6 text-sm text-muted">
        {isSignup ? "Already a member? " : "New here? "}
        <Link
          to={`${isSignup ? "/login" : "/signup"}${
            next !== "/" ? `?next=${encodeURIComponent(next)}` : ""
          }`}
          className="font-bold text-accent"
        >
          {isSignup ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </section>
  );
}
