export function PatOverlay({ burst }) {
  if (!burst) return null;

  return (
    <div key={burst.id} className="pat-overlay" aria-hidden="true">
      <div className="pat-bubble">{burst.word}</div>

      <svg
        className="pat-paw-svg"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="32" cy="40" rx="14" ry="11" fill="#FAF7F0" stroke="#171412" strokeWidth="3" />
        <ellipse cx="32" cy="42" rx="7.5" ry="5.5" fill="#FF7A45" />
        <circle cx="17" cy="25" r="5" fill="#FAF7F0" stroke="#171412" strokeWidth="2.8" />
        <circle cx="27" cy="19" r="5.2" fill="#FAF7F0" stroke="#171412" strokeWidth="2.8" />
        <circle cx="38" cy="19" r="5.2" fill="#FAF7F0" stroke="#171412" strokeWidth="2.8" />
        <circle cx="47" cy="25" r="5" fill="#FAF7F0" stroke="#171412" strokeWidth="2.8" />
        <circle cx="17" cy="25.5" r="2.2" fill="#FF7A45" />
        <circle cx="27" cy="19.5" r="2.3" fill="#FF7A45" />
        <circle cx="38" cy="19.5" r="2.3" fill="#FF7A45" />
        <circle cx="47" cy="25.5" r="2.2" fill="#FF7A45" />
      </svg>

      <svg
        className="pat-heart pat-heart-1"
        viewBox="0 0 24 22"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 21C12 21 2 14.4 2 7.3C2 4 4.5 1.5 7.6 1.5C9.5 1.5 11.2 2.5 12 4C12.8 2.5 14.5 1.5 16.4 1.5C19.5 1.5 22 4 22 7.3C22 14.4 12 21 12 21Z" />
      </svg>

      <svg
        className="pat-heart pat-heart-2"
        viewBox="0 0 24 22"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 21C12 21 2 14.4 2 7.3C2 4 4.5 1.5 7.6 1.5C9.5 1.5 11.2 2.5 12 4C12.8 2.5 14.5 1.5 16.4 1.5C19.5 1.5 22 4 22 7.3C22 14.4 12 21 12 21Z" />
      </svg>

      <svg
        className="pat-heart pat-heart-3"
        viewBox="0 0 24 22"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 21C12 21 2 14.4 2 7.3C2 4 4.5 1.5 7.6 1.5C9.5 1.5 11.2 2.5 12 4C12.8 2.5 14.5 1.5 16.4 1.5C19.5 1.5 22 4 22 7.3C22 14.4 12 21 12 21Z" />
      </svg>
    </div>
  );
}
