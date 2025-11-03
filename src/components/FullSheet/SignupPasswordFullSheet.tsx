import { type ReactElement, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFullSheet } from '../../hooks/useFullSheet';
import { useCacheStorage } from '../../hooks/useCacheStorage';
import { InputNormal } from '../input/InputNormal';
import { DefaultBtn } from '../button/DefaultBtn';
import type { InputState } from '../../types/input';
import { contentSlideUpVariants, contentSlideUpTransition } from './contentAnimation';
import { SIGNUP_DATA_KEY, type SignupData } from '../../types/signup';
import { validatePassword, validatePasswordDetail } from '../../utils/common';
import { IconCheck, IconInputShow, IconInputHide, IconArrowLeft } from '../../assets/Icon';
import { SignupNameFullSheet } from './SignupNameFullSheet';

/**
 * 회원가입 비밀번호 입력 풀 시트 컴포넌트
 */
export function SignupPasswordFullSheet(): ReactElement {
  const { popFullSheet, pushFullSheet } = useFullSheet();
  const cache = useCacheStorage();
  const [password, setPassword] = useState('');
  const [passwordState, setPasswordState] = useState<InputState>('keyout-empty');
  const [hasBlurred, setHasBlurred] = useState(false);
  const [shouldAnimateContent, setShouldAnimateContent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setShouldAnimateContent(true);
  }, []);

  // 비밀번호 유효성 검증
  const passwordValidation = useMemo(() => {
    return validatePassword(password);
  }, [password]);

  // 비밀번호 유효성 검증 상세 (체크리스트용)
  const passwordValidationDetail = useMemo(() => {
    return validatePasswordDetail(password);
  }, [password]);

  // 버튼 disabled 상태: 비밀번호가 유효하지 않으면 disabled
  const isButtonDisabled = useMemo(() => {
    return !password.trim() || !passwordValidation.isValid;
  }, [password, passwordValidation.isValid]);

  const showError = passwordState === 'keyout-error';
  // 에러 메시지는 유효성 검증 리스트에 통합하여 표시하므로 InputNormal에는 전달하지 않음

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handlePasswordFocus = () => {
    if (showError) {
      setPasswordState('keyin-typing');
    } else {
      setPasswordState(password ? 'keyin-typing' : 'keyin-empty');
    }
  };

  const handlePasswordBlur = () => {
    setHasBlurred(true);
    const validation = validatePassword(password);
    if (!password.trim() || !validation.isValid) {
      setPasswordState('keyout-error');
    } else {
      setPasswordState('keyout-empty');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (hasBlurred) {
      const validation = validatePassword(value);
      if (!value.trim() || !validation.isValid) {
        setPasswordState('keyout-error');
      } else {
        setPasswordState(value ? 'keyin-typing' : 'keyin-empty');
      }
    } else {
      setPasswordState(value ? 'keyin-typing' : 'keyin-empty');
    }
  };

  const handleContinue = () => {
    // 입력 값 검증
    const trimmedPassword = password.trim();
    
    if (!trimmedPassword) {
      setHasBlurred(true);
      setPasswordState('keyout-error');
      return;
    }
    
    // 비밀번호 유효성 검증
    const validation = validatePassword(trimmedPassword);
    if (!validation.isValid) {
      setHasBlurred(true);
      setPasswordState('keyout-error');
      return;
    }
    
    // 회원가입 데이터에서 비밀번호 업데이트
    const signupData = cache.get<SignupData>(SIGNUP_DATA_KEY) || {};
    cache.set(SIGNUP_DATA_KEY, {
      ...signupData,
      password: trimmedPassword,
    });
    
    // 이름 입력 풀시트로 이동
    pushFullSheet(SignupNameFullSheet, undefined, {
      animationDirection: 'none',
    });
  };

  return (
    <div className="relative inset-0 flex flex-col items-center h-full bg-white">
      {/* 헤더 */}
      <div className="box-border flex gap-[10px] h-[68px] items-center p-[20px] relative shrink-0 w-full">
        <button
          type="button"
          onClick={() => popFullSheet({ exitAnimationDirection: 'right' })} // 중앙에서 우측으로 퇴장
          className="relative shrink-0 w-[24px] h-[24px] flex items-center justify-center"
          aria-label="뒤로 가기"
        >
          <IconArrowLeft width={24} height={24} className="text-gray-400" />
        </button>
      </div>

      {/* 콘텐츠 */}
      <motion.div
        className="basis-0 bg-white box-border flex flex-col gap-[24px] grow items-center min-h-0 min-w-0 pb-[40px] pt-[20px] px-[20px] relative shrink-0 w-[360px]"
        variants={contentSlideUpVariants}
        initial="initial"
        animate={shouldAnimateContent ? 'animate' : 'initial'}
        exit="exit"
        transition={contentSlideUpTransition}
      >
        {/* 제목 */}
        <div className="font-['Pretendard_Variable',sans-serif] font-bold leading-[38px] max-w-[400px] relative shrink-0 text-gray-700 text-[28px] w-full">
          <p className="mb-0">비밀번호를</p>
          <p>입력해주세요</p>
        </div>

        {/* 비밀번호 입력 */}
        <div className="flex flex-col gap-[8px] items-start max-w-[400px] relative shrink-0 w-full">
          <div className="relative w-full">
            <InputNormal
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호를 입력해주세요"
              value={password}
              state={passwordState}
              onChange={handlePasswordChange}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
            />
            {/* 비밀번호 보기/숨기기 토글 버튼 */}
            {password && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="
                  absolute right-[12px] top-1/2 -translate-y-1/2
                  flex items-center justify-center
                  w-8 h-8 shrink-0
                  text-gray-400
                  hover:bg-gray-75 rounded
                  transition-colors
                  z-10
                "
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPassword ? <IconInputShow width={24} height={24} className="text-gray-400" /> : <IconInputHide width={24} height={24} className="text-gray-400" />}
              </button>
            )}
          </div>
          
          {/* 비밀번호 유효성 검증 체크리스트 */}
          <div className="flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            {/* 영문자, 숫자, 특수문자 포함 */}
            <div className="box-border flex gap-[4px] items-start px-[8px] py-0 relative shrink-0 w-full">
              <IconCheck 
                width={16} 
                height={16} 
                className={passwordValidationDetail.hasLetterNumberSpecial ? 'text-primary-500' : 'text-gray-500'} 
              />
              <p className={`font-['Pretendard_Variable',sans-serif] font-normal leading-[16px] relative shrink-0 text-12r text-nowrap whitespace-pre ${passwordValidationDetail.hasLetterNumberSpecial ? 'text-primary-500' : 'text-gray-500'}`}>
                영문자, 숫자, 특수문자 포함
              </p>
            </div>
            
            {/* 최소 8자 이상 */}
            <div className="box-border flex gap-[4px] items-start px-[8px] py-0 relative shrink-0 w-full">
              <IconCheck 
                width={16} 
                height={16} 
                className={passwordValidationDetail.minLength ? 'text-primary-500' : 'text-gray-500'} 
              />
              <p className={`font-['Pretendard_Variable',sans-serif] font-normal leading-[16px] relative shrink-0 text-12r text-nowrap whitespace-pre ${passwordValidationDetail.minLength ? 'text-primary-500' : 'text-gray-500'}`}>
                최소 8자 이상
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 하단 버튼 */}
      <div className="flex flex-col items-start relative shrink-0 w-full">
        <div className="bg-white box-border flex flex-col items-start pb-[16px] pt-[4px] px-[16px] relative shrink-0 w-full">
          <DefaultBtn
            variant="filled"
            color="primary"
            size="big"
            onClick={handleContinue}
            disabled={isButtonDisabled}
            className="w-full"
          >
            계속하기
          </DefaultBtn>
        </div>
      </div>
    </div>
  );
}

