import './Loading.css'
import type { CSSProperties } from 'react'

// TS gets weird about custom CSS vars, so this keeps the inline style object from fighting us.
type BinaryStreamStyle = CSSProperties & {
  '--stream-left': string
  '--stream-duration': string
  '--stream-delay': string
  '--intro-delay': string
  '--stream-opacity': number
  '--stream-size': string
  '--stream-blur': string
}

type BinaryStream = {
  text: string
  head: string
  left: number
  duration: number
  delay: number
  opacity: number
  size: number
  blur: number
}

const randomInRange = (min: number, max: number) => (
  Math.random() * (max - min) + min
)

const createBinaryText = (length = 36) => (
  Array.from({ length }, () => Math.round(Math.random())).join('\n')
)

// build the rain once on load so it doesn't reshuffle every render and look broken
const binaryStreams: BinaryStream[] = Array.from({ length: 100 }, (_, index) => {
  const baseLeft = (index / 99) * 100
  const jitteredLeft = baseLeft + randomInRange(-1.1, 1.1)

  return {
    text: createBinaryText(randomInRange(34, 68)),
    head: `${Math.round(Math.random())}`,
    left: Math.min(98, Math.max(0, jitteredLeft)),
    duration: randomInRange(4.2, 8.8),
    delay: randomInRange(0, 5),
    opacity: randomInRange(0.16, 0.42),
    size: randomInRange(0.88, 1.22),
    blur: randomInRange(0, 0.9),
  }
})

export const Loading = () => {
  return (
    <main className="binary-cover">
      {/* purely visual, so screen readers can ignore the matrix rain */}
      <div className="binary-grid" aria-hidden="true">
        {binaryStreams.map((stream, index) => (
          <span
            className="binary-column"
            key={`${stream.text}-${index}`}
            style={{
              '--stream-left': `${stream.left}%`,
              '--stream-duration': `${stream.duration}s`,
              '--stream-delay': `${stream.delay}s`,
              '--intro-delay': `${stream.delay * 0.12}s`,
              '--stream-opacity': stream.opacity,
              '--stream-size': `${stream.size}`,
              '--stream-blur': `${stream.blur}px`,
            } as BinaryStreamStyle}
          >
            <span className="binary-column__trail">{stream.text}</span>
            <span className="binary-column__head">{stream.head}</span>
          </span>
        ))}
      </div>

      {/* just atmosphere layers so the screen doesn't feel totally flat */}
      <div className="binary-glow" aria-hidden="true" />
      <div className="binary-scanline" aria-hidden="true" />

      <section className="terminal-shell relative z-4 grid min-h-dvh place-items-center px-6 py-16 sm:px-10">
        <div className="terminal-stack grid w-full max-w-4xl justify-items-center gap-6 text-center">
          <p className="glitch-subtitle mb-5 font-mono text-[clamp(0.7rem,1.8vw,0.95rem)] font-bold uppercase tracking-[0.2em] text-[#8fbc8f]/80 sm:tracking-[0.28em]">
            ALBA@PORTFOLIO:~$
          </p>
          {/* data-text feeds the fake duplicate layers in css for the glitch slices */}
          <h1 className="glitch-title text-[clamp(3rem,10vw,8rem)]" data-text="Loading Portfolio">
            Loading Portfolio
          </h1>

          <div className="terminal-sequence" aria-label="Loading sequence">
            <p className="terminal-line terminal-line--1">
              <span className="terminal-prompt">&gt;</span>
              init portfolio runtime
            </p>
            <p className="terminal-line terminal-line--2">
              <span className="terminal-prompt">&gt;</span>
              setting up interface modules
            </p>
            <p className="terminal-line terminal-line--3">
              <span className="terminal-prompt">&gt;</span>
              loading hero section
            </p>
            <p className="terminal-line terminal-line--4">
              <span className="terminal-prompt">&gt;</span>
              ready
              <span className="terminal-caret" aria-hidden="true" />
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Loading
