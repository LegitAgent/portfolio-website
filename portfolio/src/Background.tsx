import './Background.css'
import { useEffect } from 'react'

function Background() {
  useEffect(() => {
    const interactiveBubble = document.querySelector<HTMLDivElement>('.interactive')
    if (!interactiveBubble) return

    let curX = 0
    let curY = 0
    let tgX = 0
    let tgY = 0
    let animationFrameId = 0

    const handleMouseMove = (event: MouseEvent) => {
      tgX = event.clientX
      tgY = event.clientY
    }

    const move = () => {
      curX += (tgX - curX) / 10
      curY += (tgY - curY) / 10
      interactiveBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px) translate(-50%, -50%)`
      animationFrameId = window.requestAnimationFrame(move)
    }

    window.addEventListener('mousemove', handleMouseMove)
    move()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="gradient-bg" aria-hidden="true">
      <div className="gradient-glow gradient-glow--one"></div>
      <div className="gradient-glow gradient-glow--two"></div>
      <div className="gradient-glow gradient-glow--three"></div>
      <div className="interactive"></div>
    </div>
  )
}

export default Background
