import './Sandbox.css';
import { INFO_ICON } from '../../config/constants';
import { BACKGROUNDS } from '../../components/Background/backgroundCatalog';
import type { BackgroundId } from '../../components/Background/backgroundCatalog';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { GLIDER_GUN_ANIMATION, GLIDER_GUN_PATTERN, AND_GATE_ANIMATION } from '../../config/constants';
import { CF_CONNECT } from '../../config/constants';

// Replace these two values with the final Cloudflare Connect reference media.
const SPRAY_PAINT_REFERENCE_URL = 'https://www.cloudflare.com/connect/';

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
            data-background={selectedBackground}
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
                    <p>With this, it can continuously produce mini gliders that move across the screen.</p>
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
                      Hence, what makes this background so interesting to me is that its Turing complete since you can have moving data streams, an unbounded memory, and also persistent states. So given enough space, you can simulate a basic calculator, and even itself just from these
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
                      except in constant extra space. I solved it and found it interesting so here it is, but my implementation here isn't constant space. I use two Uint8Array buffers backed by
                      ArrayBuffers, one for the current generation and one for the next, so reads and writes stay separate without encoding transitional states in a single grid.
                    </p>
                  </section>
                </div>
              }

              {activeBackground.id === 'spray-paint' &&
                <div className='sprayPaintInfo'>
                  <svg className='sprayPaintDoodles' viewBox='0 0 900 1200' aria-hidden='true'>
                    <path className='sprayDoodle sprayDoodle--blue' d='M50 150c60-72 127 70 196-8s126 42 188-20' />
                    <path className='sprayDoodle sprayDoodle--orange' d='m745 82 14 29 32 5-23 22 6 31-29-15-28 15 5-32-23-22 32-4Z' />
                    <path className='sprayDoodle sprayDoodle--blue' d='M752 404c-84 6-109 65-76 112 28 40 98 20 91-30-6-41-64-46-81-7' />
                    <path className='sprayDoodle sprayDoodle--white' d='M88 769c48-56 111-57 159-2m-125 27c25 23 58 24 84 0M110 738h2m92 0h2' />
                    <path className='sprayDoodle sprayDoodle--orange' d='M687 996c34-63 83-101 146-112m-35-17 35 17-12 36' />
                  </svg>
                  <div className='sprayPaintMist sprayPaintMist--one' aria-hidden='true' />
                  <div className='sprayPaintMist sprayPaintMist--two' aria-hidden='true' />

                  <section className='sprayPaintIntro'>
                    <span className='sprayPaintKicker'>01 / THE REFERENCE</span>
                    <h2>From a spray can on the web.</h2>
                    <p>
                      This background was inspired by the website over at Cloudflare Connect event. I initially wanted to go to the event, but it was not feasible, especially including the fact that I had school.
                      And so the next best thing I saw was their spray can interactive background and hoped to implement myself, and so I did.
                      The only difference is that the Cloudflare Connects spray can background appeared to blend with and affect other elements, while mine does not.
                    </p>

                    <figure className='sprayPaintReference'>
                      <a href={SPRAY_PAINT_REFERENCE_URL} target='_blank' rel='noreferrer'>
                        <img src={CF_CONNECT} alt='Cloudflare Connect spray paint reference' loading='lazy' />
                      </a>
                      <figcaption>
                        <a href={SPRAY_PAINT_REFERENCE_URL} target='_blank' rel='noreferrer'>Cloudflare Connect <span aria-hidden='true'>↗</span></a>
                      </figcaption>
                    </figure>
                  </section>

                  <section className='sprayPaintSection sprayPaintMechanics'>
                    <header>
                      <span>02</span>
                      <div>
                        <p>UNDER THE PAINT</p>
                        <h2>A grid that only watches active cells.</h2>
                      </div>
                    </header>
                    <div className='sprayPaintCopyColumns'>
                      <p>
                        I did it by dividing the background into grids, similar to the Game of Life background. The only difference is now each cell stores
                        the timestamp of when it was painted in a Float64Array, which is used to calculate when it should fade.
                      </p>
                      <p>
                        But then I also thought that if I had a huge screen, and a lot of unanimated cells, wouldn't it be better to only animate the
                        cells that are active. So I also implemented a Set where it contains the cell index of every cell that needs to be animated, so instead of scanning the
                        entire background, it only iterates over active cells that need to be animated in the Set.
                      </p>
                    </div>
                    <div className='sprayPaintDataStrip' aria-label='Core implementation pieces'>
                      <span>Float64Array <i>paint time</i></span>
                      <span>Set&lt;number&gt; <i>active cells</i></span>
                    </div>
                  </section>

                  <section className='sprayPaintSection sprayPaintInteraction'>
                    <span className='sprayPaintKicker'>03 / THE INTERACTION</span>
                    <p>So how the dissapating effect works is that wee recalculate each cells alpha value every animation frame via requestAnimationFrame function.</p>
                    <p>The feature also has text detection, so if your cursor is over a block of text, you can still select the text as you would, rather than spray painting the background.</p>
                  </section>

                  <section className='sprayPaintSection sprayPaintPersonal'>
                    <span className='sprayPaintTag'>Personal fun facts:</span>
                    <p>
                      Another reason why I made it is because I always doodled as a kid with some of the most random things,
                      and so implementing a sort of drawing tool into my own portfolio website
                      makes me relive drawing the wildest and most random stuff I've created when I was a kid. Also, it's just interesting to interact with the Canvas API.
                    </p>
                    <svg viewBox='0 0 180 72' aria-hidden='true'>
                      <path d='M8 50c21-47 41 20 65-17 18-27 35 26 56-3 11-15 24-13 43-2' />
                    </svg>
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
