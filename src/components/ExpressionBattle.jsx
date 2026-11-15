import { useEffect, useRef, useState } from 'react';
import { BATTLE_SCENARIOS } from '../data/cats';
import { playBrawlSound } from '../utils/catAudio';

const SCENARIO_FAVORED_MOOD = [
  'Dramatis',
  'Garang',
  'Santai',
  'Konyol',
  'Konyol',
];

function computePower(cat, patsByCat, treatsByCat, winsByCat, scenarioIndex) {
  const pats = patsByCat[cat.id] || 0;
  const treats = treatsByCat[cat.id] || 0;
  const wins = winsByCat[cat.id] || 0;
  const moodBonus = cat.mood === SCENARIO_FAVORED_MOOD[scenarioIndex] ? 6 : 0;
  return {
    total: 10 + pats * 3 + treats * 5 + wins * 2 + moodBonus,
    pats,
    treats,
    moodBonus,
  };
}

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

export function ExpressionBattle({
  cats,
  patsByCat,
  treatsByCat,
  winsByCat,
  soundEnabled,
  onVoteCat,
}) {
  const [pairIndexes, setPairIndexes] = useState([0, 2]);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [roundWinnerId, setRoundWinnerId] = useState(null);
  const [fightStep, setFightStep] = useState(0);
  const brawlTimerRef = useRef(null);
  const stepIntervalRef = useRef(null);

  const leftCat = cats[pairIndexes[0]] || cats[0];
  const rightCat = cats[pairIndexes[1]] || cats[1];
  const activeScenario = BATTLE_SCENARIOS[scenarioIndex];

  const leftStats = computePower(
    leftCat,
    patsByCat,
    treatsByCat,
    winsByCat,
    scenarioIndex
  );
  const rightStats = computePower(
    rightCat,
    patsByCat,
    treatsByCat,
    winsByCat,
    scenarioIndex
  );
  const combinedPower = leftStats.total + rightStats.total;
  const probLeft = Math.round((leftStats.total / combinedPower) * 100);
  const probRight = 100 - probLeft;

  const winnerCat =
    roundWinnerId === leftCat.id
      ? leftCat
      : roundWinnerId === rightCat.id
        ? rightCat
        : null;

  const BRAWL_WORDS = ['PLAK!', 'MEONG!', 'SRAT!', 'DUAR!'];

  const clearTimers = () => {
    if (brawlTimerRef.current) {
      window.clearTimeout(brawlTimerRef.current);
      brawlTimerRef.current = null;
    }
    if (stepIntervalRef.current) {
      window.clearInterval(stepIntervalRef.current);
      stepIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const startGelud = (forcedWinnerId = null) => {
    if (phase === 'fighting') return;
    clearTimers();

    setPhase('fighting');
    setRoundWinnerId(null);
    setFightStep(0);

    if (soundEnabled) {
      playBrawlSound();
    }

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const chosenId =
      forcedWinnerId ||
      (Math.random() * 100 < probLeft ? leftCat.id : rightCat.id);

    if (reducedMotion) {
      setPhase('result');
      setRoundWinnerId(chosenId);
      onVoteCat(chosenId);
      return;
    }

    stepIntervalRef.current = window.setInterval(() => {
      setFightStep((prev) => (prev + 1) % BRAWL_WORDS.length);
    }, 260);

    brawlTimerRef.current = window.setTimeout(() => {
      clearTimers();
      setPhase('result');
      setRoundWinnerId(chosenId);
      onVoteCat(chosenId);
    }, 1150);
  };

  const handleNextMatch = () => {
    clearTimers();
    setPairIndexes((prev) => pickTwoDifferentIndexes(cats.length, prev));
    setScenarioIndex((prev) => (prev + 1) % BATTLE_SCENARIOS.length);
    setPhase('idle');
    setRoundWinnerId(null);
  };

  const handleNextScenario = () => {
    clearTimers();
    setScenarioIndex((prev) => (prev + 1) % BATTLE_SCENARIOS.length);
    setPhase('idle');
    setRoundWinnerId(null);
  };

  return (
    <section id="adu-ekspresi" className="battle-section">
      <div className="container">
        <div className="battle-header">
          <div>
            <h2 className="section-title">Adu Ekspresi 1 vs 1</h2>
            <p className="section-subtitle">
              Tepukan dan ikan di galeri ikut menaikkan peluang menang kucing di
              arena. Klik Mulai Gelud untuk adu peluang, atau klik langsung
              kucing favoritmu.
            </p>
          </div>

          <div className="battle-toolbar">
            <button
              type="button"
              className="btn-primary"
              onClick={() => startGelud(null)}
              disabled={phase === 'fighting'}
            >
              {phase === 'fighting' ? 'Sedang Gelud...' : 'Mulai Gelud!'}
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={handleNextScenario}
              disabled={phase === 'fighting'}
            >
              Ganti Pertanyaan
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleNextMatch}
              disabled={phase === 'fighting'}
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

        <div
          className="prob-panel"
          aria-label="Perbandingan peluang menang ronde berdasarkan interaksi"
        >
          <div className="prob-labels">
            <span>
              #{leftCat.code} {leftCat.mood}: <strong>{probLeft}%</strong>
            </span>
            <span className="prob-note">
              Peluang Duel (berdasarkan tepukan, ikan &amp; mood)
            </span>
            <span>
              #{rightCat.code} {rightCat.mood}: <strong>{probRight}%</strong>
            </span>
          </div>
          <div className="prob-track" aria-hidden="true">
            <span className="prob-fill-left" style={{ width: `${probLeft}%` }} />
            <span
              className="prob-fill-right"
              style={{ width: `${probRight}%` }}
            />
          </div>
        </div>

        <div className={`battle-arena ${phase === 'fighting' ? 'is-brawling' : ''}`}>
          {[leftCat, rightCat].map((cat, idx) => {
            const isLeft = idx === 0;
            const stats = isLeft ? leftStats : rightStats;
            const prob = isLeft ? probLeft : probRight;
            const isWinner = phase === 'result' && roundWinnerId === cat.id;
            const isLoser =
              phase === 'result' && Boolean(roundWinnerId && !isWinner);

            return (
              <button
                key={`${cat.id}-${idx}`}
                type="button"
                className={`battle-card ${isWinner ? 'is-winner' : ''} ${
                  isLoser ? 'is-ko' : ''
                } ${
                  phase === 'fighting'
                    ? isLeft
                      ? 'is-fighting-left'
                      : 'is-fighting-right'
                    : ''
                }`}
                style={{ order: isLeft ? 1 : 3 }}
                onClick={() => startGelud(cat.id)}
                disabled={phase === 'fighting'}
                aria-pressed={isWinner}
              >
                <div className="battle-card-top">
                  <span className="card-code">
                    #{cat.code} · Peluang {prob}%
                  </span>
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
                  {isLoser && (
                    <span className="ko-badge" aria-hidden="true">
                      K.O. GEMAS
                    </span>
                  )}
                </div>

                <div className="battle-card-body">
                  <h3 className="battle-cat-name">{cat.name}</h3>
                  <p className="battle-cat-pose">{cat.poseTitle}</p>
                  <p className="battle-power-breakdown">
                    Tepuk: {stats.pats} · Ikan: {stats.treats}
                    {stats.moodBonus > 0 ? ' · Cocok Skenario!' : ''}
                  </p>
                  <p className="battle-cat-wins">
                    Menang sesi ini: {winsByCat[cat.id] || 0} kali
                  </p>
                </div>
              </button>
            );
          })}

          <div className="battle-center" style={{ order: 2 }} aria-hidden="true">
            {phase === 'fighting' ? (
              <div className="brawl-cloud">
                <svg
                  className="brawl-paw-left"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <ellipse
                    cx="24"
                    cy="30"
                    rx="11"
                    ry="9"
                    fill="#FAF7F0"
                    stroke="#171412"
                    strokeWidth="2.8"
                  />
                  <circle cx="13" cy="18" r="4" fill="#FF7A45" stroke="#171412" strokeWidth="2.2" />
                  <circle cx="24" cy="13" r="4.2" fill="#FF7A45" stroke="#171412" strokeWidth="2.2" />
                  <circle cx="35" cy="18" r="4" fill="#FF7A45" stroke="#171412" strokeWidth="2.2" />
                </svg>
                <span className="brawl-word">{BRAWL_WORDS[fightStep]}</span>
                <svg
                  className="brawl-paw-right"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <ellipse
                    cx="24"
                    cy="30"
                    rx="11"
                    ry="9"
                    fill="#FAF7F0"
                    stroke="#171412"
                    strokeWidth="2.8"
                  />
                  <circle cx="13" cy="18" r="4" fill="#FF7A45" stroke="#171412" strokeWidth="2.2" />
                  <circle cx="24" cy="13" r="4.2" fill="#FF7A45" stroke="#171412" strokeWidth="2.2" />
                  <circle cx="35" cy="18" r="4" fill="#FF7A45" stroke="#171412" strokeWidth="2.2" />
                </svg>
              </div>
            ) : (
              <div className="vs-badge">VS</div>
            )}
          </div>
        </div>

        {phase === 'fighting' && (
          <p className="brawl-live-status" role="status" aria-live="polite">
            Kedua kucing sedang gelud memperebutkan gelar ronde ini...
          </p>
        )}

        {phase === 'result' && winnerCat && (
          <div className="battle-verdict" role="status" aria-live="polite">
            <div>
              <p className="battle-verdict-title">
                Pemenang Gelud: {winnerCat.name}
              </p>
              <p className="battle-verdict-line">{winnerCat.battleWinLine}</p>
            </div>
            <div className="battle-verdict-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => startGelud(null)}
              >
                Gelud Ulang
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleNextMatch}
              >
                Lanjut Duel Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
