/** Brand mark: a cut-off line that steps down, drawn over a rounded tile */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="8" fill="#272727" />
      <path d="M6 11h7v5h6v-3h7" fill="none" stroke="#F5F1E8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="22" r="2" fill="#F2A93B" />
      <circle cx="16" cy="20" r="2" fill="#F2A93B" opacity="0.75" />
      <circle cx="23" cy="23" r="2" fill="#F2A93B" opacity="0.5" />
    </svg>
  );
}
