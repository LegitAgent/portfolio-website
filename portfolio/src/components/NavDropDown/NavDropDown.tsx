import './NavDropDown.css';
import { Link, useLocation } from 'react-router-dom';

export interface LinkItem {
  path: string;
  name: string;
  img_path: string;
}

interface NavDropDownProps {
  itemsArray: LinkItem[];
  dropdownType: string;
  isOpen: boolean;
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
            <img src={item.img_path} className="linkImage" />
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}

export default NavDropDown;
