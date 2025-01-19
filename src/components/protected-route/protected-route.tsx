import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { ProtectedRouteProps } from './type';
import { getUser, getUserIsAuth } from '../../services/slices/user-slice';

export const ProtectedRoute = ({
  children,
  GuestRoute = false
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(getUserIsAuth);
  const user = useSelector(getUser);
  const location = useLocation();

  if (!isAuthChecked) return <Preloader />;

  if (GuestRoute && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  if (!GuestRoute && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children || <Outlet />;
};
