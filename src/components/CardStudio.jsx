import { useEffect, useState } from 'react';

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length >= maxLines) break;
    }
  }
  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  lines.forEach((line, idx) => {
    ctx.fillText(line, x, y + idx * lineHeight);
  });
}

export function CardStudio({ cats }) {
  const [selectedId, setSelectedId] = useState(cats[0].id);
  const activeCat = cats.find((c) => c.id === selectedId) || cats[0];

  const [caption, setCaption] = useState(activeCat.presets[0]);
  const [cardTheme, setCardTheme] = useState('dark');
  const [statusMessage, setStatusMessage] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setCaption(activeCat.presets[0]);
    setStatusMessage('');
    setImgError(false);
  }, [activeCat]);

  const handleCopyText = async () => {
    const textToCopy = `"${caption.trim() || activeCat.signatureLine}" - ${activeCat.name} (Landing Cat)`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setStatusMessage('Teks kartu berhasil disalin ke clipboard.');
    } catch {
      setStatusMessage(
        'Clipboard browser tidak tersedia. Silakan salin manual dari kotak teks.'
      );
    }
  };

  const handleDownloadPng = async () => {
    setDownloading(true);
    setStatusMessage('');
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = activeCat.image;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1040;
      const ctx = canvas.getContext('2d');

      const isDarkCard = cardTheme === 'dark';
      ctx.fillStyle = isDarkCard ? '#11100E' : '#F6F1E7';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw portrait inside padded frame
      const frameX = 48;
      const frameY = 48;
      const frameW = 704;
      const frameH = 720;

      const scale = Math.max(frameW / img.width, frameH / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const drawX = frameX + (frameW - drawW) / 2;
      const posParts = activeCat.objectPosition.split(' ');
      const yPercent = parseFloat(posParts[1] || '50') / 100;
      const drawY = frameY + (frameH - drawH) * yPercent;

      ctx.save();
      ctx.beginPath();
      ctx.rect(frameX, frameY, frameW, frameH);
      ctx.clip();
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();

      ctx.strokeStyle = isDarkCard ? '#FF7A45' : '#B83B14';
      ctx.lineWidth = 4;
      ctx.strokeRect(frameX, frameY, frameW, frameH);

      // Footer typography block
      ctx.fillStyle = isDarkCard ? '#FF7A45' : '#B83B14';
      ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        `LANDING CAT · #${activeCat.code} · ${activeCat.mood.toUpperCase()}`,
        48,
        822
      );

      ctx.fillStyle = isDarkCard ? '#F4EFE6' : '#171412';
      ctx.font = '700 32px "Syne", sans-serif';
      const displayLine = caption.trim() || activeCat.signatureLine;
      wrapCanvasText(ctx, displayLine, 48, 874, 704, 42, 3);

      ctx.fillStyle = isDarkCard ? '#BEB4A8' : '#574E46';
      ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(activeCat.name, 48, 996);

      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `landing-cat-${activeCat.code}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setStatusMessage(`Kartu PNG #${activeCat.code} berhasil diunduh.`);
    } catch {
      setStatusMessage('Gagal membuat file PNG di browser ini.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section id="studio-kata" className="studio-section">
      <div className="container studio-grid">
        <div className="studio-controls">
          <h2 className="section-title">Studio Kartu Ekspresi</h2>
          <p className="section-subtitle">
            Pilih salah satu potret, pakai kalimat bawaan atau tulis pesanmu
            sendiri, lalu unduh sebagai kartu PNG siap bagikan.
          </p>

          <div className="studio-block">
            <span className="field-label">1. Pilih potret kucing</span>
            <div
              className="studio-cat-picker"
              role="group"
              aria-label="Pilih foto kucing untuk kartu"
            >
              {cats.map((cat) => {
                const selected = cat.id === activeCat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`picker-chip ${selected ? 'is-active' : ''}`}
                    onClick={() => setSelectedId(cat.id)}
                    aria-pressed={selected}
                  >
                    #{cat.code} {cat.mood}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="studio-block">
            <span className="field-label">2. Kalimat cepat</span>
            <div className="preset-list">
              {activeCat.presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`preset-btn ${
                    caption === preset ? 'is-active' : ''
                  }`}
                  onClick={() => {
                    setCaption(preset);
                    setStatusMessage('');
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="studio-block">
            <label htmlFor="studio-caption-input" className="field-label">
              3. Tulis atau sunting kalimat kartu
            </label>
            <textarea
              id="studio-caption-input"
              className="field-textarea"
              rows={2}
              maxLength={120}
              value={caption}
              onChange={(event) => {
                setCaption(event.target.value);
                setStatusMessage('');
              }}
            />
          </div>

          <div className="studio-block">
            <span className="field-label">4. Gaya bingkai kartu</span>
            <div
              className="frame-style-group"
              role="group"
              aria-label="Pilih gaya bingkai kartu"
            >
              <button
                type="button"
                className={`filter-btn ${
                  cardTheme === 'dark' ? 'is-active' : ''
                }`}
                onClick={() => setCardTheme('dark')}
                aria-pressed={cardTheme === 'dark'}
              >
                Gelap Sinematik
              </button>
              <button
                type="button"
                className={`filter-btn ${
                  cardTheme === 'light' ? 'is-active' : ''
                }`}
                onClick={() => setCardTheme('light')}
                aria-pressed={cardTheme === 'light'}
              >
                Kertas Hangat
              </button>
            </div>
          </div>

          <div className="studio-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={handleDownloadPng}
              disabled={downloading}
            >
              {downloading ? 'Menyiapkan PNG...' : 'Unduh Kartu (PNG)'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCopyText}
            >
              Salin Teks Kartu
            </button>
          </div>

          {statusMessage && (
            <p className="form-feedback" role="status" aria-live="polite">
              {statusMessage}
            </p>
          )}
        </div>

        <div className="studio-preview-col">
          <div
            className={`postcard-preview ${
              cardTheme === 'dark' ? 'is-dark-card' : 'is-light-card'
            }`}
          >
            <div className="postcard-media">
              {imgError ? (
                <div className="img-fallback">
                  <p>Foto pratinjau gagal dimuat.</p>
                  <button
                    type="button"
                    className="tool-btn"
                    onClick={() => setImgError(false)}
                  >
                    Muat Ulang Pratinjau
                  </button>
                </div>
              ) : (
                <img
                  key={activeCat.id}
                  src={activeCat.image}
                  alt={activeCat.alt}
                  width={activeCat.width}
                  height={activeCat.height}
                  decoding="async"
                  className="postcard-img"
                  style={{ objectPosition: activeCat.objectPosition }}
                  onError={() => setImgError(true)}
                />
              )}
            </div>

            <div className="postcard-body">
              <p className="postcard-tag">
                LANDING CAT · #{activeCat.code} · {activeCat.mood.toUpperCase()}
              </p>
              <p className="postcard-quote">
                {caption.trim() || activeCat.signatureLine}
              </p>
              <p className="postcard-author">{activeCat.name}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
