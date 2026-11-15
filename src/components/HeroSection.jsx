export function HeroSection({
  cats,
  activeCat,
  onSelectCat,
  onShuffleCat,
  onOpenDetail,
}) {
  return (
    <section id="sorotan" className="hero-section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1 className="hero-title">
            Lima Ekspresi.
            <span className="hero-title-accent">Satu Panggung.</span>
          </h1>

          <p className="hero-lead">
            Landing Cat merangkum lima potret kucing penuh watak: dari tatapan
            serius di sudut gelap, melet tanpa beban, hingga tinju pagi di atas
            seprai putih. Klik potret mana saja untuk membaca ceritanya atau
            mengubah nama sementaranya.
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
          </div>

          <div className="hero-strip" aria-label="Pilih sorotan kucing">
            <span className="strip-label">Sorotan aktif:</span>
            <div className="strip-buttons" role="group" aria-label="Daftar lima kucing">
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
          <div className="hero-frame">
            <div className="hero-frame-header">
              <span className="frame-index">POTRET #{activeCat.code}</span>
              <span className="frame-mood">{activeCat.mood}</span>
            </div>

            <div className="hero-image-wrap">
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
            </div>

            <div className="hero-frame-footer">
              <div>
                <h2 className="frame-name">{activeCat.name}</h2>
                <p className="frame-caption">{activeCat.signatureLine}</p>
              </div>
              <button
                type="button"
                className="frame-detail-btn"
                onClick={() => onOpenDetail(activeCat.id)}
              >
                Buka Profil
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
