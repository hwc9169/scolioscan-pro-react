import { type ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FullSheetProvider } from './contexts/FullSheetContext';
import { CacheStorageProvider } from './contexts/CacheStorageContext';
import { ToastProvider } from './contexts/ToastContext';
import { FullSheetRenderer } from './components/FullSheet/FullSheetRenderer';
import { ToastRenderer } from './components/Toast/ToastRenderer';
import { Splash } from './pages/Splash';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Analysis } from './pages/Analysis';
import { Hospital } from './pages/Hospital';
import { Shopping } from './pages/Shopping';
import { My } from './pages/My';

function App(): ReactElement {
  return (
    <BrowserRouter>
      <FullSheetProvider>
        <CacheStorageProvider>
          <ToastProvider>
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
            
            {/* 존재하지 않는 경로는 홈으로 리다이렉트 */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <FullSheetRenderer />
            <ToastRenderer />
          </ToastProvider>
        </CacheStorageProvider>
      </FullSheetProvider>
    </BrowserRouter>
  );
}

export default App;
