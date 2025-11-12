import { refreshAccessToken } from './loginSession';


/**
 * 쿠키 조회
 * @param name - 조회할 쿠키 이름
 * @returns 쿠키 값 또는 null
 */
export function getCookie(name: string): string | null {
  const cookieString = document.cookie;
  const cookies = cookieString.split('; ');

  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) return value;
  }

  return null;
}

/**
 * 쿠키 설정
 * @param name - 쿠키 이름
 * @param value - 쿠키 값
 * @param days - 만료일 (기본값: 365일)
 */
export function setCookie(name: string, value: string, days: number = 365): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + date.toUTCString();
  document.cookie = name + '=' + value + '; ' + expires + '; path=/';
}

/**
 * URL에서 마지막 경로 값을 가져오는 함수
 * @returns 마지막 경로 값 (.html 확장자 제거)
 */
export function getLastPathFromURL(): string {
  const path = window.location.pathname;
  let lastPath = path.substring(path.lastIndexOf('/') + 1);
  if (lastPath.endsWith('.html')) {
    lastPath = lastPath.substring(0, lastPath.lastIndexOf('.'));
  }
  return lastPath;
}

// 비동기 fetch api
export async function fetchDataAsync(url: string, method: string, data: any, form: boolean = false, useCredentials: boolean = true) {
  const accessToken = getCookie('userAccessToken');
  let newUrl = url;

  const headers: any = {
    Authorization: `Bearer ${accessToken}`,
  };

  if (!form) {
    headers['Content-Type'] = 'application/json';
  }

  const fetchOptions: any = { method, headers };

  if (method !== 'GET' && form) {
    const formData = new FormData();
    formData.append('json_data', JSON.stringify(data.json_data));
    data.form_data.forEach(({ key, value }: { key: string; value: string }) => {
      formData.append(key, value);
    });
    fetchOptions.body = formData;
  }

  if (method !== 'GET' && !form) {
    fetchOptions.body = JSON.stringify(data);
  }

  if (method === 'GET' || method === 'DELETE') {
    newUrl += '?';
    for (const key in data) {
      const value = data[key];
      newUrl += `${key}=${value}&`;
    }
  }

  // credentials 옵션 추가 (기본값: true)
  if (useCredentials) {
    fetchOptions.credentials = 'include';
  }

  try {
    const response = await fetch(newUrl, fetchOptions);

    if (response.ok) {
      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('application/json')) {
        return await response.json();
      } else if (contentType.includes('image/') || contentType.includes('audio/') || contentType.includes('application/octet-stream')) {
        return await response.blob();
      } else if (contentType.includes('text/')) {
        return await response.text();
      } else {
        throw new Error('지원하지 않는 데이터 형식입니다.');
      }
    } else if (response.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return await fetchDataAsync(url, method, data, form, useCredentials); // 새 Access Token으로 재요청
      } else {
        return null;
      }
    } else {
      return response;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * 이메일 형식 검증 함수
 * @param email - 검증할 이메일 주소
 * @returns 이메일 형식이 올바르면 true, 그렇지 않으면 false
 */
export function isValidEmail(email: string): boolean {
  if (!email || !email.trim()) return false; // 빈 값은 false 반환
  const trimmedEmail = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmedEmail);
}

/**
 * 비밀번호 유효성 검증 결과 타입
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * 비밀번호 유효성 검증 상세 결과 타입
 */
export interface PasswordValidationDetail {
  hasLetterNumberSpecial: boolean; // 영문자, 숫자, 특수문자 포함
  minLength: boolean; // 최소 8자 이상
}

/**
 * 비밀번호 유효성 검증 함수
 * @param password - 검증할 비밀번호
 * @returns 유효성 검증 결과
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  
  if (!password || password.trim().length === 0) {
    return { isValid: false, errors: ['비밀번호를 입력해주세요'] };
  }
  
  // 최소 길이 체크 (8자 이상)
  if (password.length < 8) {
    errors.push('비밀번호는 8자 이상이어야 합니다');
  }
  
  // 영문자, 숫자, 특수문자 포함 체크
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  if (!hasLetter || !hasNumber || !hasSpecial) {
    errors.push('영문자, 숫자, 특수문자를 포함해야 합니다');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 비밀번호 유효성 검증 상세 함수 (체크리스트용)
 * @param password - 검증할 비밀번호
 * @returns 각 검증 항목별 통과 여부
 */
export function validatePasswordDetail(password: string): PasswordValidationDetail {
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  return {
    hasLetterNumberSpecial: hasLetter && hasNumber && hasSpecial,
    minLength: password.length >= 8,
  };
}

