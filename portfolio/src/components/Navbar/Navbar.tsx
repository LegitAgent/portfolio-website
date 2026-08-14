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
          <svg viewBox='0 0 512 512' aria-hidden='true'>
            <path
              fill='white'
              d="M360.923 302.912H344.595C337.83 302.912 332.346 308.397 332.346 315.161C332.346 321.925 337.83 327.41 344.595 327.41H360.923C367.688 327.41 373.172 321.925 373.172 315.161C373.172 308.397 367.688 302.912 360.923 302.912Z"
            />

            <path
              fill='white'
              d="M499.751 302.912H475.18V275.095C475.18 268.331 469.696 262.846 462.931 262.846H419.035L378.765 231.385L432.948 177.194C439.066 181.523 446.254 183.696 453.445 183.696C462.541 183.696 471.638 180.234 478.562 173.31L489.647 162.225C491.944 159.928 493.235 156.812 493.235 153.564C493.235 150.316 491.944 147.201 489.647 144.903L447.915 103.171C445.618 100.874 442.502 99.583 439.254 99.583C436.004 99.584 432.888 100.876 430.592 103.176L419.523 114.256C407.121 126.658 405.834 146.02 415.634 159.868L359.319 216.19L350.304 209.147C294.783 165.765 217.227 165.765 161.705 209.146L92.956 262.846H49.056C42.291 262.846 36.807 268.331 36.807 275.095V302.912H12.249C5.484 302.912 0 308.397 0 315.161C0 321.925 5.484 327.41 12.249 327.41H36.808V400.168C36.808 406.932 42.292 412.417 49.057 412.417H462.932C469.697 412.417 475.181 406.932 475.181 400.168V327.41H499.752C506.517 327.41 512.001 321.925 512.001 315.161C512.001 308.397 506.516 302.912 499.751 302.912ZM436.847 131.572L439.259 129.157L463.664 153.563L461.24 155.987C456.942 160.285 449.949 160.286 445.65 155.987L436.844 147.168C432.544 142.869 432.544 135.875 436.847 131.572ZM176.783 228.452C223.425 192.011 288.575 192.008 335.218 228.452L379.243 262.847H132.749L176.783 228.452ZM450.682 387.919H61.305V327.41H305.803C312.568 327.41 318.052 321.925 318.052 315.161C318.052 308.397 312.568 302.912 305.803 302.912H61.305V287.344H450.683V302.912H403.39C396.625 302.912 391.141 308.397 391.141 315.161C391.141 321.925 396.625 327.41 403.39 327.41H450.683L450.682 387.919Z"
            />
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
