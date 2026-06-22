import './Background.css';
import { useEffect } from 'react';

function Background() {
  useEffect(() => {
    const background = document.querySelector<HTMLDivElement>('.gradient-bg');
    const interactiveBubble = document.querySelector<HTMLDivElement>('.interactive');
    if (!background || !interactiveBubble) {
      return;
    }

    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;
    let animationFrameId = 0;
    const particleTimers: number[] = [];
    const spotlightQuery = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)');

    const handlePointerMove = (event: PointerEvent) => {
      if (!spotlightQuery.matches) {
        return;
      }

      tgX = event.clientX;
      tgY = event.clientY;
      background.style.setProperty('--pointer-x', `${event.clientX}px`);
      background.style.setProperty('--pointer-y', `${event.clientY}px`);
      background.classList.add('is-active');
    };

    const handlePointerLeave = () => {
      background.classList.remove('is-active');
    };

    const handlePointerDown = (event: PointerEvent) => {
      const particleCount = window.matchMedia('(max-width: 640px)').matches ? 5 : 9; // makes phones less laggy

      for (let index = 0; index < particleCount; index += 1) {
        const particle = document.createElement('span');
        const angle = Math.random() * (Math.PI * 2 * index) / particleCount;
        const distance = 34 + Math.random() * 32;

        particle.className = 'click-particle';
        particle.textContent = Math.random() > 0.5 ? '1' : '0';
        particle.style.left = `${event.clientX}px`;
        particle.style.top = `${event.clientY}px`;
        particle.style.setProperty('--particle-x', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--particle-y', `${Math.sin(angle) * distance}px`);

        background.appendChild(particle);
        particleTimers.push(window.setTimeout(() => particle.remove(), 850)); // time existing for particle element (ms)
      }
    };

    const move = () => {
      if (!spotlightQuery.matches) {
        background.classList.remove('is-active');
        interactiveBubble.style.transform = 'translate(-50%, -50%)';
        animationFrameId = window.requestAnimationFrame(move);
        return;
      }

      // larger divisor = slower/floatier
      curX += (tgX - curX) / 10;
      curY += (tgY - curY) / 10;
      interactiveBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px) translate(-50%, -50%)`;
      animationFrameId = window.requestAnimationFrame(move);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('mouseleave', handlePointerLeave);
    move();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.cancelAnimationFrame(animationFrameId);
      particleTimers.forEach((timer) => window.clearTimeout(timer));
      background.querySelectorAll('.click-particle').forEach((particle) => particle.remove());
    };
  }, []);

  return (
    <div className='gradient-bg' aria-hidden='true'>
      <div className='interactive'></div>
    </div>
  );
}

export default Background;
