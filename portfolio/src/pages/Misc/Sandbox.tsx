import './Sandbox.css';
import { INFO_ICON } from '../../config/constants';
import { BACKGROUNDS } from '../../components/Background/backgroundCatalog';
import type { BackgroundId } from '../../components/Background/backgroundCatalog';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { MouseEvent as ReactMouseEvent } from 'react';

interface SandboxProps {
  selectedBackground: BackgroundId;
}

function Sandbox({ selectedBackground }: SandboxProps) {
  const [isInfoOpen, setInfoOpen] = useState(false);
  const infoButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogTitleId = 'sandbox-background-information-title';
  const activeBackground = BACKGROUNDS.find(({ id }) => id === selectedBackground) ?? BACKGROUNDS[0];

  useEffect(() => {
    if (!isInfoOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const returnFocusTarget = infoButtonRef.current;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setInfoOpen(false);
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      returnFocusTarget?.focus({ preventScroll: true });
    };
  }, [isInfoOpen]);

  const closeInfo = () => setInfoOpen(false);

  const handleBackdropClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeInfo();
    }
  };

  return (
    <main className='sandboxPage'>
      <button
        className='sandboxInfoButton'
        type='button'
        aria-label='Open background information'
        aria-haspopup='dialog'
        onClick={() => setInfoOpen(true)}
        ref={infoButtonRef}
      >
        <img src={INFO_ICON} className='infoIcon' alt='' aria-hidden='true' />
      </button>

      {isInfoOpen && createPortal(
        <div className='sandboxInfoLightbox' onMouseDown={handleBackdropClick}>
          <div
            className='sandboxInfoDialog'
            role='dialog'
            aria-modal='true'
            aria-labelledby={dialogTitleId}
            ref={dialogRef}
          >
            <header className='sandboxInfoDialogHeader'>
              <h1 id={dialogTitleId}>{activeBackground.label}</h1>
              <button type='button' onClick={closeInfo} ref={closeButtonRef} aria-label='Close background information'>
                <svg viewBox='0 0 24 24' aria-hidden='true'>
                  <path d='m6 6 12 12M18 6 6 18' />
                </svg>
              </button>
            </header>

            <div className='sandboxInfoDialogContent' data-background={selectedBackground} key={selectedBackground}>
              {/* Add content for the selectedBackground value here. */}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </main>
  );
}

export default Sandbox;
