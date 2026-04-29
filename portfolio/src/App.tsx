import './App.css'
import Background from './components/Background/Background'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Resume from './pages/Home/Resume.tsx'
import { HashRouter, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <HashRouter>
      <main className="app-shell">
        <Background />
        <div className="page-shell">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profession" element={<Home />} />
            <Route path="/projects" element={<Home />} />
            <Route path="/contact" element={<Home />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </main>
    </HashRouter>
  )
}

export default App
