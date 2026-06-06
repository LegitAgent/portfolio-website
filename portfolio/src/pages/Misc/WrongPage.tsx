import './WrongPage.css';
import { useNavigate } from 'react-router-dom';

function WrongPage() {
  const navigate = useNavigate();

  return (
    <div className='wrong'>
      WRONG PAGE
      <button className='highlight' onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

export default WrongPage;
