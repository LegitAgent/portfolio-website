import './App.css'
import Background from './components/Background/Background'
import Navbar from './components/Navbar/Navbar'
import Experience from './pages/Home/Experience.tsx'
import Home from './pages/Home/Home'
import Resume from './pages/Home/Resume.tsx'
import WrongPage from './pages/Home/WrongPage.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'


function App() {

  return (
    <BrowserRouter>
      <main className="app-shell">
        <Background />
        <div className="page-shell">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/projects" element={<Home />} />
            <Route path="/contact" element={<Home />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="*" element={<WrongPage />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  )
}

export default App
