import { useEffect, useMemo, useRef, useState } from 'react';
import { INITIAL_CATS } from './data/cats';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CardboardBox } from './components/CardboardBox';
import { GallerySection } from './components/GallerySection';
import { ExpressionBattle } from './components/ExpressionBattle';
import { CardStudio } from './components/CardStudio';
import { CatCompanion } from './components/CatCompanion';
import { CatModal } from './components/CatModal';
import { Footer } from './components/Footer';
import {
  playBoopSound,
  playCrunchSound,
  playMeowSound,
} from './utils/catAudio';

const STORAGE_KEYS = {
  theme: 'landing-cat-theme',
  sound: 'landing-cat-sound',
  custom: 'landing-cat-custom',
  pats: 'landing-cat-pats',
  treats: 'landing-cat-treats',
  wins: 'landing-cat-wins',
};

const PAT_WORDS = ['Purr~', 'Miao!', 'Nyaman~', 'Prrrt!', 'Lagi dong!'];
const TREAT_WORDS = ['NYAM!', 'TUNA!', 'ENAK!', 'MAU LAGI!'];
const BOOP_WORDS = ['BOOP!', 'TINY BOOP!', 'PIU!', 'HEHE!'];

function loadJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem(STORAGE_KEYS.theme);
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = window.localStorage.getItem(STORAGE_KEYS.sound);
    return saved === 'true';
  });

  const [customByCat, setCustomByCat] = useState(() =>
    loadJson(STORAGE_KEYS.custom, {})
  );
  const [patsByCat, setPatsByCat] = useState(() =>
    loadJson(STORAGE_KEYS.pats, {})
  );
  const [treatsByCat, setTreatsByCat] = useState(() =>
    loadJson(STORAGE_KEYS.treats, {})
  );
  const [winsByCat, setWinsByCat] = useState(() =>
    loadJson(STORAGE_KEYS.wins, {})
  );

  const [heroCatId, setHeroCatId] = useState(INITIAL_CATS[0].id);
  const [activeMood, setActiveMood] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewStatus, setViewStatus] = useState('ready');
  const [modalCatId, setModalCatId] = useState(null);
  const [patBursts, setPatBursts] = useState({});
  const [companionLine, setCompanionLine] = useState(
    'Miao! Pencet hidungku atau ketuk kardus kejutan yuk!'
  );
  const reloadTimerRef = useRef(null);
  const patTimersRef = useRef({});
  const patSeqRef = useRef(0);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(STORAGE_KEYS.theme, theme);
    } catch {
      // Ignore storage quota errors
    }
  }, [theme]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.sound, String(soundEnabled));
    } catch {
      // Ignore storage quota errors
    }
  }, [soundEnabled]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.custom,
        JSON.stringify(customByCat)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [customByCat]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.pats, JSON.stringify(patsByCat));
    } catch {
      // Ignore storage quota errors
    }
  }, [patsByCat]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.treats,
        JSON.stringify(treatsByCat)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [treatsByCat]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.wins, JSON.stringify(winsByCat));
    } catch {
      // Ignore storage quota errors
    }
  }, [winsByCat]);

  useEffect(() => {
    return () => {
      if (reloadTimerRef.current) {
        window.clearTimeout(reloadTimerRef.current);
      }
      Object.values(patTimersRef.current).forEach((timerId) => {
        window.clearTimeout(timerId);
      });
    };
  }, []);

  const cats = useMemo(() => {
    return INITIAL_CATS.map((cat) => {
      const custom = customByCat[cat.id];
      if (!custom) return cat;
      return {
        ...cat,
        name: custom.name || cat.name,
        signatureLine: custom.signatureLine || cat.signatureLine,
        isPlaceholderName: false,
      };
    });
  }, [customByCat]);

  const activeHeroCat = cats.find((cat) => cat.id === heroCatId) || cats[0];

  const filteredCats = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return cats.filter((cat) => {
      const moodMatch = activeMood === 'Semua' || cat.mood === activeMood;
      if (!moodMatch) return false;
      if (!q) return true;
      return (
        cat.name.toLowerCase().includes(q) ||
        cat.mood.toLowerCase().includes(q) ||
        cat.poseTitle.toLowerCase().includes(q) ||
        cat.story.toLowerCase().includes(q) ||
        cat.signatureLine.toLowerCase().includes(q)
      );
    });
  }, [cats, activeMood, searchQuery]);

  const modalCat = cats.find((cat) => cat.id === modalCatId) || null;

  const triggerBurst = (catId, type, wordPool) => {
    patSeqRef.current += 1;
    const seq = patSeqRef.current;
    const word = wordPool[(seq - 1) % wordPool.length];
    setPatBursts((prev) => ({
      ...prev,
      [catId]: { id: seq, type, word },
    }));

    if (patTimersRef.current[catId]) {
      window.clearTimeout(patTimersRef.current[catId]);
    }
    patTimersRef.current[catId] = window.setTimeout(() => {
      setPatBursts((prev) => {
        if (!prev[catId] || prev[catId].id !== seq) return prev;
        const next = { ...prev };
        delete next[catId];
        return next;
      });
    }, 900);
  };

  const handleShuffleHero = () => {
    const others = cats.filter((cat) => cat.id !== activeHeroCat.id);
    const next = others[Math.floor(Math.random() * others.length)];
    if (next) setHeroCatId(next.id);
    if (soundEnabled) playMeowSound();
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) playMeowSound();
      return next;
    });
  };

  const handleTriggerReload = () => {
    if (reloadTimerRef.current) {
      window.clearTimeout(reloadTimerRef.current);
    }
    setViewStatus('loading');
    reloadTimerRef.current = window.setTimeout(() => {
      setViewStatus('ready');
    }, 650);
  };

  const getCatName = (catId) =>
    cats.find((cat) => cat.id === catId)?.name || 'Si Meong';

  const handlePatCat = (catId) => {
    setPatsByCat((prev) => ({
      ...prev,
      [catId]: (prev[catId] || 0) + 1,
    }));
    triggerBurst(catId, 'pat', PAT_WORDS);
    setCompanionLine(`${getCatName(catId)} purring keras! Prrr~`);
    if (soundEnabled) playMeowSound();
  };

  const handleBoopCat = (catId) => {
    setPatsByCat((prev) => ({
      ...prev,
      [catId]: (prev[catId] || 0) + 1,
    }));
    triggerBurst(catId, 'boop', BOOP_WORDS);
    setCompanionLine(`Boop! Hidung ${getCatName(catId)} adem banget!`);
    if (soundEnabled) playBoopSound();
  };

  const handleTreatCat = (catId) => {
    setTreatsByCat((prev) => ({
      ...prev,
      [catId]: (prev[catId] || 0) + 1,
    }));
    triggerBurst(catId, 'treat', TREAT_WORDS);
    setCompanionLine(`${getCatName(catId)} lahap makan ikan crispy!`);
    if (soundEnabled) playCrunchSound();
  };

  const handleVoteBattle = (catId) => {
    setWinsByCat((prev) => ({
      ...prev,
      [catId]: (prev[catId] || 0) + 1,
    }));
    setCompanionLine(`${getCatName(catId)} makin pede di arena ekspresi!`);
    if (soundEnabled) playMeowSound();
  };

  const handleBoxPop = (cat) => {
    if (cat?.name) {
      setCompanionLine(`Cihuy! ${cat.name} nongol dari dalam kardus!`);
    }
    if (soundEnabled) playMeowSound();
  };

  const handlePetCompanion = (quote) => {
    if (quote) setCompanionLine(quote);
    if (soundEnabled) playBoopSound();
  };

  const handleSaveCat = (catId, updates) => {
    setCustomByCat((prev) => ({
      ...prev,
      [catId]: updates,
    }));
  };

  const handleResetCat = (catId) => {
    setCustomByCat((prev) => {
      const next = { ...prev };
      delete next[catId];
      return next;
    });
  };

  const handleResetAll = () => {
    setCustomByCat({});
    setPatsByCat({});
    setTreatsByCat({});
    setWinsByCat({});
    setActiveMood('Semua');
    setSearchQuery('');
    setViewStatus('ready');
  };

  const handleStepModal = (delta) => {
    if (!modalCat) return;
    const currentIndex = cats.findIndex((c) => c.id === modalCat.id);
    const nextIndex = (currentIndex + delta + cats.length) % cats.length;
    setModalCatId(cats[nextIndex].id);
  };

  const heroInteractionScore =
    (patsByCat[activeHeroCat.id] || 0) + (treatsByCat[activeHeroCat.id] || 0);

  return (
    <div className="app-shell">
      <Navbar
        theme={theme}
        onToggleTheme={() =>
          setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
        }
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      <main id="konten-utama">
        <HeroSection
          cats={cats}
          activeCat={activeHeroCat}
          onSelectCat={setHeroCatId}
          onShuffleCat={handleShuffleHero}
          onOpenDetail={setModalCatId}
          onBoopCat={handleBoopCat}
          onPatCat={handlePatCat}
          patBurst={patBursts[activeHeroCat.id] || null}
          interactionScore={heroInteractionScore}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />

        <CardboardBox
          cats={cats}
          onOpenDetail={setModalCatId}
          onBoxPop={handleBoxPop}
        />

        <GallerySection
          cats={filteredCats}
          activeMood={activeMood}
          onMoodChange={setActiveMood}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onResetFilters={() => {
            setActiveMood('Semua');
            setSearchQuery('');
          }}
          viewStatus={viewStatus}
          onTriggerReload={handleTriggerReload}
          onTriggerError={() => setViewStatus('error')}
          onRecoverError={handleTriggerReload}
          patsByCat={patsByCat}
          treatsByCat={treatsByCat}
          patBursts={patBursts}
          onPatCat={handlePatCat}
          onTreatCat={handleTreatCat}
          onOpenDetail={setModalCatId}
        />

        <ExpressionBattle
          cats={cats}
          patsByCat={patsByCat}
          treatsByCat={treatsByCat}
          winsByCat={winsByCat}
          soundEnabled={soundEnabled}
          onVoteCat={handleVoteBattle}
        />

        <CardStudio cats={cats} />
      </main>

      <Footer onResetAll={handleResetAll} />

      <CatCompanion
        message={companionLine}
        onPetCompanion={handlePetCompanion}
      />

      {modalCat && (
        <CatModal
          cat={modalCat}
          onClose={() => setModalCatId(null)}
          onPrev={() => handleStepModal(-1)}
          onNext={() => handleStepModal(1)}
          onSaveCat={handleSaveCat}
          onResetCat={handleResetCat}
          patsCount={patsByCat[modalCat.id] || 0}
          patBurst={patBursts[modalCat.id] || null}
          onPatCat={handlePatCat}
        />
      )}
    </div>
  );
}
