import { type ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PublicRouteProps {
  children: ReactElement;
}

/**
 * 공개 페이지 컴포넌트
 * 이미 로그인한 사용자는 홈 페이지로 리다이렉트
 */
export function PublicRoute({ children }: PublicRouteProps): ReactElement {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-700 text-lg">로딩 중...</div>
        </div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/home" replace />;
}

