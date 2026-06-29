import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { NavDropDown } from '../NavDropDown/NavDropDown.tsx';
// type keyword needed since ts technically is still js and type checking disappears (import types with type keyword)
import type { LinkItem } from '../NavDropDown/NavDropDown.tsx';
import { useEffect, useState } from 'react';

type ThemeMode = 'dark' | 'light';

function getInitialTheme(): ThemeMode {
  const savedTheme = window.localStorage.getItem('portfolio-theme');
  return savedTheme === 'light' ? 'light' : 'dark';
}

function Navbar() {
  const [showProfessionalDropdown, setProfessionalDropdown] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    window.localStorage.setItem('portfolio-theme', themeMode);
  }, [themeMode]);

  const ProfessionalLinks: LinkItem[] = [
    { path: '/skills_experience', name: 'Skills & Experience' },
    { path: '/projects', name: 'Projects' },
    { path: '/certificates', name: 'Certificates' },
    { path: '/resume', name: 'Resume' },
  ];

  const isPathActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const isProfessionalActive = ProfessionalLinks.some((link) => isPathActive(link.path));
  const isLightMode = themeMode === 'light';

  return (
    <nav className='navbar' role='navigation'>
      <Link className={location.pathname === '/' ? 'navbar__iconLink is-active' : 'navbar__iconLink'} to='/' aria-label='Home'>
        <svg viewBox='0 0 24 24' aria-hidden='true'>
          <path d='M12 3.5 4 10v10.5h5.5v-6h5v6H20V10l-8-6.5Z' />
        </svg>
      </Link>

      <div className='navbar__links'>
        {/* onclick does NOT render anything, just executes, so no rendering, so use usestate instead */}
        <div className='navbar__item'>
          <button
            className={showProfessionalDropdown || isProfessionalActive ? 'navbar__iconLink focus-anim is-active' : 'navbar__iconLink'}
            onClick={() => setProfessionalDropdown(!showProfessionalDropdown)}
          >
            <svg viewBox='0 0 24 24' aria-hidden='true'>
              <path d='M8 6V4.75C8 3.78 8.78 3 9.75 3h4.5C15.22 3 16 3.78 16 4.75V6h1.5A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8A2.5 2.5 0 0 1 6.5 6H8Zm1.5 0h5V4.75a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25V6ZM5.5 10v6.5c0 .55.45 1 1 1h11c.55 0 1-.45 1-1V10h-5v1a.75.75 0 0 1-.75.75h-1.5A.75.75 0 0 1 10.5 11v-1h-5Z' />
            </svg>
          </button>
          {/* note that for props you can only pass one instance through the component file itself */}
          <NavDropDown itemsArray={ProfessionalLinks} dropdownType='Professional' isOpen={showProfessionalDropdown} />
        </div>
        <Link className={isPathActive('/stats') ? 'navbar__iconLink is-active' : 'navbar__iconLink'} to='/stats' aria-label='Statistics'>
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <path d='M5.25 19.5A1.25 1.25 0 0 1 4 18.25v-5.5a1.25 1.25 0 0 1 2.5 0v5.5c0 .69-.56 1.25-1.25 1.25Zm6.75 0a1.25 1.25 0 0 1-1.25-1.25V8.75a1.25 1.25 0 0 1 2.5 0v9.5A1.25 1.25 0 0 1 12 19.5Zm6.75 0a1.25 1.25 0 0 1-1.25-1.25V4.75a1.25 1.25 0 0 1 2.5 0v13.5a1.25 1.25 0 0 1-1.25 1.25Z' />
          </svg>
        </Link>
        <Link className={isPathActive('/contacts') ? 'navbar__iconLink is-active' : 'navbar__iconLink'} to='/contacts' aria-label='Contact'>
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <path d='M4 6.75A1.75 1.75 0 0 1 5.75 5h12.5A1.75 1.75 0 0 1 20 6.75v10.5A1.75 1.75 0 0 1 18.25 19H5.75A1.75 1.75 0 0 1 4 17.25V6.75Zm1.78-.25L12 11.26l6.22-4.76H5.78ZM18.5 8l-6.04 4.62a.75.75 0 0 1-.92 0L5.5 8v9.25c0 .14.11.25.25.25h12.5c.14 0 .25-.11.25-.25V8Z' />
          </svg>
        </Link>
      </div>
      <button
        className={isLightMode ? 'navbar__iconLink navbar__themeToggle is-light' : 'navbar__iconLink navbar__themeToggle'}
        type='button'
        aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
        aria-pressed={isLightMode}
        onClick={() => setThemeMode(isLightMode ? 'dark' : 'light')}
      >
        {isLightMode ? (
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <path d='M12 3.25a.75.75 0 0 1 .75.75v1.25a.75.75 0 0 1-1.5 0V4a.75.75 0 0 1 .75-.75Zm0 15.5a.75.75 0 0 1 .75.75V20a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 1 .75-.75ZM20.75 12a.75.75 0 0 1-.75.75h-1.25a.75.75 0 0 1 0-1.5H20a.75.75 0 0 1 .75.75ZM5.25 12a.75.75 0 0 1-.75.75H4a.75.75 0 0 1 0-1.5h.5a.75.75 0 0 1 .75.75Zm12.43-6.74a.75.75 0 0 1 0 1.06l-.88.88a.75.75 0 0 1-1.06-1.06l.88-.88a.75.75 0 0 1 1.06 0ZM7.2 16.8a.75.75 0 0 1 0 1.06l-.88.88a.75.75 0 0 1-1.06-1.06l.88-.88a.75.75 0 0 1 1.06 0Zm10.48 1.94a.75.75 0 0 1-1.06 0l-.88-.88a.75.75 0 1 1 1.06-1.06l.88.88a.75.75 0 0 1 0 1.06ZM7.2 7.2a.75.75 0 0 1-1.06 0l-.88-.88a.75.75 0 0 1 1.06-1.06l.88.88a.75.75 0 0 1 0 1.06ZM12 7.25A4.75 4.75 0 1 1 12 16.75 4.75 4.75 0 0 1 12 7.25Z' />
          </svg>
        ) : (
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <path d='M19.35 14.78a.75.75 0 0 1 .82.94A8.75 8.75 0 1 1 8.29 3.84a.75.75 0 0 1 .94.82 7.25 7.25 0 0 0 10.12 10.12ZM5.25 12A6.75 6.75 0 0 0 18.3 14.4 8.75 8.75 0 0 1 9.6 5.7 6.75 6.75 0 0 0 5.25 12Z' />
          </svg>
        )}
      </button>
    </nav>
  );
}

export default Navbar;
