import { useState } from 'react';
import { MOOD_FILTERS } from '../data/cats';
import { PatOverlay } from './PatOverlay';

export function GallerySection({
  cats,
  activeMood,
  onMoodChange,
  searchQuery,
  onSearchChange,
  onResetFilters,
  viewStatus,
  onTriggerReload,
  onTriggerError,
  onRecoverError,
  patsByCat,
  patBursts,
  onPatCat,
  onOpenDetail,
}) {
  const [brokenImages, setBrokenImages] = useState({});

  const markBroken = (id) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  const leadCat = cats[0] || null;
  const restCats = cats.slice(1);

  return (
    <section id="galeri" className="gallery-section">
      <div className="container">
        <div className="gallery-header">
          <div className="gallery-heading-group">
            <h2 className="section-title">Galeri Karakter</h2>
            <p className="section-subtitle">
              Saring berdasarkan suasana atau cari ciri khas posenya. Nama
              berlabel contoh dapat diubah langsung di profil masing-masing
              kucing.
            </p>
          </div>

          <div className="gallery-status-tools">
            <button
              type="button"
              className="tool-btn"
              onClick={onTriggerReload}
              disabled={viewStatus === 'loading'}
            >
              {viewStatus === 'loading' ? 'Memuat...' : 'Muat Ulang'}
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={
                viewStatus === 'error' ? onRecoverError : onTriggerError
              }
            >
              {viewStatus === 'error' ? 'Pulihkan Galeri' : 'Uji Status Error'}
            </button>
          </div>
        </div>

        <div className="gallery-controls">
          <div
            className="mood-filter-group"
            role="group"
            aria-label="Saring kucing berdasarkan mood"
          >
            {MOOD_FILTERS.map((mood) => {
              const active = activeMood === mood;
              return (
                <button
                  key={mood}
                  type="button"
                  className={`filter-btn ${active ? 'is-active' : ''}`}
                  onClick={() => onMoodChange(mood)}
                  aria-pressed={active}
                >
                  {mood}
                </button>
              );
            })}
          </div>

          <div className="search-field">
            <label htmlFor="cat-search" className="search-label">
              Cari nama atau pose
            </label>
            <input
              id="cat-search"
              type="search"
              className="search-input"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Contoh: melet, taman, tinju..."
            />
          </div>
        </div>

        {viewStatus === 'loading' && (
          <div className="state-box" role="status" aria-live="polite">
            <div className="loading-bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <h3 className="state-title">Memuat ulang koleksi potret kucing</h3>
            <p className="state-desc">
              Menyiapkan lima kartu karakter dan preferensi nama yang tersimpan
              di browser.
            </p>
          </div>
        )}

        {viewStatus === 'error' && (
          <div className="state-box is-error" role="alert">
            <p className="state-code">STATUS: GAGAL MEMUAT</p>
            <h3 className="state-title">
              Galeri sedang dalam mode simulasi gangguan
            </h3>
            <p className="state-desc">
              Potret tidak dapat ditampilkan saat koneksi terputus atau sumber
              gambar gagal dimuat. Tekan tombol di bawah untuk memuat ulang
              galeri.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={onRecoverError}
            >
              Coba Muat Ulang
            </button>
          </div>
        )}

        {viewStatus === 'ready' && cats.length === 0 && (
          <div className="state-box" role="status" aria-live="polite">
            <p className="state-code">HASIL: 0 KUCING</p>
            <h3 className="state-title">
              Tidak ada kucing yang cocok dengan pencarian ini
            </h3>
            <p className="state-desc">
              Filter aktif ({activeMood})
              {searchQuery.trim()
                ? ` dengan kata kunci "${searchQuery.trim()}"`
                : ''}{' '}
              tidak menemukan potret. Tampilkan kembali semua lima kucing untuk
              melihat koleksi lengkap.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={onResetFilters}
            >
              Tampilkan Semua Kucing
            </button>
          </div>
        )}

        {viewStatus === 'ready' && leadCat && (
          <div className="gallery-content">
            <article className="spotlight-card">
              <div
                className={`spotlight-media ${
                  patBursts[leadCat.id] ? 'is-patting' : ''
                }`}
              >
                {brokenImages[leadCat.id] ? (
                  <div className="img-fallback">
                    <p>Gambar gagal dimuat.</p>
                    <button
                      type="button"
                      className="tool-btn"
                      onClick={() =>
                        setBrokenImages((prev) => ({
                          ...prev,
                          [leadCat.id]: false,
                        }))
                      }
                    >
                      Muat Ulang Gambar
                    </button>
                  </div>
                ) : (
                  <img
                    src={leadCat.image}
                    alt={leadCat.alt}
                    width={leadCat.width}
                    height={leadCat.height}
                    loading="lazy"
                    decoding="async"
                    className="spotlight-img"
                    style={{ objectPosition: leadCat.objectPosition }}
                    onError={() => markBroken(leadCat.id)}
                  />
                )}
                <PatOverlay burst={patBursts[leadCat.id]} />
              </div>

              <div className="spotlight-body">
                <div className="card-meta-row">
                  <span className="card-code">SOROTAN #{leadCat.code}</span>
                  <span className="card-mood-tag">{leadCat.mood}</span>
                </div>

                <h3 className="spotlight-name">{leadCat.name}</h3>
                <p className="spotlight-pose">{leadCat.poseTitle}</p>
                <p className="spotlight-story">{leadCat.story}</p>

                <blockquote className="spotlight-quote">
                  &ldquo;{leadCat.signatureLine}&rdquo;
                </blockquote>

                <div className="spotlight-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => onOpenDetail(leadCat.id)}
                  >
                    Buka Profil &amp; Ubah Nama
                  </button>
                  <button
                    type="button"
                    className={`btn-secondary ${
                      patBursts[leadCat.id] ? 'is-pat-btn-active' : ''
                    }`}
                    onClick={() => onPatCat(leadCat.id)}
                  >
                    Tepuk Kepala ({patsByCat[leadCat.id] || 0})
                  </button>
                </div>
              </div>
            </article>

            {restCats.length > 0 && (
              <div className="staggered-grid">
                {restCats.map((cat, index) => (
                  <article
                    key={cat.id}
                    className={`cat-card ${
                      index % 2 === 1 ? 'is-offset' : ''
                    }`}
                  >
                    <button
                      type="button"
                      className="cat-card-trigger"
                      onClick={() => onOpenDetail(cat.id)}
                      aria-label={`Buka profil ${cat.name}`}
                    >
                      <div
                        className={`cat-card-media ${
                          patBursts[cat.id] ? 'is-patting' : ''
                        }`}
                      >
                        {brokenImages[cat.id] ? (
                          <div className="img-fallback">
                            <span>Gambar tidak tersedia</span>
                          </div>
                        ) : (
                          <img
                            src={cat.image}
                            alt={cat.alt}
                            width={cat.width}
                            height={cat.height}
                            loading="lazy"
                            decoding="async"
                            className="cat-card-img"
                            style={{ objectPosition: cat.objectPosition }}
                            onError={() => markBroken(cat.id)}
                          />
                        )}
                        <PatOverlay burst={patBursts[cat.id]} />
                      </div>

                      <div className="cat-card-info">
                        <div className="card-meta-row">
                          <span className="card-code">#{cat.code}</span>
                          <span className="card-mood-tag">{cat.mood}</span>
                        </div>
                        <h3 className="cat-card-name">{cat.name}</h3>
                        <p className="cat-card-pose">{cat.poseTitle}</p>
                      </div>
                    </button>

                    <div className="cat-card-footer">
                      <button
                        type="button"
                        className={`pat-btn ${
                          patBursts[cat.id] ? 'is-pat-btn-active' : ''
                        }`}
                        onClick={() => onPatCat(cat.id)}
                      >
                        Tepuk Kepala ({patsByCat[cat.id] || 0})
                      </button>
                      <button
                        type="button"
                        className="detail-text-btn"
                        onClick={() => onOpenDetail(cat.id)}
                      >
                        Detail
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
