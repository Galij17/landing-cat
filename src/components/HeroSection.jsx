import { useState } from 'react';
import { PatOverlay } from './PatOverlay';

const HERO_ACCESSORIES = [
  { id: 'none', label: 'Polos' },
  { id: 'bow', label: 'Pita Imut' },
  { id: 'glasses', label: 'Kacamata' },
  { id: 'blush', label: 'Merona' },
];

function getMoodStage(score) {
  if (score >= 8) return { label: 'Mode Zoomies!', percent: 100 };
  if (score >= 5) return { label: 'Super Manja', percent: 75 };
  if (score >= 2) return { label: 'Mulai Penasaran', percent: 45 };
  return { label: 'Santai Kalem', percent: 18 };
}

export function HeroSection({
  cats,
  activeCat,
  onSelectCat,
  onShuffleCat,
  onOpenDetail,
  onBoopCat,
  onPatCat,
  patBurst,
  interactionScore,
  soundEnabled,
  onToggleSound,
}) {
  const [laserMode, setLaserMode] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: 50, y: 45 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [accessory, setAccessory] = useState('none');

  const moodStage = getMoodStage(interactionScore);

  const handlePointerMove = (event) => {
    if (!laserMode) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(8, Math.min(92, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(8, Math.min(92, ((event.clientY - rect.top) / rect.height) * 100));
    setLaserPos({ x, y });
    setTilt({
      rx: ((50 - y) / 50) * 5,
      ry: ((x - 50) / 50) * 6,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <section id="sorotan" className="hero-section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1 className="hero-title">
            Lima Ekspresi.
            <span className="hero-title-accent">Satu Panggung.</span>
          </h1>

          <p className="hero-lead">
            Landing Cat merangkum lima potret kucing penuh watak: pencet hidungnya
            untuk boop, tepuk kepalanya, lempar ikan, nyalakan mainan laser,
            hingga adu ekspresi satu lawan satu.
          </p>

          <div className="hero-actions">
            <a className="btn-primary" href="#galeri">
              Lihat Galeri Kucing
            </a>
            <button
              type="button"
              className="btn-secondary"
              onClick={onShuffleCat}
            >
              Acak Sorotan (#{activeCat.code})
            </button>
            <button
              type="button"
              className={`tool-btn ${laserMode ? 'is-laser-active' : ''}`}
              onClick={() => {
                setLaserMode((prev) => !prev);
                setTilt({ rx: 0, ry: 0 });
              }}
              aria-pressed={laserMode}
            >
              {laserMode ? 'Matikan Laser' : 'Mainan Laser'}
            </button>
            <button
              type="button"
              className={`tool-btn ${soundEnabled ? 'is-sound-active' : ''}`}
              onClick={onToggleSound}
              aria-pressed={soundEnabled}
            >
              {soundEnabled ? 'Suara Meow: Nyala' : 'Suara Meow: Mati'}
            </button>
          </div>

          <div className="hero-strip" aria-label="Pilih sorotan kucing">
            <span className="strip-label">Sorotan aktif:</span>
            <div
              className="strip-buttons"
              role="group"
              aria-label="Daftar lima kucing"
            >
              {cats.map((cat) => {
                const isSelected = cat.id === activeCat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`strip-pill ${isSelected ? 'is-active' : ''}`}
                    onClick={() => onSelectCat(cat.id)}
                    aria-pressed={isSelected}
                  >
                    <span className="strip-code">#{cat.code}</span>
                    <span className="strip-mood">{cat.mood}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="hero-stage">
          <div
            className={`hero-frame ${patBurst ? 'is-ears-wiggling' : ''}`}
            style={
              laserMode
                ? {
                    transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                  }
                : undefined
            }
          >
            <div className="hero-ears" aria-hidden="true">
              <svg className="hero-ear hero-ear-left" viewBox="0 0 48 38" fill="none">
                <path
                  d="M4 36L14 4L44 36H4Z"
                  fill="currentColor"
                  stroke="var(--ink)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path d="M13 31L18 14L33 31H13Z" fill="var(--accent)" />
              </svg>
              <svg className="hero-ear hero-ear-right" viewBox="0 0 48 38" fill="none">
                <path
                  d="M4 36L34 4L44 36H4Z"
                  fill="currentColor"
                  stroke="var(--ink)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path d="M15 31L30 14L35 31H15Z" fill="var(--accent)" />
              </svg>
            </div>

            <div className="hero-frame-header">
              <span className="frame-index">POTRET #{activeCat.code}</span>
              <span className="frame-mood">{activeCat.mood}</span>
            </div>

            <div
              className={`hero-image-wrap ${patBurst ? 'is-patting' : ''} ${
                laserMode ? 'is-laser-stage' : ''
              }`}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
            >
              <img
                src={activeCat.image}
                alt={activeCat.alt}
                width={activeCat.width}
                height={activeCat.height}
                fetchpriority="high"
                decoding="async"
                className="hero-image"
                style={{ objectPosition: activeCat.objectPosition }}
              />

              <button
                type="button"
                className="hero-boop-hitbox"
                onClick={() =>
                  laserMode ? onPatCat(activeCat.id) : onBoopCat(activeCat.id)
                }
                aria-label={
                  laserMode
                    ? `Tangkap titik laser bersama ${activeCat.name}`
                    : `Boop hidung ${activeCat.name}`
                }
              />

              {laserMode && (
                <span
                  className="laser-dot"
                  style={{ left: `${laserPos.x}%`, top: `${laserPos.y}%` }}
                  aria-hidden="true"
                />
              )}

              {accessory === 'bow' && (
                <svg
                  className="hero-accessory hero-accessory-bow"
                  viewBox="0 0 120 72"
                  aria-hidden="true"
                >
                  <path
                    d="M54 36 C32 10, 8 18, 14 42 C18 58, 38 56, 54 40 Z"
                    fill="#E94E77"
                    stroke="#171412"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M66 36 C88 10, 112 18, 106 42 C102 58, 82 56, 66 40 Z"
                    fill="#E94E77"
                    stroke="#171412"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  <circle cx="60" cy="38" r="11" fill="#FFB8C9" stroke="#171412" strokeWidth="4" />
                </svg>
              )}

              {accessory === 'glasses' && (
                <svg
                  className="hero-accessory hero-accessory-glasses"
                  viewBox="0 0 220 76"
                  aria-hidden="true"
                >
                  <rect
                    x="12"
                    y="14"
                    width="78"
                    height="48"
                    rx="18"
                    fill="rgba(23, 20, 18, 0.72)"
                    stroke="#FFF7ED"
                    strokeWidth="5"
                  />
                  <rect
                    x="130"
                    y="14"
                    width="78"
                    height="48"
                    rx="18"
                    fill="rgba(23, 20, 18, 0.72)"
                    stroke="#FFF7ED"
                    strokeWidth="5"
                  />
                  <path d="M90 36 H130" stroke="#FFF7ED" strokeWidth="5" strokeLinecap="round" />
                  <path d="M26 26 L44 26" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M144 26 L162 26" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              )}

              {accessory === 'blush' && (
                <div className="hero-accessory hero-accessory-blush" aria-hidden="true">
                  <span className="blush-cheek blush-left" />
                  <span className="blush-cheek blush-right" />
                  <svg className="blush-sparkle" viewBox="0 0 40 40">
                    <path
                      d="M20 4 L24 16 L36 20 L24 24 L20 36 L16 24 L4 20 L16 16 Z"
                      fill="#FFD166"
                      stroke="#171412"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
              )}

              <PatOverlay burst={patBurst} />
            </div>

            <div className="hero-mood-meter">
              <div className="mood-meter-row">
                <span className="mood-meter-title">Mood: {moodStage.label}</span>
                <span className="mood-meter-hint">
                  {laserMode ? 'Arahkan & klik foto!' : 'Klik foto untuk boop!'}
                </span>
              </div>
              <div className="mood-meter-track" aria-hidden="true">
                <span
                  className="mood-meter-fill"
                  style={{ width: `${moodStage.percent}%` }}
                />
              </div>
            </div>

            <div className="hero-accessory-bar" role="group" aria-label="Pilih aksesori imut kucing">
              {HERO_ACCESSORIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`accessory-pill ${accessory === item.id ? 'is-active' : ''}`}
                  aria-pressed={accessory === item.id}
                  onClick={() => setAccessory(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hero-frame-footer">
              <div>
                <h2 className="frame-name">{activeCat.name}</h2>
                <p className="frame-caption">{activeCat.signatureLine}</p>
              </div>
              <div className="hero-frame-btns">
                <button
                  type="button"
                  className="frame-boop-btn"
                  onClick={() => onBoopCat(activeCat.id)}
                >
                  Boop!
                </button>
                <button
                  type="button"
                  className="frame-detail-btn"
                  onClick={() => onOpenDetail(activeCat.id)}
                >
                  Profil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
