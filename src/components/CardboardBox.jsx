import { useState } from 'react';

const BOX_LINES = [
  'Ketahuan! Kardus ini sudah resmi jadi markasku.',
  'Ada paket ikan tuna datang hari ini?',
  'Kalau muat, berarti aku boleh duduk di sini.',
  'Jangan tutup kardusnya, aku lagi patroli!',
  'Halo! Mau elus kepalaku sebelum aku sembunyi lagi?',
];

export function CardboardBox({ cats, onOpenDetail, onBoxPop }) {
  const [poppedIndex, setPoppedIndex] = useState(null);
  const [shakeKey, setShakeKey] = useState(0);

  const poppedCat = poppedIndex !== null ? cats[poppedIndex] : null;

  const handleKnockBox = () => {
    const nextIndex =
      poppedIndex === null ? 0 : (poppedIndex + 1) % cats.length;
    setShakeKey((prev) => prev + 1);
    setPoppedIndex(nextIndex);
    onBoxPop?.(cats[nextIndex]);
  };

  return (
    <section className="box-section" aria-label="Kotak kardus kejutan kucing">
      <div className="container box-grid">
        <div className="box-copy">
          <h2 className="box-title">Kotak Kardus Kejutan</h2>
          <p className="box-desc">
            Kucing tidak pernah bisa menolak kardus paket kosong. Ketuk
            kardusnya untuk melihat siapa yang bersembunyi di dalam.
          </p>
          <div className="box-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={handleKnockBox}
            >
              {poppedCat ? 'Ketuk Kardus Lagi!' : 'Ketuk Kardus!'}
            </button>
            {poppedCat && (
              <>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => onOpenDetail(poppedCat.id)}
                >
                  Buka Profil #{poppedCat.code}
                </button>
                <button
                  type="button"
                  className="tool-btn"
                  onClick={() => setPoppedIndex(null)}
                >
                  Sembunyikan Kembali
                </button>
              </>
            )}
          </div>
        </div>

        <div className="box-stage">
          <div key={shakeKey} className={`kardus-wrapper ${poppedCat ? 'is-open' : ''}`}>
            {poppedCat && (
              <div className="kardus-peek" role="status" aria-live="polite">
                <span className="kardus-speech">
                  {BOX_LINES[poppedIndex % BOX_LINES.length]}
                </span>
                <div className="kardus-cat-frame">
                  <img
                    src={poppedCat.image}
                    alt={poppedCat.alt}
                    width={poppedCat.width}
                    height={poppedCat.height}
                    loading="lazy"
                    decoding="async"
                    className="kardus-cat-img"
                    style={{ objectPosition: poppedCat.objectPosition }}
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              className="kardus-box-btn"
              onClick={handleKnockBox}
              aria-label={
                poppedCat
                  ? `Ketuk kardus untuk memanggil kucing berikutnya`
                  : `Ketuk kardus untuk melihat kucing di dalamnya`
              }
            >
              <svg
                className="kardus-svg"
                viewBox="0 0 240 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M24 28L12 10H108L120 28H24Z"
                  fill="#D5A673"
                  stroke="#171412"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path
                  d="M120 28L132 10H228L216 28H120Z"
                  fill="#D5A673"
                  stroke="#171412"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <rect
                  x="24"
                  y="28"
                  width="192"
                  height="82"
                  rx="6"
                  fill="#E4B986"
                  stroke="#171412"
                  strokeWidth="3"
                />
                <rect
                  x="96"
                  y="28"
                  width="48"
                  height="24"
                  fill="#FF7A45"
                  stroke="#171412"
                  strokeWidth="2.5"
                />
                <text
                  x="120"
                  y="78"
                  textAnchor="middle"
                  fill="#171412"
                  fontFamily="Syne, sans-serif"
                  fontWeight="800"
                  fontSize="14"
                >
                  KARDUS KUCING
                </text>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
