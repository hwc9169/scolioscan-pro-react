import { type ReactElement, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoginUserInfo } from '../utils/loginSession';
import { getCookie } from '../utils/common';

/**
 * 스플래시 페이지
 * - 로그인 상태 확인
 * - 데이터 미리 조회
 * - 로그인 안된 경우 로그인 페이지로 이동
 * - 로그인된 경우 홈 페이지로 이동
 */
export function Splash(): ReactElement {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        // Access Token이 있는지 확인
        const accessToken = getCookie('userAccessToken');
        
        if (!accessToken) {
          // 토큰이 없으면 로그인 페이지로
          navigate('/login', { replace: true });
          return;
        }

        // 로그인 상태 확인만 수행 (데이터는 AppDataContext가 자동으로 로드함)
        const isAuthenticated = await getLoginUserInfo();
        
        if (isAuthenticated) {
          // AppDataContext의 useEffect가 이미 refreshAllData()를 호출하므로
          // 여기서는 호출하지 않음 (중복 호출 방지)
          
          // 홈 페이지로 이동
          navigate('/home', { replace: true });
        } else {
          // 인증 실패 시 로그인 페이지로
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('스플래시 페이지 오류:', error);
        navigate('/login', { replace: true });
      }
    };

    checkAuthAndNavigate();
  }, [navigate]);
  // refreshAllData를 의존성 배열에서 제거 (AppDataContext가 자동으로 호출하므로)

  // 스플래시 화면 (로딩 중 표시)
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        {/* TODO: 스플래시 로고나 로딩 애니메이션 추가 */}
        <div className="text-gray-700 text-lg">로딩 중...</div>
      </div>
    </div>
  );
}

