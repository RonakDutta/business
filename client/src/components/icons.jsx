/* ===========================================================================
   One stroke weight, one join style, one 24x24 box — that's what keeps a set
   of hand-rolled icons from looking hand-rolled. Size them at the call site
   with a className; they inherit colour from `currentColor`.
   =========================================================================== */

function Icon({ className = "", strokeWidth = 1.8, children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function HeartIcon({ filled = false, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21.2l7.7-7.7 1.1-1a5.5 5.5 0 0 0 0-7.9z" />
    </svg>
  );
}

export function ShareIcon({ className = "" }) {
  return (
    <Icon className={className} strokeWidth={2}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </Icon>
  );
}

export function CheckIcon({ className = "" }) {
  return (
    <Icon className={className} strokeWidth={2.5}>
      <path d="M20 6L9 17l-5-5" />
    </Icon>
  );
}

export function CalendarIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </Icon>
  );
}

export function CalendarPlusIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path d="M21 12V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h6" />
      <path d="M3 10h18M8 3v4M16 3v4M18 15v6M15 18h6" />
    </Icon>
  );
}

export function MapPinIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path d="M20 10.5c0 5.2-6.3 10.7-8 11.4-1.7-.7-8-6.2-8-11.4a8 8 0 1 1 16 0z" />
      <circle cx="12" cy="10.5" r="2.8" />
    </Icon>
  );
}

export function ArrowUpRightIcon({ className = "" }) {
  return (
    <Icon className={className} strokeWidth={2}>
      <path d="M7 17L17 7M8 7h9v9" />
    </Icon>
  );
}

export function ArrowRightIcon({ className = "" }) {
  return (
    <Icon className={className} strokeWidth={2}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </Icon>
  );
}

export function SpeakerOnIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path d="M11 5L6.5 9H3v6h3.5L11 19V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
    </Icon>
  );
}

export function SpeakerOffIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path d="M11 5L6.5 9H3v6h3.5L11 19V5z" />
      <path d="M16 9.5l5 5M21 9.5l-5 5" />
    </Icon>
  );
}

export function ChevronDownIcon({ className = "" }) {
  return (
    <Icon className={className} strokeWidth={2.5}>
      <path d="M6 9l6 6 6-6" />
    </Icon>
  );
}

export function MenuIcon({ className = "" }) {
  return (
    <Icon className={className} strokeWidth={2}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Icon>
  );
}

export function CloseIcon({ className = "" }) {
  return (
    <Icon className={className} strokeWidth={2}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
  );
}

export function PlusIcon({ className = "" }) {
  return (
    <Icon className={className} strokeWidth={2.2}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  );
}

export function SearchIcon({ className = "" }) {
  return (
    <Icon className={className} strokeWidth={2}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </Icon>
  );
}

export function PencilIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path d="M4 20h4l10-10a2.8 2.8 0 1 0-4-4L4 16v4z" />
      <path d="M14 6l4 4" />
    </Icon>
  );
}

export function TrashIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
      <path d="M10 11v6M14 11v6" />
    </Icon>
  );
}

export function BanIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M6 6l12 12" />
    </Icon>
  );
}

export function UndoIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path d="M4 9h11a5 5 0 1 1 0 10h-5" />
      <path d="M8 5L4 9l4 4" />
    </Icon>
  );
}

export function UsersIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5.2a3.5 3.5 0 0 1 0 5.6M17.5 14.2a6.5 6.5 0 0 1 4 5.8" />
    </Icon>
  );
}

export function TicketIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8z" />
      <path d="M14 6v2M14 11v2M14 16v2" strokeDasharray="0.1 3" />
    </Icon>
  );
}

export function LayersIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5M3 17l9 5 9-5" />
    </Icon>
  );
}

export function ImageIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M4 17l4.5-4.5a2 2 0 0 1 2.8 0L16 17M14.5 15.5l1.6-1.6a2 2 0 0 1 2.8 0L21 16" />
    </Icon>
  );
}

export function HomeIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path d="M4 10.5L12 4l8 6.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8.5z" />
      <path d="M9.5 21v-6h5v6" />
    </Icon>
  );
}

export function LogOutIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path d="M15 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2" />
      <path d="M10 8l-4 4 4 4M6 12h9" />
    </Icon>
  );
}

export function ShieldIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path d="M12 3l7 3v6c0 4.4-3 8.2-7 9-4-.8-7-4.6-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </Icon>
  );
}

export function ClockIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Icon>
  );
}

export function MailIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 8l7.1 4.7a2 2 0 0 0 2.2 0L20 8" />
    </Icon>
  );
}

export function PhoneIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path d="M7 3h2l2 5-2.2 1.4a12 12 0 0 0 5.8 5.8L16 13l5 2v2a3 3 0 0 1-3 3A15 15 0 0 1 4 6a3 3 0 0 1 3-3z" />
    </Icon>
  );
}

export function InstagramIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" />
    </Icon>
  );
}

export function LinkedInIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M8 10.5V16M8 7.6v.1" />
      <path d="M12 16v-3.2a2.3 2.3 0 0 1 4.6 0V16" />
    </Icon>
  );
}

export function ScanIcon({ className = "" }) {
  return (
    <Icon className={className}>
      <path d="M4 9V6.5A2.5 2.5 0 0 1 6.5 4H9M15 4h2.5A2.5 2.5 0 0 1 20 6.5V9M20 15v2.5a2.5 2.5 0 0 1-2.5 2.5H15M9 20H6.5A2.5 2.5 0 0 1 4 17.5V15" />
      <path d="M4 12h16" />
    </Icon>
  );
}
