import { useMusic } from "../context/MusicContext.jsx";
import { SpeakerOnIcon, SpeakerOffIcon } from "./icons.jsx";

/**
 * Default is OFF and the control is always visible.
 *
 * Two reasons this isn't negotiable-by-CSS: browsers refuse to autoplay audio
 * before a user gesture, and WCAG 2.1 (1.4.2) requires any sound that runs for
 * more than 3 seconds to have a way to stop it.
 */
export default function MusicToggle({ className = "" }) {
  const { enabled, toggle } = useMusic();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Turn music off" : "Turn music on"}
      title={enabled ? "Music on" : "Music off"}
      className={`flex h-10 w-10 items-center justify-center rounded-full transition-[scale,color,background] duration-200 ease-smooth hover:scale-105 active:scale-95 ${
        enabled ? "bg-accent/10 text-accent" : "text-subtle hover:bg-line hover:text-ink"
      } ${className}`}
    >
      {enabled ? (
        <SpeakerOnIcon className="h-[18px] w-[18px]" />
      ) : (
        <SpeakerOffIcon className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
