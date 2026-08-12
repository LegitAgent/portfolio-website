import './GameofLife.css';
import { useEffect, useRef, useState } from 'react';

const PIXEL_SIZE = 10;
const GOSPER_GLIDER_GUN_WIDTH = 36;
const GOSPER_GLIDER_GUN_HEIGHT = 9;
const GOSPER_GLIDER_GUN_CELLS: ReadonlyArray<readonly [number, number]> = [
  [1, 5], [1, 6], [2, 5], [2, 6],
  [11, 5], [11, 6], [11, 7], [12, 4], [12, 8], [13, 3], [13, 9],
  [14, 3], [14, 9], [15, 6], [16, 4], [16, 8], [17, 5], [17, 6],
  [17, 7], [18, 6],
  [21, 3], [21, 4], [21, 5], [22, 3], [22, 4], [22, 5], [23, 2],
  [23, 6], [25, 1], [25, 2], [25, 6], [25, 7],
  [35, 3], [35, 4], [36, 3], [36, 4]
];
const BLINKER_CELLS = [
  [0, 0], [1, 0], [2, 0]
];
const TOAD_CELLS = [
  [1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1]
];
const BEACON_CELLS = [
  [0, 0], [1, 0], [0, 1], [1, 1],
  [2, 2], [3, 2], [2, 3], [3, 3]
];
const PULSAR_CELLS = [
  [2, 0], [3, 0], [4, 0], [8, 0], [9, 0], [10, 0],
  [0, 2], [5, 2], [7, 2], [12, 2],
  [0, 3], [5, 3], [7, 3], [12, 3],
  [0, 4], [5, 4], [7, 4], [12, 4],
  [2, 5], [3, 5], [4, 5], [8, 5], [9, 5], [10, 5],
  [2, 7], [3, 7], [4, 7], [8, 7], [9, 7], [10, 7],
  [0, 8], [5, 8], [7, 8], [12, 8],
  [0, 9], [5, 9], [7, 9], [12, 9],
  [0, 10], [5, 10], [7, 10], [12, 10],
  [2, 12], [3, 12], [4, 12], [8, 12], [9, 12], [10, 12]
];

interface GridDimensions {
  rows: number;
  cols: number;
}

function createSeededGrid(rows: number, cols: number) {
  const grid = new Uint8Array(rows * cols);
  const columnOffset = Math.max(0, Math.floor((cols - GOSPER_GLIDER_GUN_WIDTH) / 2));
  const rowOffset = Math.max(0, Math.floor((rows - GOSPER_GLIDER_GUN_HEIGHT) / 2));

  const placePattern = (cells: number[][], startCol: number, startRow: number) => {
    for (const [x, y] of cells) {
      const col = startCol + x;
      const row = startRow + y;

      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        grid[row * cols + col] = 1;
      }
    }
  };

  placePattern(PULSAR_CELLS, 8, 7);
  placePattern(PULSAR_CELLS, Math.max(0, cols - 21), Math.max(0, rows - 21));
  placePattern(BLINKER_CELLS, Math.max(0, cols - 14), 8);
  placePattern(BLINKER_CELLS, Math.max(0, Math.floor(cols / 2) - 1), 7);
  placePattern(TOAD_CELLS, Math.max(0, cols - 16), 20);
  placePattern(TOAD_CELLS, 9, Math.max(0, Math.floor(rows / 2) - 1));
  placePattern(BEACON_CELLS, 10, Math.max(0, rows - 18));
  placePattern(BEACON_CELLS, Math.max(0, cols - 15), Math.max(0, Math.floor(rows / 2) - 2));
  placePattern(BEACON_CELLS, Math.max(0, Math.floor(cols / 2) - 2), Math.max(0, rows - 24));
  placePattern(BLINKER_CELLS, Math.max(0, cols - 15), Math.max(0, rows - 14));
  placePattern(TOAD_CELLS, Math.max(0, Math.floor(cols / 2) - 2), Math.max(0, rows - 12));

  for (const [x, y] of GOSPER_GLIDER_GUN_CELLS) {
    const col = columnOffset + x - 1;
    const row = rowOffset + y - 1;

    if (row < rows && col < cols) {
      grid[row * cols + col] = 1;
    }
  }

  return grid;
}

function calculateNextGeneration(currentGrid: Uint8Array, nextGrid: Uint8Array, rows: number, cols: number) {
  // current grid = read-only, next grid = write-only
  const directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
  
  const checkNeighbors = (i: number, j: number): number => {
    let neighbors = 0;
    for (const [rowOffset, colOffset] of directions) {
      const rowIdx = i + rowOffset;
      const colIdx = j + colOffset;
      if (rowIdx >= 0 && rowIdx < rows && colIdx >= 0 && colIdx < cols) {
        if (currentGrid[rowIdx * cols + colIdx] === 1) {
          neighbors++;
        }
      }
    }
    return neighbors;
  };

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const curIdx = i * cols + j;
      const neighborCount = checkNeighbors(i, j);
      if (currentGrid[curIdx] === 1) {
        if (neighborCount < 2 || neighborCount > 3) {
          nextGrid[curIdx] = 0;
        } else {
          nextGrid[curIdx] = 1;
        }
      } else { // if 0
        nextGrid[curIdx] = neighborCount === 3 ? 1 : 0;
      }
    }
  }
}

function GameOfLife() {
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(8);
  const [areControlsHidden, setControlsHidden] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hideControlsRef = useRef<HTMLButtonElement>(null);
  const showControlsRef = useRef<HTMLButtonElement>(null);
  const currentGridRef = useRef(new Uint8Array());
  const nextGridRef = useRef(new Uint8Array());
  const dimensionsRef = useRef<GridDimensions>({ rows: 0, cols: 0 });
  const advanceGenerationRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const drawGrid = () => {
      const { rows, cols } = dimensionsRef.current;
      const grid = currentGridRef.current;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = '#000000';
      context.fillStyle = '#ffffff';

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * PIXEL_SIZE;
          const y = row * PIXEL_SIZE;
          const cellIndex = row * cols + col;

          if (grid[cellIndex] === 1) {
            context.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
          } else {
            context.strokeRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
          }
        }
      }
    };

    const resizeGrid = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const rows = Math.floor(height / PIXEL_SIZE) + 2;
      const cols = Math.floor(width / PIXEL_SIZE) + 2;

      canvas.width = width;
      canvas.height = height;
      dimensionsRef.current = { rows, cols };
      currentGridRef.current = createSeededGrid(rows, cols);
      nextGridRef.current = new Uint8Array(rows * cols);
      drawGrid();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) {
        return;
      }

      const target = event.target;
      if (target instanceof Element && target.closest('a, button, input, textarea, select')) {
        return;
      }

      const { rows, cols } = dimensionsRef.current;
      const col = Math.floor(event.clientX / PIXEL_SIZE);
      const row = Math.floor(event.clientY / PIXEL_SIZE);

      if (row < 0 || row >= rows || col < 0 || col >= cols) {
        return;
      }

      const cellIndex = row * cols + col;
      const grid = currentGridRef.current;
      grid[cellIndex] = grid[cellIndex] === 1 ? 0 : 1;
      drawGrid();
    };

    const advanceGeneration = () => {
      const { rows, cols } = dimensionsRef.current;

      calculateNextGeneration(currentGridRef.current, nextGridRef.current, rows, cols);

      const previousGrid = currentGridRef.current;
      currentGridRef.current = nextGridRef.current;
      nextGridRef.current = previousGrid;
      drawGrid();
    };

    advanceGenerationRef.current = advanceGeneration;

    resizeGrid();

    window.addEventListener('resize', resizeGrid);
    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      advanceGenerationRef.current = () => undefined;
      window.removeEventListener('resize', resizeGrid);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const simulationInterval = window.setInterval(() => {
      advanceGenerationRef.current();
    }, 1000 / speed);

    return () => window.clearInterval(simulationInterval);
  }, [isRunning, speed]);

  return (
    <>
      <canvas ref={canvasRef} className='backgroundContainer' aria-hidden='true' />
      <div
        className={areControlsHidden ? 'backgroundControls is-hidden' : 'backgroundControls'}
        id='game-of-life-controls'
        role='group'
        aria-label='Game of Life controls'
        inert={areControlsHidden}
      >
        <button
          className='backgroundControls__playButton'
          type='button'
          aria-pressed={isRunning}
          onClick={() => setIsRunning((running) => !running)}
        >
          <span aria-hidden='true'>{isRunning ? 'II' : '▶'}</span>
          {isRunning ? 'Pause' : 'Play'}
        </button>

        <label className='backgroundControls__speed' htmlFor='game-of-life-speed'>
          <span>Speed</span>
          <input
            id='game-of-life-speed'
            type='range'
            min='1'
            max='20'
            step='1'
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
          />
          <output htmlFor='game-of-life-speed'>{speed} gen/s</output>
        </label>
        <button
          className='backgroundControls__hideButton'
          type='button'
          aria-label='Hide Game of Life controls'
          aria-controls='game-of-life-controls'
          onClick={() => {
            setControlsHidden(true);
            window.requestAnimationFrame(() => showControlsRef.current?.focus());
          }}
          ref={hideControlsRef}
        >
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <g transform="rotate(180 12 11.5)">
              <path d="m7 9 5 5 5-5" />
            </g>
          </svg>
        </button>
      </div>
      <button
        className={areControlsHidden ? 'backgroundControlsReveal is-visible' : 'backgroundControlsReveal'}
        type='button'
        aria-label='Show Game of Life controls'
        aria-controls='game-of-life-controls'
        aria-expanded={!areControlsHidden}
        tabIndex={areControlsHidden ? 0 : -1}
        onClick={() => {
          setControlsHidden(false);
          window.requestAnimationFrame(() => hideControlsRef.current?.focus());
        }}
        ref={showControlsRef}
      >
      <svg viewBox='0 0 24 24' aria-hidden='true'>
        <path d='m7 9 5 5 5-5' />
      </svg>
      </button>
    </>
  );
}

export default GameOfLife;
