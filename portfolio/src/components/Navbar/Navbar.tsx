import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { NavDropDown } from '../NavDropDown/NavDropDown.tsx';
// type keyword needed since ts technically is still js and type checking disappears (import types with type keyword)
import type { ActionItem, LinkItem } from '../NavDropDown/NavDropDown.tsx';
import { BACKGROUNDS } from '../Background/backgroundCatalog.ts';
import type { BackgroundId } from '../Background/backgroundCatalog.ts';
import { useCallback, useEffect, useRef, useState } from 'react';

interface NavbarProps {
  isCollapsed: boolean;
  onCollapsedChange: (isCollapsed: boolean) => void;
  selectedBackground: BackgroundId;
  onBackgroundChange: (background: BackgroundId) => void;
}

function Navbar({ isCollapsed, onCollapsedChange, selectedBackground, onBackgroundChange }: NavbarProps) {
  const [showProfessionalDropdown, setProfessionalDropdown] = useState(false);
  const [showBackgroundDropdown, setBackgroundDropdown] = useState(false);
  const location = useLocation();
  const professionalMenuRef = useRef<HTMLDivElement>(null);
  const professionalButtonRef = useRef<HTMLButtonElement>(null);
  const backgroundMenuRef = useRef<HTMLDivElement>(null);
  const backgroundButtonRef = useRef<HTMLButtonElement>(null);
  const collapseButtonRef = useRef<HTMLButtonElement>(null);
  const revealButtonRef = useRef<HTMLButtonElement>(null);
  const professionalMenuId = 'professional-navigation-menu';
  const backgroundMenuId = 'background-navigation-menu';

  const closeProfessionalDropdown = useCallback(() => {
    const focusedElement = document.activeElement;

    if (
      focusedElement instanceof HTMLElement
      && focusedElement !== professionalButtonRef.current
      && professionalMenuRef.current?.contains(focusedElement)
    ) {
      professionalButtonRef.current?.focus();
    }

    setProfessionalDropdown(false);
  }, []);

  const closeBackgroundDropdown = useCallback(() => {
    const focusedElement = document.activeElement;

    if (
      focusedElement instanceof HTMLElement
      && focusedElement !== backgroundButtonRef.current
      && backgroundMenuRef.current?.contains(focusedElement)
    ) {
      backgroundButtonRef.current?.focus();
    }

    setBackgroundDropdown(false);
  }, []);

  useEffect(() => {
    const closeFrame = window.requestAnimationFrame(() => {
      closeProfessionalDropdown();
      closeBackgroundDropdown();
    });
    return () => window.cancelAnimationFrame(closeFrame);
  }, [closeBackgroundDropdown, closeProfessionalDropdown, location.pathname]);

  useEffect(() => {
    if (!showProfessionalDropdown && !showBackgroundDropdown) {
      return;
    }

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!professionalMenuRef.current?.contains(event.target as Node)) {
        closeProfessionalDropdown();
      }

      if (!backgroundMenuRef.current?.contains(event.target as Node)) {
        closeBackgroundDropdown();
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      event.preventDefault();
      if (showBackgroundDropdown) {
        closeBackgroundDropdown();
      } else {
        closeProfessionalDropdown();
      }
    };

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [closeBackgroundDropdown, closeProfessionalDropdown, showBackgroundDropdown, showProfessionalDropdown]);

  const ProfessionalLinks: LinkItem[] = [
    { path: '/skills_experience', name: 'Skills & Experience' },
    { path: '/projects', name: 'Projects' },
    { path: '/certificates', name: 'Certificates' },
    { path: '/resume', name: 'Resume' },
  ];
  const BackgroundItems: ActionItem[] = BACKGROUNDS.map(({ id, label }) => ({
    id,
    name: label,
    isActive: selectedBackground === id,
    onSelect: () => onBackgroundChange(id)
  }));

  const isPathActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const isProfessionalActive = ProfessionalLinks.some((link) => isPathActive(link.path));

  const hideNavbar = () => {
    closeProfessionalDropdown();
    closeBackgroundDropdown();
    onCollapsedChange(true);
    window.requestAnimationFrame(() => revealButtonRef.current?.focus());
  };

  const showNavbar = () => {
    onCollapsedChange(false);
    window.requestAnimationFrame(() => collapseButtonRef.current?.focus());
  };

  return (
    <>
      <nav
        className={isCollapsed ? 'navbar is-collapsed' : 'navbar'}
        id='primary-navigation'
        aria-label='Primary navigation'
        inert={isCollapsed}
      >
        <Link className={location.pathname === '/' ? 'navbar__iconLink is-active' : 'navbar__iconLink'} to='/' aria-label='Home' data-tooltip='Home'>
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <path d='M12 3.5 4 10v10.5h5.5v-6h5v6H20V10l-8-6.5Z' />
          </svg>
        </Link>

        <div className='navbar__links'>
        {/* onclick does NOT render anything, just executes, so no rendering, so use usestate instead */}
        <div className='navbar__item' ref={professionalMenuRef}>
          <button
            className={showProfessionalDropdown || isProfessionalActive ? 'navbar__iconLink focus-anim is-active' : 'navbar__iconLink'}
            type='button'
            aria-label='Professional pages'
            data-tooltip='Professional'
            aria-expanded={showProfessionalDropdown}
            aria-controls={professionalMenuId}
            onClick={() => {
              closeBackgroundDropdown();
              setProfessionalDropdown((isOpen) => !isOpen);
            }}
            ref={professionalButtonRef}
          >
            <svg viewBox='0 0 24 24' aria-hidden='true'>
              <path d='M8 6V4.75C8 3.78 8.78 3 9.75 3h4.5C15.22 3 16 3.78 16 4.75V6h1.5A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8A2.5 2.5 0 0 1 6.5 6H8Zm1.5 0h5V4.75a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25V6ZM5.5 10v6.5c0 .55.45 1 1 1h11c.55 0 1-.45 1-1V10h-5v1a.75.75 0 0 1-.75.75h-1.5A.75.75 0 0 1 10.5 11v-1h-5Z' />
            </svg>
          </button>
          <NavDropDown
            id={professionalMenuId}
            itemsArray={ProfessionalLinks}
            dropdownType='Professional'
            isOpen={showProfessionalDropdown}
            onNavigate={closeProfessionalDropdown}
            centerOnMobile
          />
        </div>
        <Link className={isPathActive('/stats') ? 'navbar__iconLink is-active' : 'navbar__iconLink'} to='/stats' aria-label='Statistics' data-tooltip='Statistics'>
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <path d='M5.25 19.5A1.25 1.25 0 0 1 4 18.25v-5.5a1.25 1.25 0 0 1 2.5 0v5.5c0 .69-.56 1.25-1.25 1.25Zm6.75 0a1.25 1.25 0 0 1-1.25-1.25V8.75a1.25 1.25 0 0 1 2.5 0v9.5A1.25 1.25 0 0 1 12 19.5Zm6.75 0a1.25 1.25 0 0 1-1.25-1.25V4.75a1.25 1.25 0 0 1 2.5 0v13.5a1.25 1.25 0 0 1-1.25 1.25Z' />
          </svg>
        </Link>
        <Link className={isPathActive('/contacts') ? 'navbar__iconLink is-active' : 'navbar__iconLink'} to='/contacts' aria-label='Contact' data-tooltip='Contact'>
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <path d='M4 6.75A1.75 1.75 0 0 1 5.75 5h12.5A1.75 1.75 0 0 1 20 6.75v10.5A1.75 1.75 0 0 1 18.25 19H5.75A1.75 1.75 0 0 1 4 17.25V6.75Zm1.78-.25L12 11.26l6.22-4.76H5.78ZM18.5 8l-6.04 4.62a.75.75 0 0 1-.92 0L5.5 8v9.25c0 .14.11.25.25.25h12.5c.14 0 .25-.11.25-.25V8Z' />
          </svg>
        </Link>
        </div>
        <div className='navbar__bottomLinks'>
          <Link className={isPathActive('/sandbox') ? 'navbar__iconLink is-active' : 'navbar__iconLink'} to='/sandbox' aria-label='Sandbox' data-tooltip='Sandbox'>
            <svg viewBox='0 0 24 24' aria-hidden='true'>
              <path d='M4 7.5 12 4l8 3.5v9L12 20l-8-3.5v-9Zm8-1.86L6.1 8.22 12 10.8l5.9-2.58L12 5.64Zm-6.5 3.72v6.16l5.75 2.52v-6.16L5.5 9.36Zm7.25 8.68 5.75-2.52V9.36l-5.75 2.52v6.16Z' />
            </svg>
          </Link>
          <div className='navbar__item' ref={backgroundMenuRef}>
            <button
              className={showBackgroundDropdown ? 'navbar__iconLink focus-anim is-active' : 'navbar__iconLink'}
              type='button'
              aria-label='Choose background'
              data-tooltip='Background'
              aria-expanded={showBackgroundDropdown}
              aria-controls={backgroundMenuId}
              onClick={() => {
                closeProfessionalDropdown();
                setBackgroundDropdown((isOpen) => !isOpen);
              }}
              ref={backgroundButtonRef}
            >
              <svg viewBox='0 0 24 24' aria-hidden='true'>
                <path d='M4 5.5h16v13H4v-13Zm1.5 1.5v10h13V7h-13Zm2 7 2.4-2.8 1.9 2.1 2.8-3.3 2.4 4H7.5Z' />
              </svg>
            </button>
            <NavDropDown
              id={backgroundMenuId}
              itemsArray={BackgroundItems}
              dropdownType='Background'
              isOpen={showBackgroundDropdown}
              onNavigate={closeBackgroundDropdown}
              placement='up'
            />
          </div>
        </div>
        <button
          className='navbar__collapseButton'
          type='button'
          aria-label='Hide navigation'
          data-tooltip='Hide navigation'
          aria-controls='primary-navigation'
          onClick={hideNavbar}
          ref={collapseButtonRef}
        >
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <path d='m14.5 6-6 6 6 6' />
          </svg>
        </button>
      </nav>
      <button
        className={isCollapsed ? 'navbar__revealButton is-visible' : 'navbar__revealButton'}
        type='button'
        aria-label='Show navigation'
        data-tooltip='Show navigation'
        aria-controls='primary-navigation'
        aria-expanded={!isCollapsed}
        tabIndex={isCollapsed ? 0 : -1}
        onClick={showNavbar}
        ref={revealButtonRef}
      >
        <svg viewBox='0 0 24 24' aria-hidden='true'>
          <path d='m9.5 6 6 6-6 6' />
        </svg>
      </button>
    </>
  );
}

export default Navbar;
