import './App.css'
import Background from './Background.tsx'
import Hero from './Hero.tsx'
import Navbar from './Navbar.tsx'

function App() {

  return (
    <main className="app-shell">
      <Background />
      <div className="page-shell">
        <Navbar />
        <Hero />
      </div>
    </main>
  )
}

export default App
