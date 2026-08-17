import './App.css';

// components
import Background from './components/Background/Background';
import { isBackgroundId } from './components/Background/backgroundCatalog';
import type { BackgroundId } from './components/Background/backgroundCatalog';
import Navbar from './components/Navbar/Navbar';
import LoadingScreen from './pages/Misc/LoadingScreen';
import Sandbox from './pages/Misc/Sandbox';

// home
import Home from './pages/Home/Home';

// professional pages
const SkillsExperience = lazy(() => import('./pages/Professional/SkillsExperience'));
const Resume = lazy(() => import('./pages/Professional/Resume'));
const Projects = lazy(() => import('./pages/Professional/Projects'));
const Certificates = lazy(() => import('./pages/Professional/Certificates'));

// contacts
const Contacts = lazy(() => import('./pages/Contacts/Contacts'));

// dev stats
const Stats = lazy(() => import('./pages/Stats/Stats'));

// dynamic
const ProjectArticle = lazy(() => import('./components/ProjectArticle/ProjectArticle'));
const WorkArticle = lazy(() => import('./components/WorkArticle/WorkArticle'));

// misc.
const WrongPage = lazy(() => import('./pages/Misc/WrongPage'));

import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useLayoutEffect, useState } from 'react';

const BACKGROUND_STORAGE_KEY = 'portfolio:selected-background';

function getInitialBackground(): BackgroundId {
  try {
    const savedBackground = window.localStorage.getItem(BACKGROUND_STORAGE_KEY);
    return isBackgroundId(savedBackground) ? savedBackground : 'game-of-life';
  } catch {
    return 'game-of-life';
  }
}

interface RoutingLinks {
  url: string;
  redirectElement: React.ReactElement;
}

function RouteScrollReset() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function App() {
  const [isNavbarCollapsed, setNavbarCollapsed] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundId>(getInitialBackground);

  useEffect(() => {
    try {
      window.localStorage.setItem(BACKGROUND_STORAGE_KEY, selectedBackground);
    } catch {
      // Keep the in-memory selection working when browser storage is unavailable.
    }
  }, [selectedBackground]);

  const routes: Array<RoutingLinks> = [
    // home
    { url: '/', redirectElement: <Home /> },
    // professionals
    { url: '/skills_experience', redirectElement: <SkillsExperience /> },
    { url: '/projects', redirectElement: <Projects /> },
    { url: '/certificates', redirectElement: <Certificates /> },
    { url: '/resume', redirectElement: <Resume /> },
    // contacts
    { url: '/contacts', redirectElement: <Contacts /> },
    // dev stats
    { url: '/stats', redirectElement: <Stats /> },
    // dynamic
    { url: '/projects/:slug', redirectElement: <ProjectArticle /> },
    { url: '/skills_experience/:slug', redirectElement: <WorkArticle /> },
    // sandbox
    { url: '/sandbox', redirectElement: <Sandbox selectedBackground={selectedBackground} />},
    // misc.
    { url: '*', redirectElement: <WrongPage /> },
  ];

  return (
    <BrowserRouter>
      <RouteScrollReset />
      <main className='app-shell'>
        <Background selectedBackground={selectedBackground} />
        <div className={isNavbarCollapsed ? 'page-shell is-navbar-collapsed' : 'page-shell'}>
          <Navbar
            isCollapsed={isNavbarCollapsed}
            onCollapsedChange={setNavbarCollapsed}
            selectedBackground={selectedBackground}
            onBackgroundChange={setSelectedBackground}
          />
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {routes.map((route) => {
                return <Route path={route.url} element={route.redirectElement} key={route.url} />;
              })}
            </Routes>
          </Suspense>
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;
