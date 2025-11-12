import { setCookie } from './common';
import { refreshAccessTokenFetch } from '../api/login';
import { getCurrentUser } from '../api/users';

// http only 로그아웃
export async function logout(): Promise<void> {
  setCookie('userAccessToken', '', 0);
  localStorage.removeItem('userRefreshToken'); // Refresh Token 삭제
}

export async function getLoginUserEmail(): Promise<string> {
  const response = await getCurrentUser();
  if (response.ok) {
    const user = await response.json();
    return user.email;
  }
  return '';
}

// 로그인 유저 정보 조회 API
export async function getLoginUserInfo(): Promise<boolean> {
  try {
    const response = await getCurrentUser();

    if (response.ok) {
      await response.json();
      return true;
    }

    if (response.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return await getLoginUserInfo();
      } else {
        console.error('로그인이 필요합니다. 로그인 페이지로 이동하세요.');
        return false;
      }
    }

    // 기타 오류 상태
    console.error(`서버 오류 발생: ${response.statusText}`);
    return false;
  } catch (error) {
    // 네트워크 오류 또는 예외 처리
    console.error('네트워크 오류 발생:', error);
    console.error('네트워크 오류가 발생했습니다. 인터넷 연결을 확인하세요.');
    return false;
  }
}

// Access Token 갱신
export async function refreshAccessToken(): Promise<any> {
  const response = await refreshAccessTokenFetch();

  if (response.ok) {
    const result = await response.json();
    if (result.code == 200) {
      // Access Token 갱신
      setCookie('userAccessToken', result.data.access_token);
      return true;
    }
  } else {
    console.error('토큰 갱신 실패: 로그아웃 필요');
    logout();
    return false;
  }
}

