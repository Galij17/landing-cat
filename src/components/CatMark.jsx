export function CatMark({ className = '' }) {
  return (
    <svg
      viewBox="0 0 36 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 27V11L12.5 16.5H23.5L31 11V27C31 28.6569 29.6569 30 28 30H8C6.34315 30 5 28.6569 5 27Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M5 11L9 3L14.5 15.5M31 11L27 3L21.5 15.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="13.5" cy="21" r="1.7" fill="currentColor" />
      <circle cx="22.5" cy="21" r="1.7" fill="currentColor" />
      <path
        d="M16.5 24.2L18 25.7L19.5 24.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
