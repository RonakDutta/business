import { useMusic } from "../context/MusicContext.jsx";
import { SpeakerOnIcon, SpeakerOffIcon } from "./icons.jsx";

/**
 * The control is always visible: browsers refuse to autoplay audio before a
 * user gesture, and WCAG 2.1 (1.4.2) requires any sound that runs for more
 * than 3 seconds to have a way to stop it.
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
      className={`icon-btn ${enabled ? "text-accent" : ""} ${className}`}
    >
      {enabled ? (
        <SpeakerOnIcon className="h-[18px] w-[18px]" />
      ) : (
        <SpeakerOffIcon className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
