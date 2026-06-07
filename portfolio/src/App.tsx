import './App.css';

// components
import Background from './components/Background/Background';
import Navbar from './components/Navbar/Navbar';

// home
import Home from './pages/Home/Home';

// professional pages
import SkillsExperience from './pages/Professional/SkillsExperience.tsx';
import Resume from './pages/Professional/Resume.tsx';
import Projects from './pages/Professional/Projects.tsx';
import Certificates from './pages/Professional/Certificates.tsx';

// contacts
import Contacts from './pages/Contacts/Contacts.tsx';

// dynamic
import ProjectArticle from './components/ProjectArticle/ProjectArticle.tsx';
import WorkArticle from './components/WorkArticle/WorkArticle.tsx';

// misc.
import WrongPage from './pages/Misc/WrongPage.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

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
    { url: '/contacts', redirectElement: <Contacts />},
    // dynamic
    { url: '/projects/:slug', redirectElement: <ProjectArticle />},
    { url: '/skills_experience/:slug', redirectElement: <WorkArticle />},
    // misc.
    { url: '*', redirectElement: <WrongPage /> },
  ];

  return (
    <BrowserRouter>
      <main className='app-shell'>
        <Background />
        <div className='page-shell'>
          <Navbar />
          <Routes>
            {routes.map((route) => {
              return <Route path={route.url} element={route.redirectElement} />;
            })}
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;
