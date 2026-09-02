import { useEffect, useRef, useState } from 'react';
import './SprayPaint.css';
import './GameofLife.css';
import { SPRAY_SOUND } from '../../../config/constants';

const BASE_CELL_SIZE = 5;
const CELL_SPACING = 1;
const PAINT_COLOR = '#005EB8';
const PAINT_HOLD_DURATION_MS = 5_000;
const PAINT_FADE_DURATION_MS = 1_000;

interface GridDimensions {
  rows: number;
  cols: number;
  cellSize: number;
}

const isPointOverText = (x: number, y: number) => {
  const documentWithCaret = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
  };
  const caretPosition = documentWithCaret.caretPositionFromPoint?.(x, y);
  const node = caretPosition?.offsetNode;
  const offset = caretPosition?.offset;

  if (!node || offset === undefined || node.nodeType !== Node.TEXT_NODE || !node.textContent) {
    return false;
  }

  return [offset, offset - 1].some((characterOffset) => {
    if (characterOffset < 0 || characterOffset >= node.textContent!.length) {
      return false;
    }

    const range = document.createRange();
    range.setStart(node, characterOffset);
    range.setEnd(node, characterOffset + 1);

    return Array.from(range.getClientRects()).some(
      (rect) => x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom,
    );
  });
};

const MOBILE_CONTENT_SELECTOR = [
  'a',
  'button',
  'input',
  'textarea',
  'select',
  'label',
  '[contenteditable="true"]',
  'article',
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'li',
  'blockquote',
  'pre',
  'code',
  'img',
  'svg',
  'video',
  'iframe',
  'canvas:not(.sprayContainer)',
].join(',');

const hasVisibleBackground = (element: Element) => {
  const style = window.getComputedStyle(element);

  if (style.backgroundImage !== 'none' || style.boxShadow !== 'none') {
    return true;
  }

  const color = style.backgroundColor;
  if (color === 'transparent') {
    return false;
  }

  const alphaMatch = color.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/);
  return !alphaMatch || Number(alphaMatch[1]) > 0.01;
};

const isBarePageBackground = (x: number, y: number) => {
  const hitElement = document.elementFromPoint(x, y);
  if (!hitElement) {
    return false;
  }

  for (let element: Element | null = hitElement; element; element = element.parentElement) {
    if (element.matches('html, body, #root, .app-shell, .page-shell, main, section, .sprayContainer')) {
      continue;
    }

    if (element.matches(MOBILE_CONTENT_SELECTOR) || hasVisibleBackground(element)) {
      return false;
    }
  }

  return !isPointOverText(x, y);
};

const shouldUseBackgroundOnlyHitTest = (pointerType?: string) => {
  return pointerType === 'touch' || window.matchMedia('(pointer: coarse)').matches;
};

const canSprayAt = (target: EventTarget | null, x: number, y: number, backgroundOnly = false) => {
  if (!(target instanceof Element)) {
    return false;
  }

  const isControl = target.closest('a, button, input, textarea, select, label, [contenteditable="true"]');
  if (isControl || isPointOverText(x, y)) {
    return false;
  }

  return !backgroundOnly || isBarePageBackground(x, y);
};

function SprayPaint() {
  const [areInstructionsHidden, setInstructionsHidden] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hideInstructionsRef = useRef<HTMLButtonElement>(null);
  const showInstructionsRef = useRef<HTMLButtonElement>(null);
  const paintedAtRef = useRef(new Float64Array()); // timing array
  const activeCellsRef = useRef(new Set<number>());
  const dimensionsRef = useRef<GridDimensions>({ rows: 0, cols: 0, cellSize: BASE_CELL_SIZE }); // meta data for canvas

  useEffect(() => {
    // audio
    const sprayAudio = new Audio(SPRAY_SOUND);

    sprayAudio.loop = true;
    sprayAudio.preload = 'auto';

    const startSpraySound = () => {
      sprayAudio.currentTime = 0;

      void sprayAudio.play().catch(() => {
        // blocked
      });
    };

    const stopSpraySound = () => {
      sprayAudio.pause();
      sprayAudio.currentTime = 0;
    };

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    let animationFrameId = 0;

    const drawPaint = (timestamp: number) => {
      animationFrameId = 0;
      const { cols, cellSize } = dimensionsRef.current;
      const totalLifetime = PAINT_HOLD_DURATION_MS + PAINT_FADE_DURATION_MS;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = PAINT_COLOR;

      for (const cellIndex of activeCellsRef.current) {
        const age = timestamp - paintedAtRef.current[cellIndex];

        if (age >= totalLifetime) {
          paintedAtRef.current[cellIndex] = 0;
          activeCellsRef.current.delete(cellIndex);
          continue;
        }

        const opacity = age <= PAINT_HOLD_DURATION_MS
          ? 1
          : 1 - ((age - PAINT_HOLD_DURATION_MS) / PAINT_FADE_DURATION_MS);
        const row = Math.floor(cellIndex / cols);
        const col = cellIndex % cols;

        context.globalAlpha = Math.max(0, opacity);
        context.fillRect(
          col * cellSize,
          row * cellSize,
          cellSize - CELL_SPACING,
          cellSize - CELL_SPACING,
        );
      }

      context.globalAlpha = 1;

      if (activeCellsRef.current.size > 0) {
        animationFrameId = window.requestAnimationFrame(drawPaint);
      }
    };

    const ensureAnimationIsRunning = () => {
      if (animationFrameId === 0) {
        animationFrameId = window.requestAnimationFrame(drawPaint);
      }
    };

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const cellSize = BASE_CELL_SIZE;
      const rows = Math.ceil(height / cellSize);
      const cols = Math.ceil(width / cellSize);

      canvas.width = width;
      canvas.height = height;
      dimensionsRef.current = { rows, cols, cellSize };
      paintedAtRef.current = new Float64Array(rows * cols);
      activeCellsRef.current.clear();
    };

    let resizeTimeoutId: number | undefined;
    const handleResize = () => {
      window.clearTimeout(resizeTimeoutId);
      resizeTimeoutId = window.setTimeout(resizeCanvas, 100);
    };

    const fillCircle = (cellIndex: number) => {
      const BRUSH_SIZE = 3;
      const paintedAt = performance.now();
      const radius = Math.floor(BRUSH_SIZE / 2);
      const { rows, cols } = dimensionsRef.current;

      const centerCol = cellIndex % cols;
      const centerRow = Math.floor(cellIndex / cols);

      for (let rowOffset = -radius; rowOffset <= radius; rowOffset++) {
        for (let colOffset = -radius; colOffset <= radius; colOffset++) {
          if (rowOffset * rowOffset + colOffset * colOffset > radius * radius) {
            continue;
          }
          const row = centerRow + rowOffset;
          const col = centerCol + colOffset;

          if (row < 0 || row >= rows || col < 0 || col >= cols) {
            continue;
          }

          const targetIndex = row * cols + col;

          paintedAtRef.current[targetIndex] = paintedAt;
          activeCellsRef.current.add(targetIndex);
        }
      }

      ensureAnimationIsRunning();
    };

    const paintAtPosition = (x: number, y: number) => {
      const { rows, cols, cellSize } = dimensionsRef.current;
      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);

      if (row < 0 || row >= rows || col < 0 || col >= cols) {
        return;
      }

      fillCircle(row * cols + col);
    };

    let activePointerId: number | null = null;
    let previousPointerPosition: { x: number; y: number } | null = null;

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (event.touches.length === 1 && touch && canSprayAt(event.target, touch.clientX, touch.clientY, true)) {
        event.preventDefault();
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (activePointerId !== null) {
        event.preventDefault();
      }
    };

    const stopPainting = (event?: PointerEvent) => {
      if (event && activePointerId !== event.pointerId) {
        return;
      }

      activePointerId = null;
      previousPointerPosition = null;
      stopSpraySound();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || !event.isPrimary || activePointerId !== null) {
        return;
      }

      const target = event.target;
      const backgroundOnly = shouldUseBackgroundOnlyHitTest(event.pointerType);
      if (!canSprayAt(target, event.clientX, event.clientY, backgroundOnly)) {
        return;
      }

      event.preventDefault();

      const { width, height } = canvas.getBoundingClientRect();
      if (event.clientX < 0 || event.clientX >= width || event.clientY < 0 || event.clientY >= height) {
        return;
      }

      activePointerId = event.pointerId;
      previousPointerPosition = { x: event.clientX, y: event.clientY };
      startSpraySound();
      paintAtPosition(event.clientX, event.clientY);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (activePointerId !== event.pointerId) {
        return;
      }

      // only primary click
      if ((event.buttons & 1) === 0) {
        stopPainting(event);
        return;
      }

      const backgroundOnly = shouldUseBackgroundOnlyHitTest(event.pointerType);
      if (!canSprayAt(event.target, event.clientX, event.clientY, backgroundOnly)) {
        previousPointerPosition = null;
        stopSpraySound();
        return;
      }

      event.preventDefault();

      if (previousPointerPosition === null) {
        previousPointerPosition = { x: event.clientX, y: event.clientY };
        startSpraySound();
        paintAtPosition(event.clientX, event.clientY);
        return;
      }

      // interpolation
      const currentPosition = { x: event.clientX, y: event.clientY };
      const deltaX = currentPosition.x - previousPointerPosition.x;
      const deltaY = currentPosition.y - previousPointerPosition.y;
      const distance = Math.hypot(deltaX, deltaY);
      const interpolationSpacing = Math.max(1, dimensionsRef.current.cellSize / 2); // max stride length before generate
      const steps = Math.max(1, Math.ceil(distance / interpolationSpacing));

      for (let step = 1; step <= steps; step++) {
        const progress = step / steps;
        const x = previousPointerPosition.x + deltaX * progress;
        const y = previousPointerPosition.y + deltaY * progress;
        const target = document.elementFromPoint(x, y);
        if (canSprayAt(target, x, y, backgroundOnly)) {
          paintAtPosition(x, y);
        }
      }

      previousPointerPosition = currentPosition;
    };

    const handleWindowBlur = () => stopPainting();

    resizeCanvas();
    window.addEventListener('resize', handleResize);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopPainting);
    window.addEventListener('pointercancel', stopPainting);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      stopSpraySound();

      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(resizeTimeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopPainting);
      window.removeEventListener('pointercancel', stopPainting);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  return(
    <>
      <canvas ref={canvasRef} className='sprayContainer' aria-hidden='true' />
      <div
        className={areInstructionsHidden ? 'backgroundControls is-hidden' : 'backgroundControls'}
        id='spray-paint-instructions'
        role='note'
        inert={areInstructionsHidden}
      >
        <span>Press and hold to spray</span>
        <button
          className='backgroundControls__hideButton'
          type='button'
          aria-label='Hide spray paint instructions'
          aria-controls='spray-paint-instructions'
          onClick={() => {
            setInstructionsHidden(true);
            window.requestAnimationFrame(() => showInstructionsRef.current?.focus());
          }}
          ref={hideInstructionsRef}
        >
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <g transform='rotate(180 12 11.5)'>
              <path d='m7 9 5 5 5-5' />
            </g>
          </svg>
        </button>
      </div>
      <button
        className={areInstructionsHidden ? 'backgroundControlsReveal is-visible' : 'backgroundControlsReveal'}
        type='button'
        aria-label='Show spray paint instructions'
        aria-controls='spray-paint-instructions'
        aria-expanded={!areInstructionsHidden}
        tabIndex={areInstructionsHidden ? 0 : -1}
        onClick={() => {
          setInstructionsHidden(false);
          window.requestAnimationFrame(() => hideInstructionsRef.current?.focus());
        }}
        ref={showInstructionsRef}
      >
        <svg viewBox='0 0 24 24' aria-hidden='true'>
          <path d='m7 9 5 5 5-5' />
        </svg>
      </button>
    </>
  );
}

export default SprayPaint;
