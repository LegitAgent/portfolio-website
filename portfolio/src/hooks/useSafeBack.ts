import { useNavigate, useLocation } from 'react-router-dom';

export const useSafeBack = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBackSafely = () => {
    if (location.state?.openedFromApp) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return goBackSafely;
};
