import './ProjectArticleGallery.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, RefObject } from 'react';
import { CLOUDFLARE_R2_BUCKET } from '../../config/constants';

interface GalleryNavigationProps {
  imageCount: number;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}

interface GalleryDotsProps {
  activeIndex: number;
  imageCount: number;
  onSelect: (index: number) => void;
  className?: string;
}

interface ProjectArticleLightboxProps {
  activeIndex: number;
  altText: string;
  failed: boolean;
  imageCount: number;
  imageUrl: string;
  isLoaded: boolean;
  isOpen: boolean;
  onClose: () => void;
  onImageError: () => void;
  onImageLoad: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSelect: (index: number) => void;
  showFocusRingOnRestore: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

interface ProjectArticleGalleryProps {
  imagePaths: string[];
  imageAlt?: string | null;
  isFeatured?: boolean;
  projectName: string;
  r2Url: string;
}

function buildR2ImageUrl(r2Url: string, imagePath: string): string {
  const normalizedFolder = r2Url.replace(/^\/+|\/+$/g, '');
  const normalizedImagePath = imagePath.replace(/^\/+/, '');
  const objectPath = normalizedFolder ? `${normalizedFolder}/${normalizedImagePath}` : normalizedImagePath;
  return new URL(objectPath, CLOUDFLARE_R2_BUCKET).toString();
}

function GalleryNavigation({ imageCount, onPrevious, onNext, className = '' }: GalleryNavigationProps) {
  if (imageCount <= 1) {
    return null;
  }

  return (
    <div className={`projectGalleryNavigation ${className}`.trim()}>
      <button type='button' onClick={onPrevious} aria-label='Previous image'>
        <svg viewBox='0 0 24 24' aria-hidden='true'>
          <path d='m15 18-6-6 6-6' />
        </svg>
      </button>
      <button type='button' onClick={onNext} aria-label='Next image'>
        <svg viewBox='0 0 24 24' aria-hidden='true'>
          <path d='m9 6 6 6-6 6' />
        </svg>
      </button>
    </div>
  );
}

function GalleryDots({ activeIndex, imageCount, onSelect, className = '' }: GalleryDotsProps) {
  if (imageCount <= 1) {
    return null;
  }

  return (
    <div className={`projectGalleryDots ${className}`.trim()} aria-label='Choose a project image'>
      {Array.from({ length: imageCount }, (_, index) => (
        <button
          className={index === activeIndex ? 'is-active' : ''}
          type='button'
          onClick={() => onSelect(index)}
          aria-label={`View image ${index + 1} of ${imageCount}`}
          aria-current={index === activeIndex ? 'true' : undefined}
          key={index}
        />
      ))}
    </div>
  );
}

function ImageFallback({ projectName }: { projectName: string }) {
  return (
    <div className='projectGalleryFallback' role='img' aria-label={`${projectName} screenshot unavailable`}>
      <svg viewBox='0 0 24 24' aria-hidden='true'>
        <path d='M4 5.75C4 4.78 4.78 4 5.75 4h12.5C19.22 4 20 4.78 20 5.75v12.5c0 .97-.78 1.75-1.75 1.75H5.75C4.78 20 4 19.22 4 18.25V5.75Z' />
        <circle cx='9' cy='9' r='1.5' />
        <path d='m5 17 4.5-4.5 3 3 2-2L19 18' />
        <path d='m7 7 10 10' />
      </svg>
      <span>Screenshot unavailable</span>
    </div>
  );
}

function ProjectArticleLightbox({
  activeIndex,
  altText,
  failed,
  imageCount,
  imageUrl,
  isLoaded,
  isOpen,
  onClose,
  onImageError,
  onImageLoad,
  onNext,
  onPrevious,
  onSelect,
  showFocusRingOnRestore,
  triggerRef,
}: ProjectArticleLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const returnFocusTarget = triggerRef.current;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (!showFocusRingOnRestore) {
        returnFocusTarget?.setAttribute('data-suppress-focus-ring', 'true');
      }
      returnFocusTarget?.focus({ preventScroll: true });
      window.requestAnimationFrame(() => returnFocusTarget?.removeAttribute('data-suppress-focus-ring'));
    };
  }, [isOpen, showFocusRingOnRestore, triggerRef]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'ArrowLeft' && imageCount > 1) {
        event.preventDefault();
        onPrevious();
        return;
      }

      if (event.key === 'ArrowRight' && imageCount > 1) {
        event.preventDefault();
        onNext();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled])');
      if (!focusableElements?.length) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [imageCount, isOpen, onClose, onNext, onPrevious]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className='projectArticleLightbox' onMouseDown={handleBackdropClick}>
      <div
        className='projectArticleLightboxDialog'
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-label={`${altText}, focused image viewer`}
      >
        <button className='projectArticleLightboxClose' type='button' onClick={onClose} ref={closeButtonRef} aria-label='Close image viewer'>
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <path d='m6 6 12 12M18 6 6 18' />
          </svg>
        </button>

        <div className='projectArticleLightboxImage'>
          {!isLoaded && !failed && <span className='projectGalleryLoading'>Loading screenshot…</span>}
          {failed ? (
            <ImageFallback projectName={altText} />
          ) : (
            <img
              className={isLoaded ? 'is-loaded' : ''}
              src={imageUrl}
              alt={altText}
              decoding='async'
              onLoad={onImageLoad}
              onError={onImageError}
            />
          )}
        </div>

        <GalleryNavigation imageCount={imageCount} onPrevious={onPrevious} onNext={onNext} className='projectArticleLightboxNavigation' />

        <div className='projectArticleLightboxFooter'>
          <GalleryDots activeIndex={activeIndex} imageCount={imageCount} onSelect={onSelect} />
          <span aria-live='polite'>
            {activeIndex + 1} / {imageCount}
          </span>
        </div>
      </div>
    </div>
  );
}

function ProjectArticleGallery({ imagePaths, imageAlt, isFeatured = false, projectName, r2Url }: ProjectArticleGalleryProps) {
  const images = imagePaths.filter((path) => path.trim().length > 0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<number>>(() => new Set());
  const [loadedImages, setLoadedImages] = useState<Set<number>>(() => new Set());
  const [showFocusRingOnRestore, setShowFocusRingOnRestore] = useState(false);
  const imageTriggerRef = useRef<HTMLButtonElement>(null);

  const showPrevious = useCallback(() => {
    setActiveImageIndex((currentIndex) => (currentIndex - 1 + images.length) % images.length);
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveImageIndex((currentIndex) => (currentIndex + 1) % images.length);
  }, [images.length]);

  const closeLightbox = useCallback(() => setIsLightboxOpen(false), []);

  if (images.length === 0) {
    return (
      <div className={isFeatured ? 'projectArticleVisual projectArticleGallery is-featured' : 'projectArticleVisual projectArticleGallery'}>
        <ImageFallback projectName={projectName} />
        {isFeatured && <span className='projectArticleImageFeatured'>Featured project</span>}
      </div>
    );
  }

  const activeImagePath = images[activeImageIndex];
  const activeImageUrl = buildR2ImageUrl(r2Url, activeImagePath);
  const activeAltText = activeImageIndex === 0 && imageAlt ? imageAlt : `${projectName} project screenshot ${activeImageIndex + 1}`;
  const activeImageFailed = failedImages.has(activeImageIndex);
  const activeImageLoaded = loadedImages.has(activeImageIndex);
  const galleryClassName = [
    'projectArticleVisual',
    'projectArticleGallery',
    images.length === 1 ? 'has-single-image' : '',
    isFeatured ? 'is-featured' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const markImageFailed = () => {
    setFailedImages((current) => new Set(current).add(activeImageIndex));
  };

  const markImageLoaded = () => {
    setLoadedImages((current) => new Set(current).add(activeImageIndex));
  };

  const handleGalleryKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (images.length <= 1) {
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPrevious();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNext();
    }
  };

  return (
    <>
      <section
        className={galleryClassName}
        aria-label={`${projectName} project screenshots`}
        onKeyDown={handleGalleryKeyDown}
      >
        <div className='projectArticleGalleryViewport'>
          <button
            className='projectArticleGalleryTrigger'
            type='button'
            onClick={() => setIsLightboxOpen(true)}
            onPointerDown={() => {
              setShowFocusRingOnRestore(false);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                setShowFocusRingOnRestore(true);
              }
            }}
            ref={imageTriggerRef}
            aria-label={`Open image ${activeImageIndex + 1} of ${images.length} in focused viewer`}
          >
            {!activeImageLoaded && !activeImageFailed && <span className='projectGalleryLoading'>Loading screenshot…</span>}
            {activeImageFailed ? (
              <ImageFallback projectName={projectName} />
            ) : (
              <img
                className={activeImageLoaded ? 'is-loaded' : ''}
                src={activeImageUrl}
                alt={activeAltText}
                loading='eager'
                decoding='async'
                onLoad={markImageLoaded}
                onError={markImageFailed}
              />
            )}
          </button>

          <GalleryNavigation imageCount={images.length} onPrevious={showPrevious} onNext={showNext} />
        </div>

        {images.length > 1 && (
          <div className='projectArticleGalleryFooter'>
            <GalleryDots activeIndex={activeImageIndex} imageCount={images.length} onSelect={setActiveImageIndex} />
            <span aria-live='polite'>
              {activeImageIndex + 1} / {images.length}
            </span>
          </div>
        )}

        {isFeatured && <span className='projectArticleImageFeatured'>Featured project</span>}
      </section>

      <ProjectArticleLightbox
        activeIndex={activeImageIndex}
        altText={activeAltText}
        failed={activeImageFailed}
        imageCount={images.length}
        imageUrl={activeImageUrl}
        isLoaded={activeImageLoaded}
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
        onImageError={markImageFailed}
        onImageLoad={markImageLoaded}
        onNext={showNext}
        onPrevious={showPrevious}
        onSelect={setActiveImageIndex}
        showFocusRingOnRestore={showFocusRingOnRestore}
        triggerRef={imageTriggerRef}
      />
    </>
  );
}

export default ProjectArticleGallery;
