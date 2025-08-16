import { useAuthStore } from '@/store/authStore';
import { Auth } from '@/pages/Auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Auth />;
  }
  
  return <>{children}</>;
};