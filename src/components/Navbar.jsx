import { useEffect, useState } from 'react';
import { CatMark } from './CatMark';

const NAV_LINKS = [
  { href: '#sorotan', label: 'Sorotan' },
  { href: '#galeri', label: 'Galeri' },
  { href: '#adu-ekspresi', label: 'Adu Ekspresi' },
  { href: '#studio-kata', label: 'Studio Kartu' },
];

export function Navbar({ theme, onToggleTheme, soundEnabled, onToggleSound }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <a className="skip-link" href="#konten-utama">
        Lewati ke konten utama
      </a>

      <div className="container header-inner">
        <a className="brand-link" href="#sorotan">
          <CatMark className="brand-mark" />
          <span className="brand-text">Landing Cat</span>
        </a>

        <nav className="desktop-nav" aria-label="Navigasi utama">
          <ul className="nav-list">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <a className="nav-link" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="desktop-sound-toggle"
            onClick={onToggleSound}
            aria-pressed={soundEnabled}
            aria-label={
              soundEnabled
                ? 'Matikan suara efek kucing'
                : 'Nyalakan suara efek kucing'
            }
          >
            {soundEnabled ? 'Suara: Nyala' : 'Suara: Mati'}
          </button>

          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-pressed={theme === 'dark'}
            aria-label={
              theme === 'dark'
                ? 'Ubah ke tema terang kertas hangat'
                : 'Ubah ke tema gelap sinematik'
            }
          >
            <span className="theme-indicator" aria-hidden="true" />
            <span>{theme === 'dark' ? 'Tema Terang' : 'Tema Gelap'}</span>
          </button>

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
          >
            {menuOpen ? 'Tutup' : 'Menu'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav-drawer"
          className="mobile-nav"
          aria-label="Navigasi seluler"
        >
          <ul className="mobile-nav-list">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <a
                  className="mobile-nav-link"
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
