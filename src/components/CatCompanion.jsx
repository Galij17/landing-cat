import { useEffect, useRef, useState } from 'react';

const CUTE_LINES = [
  'Jangan lupa kasih ikan ke si melet ya!',
  'Coba pencet hidung kucing di atas untuk boop.',
  'Kardus kosong selalu lebih nyaman dari kasur mahal.',
  'Klik aku lagi kalau butuh semangat hari ini.',
  'Siapa paling jago gelud menurutmu?',
];

export function CatCompanion({ message, onPetCompanion }) {
  const [minimized, setMinimized] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [blushing, setBlushing] = useState(false);
  const firstMessageRef = useRef(message);

  useEffect(() => {
    if (message && message !== firstMessageRef.current) {
      firstMessageRef.current = message;
      setBubbleOpen(true);
    }
  }, [message]);

  const displayLine =
    message || 'Hai! Klik kucing mana saja untuk main bareng.';

  const handlePoke = () => {
    setBlushing(true);
    setBubbleOpen(true);
    const others = CUTE_LINES.filter((line) => line !== message);
    const pool = others.length > 0 ? others : CUTE_LINES;
    const nextLine = pool[Math.floor(Math.random() * pool.length)];
    onPetCompanion?.(nextLine);
    window.setTimeout(() => setBlushing(false), 750);
  };

  if (minimized) {
    return (
      <div className="companion-dock is-minimized">
        <button
          type="button"
          className="companion-reopen-btn"
          onClick={() => {
            setMinimized(false);
            setBubbleOpen(true);
          }}
          aria-label="Panggil kembali asisten kucing pojok"
        >
          Panggil Kucing
        </button>
      </div>
    );
  }

  return (
    <aside className="companion-dock" aria-label="Teman kucing interaktif">
      {bubbleOpen && (
        <div className="companion-bubble" role="status" aria-live="polite">
          <p className="companion-text">{displayLine}</p>
          <button
            type="button"
            className="companion-hide-btn"
            onClick={() => setMinimized(true)}
            aria-label="Sembunyikan teman kucing"
          >
            Sembunyikan
          </button>
        </div>
      )}

      <button
        type="button"
        className={`companion-avatar-btn ${blushing ? 'is-blushing' : ''}`}
        onClick={handlePoke}
        aria-label="Elus teman kucing di pojok layar"
      >
        <svg
          className="companion-svg"
          viewBox="0 0 72 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M14 26L18 7L31 19H41L54 7L58 26C62 32 62 56 36 58C10 56 10 32 14 26Z"
            fill="#FAF7F0"
            stroke="#171412"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M19 22L21 12L28 19H19Z" fill="#FF7A45" />
          <path d="M53 22L51 12L44 19H53Z" fill="#FF7A45" />

          {blushing ? (
            <>
              <path
                d="M22 35C24 31 28 31 30 35"
                stroke="#171412"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M42 35C44 31 48 31 50 35"
                stroke="#171412"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <ellipse cx="22" cy="41" rx="4.5" ry="2.8" fill="#FF7A45" opacity="0.7" />
              <ellipse cx="50" cy="41" rx="4.5" ry="2.8" fill="#FF7A45" opacity="0.7" />
            </>
          ) : (
            <>
              <circle cx="26" cy="34" r="3.5" fill="#171412" />
              <circle cx="46" cy="34" r="3.5" fill="#171412" />
              <circle cx="27" cy="33" r="1.2" fill="#FFFFFF" />
              <circle cx="47" cy="33" r="1.2" fill="#FFFFFF" />
            </>
          )}

          <path
            d="M33.5 40L36 43L38.5 40"
            stroke="#FF7A45"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M31 45C33 47 35 46 36 44C37 46 39 47 41 45"
            stroke="#171412"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M8 38H17M8 44H17M55 38H64M55 44H64"
            stroke="#171412"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </aside>
  );
}
