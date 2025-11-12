import { type ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext';
import { FullSheetProvider } from './contexts/FullSheetContext';
import { CacheStorageProvider } from './contexts/CacheStorageContext';
import { ToastProvider } from './contexts/ToastContext';
import { AppDataProvider } from './contexts/AppDataContext';
// import { ProtectedRoute } from './components/ProtectedRoute';
// import { PublicRoute } from './components/PublicRoute';
import { FullSheetRenderer } from './components/FullSheet/FullSheetRenderer';
import { ToastRenderer } from './components/Toast/ToastRenderer';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Analysis } from './pages/Analysis';
import { Hospital } from './pages/Hospital';
import { Shopping } from './pages/Shopping';
import { My } from './pages/My';
// import { ProfileEdit } from './pages/ProfileEdit';
// import { Subscription } from './pages/Subscription';
// import { Settings } from './pages/Settings';
// import { CustomerCenter } from './pages/CustomerCenter';
import { Splash } from './pages/Splash';

function App(): ReactElement {
  return (
    <BrowserRouter>
      <FullSheetProvider>
        <CacheStorageProvider>
          <ToastProvider>
            <AppDataProvider>
              <Routes>
                {/* 스플래시 페이지 - 로그인 상태 확인 및 데이터 조회 */}
                <Route path="/" element={<Splash />} />
                
                {/* 로그인 페이지 */}
                <Route path="/login" element={<Login />} />
                
                {/* 하단 네비게이션이 있는 페이지들 */}
                <Route path="/home" element={<Home />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/hospital" element={<Hospital />} />
                <Route path="/shopping" element={<Shopping />} />
                <Route path="/my" element={<My />} />




                {/* 
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />

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

                <Route path="*" element={<Navigate to="/home" replace />} /> 
                */}
              </Routes>
              <FullSheetRenderer />
              <ToastRenderer />
            </AppDataProvider>
          </ToastProvider>
        </CacheStorageProvider>
      </FullSheetProvider>
    </BrowserRouter>
  );
}

export default App;
