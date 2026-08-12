import './NavDropDown.css';
import { Link, useLocation } from 'react-router-dom';
import { SKILLS, CODE, CERTIFICATE, RESUME_ICON } from '../../config/constants';
import { useEffect, useRef } from 'react';

export interface LinkItem {
  path: string;
  name: string;
}

export interface ActionItem {
  id: string;
  name: string;
  isActive: boolean;
  onSelect: () => void;
}

type NavDropDownItem = LinkItem | ActionItem;

interface NavDropDownProps {
  id: string;
  itemsArray: NavDropDownItem[];
  dropdownType: string;
  isOpen: boolean;
  onNavigate: () => void;
  placement?: 'default' | 'up';
  centerOnMobile?: boolean;
}

function ProfessionalIcon({ path }: { path?: string }) {
  if (!path) {
    return (
      <svg className='linkImage' viewBox='0 0 24 24' aria-hidden='true'>
        <path d='M4 5.5h16v13H4zM8 9h8M8 12h5M8 15h7' />
      </svg>
    );
  }

  if (path === '/skills_experience') {
    return <img className='linkImage' src={SKILLS} alt='skills' aria-hidden='true' />;
  }

  if (path === '/projects') {
    return <img className='linkImage' src={CODE} alt='code' aria-hidden='true' />;
  }

  if (path === '/certificates') {
    return <img className='linkImage' src={CERTIFICATE} alt='certificate' aria-hidden='true' />;
  }

  return <img className='resumeImage' src={RESUME_ICON} alt='resume' aria-hidden='true' />;
}

export function NavDropDown({
  id,
  itemsArray,
  dropdownType,
  isOpen,
  onNavigate,
  placement = 'default',
  centerOnMobile = false
}: NavDropDownProps) {
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!centerOnMobile || !isOpen) {
      return;
    }

    const centerMenu = () => {
      const menu = menuRef.current;
      if (!menu || window.innerWidth > 1150) {
        menu?.style.removeProperty('--mobile-center-offset');
        return;
      }

      const parentRect = menu.parentElement?.getBoundingClientRect();
      const parentCenter = parentRect
        ? parentRect.left + parentRect.width / 2
        : window.innerWidth / 2;
      const offset = window.innerWidth / 2 - parentCenter;
      menu.style.setProperty('--mobile-center-offset', `${offset}px`);
    };

    centerMenu();
    window.addEventListener('resize', centerMenu);
    return () => window.removeEventListener('resize', centerMenu);
  }, [centerOnMobile, isOpen]);

  const isPathActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div
      className={`box${placement === 'up' ? ' box--up' : ''}${centerOnMobile ? ' box--mobile-centered' : ''}${isOpen ? ' is-open' : ''}`}
      id={id}
      inert={!isOpen}
      ref={menuRef}
    >
      <p>{dropdownType}</p>
      {itemsArray.map((item) => {
        if ('onSelect' in item) {
          return (
            <button
              className={item.isActive ? 'linkName is-active' : 'linkName'}
              key={item.id}
              type='button'
              tabIndex={isOpen ? undefined : -1}
              onClick={() => {
                item.onSelect();
                onNavigate();
              }}
            >
              <ProfessionalIcon />
              {item.name}
            </button>
          );
        }

        return (
          <Link
            className={isPathActive(item.path) ? 'linkName is-active' : 'linkName'}
            key={item.name}
            to={item.path}
            aria-label={item.name}
            tabIndex={isOpen ? undefined : -1}
            onClick={onNavigate}
          >
            <ProfessionalIcon path={item.path} />
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}

export default NavDropDown;
