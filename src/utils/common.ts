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

