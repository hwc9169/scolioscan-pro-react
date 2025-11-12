// import { type ReactElement } from 'react';
// import { Navigate } from 'react-router-dom';
// // import { useAuth } from '../contexts/AuthContext';

// interface ProtectedRouteProps {
//   children: ReactElement;
// }

// /**
//  * 인증이 필요한 페이지를 보호하는 컴포넌트
//  * 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
//  */
// export function ProtectedRoute({ children }: ProtectedRouteProps): ReactElement {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-gray-700 text-lg">로딩 중...</div>
//         </div>
//       </div>
//     );
//   }

//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// }

