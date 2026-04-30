import './App.css'

// components
import Background from './components/Background/Background'
import Navbar from './components/Navbar/Navbar'

// home
import Home from './pages/Home/Home'

// professional pages
import Experience from './pages/Professional/Experience.tsx'
import Resume from './pages/Professional/Resume.tsx'
import Skills from './pages/Professional/Skills.tsx'
import Projects from './pages/Professional/Projects.tsx'
import Certificates from './pages/Professional/Certificates.tsx'

// misc.
import WrongPage from './pages/Misc/WrongPage.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

interface RoutingLinks{
  url: string
  redirectElement: React.ReactElement
}

function App() {
  const routes: Array<RoutingLinks> = [
    // home
    {url: "/", redirectElement: <Home />},
    // professionals
    {url: "/experience", redirectElement: <Experience />},
    {url: "/projects", redirectElement: <Projects />},
    {url: "/certificates", redirectElement: <Certificates />},
    {url: "/resume", redirectElement: <Resume />},
    {url: "/skills", redirectElement: <Skills />},
    // misc.
    {url: "*", redirectElement: <WrongPage />},
  ]

  return (
    <BrowserRouter>
      <main className="app-shell">
        <Background />
        <div className="page-shell">
          <Navbar />
          <Routes>
            {routes.map((route => {
              return(
                <Route path={route.url} element={route.redirectElement} />
              )
            }))}
            {/* <Route path="/" element={<Home />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/projects" element={<Home />} />
            <Route path="/contact" element={<Home />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="*" element={<WrongPage />} /> */}
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  )
}

export default App
