import { SERVER_URL } from '../utils/server';
import { getCookie } from '../utils/common';
import type { SignupData } from '../types/signup';

/**
 * 로그인 API
 */
export const signin = async (email: string, password: string) => {
  // 임시: 테스트용 로그인 정보 검증 (실제 API 연동 후 삭제 필요)
  const TEST_EMAIL = 'test@test.test';
  const TEST_PASSWORD = 'test!@34';

  // 이메일과 비밀번호 검증
  if (email === TEST_EMAIL && password === TEST_PASSWORD) {
    return {
      status: 200,
      message: "success",
      data: {
        accessToken: "accessToken",
        refreshToken: "refreshToken",
      },
    };
  } else {
    return {
      status: 401,
      message: "로그인 정보가 일치하지 않습니다.",
      data: null,
    };
  }

  // 임시 주석 시작 : 로그인 API 연동 후 주석 제거 필요
  // const response = await fetch(`${SERVER_URL}/api/auth/signin`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ email, password }),
  // });
  // return response.json();
  // 임시 주석 종료 : 로그인 API 연동 후 주석 제거 필요
};

/**
 * 회원가입 API
 */
export const signup = async (signupData: SignupData) => {
  const response = await fetch(`${SERVER_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signupData),
  });
  return response.json();
};

/**
 * 로그인 유저 정보 조회 API
 */
export async function getLoginUserInfoFetch(): Promise<Response> {
  const accessToken = getCookie('userAccessToken');
  const response = await fetch(`${SERVER_URL}/api/user/info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken || ''}`,
    },
    credentials: 'include',
  });
  return response;
}

/**
 * Access Token 갱신 API
 */
export async function refreshAccessTokenFetch(): Promise<Response> {
  const refreshToken = localStorage.getItem('userRefreshToken');
  const response = await fetch(`${SERVER_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
    credentials: 'include',
  });
  return response;
}

