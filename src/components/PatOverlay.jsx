export function PatOverlay({ burst }) {
  if (!burst) return null;

  const mode = burst.type || 'pat';

  return (
    <div key={burst.id} className="pat-overlay" aria-hidden="true">
      <div className={`pat-bubble is-${mode}`}>{burst.word}</div>

      {mode === 'pat' && (
        <svg
          className="pat-paw-svg"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="32"
            cy="40"
            rx="14"
            ry="11"
            fill="#FAF7F0"
            stroke="#171412"
            strokeWidth="3"
          />
          <ellipse cx="32" cy="42" rx="7.5" ry="5.5" fill="#FF7A45" />
          <circle
            cx="17"
            cy="25"
            r="5"
            fill="#FAF7F0"
            stroke="#171412"
            strokeWidth="2.8"
          />
          <circle
            cx="27"
            cy="19"
            r="5.2"
            fill="#FAF7F0"
            stroke="#171412"
            strokeWidth="2.8"
          />
          <circle
            cx="38"
            cy="19"
            r="5.2"
            fill="#FAF7F0"
            stroke="#171412"
            strokeWidth="2.8"
          />
          <circle
            cx="47"
            cy="25"
            r="5"
            fill="#FAF7F0"
            stroke="#171412"
            strokeWidth="2.8"
          />
          <circle cx="17" cy="25.5" r="2.2" fill="#FF7A45" />
          <circle cx="27" cy="19.5" r="2.3" fill="#FF7A45" />
          <circle cx="38" cy="19.5" r="2.3" fill="#FF7A45" />
          <circle cx="47" cy="25.5" r="2.2" fill="#FF7A45" />
        </svg>
      )}

      {mode === 'treat' && (
        <svg
          className="pat-fish-svg"
          viewBox="0 0 64 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 22C16 12 26 6 39 6C49 6 57 14 59 22C57 30 49 38 39 38C26 38 16 32 16 22Z"
            fill="#FF7A45"
            stroke="#171412"
            strokeWidth="3"
          />
          <path
            d="M16 22L5 11V33L16 22Z"
            fill="#FAF7F0"
            stroke="#171412"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="46" cy="18" r="2.8" fill="#171412" />
          <path
            d="M32 14C30 18 30 26 32 30"
            stroke="#FAF7F0"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      )}

      {mode === 'boop' && <span className="pat-boop-ring" />}

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
