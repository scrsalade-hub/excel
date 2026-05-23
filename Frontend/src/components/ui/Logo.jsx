export default function Logo({ className = "", textClassName = "", size = 36 }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="10" width="20" height="20" rx="6" fill="#DC2626" transform="rotate(-15 14 20)" />
        <rect x="16" y="10" width="20" height="20" rx="6" fill="white" fillOpacity="0.9" transform="rotate(15 26 20)" />
        <rect x="4" y="10" width="20" height="20" rx="6" fill="#DC2626" fillOpacity="0.3" transform="rotate(-15 14 20)" />
      </svg>
      <span className={`font-bold text-xl tracking-tight ${textClassName}`}>Excel</span>
    </div>
  );
}
