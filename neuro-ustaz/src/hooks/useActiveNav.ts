import { useLocation } from 'react-router-dom';

export function useActiveNav() {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return { isActive, pathname: location.pathname };
}
