import { useEffect, useRef } from 'react';
import './SprayPaint.css';
import { SPRAY_SOUND } from '../../../config/constants';

const BASE_CELL_SIZE = 10;
const CELL_SPACING = 3;
const PAINT_COLOR = '#111184';
const PAINT_HOLD_DURATION_MS = 3_000;
const PAINT_FADE_DURATION_MS = 1_000;

interface GridDimensions {
  rows: number;
  cols: number;
  cellSize: number;
}

function SprayPaint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paintedAtRef = useRef(new Float64Array()); // timing array
  const activeCellsRef = useRef(new Set<number>());
  const dimensionsRef = useRef<GridDimensions>({ rows: 0, cols: 0, cellSize: BASE_CELL_SIZE });

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
      const BRUSH_SIZE = 5;
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
      if (target instanceof Element && target.closest('a, button, input, textarea, select')) {
        return;
      }

      if (event.pointerType !== 'touch') {
        event.preventDefault();
      }

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
      if (activePointerId !== event.pointerId || previousPointerPosition === null) {
        return;
      }

      // only primary click
      if ((event.buttons & 1) === 0) {
        stopPainting(event);
        return;
      }

      // on select
      if (event.pointerType !== 'touch') {
        event.preventDefault();
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
        paintAtPosition(
          previousPointerPosition.x + deltaX * progress,
          previousPointerPosition.y + deltaY * progress,
        );
      }

      previousPointerPosition = currentPosition;
    };

    const handleWindowBlur = () => stopPainting();

    resizeCanvas();
    window.addEventListener('resize', handleResize);
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
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopPainting);
      window.removeEventListener('pointercancel', stopPainting);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  return(
    <canvas ref={canvasRef} className='sprayContainer' aria-hidden='true' />
  );
}

export default SprayPaint;
