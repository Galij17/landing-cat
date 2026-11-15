import { CatMark } from './CatMark';

export function Footer({ onResetAll }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand-col">
          <a className="brand-link" href="#sorotan">
            <CatMark className="brand-mark" />
            <span className="brand-text">Landing Cat</span>
          </a>
          <p className="footer-note">
            Galeri karakter lima kucing. Nama contoh yang Anda ubah dan jumlah
            tepukan tersimpan secara lokal di browser Anda.
          </p>
        </div>

        <div className="footer-links-col">
          <nav aria-label="Tautan bagian halaman">
            <ul className="footer-nav-list">
              <li>
                <a href="#sorotan">Sorotan</a>
              </li>
              <li>
                <a href="#galeri">Galeri 5 Kucing</a>
              </li>
              <li>
                <a href="#studio-kata">Studio Kartu</a>
              </li>
            </ul>
          </nav>

          <div className="footer-actions">
            <button type="button" className="tool-btn" onClick={onResetAll}>
              Reset Data Lokal
            </button>
            <a className="tool-link" href="#sorotan">
              Kembali ke Atas
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
