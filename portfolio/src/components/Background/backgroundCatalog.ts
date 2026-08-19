import type { ComponentType } from 'react';
import GameOfLife from './BackgroundTypes/GameofLife';
import SprayPaint from './BackgroundTypes/SprayPaint';

export type BackgroundId = 'game-of-life' | 'spray-paint' | 'none';

interface BackgroundOption {
  id: BackgroundId;
  label: string;
  component: ComponentType | null;
}

export const BACKGROUNDS: BackgroundOption[] = [
  {
    id: 'game-of-life',
    label: 'Game of Life',
    component: GameOfLife
  },
  {
    id: 'spray-paint',
    label: 'Spray Paint',
    component: SprayPaint
  },
  {
    id: 'none',
    label: 'None',
    component: null
  }
];

export function isBackgroundId(value: string | null): value is BackgroundId {
  return BACKGROUNDS.some(({ id }) => id === value);
}
