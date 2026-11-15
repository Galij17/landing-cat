import { useState } from 'react';
import { BATTLE_SCENARIOS } from '../data/cats';

function pickTwoDifferentIndexes(total, avoidPair) {
  const first = Math.floor(Math.random() * total);
  let second = Math.floor(Math.random() * (total - 1));
  if (second >= first) second += 1;

  if (
    avoidPair &&
    ((first === avoidPair[0] && second === avoidPair[1]) ||
      (first === avoidPair[1] && second === avoidPair[0]))
  ) {
    return [(first + 1) % total, (second + 2) % total];
  }
  return [first, second];
}

export function ExpressionBattle({ cats, winsByCat, onVoteCat }) {
  const [pairIndexes, setPairIndexes] = useState([0, 2]);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [roundWinnerId, setRoundWinnerId] = useState(null);

  const leftCat = cats[pairIndexes[0]] || cats[0];
  const rightCat = cats[pairIndexes[1]] || cats[1];
  const activeScenario = BATTLE_SCENARIOS[scenarioIndex];
  const winnerCat =
    roundWinnerId === leftCat.id
      ? leftCat
      : roundWinnerId === rightCat.id
        ? rightCat
        : null;

  const handleChoose = (catId) => {
    setRoundWinnerId(catId);
    onVoteCat(catId);
  };

  const handleNextMatch = () => {
    setPairIndexes((prev) => pickTwoDifferentIndexes(cats.length, prev));
    setScenarioIndex((prev) => (prev + 1) % BATTLE_SCENARIOS.length);
    setRoundWinnerId(null);
  };

  const handleNextScenario = () => {
    setScenarioIndex((prev) => (prev + 1) % BATTLE_SCENARIOS.length);
    setRoundWinnerId(null);
  };

  return (
    <section id="adu-ekspresi" className="battle-section">
      <div className="container">
        <div className="battle-header">
          <div>
            <h2 className="section-title">Adu Ekspresi 1 vs 1</h2>
            <p className="section-subtitle">
              Pilih kucing yang ekspresinya paling cocok untuk skenario di bawah
              ini. Rekor pilihanmu tersimpan di perangkat ini.
            </p>
          </div>

          <div className="battle-toolbar">
            <button
              type="button"
              className="tool-btn"
              onClick={handleNextScenario}
            >
              Ganti Pertanyaan
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleNextMatch}
            >
              Acak Lawan Baru
            </button>
          </div>
        </div>

        <div className="battle-prompt-box">
          <span className="battle-prompt-label">
            SKENARIO #{scenarioIndex + 1}
          </span>
          <p className="battle-prompt-text">{activeScenario}</p>
        </div>

        <div className="battle-arena">
          {[leftCat, rightCat].map((cat, idx) => {
            const isWinner = roundWinnerId === cat.id;
            const isOtherPicked = Boolean(roundWinnerId && !isWinner);
            return (
              <button
                key={`${cat.id}-${idx}`}
                type="button"
                className={`battle-card ${isWinner ? 'is-winner' : ''} ${
                  isOtherPicked ? 'is-dimmed' : ''
                }`}
                style={{ order: idx === 0 ? 1 : 3 }}
                onClick={() => handleChoose(cat.id)}
                aria-pressed={isWinner}
              >
                <div className="battle-card-top">
                  <span className="card-code">#{cat.code}</span>
                  <span className="card-mood-tag">{cat.mood}</span>
                </div>

                <div className="battle-media">
                  <img
                    src={cat.image}
                    alt={cat.alt}
                    width={cat.width}
                    height={cat.height}
                    loading="lazy"
                    decoding="async"
                    className="battle-img"
                    style={{ objectPosition: cat.objectPosition }}
                  />
                  {isWinner && (
                    <span className="winner-crown" aria-hidden="true">
                      <svg viewBox="0 0 36 28" fill="none">
                        <path
                          d="M3 23L6 8L14 15L18 4L22 15L30 8L33 23H3Z"
                          fill="#FF7A45"
                          stroke="#171412"
                          strokeWidth="2.5"
                          strokeLinejoin="round"
                        />
                      </svg>
                      JUARA
                    </span>
                  )}
                </div>

                <div className="battle-card-body">
                  <h3 className="battle-cat-name">{cat.name}</h3>
                  <p className="battle-cat-pose">{cat.poseTitle}</p>
                  <p className="battle-cat-wins">
                    Pilihanmu: {winsByCat[cat.id] || 0} kali
                  </p>
                </div>
              </button>
            );
          })}

          <div className="vs-badge" style={{ order: 2 }} aria-hidden="true">
            VS
          </div>
        </div>

        {winnerCat && (
          <div className="battle-verdict" role="status" aria-live="polite">
            <div>
              <p className="battle-verdict-title">
                Pemenang Ronde: {winnerCat.name}
              </p>
              <p className="battle-verdict-line">{winnerCat.battleWinLine}</p>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={handleNextMatch}
            >
              Lanjut Duel Berikutnya
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
