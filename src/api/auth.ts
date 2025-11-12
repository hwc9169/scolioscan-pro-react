import { SERVER_URL } from '../utils/server';
import { fetchDataAsync } from '../utils/common';

/**
 * 회원가입 요청 데이터 타입
 * POST /api/auth/register
 */
export interface RegisterRequest {
  user_id: string;
  user_pw: string;
  name: string;
  phone: string;
  birthday: string; // ISO 8601 형식 (예: "2025-11-12T09:45:04.074Z")
  sex: boolean;
  address: string;
  detail_address: string;
}

/**
 * 회원가입 성공 응답 (200)
 */
export interface RegisterSuccessResponse {
  status: 200;
  data: string;
}

/**
 * 회원가입 검증 에러 응답 (422)
 */
export interface RegisterValidationErrorResponse {
  status: 422;
  message?: string;
  errors?: {
    [key: string]: string[];
  };
  [key: string]: unknown;
}

/**
 * 로그인 요청 데이터 타입
 * POST /api/auth/login
 */
export interface LoginRequest {
  user_id: string;
  user_pw: string;
}

/**
 * 비밀번호 재설정 요청 데이터 타입
 * POST /api/auth/password-reset
 */
export interface PasswordResetRequest {
  user_id: string;
  name: string;
}

/**
 * 회원가입 API
 * POST /api/auth/register
 * 
 * @param registerData - 회원가입 요청 데이터
 * @returns 
 * - 200: 성공 응답 (string)
 * - 422: 검증 에러 응답
 */
export async function register(registerData: RegisterRequest): Promise<Response> {
  // fetchDataAsync 직접 사용 (인증이 필요 없는 API이므로 credentials 사용 안 함)
  const url = `${SERVER_URL}/api/auth/register`;
  
  try {
    const result = await fetchDataAsync(url, 'POST', registerData, false, false);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * 로그인 응답 데이터 타입
 */
export interface LoginResponse {
  access_token: string;
  email: string;
  name: string;
  token_type: string;
  user_id: string;
}

/**
 * 로그인 API
 * POST /api/auth/login
 * 
 * @param loginData - 로그인 요청 데이터 (user_id, user_pw)
 * @returns 로그인 응답 데이터 (access_token, email, name, token_type, user_id)
 */
export async function login(loginData: LoginRequest): Promise<LoginResponse> {
  // fetchDataAsync 직접 사용 (인증이 필요 없는 API이므로 credentials 사용 안 함)
  // SERVER_URL이 이미 /api를 포함하는지 확인
  const baseUrl = SERVER_URL.endsWith('/api') ? SERVER_URL : `${SERVER_URL}/api`;
  const url = `${baseUrl}/auth/login`;
  
  try {
    const result = await fetchDataAsync(url, 'POST', loginData, false, false);
    // fetchDataAsync는 성공 시 파싱된 데이터를 반환하므로 타입 캐스팅
    return result as LoginResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * 비밀번호 재설정 API
 * POST /api/auth/password-reset
 * 
 * @param resetData - 비밀번호 재설정 요청 데이터 (user_id, name)
 * @returns Response
 */
export async function passwordReset(resetData: PasswordResetRequest): Promise<Response> {
  // fetchDataAsync 직접 사용 (인증이 필요 없는 API이므로 credentials 사용 안 함)
  const url = `${SERVER_URL}/api/auth/password-reset`;
  
  try {
    const result = await fetchDataAsync(url, 'POST', resetData, false, false);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * 로그아웃 API
 * POST /api/auth/logout
 * 
 * @returns Response
 */
export async function logout(): Promise<Response> {
  // fetchDataAsync 사용 (인증이 필요한 API이므로 credentials 사용)
  const baseUrl = SERVER_URL.endsWith('/api') ? SERVER_URL : `${SERVER_URL}/api`;
  const url = `${baseUrl}/auth/logout`;
  
  try {
    const result = await fetchDataAsync(url, 'POST', {}, false, true);
    return result instanceof Response ? result : new Response(JSON.stringify(result), {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('로그아웃 API 호출 실패:', error);
    throw error;
  }
}

