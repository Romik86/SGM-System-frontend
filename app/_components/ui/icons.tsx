type IconProps = { className?: string };

export const IconOverview = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M3 10.5 12 3l9 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const IconClasses = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 19.5V6a2 2 0 0 1 2-2h13v15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 22a2 2 0 0 1-2-2v-.5A1.5 1.5 0 0 1 5.5 18H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 7h9M8 10.5h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

export const IconSubjects = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M6.5 4h9A2.5 2.5 0 0 1 18 6.5V21l-5.5-2.5L7 21V6.5A2.5 2.5 0 0 1 9.5 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9.5 8.5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

export const IconGrades = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M9 3h6l1 4H8l1-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M5 7h14l-1.2 12.2A2 2 0 0 1 15.8 21H8.2a2 2 0 0 1-2-1.8L5 7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 11l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const IconAttendance = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="4" y="5" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 10h16M9 3v4M15 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8.5 14.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const IconAssignments = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M14 3.5V8h4.5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 12.5h6M9 15.5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

export const IconProfile = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="8" r="3.3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M5 20c1-3.5 4-5.5 7-5.5s6 2 7 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

export const IconSun = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

export const IconMoon = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
);

export const IconMenu = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

export const IconClose = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

export const IconLogout = ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);