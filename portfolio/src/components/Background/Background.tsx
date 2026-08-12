import { BACKGROUNDS } from './backgroundCatalog';
import type { BackgroundId } from './backgroundCatalog';

interface BackgroundProps {
  selectedBackground: BackgroundId;
}

function Background({ selectedBackground }: BackgroundProps) {
  const activeBackground = BACKGROUNDS.find(({ id }) => id === selectedBackground);
  const ActiveBackground = activeBackground?.component ?? null;

  return ActiveBackground ? <ActiveBackground key={selectedBackground} /> : null;
}

export default Background;
