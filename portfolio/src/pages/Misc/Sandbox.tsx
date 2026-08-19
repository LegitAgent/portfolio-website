import './Sandbox.css';
import { INFO_ICON } from '../../config/constants';
import { BACKGROUNDS } from '../../components/Background/backgroundCatalog';
import type { BackgroundId } from '../../components/Background/backgroundCatalog';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { GLIDER_GUN_ANIMATION, GLIDER_GUN_PATTERN, AND_GATE_ANIMATION } from '../../config/constants';

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
              {activeBackground.id === 'game-of-life' && 
                <div className='gameOfLifeInfo'>
                  <section className='gameOfLifeIntro'>
                    <p>
                      This background was inspired by Conway's game of life that was invented in the 1970's. And in some way tries to simulate life from 1's and 0's
                      in a flat grid. It checks for all 8 neighbors near the target cell, and checks how many of them are alive and does the logic below.
                    </p>
                  </section>

                  <section className='gameOfLifeSection'>
                    <header>
                      <span>01</span>
                      <h2>The mechanics of Conway's Game of Life:</h2>
                    </header>
                    <ol className='gameOfLifeRules'>
                      <li>Any live (white / 1) cell with fewer than two live cell neighbors dies (black / 0). As if from underpopulation.</li>
                      <li>Any live cell with two or three live cell neighbors stay alive. As if from survival.</li>
                      <li>Any live cell with more than three live cell neighbors dies. As if from overpopulation.</li>
                      <li>Any dead cell with EXACTLY three live cell neighbors becomes alive. As if from reporduction.</li>
                    </ol>
                  </section>

                  <section className='gameOfLifeSection gameOfLifeControlsNote'>
                    <p>You can then pause and start the simulation as you wish from the dropdown in the top-right corner, by clicking the pause/play button respectively.
                    You can also alter the speed at which a certain generation of the grid mutates by gliding the slider around.</p>
                  </section>

                  <section className='gameOfLifeSection gameOfLifeExamples'>
                    <header>
                      <span>02</span>
                      <h2>Just for some cool examples, you can make a glider gun like so:</h2>
                    </header>
                    <figure className='gameOfLifeFigure'>
                      <div className='gameOfLifeFigureMedia'>
                        <img src={GLIDER_GUN_PATTERN} alt='The cell pattern for a Gosper glider gun' loading='lazy' />
                      </div>
                      <figcaption>
                        <span>Gosper glider gun pattern</span>
                        <a href='https://commons.wikimedia.org/wiki/File:Game_of_life_glider_gun.svg' target='_blank' rel='noreferrer'>
                          Source: Wikimedia Commons
                        </a>
                      </figcaption>
                    </figure>
                    <p>With this, it can infinitely produce mini gliders that move infinitely across the screen.</p>
                    <figure className='gameOfLifeFigure'>
                      <div className='gameOfLifeFigureMedia'>
                        <img src={GLIDER_GUN_ANIMATION} alt='An animated Gosper glider gun producing gliders' loading='lazy' />
                      </div>
                      <figcaption>
                        <span>Gosper glider gun in motion</span>
                        <a href='https://en.wikipedia.org/wiki/File:Gospers_glider_gun.gif' target='_blank' rel='noreferrer'>
                          Source: Wikimedia Commons
                        </a>
                      </figcaption>
                    </figure>
                    <p>Using these glider guns, we can make logical gates, such as an NOT gate, AND gates, OR gates, and a whole lot more.</p>
                    <figure className='gameOfLifeFigure gameOfLifeFigureAndGate'>
                      <div className='gameOfLifeFigureMedia'>
                        <img src={AND_GATE_ANIMATION} alt='An animated AND gate built in Conway’s Game of Life' loading='lazy' />
                      </div>
                      <figcaption>
                        <span>AND gate built from Game of Life patterns</span>
                        <a href='https://www.alanzucconi.com/2020/10/13/conways-game-of-life/' target='_blank' rel='noreferrer'>
                          Source: Alan Zucconi
                        </a>
                      </figcaption>
                    </figure>
                    <p>
                      Hence, what makes this background so interesting to me is that its Turing complete since you can have moving data streams, an unbounded memory, and also persistent states. So given enough space, you can most likely simulate a basic calculator and more, from just these
                      relatively simple rules.
                    </p>
                  </section>

                  <section className='gameOfLifeSection gameOfLifePersonal'>
                    <header>
                      <span>03</span>
                      <h2>Personal fun facts:</h2>
                    </header>
                    <p>
                      I wanted to implement it not only because it's interesting but also because I solved a Leetcode Problem, namely Problem 289. Game of Life, that does this exact same thing
                      except in constant extra space. I solved it and found it interesting so here it is, but my implementation here isn't constant space since it would constantly lag with only one input array
                      so I made an array buffer instead and utilized Uint8Array's instead because it was faster.
                    </p>
                  </section>
                </div>
              }
              {activeBackground.id === 'none' && 
                <div>Hello I am none</div>
              }
            </div>
          </div>
        </div>,
        document.body,
      )}
    </main>
  );
}

export default Sandbox;
