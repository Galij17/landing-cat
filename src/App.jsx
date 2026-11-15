import { useEffect, useMemo, useRef, useState } from 'react';
import { INITIAL_CATS } from './data/cats';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { GallerySection } from './components/GallerySection';
import { CardStudio } from './components/CardStudio';
import { CatModal } from './components/CatModal';
import { Footer } from './components/Footer';

const STORAGE_KEYS = {
  theme: 'landing-cat-theme',
  custom: 'landing-cat-custom',
  pats: 'landing-cat-pats',
};

const PAT_WORDS = ['Purr~', 'Miao!', 'Nyaman~', 'Prrrt!', 'Lagi dong!'];

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

  const [customByCat, setCustomByCat] = useState(() =>
    loadJson(STORAGE_KEYS.custom, {})
  );
  const [patsByCat, setPatsByCat] = useState(() =>
    loadJson(STORAGE_KEYS.pats, {})
  );

  const [heroCatId, setHeroCatId] = useState(INITIAL_CATS[0].id);
  const [activeMood, setActiveMood] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewStatus, setViewStatus] = useState('ready');
  const [modalCatId, setModalCatId] = useState(null);
  const [patBursts, setPatBursts] = useState({});
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

  const activeHeroCat =
    cats.find((cat) => cat.id === heroCatId) || cats[0];

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

  const handleShuffleHero = () => {
    const others = cats.filter((cat) => cat.id !== activeHeroCat.id);
    const next = others[Math.floor(Math.random() * others.length)];
    if (next) setHeroCatId(next.id);
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

  const handlePatCat = (catId) => {
    setPatsByCat((prev) => ({
      ...prev,
      [catId]: (prev[catId] || 0) + 1,
    }));

    patSeqRef.current += 1;
    const seq = patSeqRef.current;
    const word = PAT_WORDS[(seq - 1) % PAT_WORDS.length];
    setPatBursts((prev) => ({
      ...prev,
      [catId]: { id: seq, word },
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

  return (
    <div className="app-shell">
      <Navbar
        theme={theme}
        onToggleTheme={() =>
          setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
        }
      />

      <main id="konten-utama">
        <HeroSection
          cats={cats}
          activeCat={activeHeroCat}
          onSelectCat={setHeroCatId}
          onShuffleCat={handleShuffleHero}
          onOpenDetail={setModalCatId}
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
          patBursts={patBursts}
          onPatCat={handlePatCat}
          onOpenDetail={setModalCatId}
        />

        <CardStudio cats={cats} />
      </main>

      <Footer onResetAll={handleResetAll} />

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
