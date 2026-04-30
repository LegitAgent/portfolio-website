import './NavDropDown.css';
import { Link } from 'react-router-dom';

export interface LinkItem {
  path: string;
  name: string;
  img_path: string;
}

interface NavDropDownProps {
  itemsArray: LinkItem[];
  dropdownType: string;
}

export function NavDropDown({ itemsArray, dropdownType }: NavDropDownProps) {
  return (
    <div className="box">
      <p>{dropdownType}</p>
      {itemsArray.map((item) => {
        return (
          <Link className="linkName" to={item.path} aria-label={item.name}>
            <img src={item.img_path} className="linkImage" />
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}

export default NavDropDown;
