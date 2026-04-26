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
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className="gradients-container">
        <div className="g1"></div>
        <div className="g2"></div>
        <div className="g3"></div>
        <div className="g4"></div>
        <div className="g5"></div> 
        <div className="interactive"></div>
      </div>
    </div>
  )
}

export default Background