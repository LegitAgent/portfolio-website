import './NavDropDown.css';
import { Link, useLocation } from 'react-router-dom';
import { SKILLS, CODE, CERTIFICATE, RESUME_ICON } from '../../config/constants';

export interface LinkItem {
  path: string;
  name: string;
}

interface NavDropDownProps {
  id: string;
  itemsArray: LinkItem[];
  dropdownType: string;
  isOpen: boolean;
  onNavigate: () => void;
}

function ProfessionalIcon({ path }: { path: string }) {
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

export function NavDropDown({ id, itemsArray, dropdownType, isOpen, onNavigate }: NavDropDownProps) {
  const location = useLocation();

  const isPathActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className={isOpen ? 'box is-open' : 'box'} id={id} aria-hidden={!isOpen} inert={!isOpen}>
      <p>{dropdownType}</p>
      {itemsArray.map((item) => {
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
