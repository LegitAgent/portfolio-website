import './NavDropDown.css';
import { Link, useLocation } from 'react-router-dom';

export interface LinkItem {
  path: string;
  name: string;
}

interface NavDropDownProps {
  itemsArray: LinkItem[];
  dropdownType: string;
  isOpen: boolean;
}

function ProfessionalIcon({ path }: { path: string }) {
  if (path === '/skills_experience') {
    return (
      <svg className="linkImage" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m8.5 7-4 5 4 5" />
        <path d="m15.5 7 4 5-4 5" />
        <path d="m13.5 5-3 14" />
        <circle cx="19" cy="5" r="1.5" />
        <path d="M19 6.5v3" />
      </svg>
    );
  }

  if (path === '/projects') {
    return (
      <svg className="linkImage" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="5" width="17" height="14" rx="2" />
        <path d="M3.5 9h17" />
        <path d="M7 7h.01M10 7h.01" />
        <path d="m9 13-2 2 2 2" />
        <path d="m15 13 2 2-2 2" />
      </svg>
    );
  }

  if (path === '/certificates') {
    return (
      <svg className="linkImage" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3.5h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z" />
        <path d="M8 7h8M8 10h5" />
        <circle cx="15.5" cy="13" r="2.25" />
        <path d="m14.2 14.8-.7 5.7 2-1.4 2 1.4-.7-5.7" />
      </svg>
    );
  }

  return (
    <svg className="linkImage" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3.5h7l4 4v13H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
      <path d="M14 3.5v4h4" />
      <circle cx="10" cy="11" r="2" />
      <path d="M7.5 16c.6-1.4 1.4-2 2.5-2s1.9.6 2.5 2M14 11h2M14 14h2" />
    </svg>
  );
}

export function NavDropDown({ itemsArray, dropdownType, isOpen }: NavDropDownProps) {
  const location = useLocation();

  const isPathActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className={isOpen ? 'box is-open' : 'box'} aria-hidden={!isOpen}>
      <p>{dropdownType}</p>
      {itemsArray.map((item) => {
        return (
          <Link className={isPathActive(item.path) ? 'linkName is-active' : 'linkName'} key={item.name} to={item.path} aria-label={item.name}>
            <ProfessionalIcon path={item.path} />
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}

export default NavDropDown;
