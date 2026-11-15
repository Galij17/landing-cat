import { useEffect, useRef, useState } from 'react';
import { PatOverlay } from './PatOverlay';

export function CatModal({
  cat,
  onClose,
  onPrev,
  onNext,
  onSaveCat,
  onResetCat,
  patsCount,
  patBurst,
  onPatCat,
}) {
  const [nameInput, setNameInput] = useState(cat.name);
  const [lineInput, setLineInput] = useState(cat.signatureLine);
  const [savedNotice, setSavedNotice] = useState('');
  const closeBtnRef = useRef(null);

  useEffect(() => {
    setNameInput(cat.name);
    setLineInput(cat.signatureLine);
  }, [cat.name, cat.signatureLine]);

  useEffect(() => {
    setSavedNotice('');
  }, [cat.id]);

  useEffect(() => {
    closeBtnRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft') {
        onPrev();
      } else if (event.key === 'ArrowRight') {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanedName = nameInput.trim();
    const cleanedLine = lineInput.trim();
    if (!cleanedName) {
      setSavedNotice('Nama tidak boleh kosong.');
      return;
    }
    onSaveCat(cat.id, {
      name: cleanedName,
      signatureLine: cleanedLine || cat.signatureLine,
    });
    setSavedNotice('Perubahan tersimpan di browser ini.');
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-cat-title"
      >
        <div className="modal-topbar">
          <span className="card-code">
            PROFIL #{cat.code} · {cat.mood.toUpperCase()}
          </span>
          <div className="modal-nav-group">
            <button
              type="button"
              className="tool-btn"
              onClick={onPrev}
              aria-label="Kucing sebelumnya"
            >
              Sebelumnya
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={onNext}
              aria-label="Kucing berikutnya"
            >
              Berikutnya
            </button>
            <button
              ref={closeBtnRef}
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Tutup dialog profil"
            >
              Tutup
            </button>
          </div>
        </div>

        <div className="modal-body">
          <div className={`modal-photo-col ${patBurst ? 'is-patting' : ''}`}>
            <img
              src={cat.image}
              alt={cat.alt}
              width={cat.width}
              height={cat.height}
              className="modal-img"
              style={{ objectPosition: cat.objectPosition }}
            />
            <PatOverlay burst={patBurst} />
          </div>

          <div className="modal-info-col">
            <h2 id="modal-cat-title" className="modal-title">
              {cat.name}
            </h2>
            <p className="modal-pose">{cat.poseTitle}</p>
            <p className="modal-story">{cat.story}</p>

            <div className="modal-pat-row">
              <button
                type="button"
                className={`btn-secondary ${
                  patBurst ? 'is-pat-btn-active' : ''
                }`}
                onClick={() => onPatCat(cat.id)}
              >
                Tepuk Kepala ({patsCount})
              </button>
              <span className="pat-hint">Tersimpan di perangkatmu</span>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <h3 className="modal-form-heading">
                Sesuaikan Nama &amp; Kalimat Kucing
              </h3>

              <div className="form-field">
                <label htmlFor="modal-name-input" className="field-label">
                  Nama kucing
                </label>
                <input
                  id="modal-name-input"
                  type="text"
                  className="field-input"
                  value={nameInput}
                  onChange={(event) => {
                    setNameInput(event.target.value);
                    setSavedNotice('');
                  }}
                  maxLength={60}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="modal-line-input" className="field-label">
                  Kalimat khas
                </label>
                <input
                  id="modal-line-input"
                  type="text"
                  className="field-input"
                  value={lineInput}
                  onChange={(event) => {
                    setLineInput(event.target.value);
                    setSavedNotice('');
                  }}
                  maxLength={140}
                />
              </div>

              {savedNotice && (
                <p className="form-feedback" role="status" aria-live="polite">
                  {savedNotice}
                </p>
              )}

              <div className="modal-form-actions">
                <button type="submit" className="btn-primary">
                  Simpan Nama
                </button>
                <button
                  type="button"
                  className="tool-btn"
                  onClick={() => {
                    onResetCat(cat.id);
                    setSavedNotice('Dikembalikan ke nama contoh awal.');
                  }}
                >
                  Reset Bawaan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
