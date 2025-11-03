/**
 * 회원가입 데이터 타입 정의
 */
export interface SignupData {
  email?: string;
  password?: string;
  name?: string;
  gender?: string;
  birthYear?: string;
  birthMonth?: string;
  birthDay?: string;
}

/**
 * 캐시 스토리지에서 사용하는 회원가입 데이터 키
 */
export const SIGNUP_DATA_KEY = 'signup.data';

