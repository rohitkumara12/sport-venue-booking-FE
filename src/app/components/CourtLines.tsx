export function CourtLines ({ className }: { className?: string}) {
    return (
        <svg
        viewBox="0 0 700 360"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true" 
        className={className}>

            <rect x="0" y="0" width="780" height="360" />
            
            <line x1="0" y1="45" x2="780" y2="45" />
            <line x1="0" y1="315" x2="780" y2="315" />
            <line x1="180" y1="45" x2="180" y2="315" />

            <line x1="600" y1="45" x2="600" y2="315" />
            <line x1="180" y1="180" x2="600" y2="180" />
            <line x1="390" y1="0" x2="390" y2="360" strokeWidth="6" />
        
        </svg>
    )
}