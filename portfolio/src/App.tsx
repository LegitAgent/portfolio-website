import './App.css';

// components
import Background from './components/Background/Background';
import Navbar from './components/Navbar/Navbar';
import LoadingScreen from './pages/Misc/LoadingScreen';

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

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

interface RoutingLinks {
  url: string;
  redirectElement: React.ReactElement;
}

function App() {
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
    // misc.
    { url: '*', redirectElement: <WrongPage /> },
  ];

  return (
    <BrowserRouter>
      <main className='app-shell'>
        <Background />
        <div className='page-shell'>
          <Navbar />
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {routes.map((route) => {
                return <Route path={route.url} element={route.redirectElement} />;
              })}
            </Routes>
          </Suspense>
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;
