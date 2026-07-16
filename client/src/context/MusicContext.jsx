import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const KEY = "b4:music";
const SRC = "/audio/ambient.mp3";
const VOLUME = 0.18; // background, not foreground — keep it low

const MusicContext = createContext(null);

/**
 * Site-wide ambient audio.
 *
 * Browsers block audio that plays before the user interacts with the page
 * (Chrome/Safari autoplay policy), so this can never start on load. It starts
 * on a click of the toggle, remembers the choice, and — for a returning
 * visitor who left it on — resumes on their first interaction.
 *
 * Default is OFF, deliberately. See the note in MusicToggle.jsx.
 */
export function MusicProvider({ children, src = SRC, volume = VOLUME }) {
  const audioRef = useRef(null);
  const fadeRef = useRef(0);

  // Default ON: music plays unless the visitor has explicitly turned it off.
  const [enabled, setEnabled] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === "off") setEnabled(false);
    } catch {
      /* storage unavailable */
    }
  }, []);

  // Created lazily so the file is never downloaded unless it's wanted.
  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;
    return audio;
  }, [src]);

  const fadeTo = useCallback((target, ms = 800) => {
    const audio = audioRef.current;
    if (!audio) return;

    cancelAnimationFrame(fadeRef.current);
    const from = audio.volume;
    const t0 = performance.now();

    const tick = (t) => {
      const p = Math.min(1, (t - t0) / ms);
      audio.volume = Math.max(0, Math.min(1, from + (target - from) * p));
      if (p < 1) fadeRef.current = requestAnimationFrame(tick);
      else if (target === 0) audio.pause();
    };
    fadeRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(async () => {
    const audio = ensureAudio();
    try {
      await audio.play();
      fadeTo(volume);
    } catch {
      /* Browser refused — the gesture listener below will retry. */
    }
  }, [ensureAudio, fadeTo, volume]);

  // Mirror the element's real state; don't infer it.
  useEffect(() => {
    if (!enabled) {
      if (audioRef.current) fadeTo(0);
      return;
    }

    const audio = ensureAudio();
    const onPlaying = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    start();

    return () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
    };
  }, [enabled, ensureAudio, start, fadeTo]);

  /*
    Autoplay is blocked until the visitor interacts with the page, so arm a
    listener for the first click/tap/key and start then. Listeners are attached
    whenever we want sound but aren't producing any — that removes the race
    where a rejected play() hadn't flipped a flag yet before the user clicked.
  */
  useEffect(() => {
    if (!enabled || playing) return;

    const go = () => start();
    const opts = { passive: true };

    window.addEventListener("pointerdown", go, opts);
    window.addEventListener("touchstart", go, opts);
    window.addEventListener("keydown", go);
    window.addEventListener("scroll", go, opts);

    return () => {
      window.removeEventListener("pointerdown", go);
      window.removeEventListener("touchstart", go);
      window.removeEventListener("keydown", go);
      window.removeEventListener("scroll", go);
    };
  }, [enabled, playing, start]);

  // Don't play to an empty room.
  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio || !enabled) return;
      if (document.hidden) audio.pause();
      else audio.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [enabled]);

  useEffect(
    () => () => {
      cancelAnimationFrame(fadeRef.current);
      audioRef.current?.pause();
    },
    []
  );

  const toggle = useCallback(() => {
    setEnabled((on) => {
      const next = !on;
      try {
        localStorage.setItem(KEY, next ? "on" : "off");
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  return (
    <MusicContext.Provider value={{ enabled, toggle }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside <MusicProvider>");
  return ctx;
}
