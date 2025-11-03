import { type ReactElement, useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useFullSheet } from '../../hooks/useFullSheet';
import { useCacheStorage } from '../../hooks/useCacheStorage';
import { InputNormal } from '../input/InputNormal';
import { DefaultBtn } from '../button/DefaultBtn';
import type { InputState } from '../../types/input';
import { isValidEmail } from '../../utils/common';
import { SignupPasswordFullSheet } from './SignupPasswordFullSheet';
import { contentSlideUpVariants, contentSlideUpTransition } from './contentAnimation';
import { SIGNUP_DATA_KEY, type SignupData } from '../../types/signup';
import { IconArrowLeft } from '../../assets/Icon';

/**
 * 회원가입 이메일 입력 풀 시트 컴포넌트
 */
export function SignupEmailFullSheet(): ReactElement {
  const { popFullSheet, pushFullSheet } = useFullSheet();
  const cache = useCacheStorage();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const emailValueRef = useRef('');
  const [email, setEmail] = useState(''); // UI 업데이트를 위한 최소 상태
  const [emailState, setEmailState] = useState<InputState>('keyout-empty');
  const [hasBlurred, setHasBlurred] = useState(false);
  const [shouldAnimateContent, setShouldAnimateContent] = useState(false);
  const isInitialRender = useRef(true);

  // 캐시에서 이전 이메일 값 복원 (있는 경우)
  useEffect(() => {
    const signupData = cache.get<SignupData>(SIGNUP_DATA_KEY);
    if (signupData?.email) {
      emailValueRef.current = signupData.email;
      setEmail(signupData.email);
    }
  }, [cache]);

  // 풀시트 등장 애니메이션 완료 후 콘텐츠 애니메이션 시작
  // 풀시트의 spring 애니메이션(stiffness: 260, damping: 28)은 약 400ms 정도 소요됨
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setShouldAnimateContent(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const isEmailValid = useMemo(() => {
    return isValidEmail(emailValueRef.current);
  }, [email]);
  
  const showError = emailState === 'keyout-error' && (!isEmailValid || !emailValueRef.current.trim());
  
  const handleEmailFocus = () => {
    if (showError) {
      setEmailState('keyin-typing');
    } else {
      setEmailState(emailValueRef.current ? 'keyin-typing' : 'keyin-empty');
    }
  };

  const handleEmailBlur = () => {
    setHasBlurred(true);
    const currentValue = emailInputRef.current?.value || emailValueRef.current;
    emailValueRef.current = currentValue;
    setEmail(currentValue); // UI 업데이트를 위한 상태 동기화
    const isValid = isValidEmail(currentValue);
    if (currentValue.length > 0 && !isValid) {
      setEmailState('keyout-error');
    } else {
      setEmailState('keyout-empty');
    }
  };

  const handleEmailChange = (value: string) => {
    emailValueRef.current = value;
    setEmail(value); // UI 업데이트를 위한 상태 동기화
    if (hasBlurred && !isValidEmail(value) && value.length > 0) {
      setEmailState('keyout-error');
    } else if (hasBlurred && isValidEmail(value)) {
      // 유효한 이메일로 수정했을 때는 에러 상태 해제
      setEmailState(value ? 'keyin-typing' : 'keyin-empty');
    } else {
      setEmailState(value ? 'keyin-typing' : 'keyin-empty');
    }
  };

  const handleContinue = () => {
    // ref에서 현재 값 가져오기
    const currentEmail = emailInputRef.current?.value || emailValueRef.current;
    const trimmedEmail = currentEmail.trim();
    
    // ref 값 업데이트
    emailValueRef.current = trimmedEmail;
    setEmail(trimmedEmail); // UI 업데이트
    
    if (!trimmedEmail) {
      setHasBlurred(true);
      setEmailState('keyout-error');
      // showError는 hasBlurred가 true이고 이메일이 없으면 표시되지 않으므로
      // 별도로 에러 상태를 설정
      return;
    }
    
    if (!isValidEmail(trimmedEmail)) {
      setHasBlurred(true);
      setEmailState('keyout-error');
      return;
    }
    
    // 회원가입 데이터에서 이메일 업데이트
    const signupData = cache.get<SignupData>(SIGNUP_DATA_KEY) || {};
    cache.set(SIGNUP_DATA_KEY, {
      ...signupData,
      email: trimmedEmail,
    });
    
    // 현재 콘텐츠를 숨김
    setShouldAnimateContent(false);
    
    // 콘텐츠가 사라진 후 새로운 풀시트 등장
    setTimeout(() => {
      // 비밀번호 입력 풀시트로 push (애니메이션 없이 바로 표시)
      pushFullSheet(SignupPasswordFullSheet, undefined, {
        animationDirection: 'none', // 애니메이션 없이 즉시 표시
      });
    }, 300); // 콘텐츠 사라지는 애니메이션 시간
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
        animate={shouldAnimateContent ? 'animate' : 'exit'}
        exit="exit"
        transition={contentSlideUpTransition}
      >
        {/* 제목 */}
        <div className="font-['Pretendard_Variable',sans-serif] font-bold leading-[38px] max-w-[400px] relative shrink-0 text-gray-700 text-[28px] w-full">
          <p className="mb-0">이메일을</p>
          <p>입력해주세요</p>
        </div>

        {/* 이메일 입력 */}
        <div className="flex flex-col gap-[4px] items-start max-w-[400px] relative shrink-0 w-full">
          <InputNormal
            placeholder="abc@nextvine.com"
            value={email}
            state={emailState}
            errorMessage={
              showError 
                ? !emailValueRef.current.trim() 
                  ? '이메일을 입력해주세요' 
                  : '이메일 형식이 아닙니다'
                : undefined
            }
            onChange={handleEmailChange}
            onFocus={handleEmailFocus}
            onBlur={handleEmailBlur}
            onClear={() => {
              emailValueRef.current = '';
              setEmail('');
              setEmailState('keyin-empty');
              setHasBlurred(false);
              // ref의 input 요소도 직접 업데이트
              if (emailInputRef.current) {
                emailInputRef.current.value = '';
              }
            }}
            ref={emailInputRef}
          />
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
            className="w-full"
          >
            계속하기
          </DefaultBtn>
        </div>
      </div>
    </div>
  );
}
