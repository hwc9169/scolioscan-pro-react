import { type ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FullSheetProvider } from './contexts/FullSheetContext';
import { CacheStorageProvider } from './contexts/CacheStorageContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { FullSheetRenderer } from './components/FullSheet/FullSheetRenderer';
import { ToastRenderer } from './components/Toast/ToastRenderer';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Analysis } from './pages/Analysis';
import { Hospital } from './pages/Hospital';
import { Shopping } from './pages/Shopping';
import { My } from './pages/My';
import { ProfileEdit } from './pages/ProfileEdit';
import { Subscription } from './pages/Subscription';
import { Settings } from './pages/Settings';
import { CustomerCenter } from './pages/CustomerCenter';

function App(): ReactElement {
  return (
    <AuthProvider>
      <BrowserRouter>
        <FullSheetProvider>
          <CacheStorageProvider>
            <ToastProvider>
              <Routes>
                {/* 공개 페이지 */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />

                {/* 인증이 필요한 페이지들 */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Navigate to="/home" replace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analysis"
                  element={
                    <ProtectedRoute>
                      <Analysis />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hospital"
                  element={
                    <ProtectedRoute>
                      <Hospital />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shopping"
                  element={
                    <ProtectedRoute>
                      <Shopping />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my"
                  element={
                    <ProtectedRoute>
                      <My />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile-edit"
                  element={
                    <ProtectedRoute>
                      <ProfileEdit />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subscription"
                  element={
                    <ProtectedRoute>
                      <Subscription />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer-center"
                  element={
                    <ProtectedRoute>
                      <CustomerCenter />
                    </ProtectedRoute>
                  }
                />

                {/* 존재하지 않는 경로는 홈으로 리다이렉트 */}
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
              <FullSheetRenderer />
              <ToastRenderer />
            </ToastProvider>
          </CacheStorageProvider>
        </FullSheetProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
