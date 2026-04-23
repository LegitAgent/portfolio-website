import './App.css'
import Loading from './Loading.tsx'
import Hero from './Hero.tsx'
import { useState, useEffect } from 'react'

function App() {
  const introDuration = 4200
  const fadeDuration = 900
  const [isIntroVisible, setIsIntroVisible] = useState(true)
  const [isIntroFading, setIsIntroFading] = useState(false)

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => {
      setIsIntroFading(true)
    }, introDuration)

    const removeIntroTimer = window.setTimeout(() => {
      setIsIntroVisible(false)
    }, introDuration + fadeDuration)

    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(removeIntroTimer)
    }
  }, [fadeDuration, introDuration])

  return (
    <main className="app-shell">
      <div className={`hero-layer ${isIntroFading || !isIntroVisible ? 'hero-layer--visible' : ''}`}>
        <Hero />
      </div>

      {isIntroVisible ? (
        <div className={`intro-layer ${isIntroFading ? 'intro-layer--fade-out' : ''}`}>
          <Loading />
        </div>
      ) : null}
    </main>
  )
}

export default App
