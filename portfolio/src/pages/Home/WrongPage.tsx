import './WrongPage.css'
import { Link } from 'react-router-dom'

function WrongPage() {
  return (
    <div className="wrong">
      WRONG PAGE
      <Link to="/" className="highlight">BACK</Link>
    </div>
  )
}

export default WrongPage