import './Navbar.css'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar" role="navigation">
      <Link className="navbar__iconLink" to="/" aria-label="Home">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3.5 4 10v10.5h5.5v-6h5v6H20V10l-8-6.5Z" />
        </svg>
      </Link>

      <div className="navbar__links">
        <Link className="navbar__iconLink" to="/profession" aria-label="Profession">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 6V4.75C8 3.78 8.78 3 9.75 3h4.5C15.22 3 16 3.78 16 4.75V6h1.5A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8A2.5 2.5 0 0 1 6.5 6H8Zm1.5 0h5V4.75a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25V6ZM5.5 10v6.5c0 .55.45 1 1 1h11c.55 0 1-.45 1-1V10h-5v1a.75.75 0 0 1-.75.75h-1.5A.75.75 0 0 1 10.5 11v-1h-5Z" />
          </svg>
        </Link>
        <Link className="navbar__iconLink" to="/projects" aria-label="Projects">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 5.75A1.75 1.75 0 0 1 5.75 4h12.5A1.75 1.75 0 0 1 20 5.75v12.5A1.75 1.75 0 0 1 18.25 20H5.75A1.75 1.75 0 0 1 4 18.25V5.75Zm3 1.75v9h10v-9H7Zm1.5 1.5h7v1.5h-7V9Zm0 3h7V13.5h-7V12Z" />
          </svg>
        </Link>
        <Link className="navbar__iconLink" to="/contact" aria-label="Contact">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6.75A1.75 1.75 0 0 1 5.75 5h12.5A1.75 1.75 0 0 1 20 6.75v10.5A1.75 1.75 0 0 1 18.25 19H5.75A1.75 1.75 0 0 1 4 17.25V6.75Zm1.78-.25L12 11.26l6.22-4.76H5.78ZM18.5 8l-6.04 4.62a.75.75 0 0 1-.92 0L5.5 8v9.25c0 .14.11.25.25.25h12.5c.14 0 .25-.11.25-.25V8Z" />
          </svg>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
