import { type ReactElement, useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useFullSheet } from '../../hooks/useFullSheet';
import { useToast } from '../../contexts/ToastContext';
import { InputNormal } from '../input/InputNormal';
import { DefaultBtn } from '../button/DefaultBtn';
import type { InputState } from '../../types/input';
import { isValidEmail } from '../../utils/common';
import { contentSlideUpVariants, contentSlideUpTransition } from './contentAnimation';
import { IconArrowLeft } from '../../assets/Icon';
import { passwordReset } from '../../api/auth';

/**
 * 비밀번호 찾기 풀 시트 컴포넌트
 */
export function PasswordResetFullSheet(): ReactElement {
  const { popFullSheet, closeFullSheet } = useFullSheet();
  const { showToast } = useToast();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailValueRef = useRef('');
  const nameValueRef = useRef('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [emailState, setEmailState] = useState<InputState>('keyout-empty');
  const [nameState, setNameState] = useState<InputState>('keyout-empty');
  const [hasBlurredEmail, setHasBlurredEmail] = useState(false);
  const [hasBlurredName, setHasBlurredName] = useState(false);
  const [shouldAnimateContent, setShouldAnimateContent] = useState(false);
  const isInitialRender = useRef(true);

  // 풀시트 등장 애니메이션 완료 후 콘텐츠 애니메이션 시작
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

  const showEmailError = emailState === 'keyout-error' && (!isEmailValid || !emailValueRef.current.trim());
  const showNameError = nameState === 'keyout-error' && !nameValueRef.current.trim();

  // 버튼 disabled 상태: 이메일과 이름이 모두 유효해야 활성화
  const isButtonDisabled = useMemo(() => {
    return !email.trim() || !name.trim() || !isEmailValid;
  }, [email, name, isEmailValid]);

  const handleEmailFocus = () => {
    if (showEmailError) {
      setEmailState('keyin-typing');
    } else {
      setEmailState(emailValueRef.current ? 'keyin-typing' : 'keyin-empty');
    }
  };

  const handleEmailBlur = () => {
    setHasBlurredEmail(true);
    const currentValue = emailInputRef.current?.value || emailValueRef.current;
    emailValueRef.current = currentValue;
    setEmail(currentValue);
    const isValid = isValidEmail(currentValue);
    if (currentValue.length > 0 && !isValid) {
      setEmailState('keyout-error');
    } else {
      setEmailState('keyout-empty');
    }
  };

  const handleEmailChange = (value: string) => {
    emailValueRef.current = value;
    setEmail(value);
    if (hasBlurredEmail && !isValidEmail(value) && value.length > 0) {
      setEmailState('keyout-error');
    } else if (hasBlurredEmail && isValidEmail(value)) {
      setEmailState(value ? 'keyin-typing' : 'keyin-empty');
    } else {
      setEmailState(value ? 'keyin-typing' : 'keyin-empty');
    }
  };

  const handleNameFocus = () => {
    if (showNameError) {
      setNameState('keyin-typing');
    } else {
      setNameState(nameValueRef.current ? 'keyin-typing' : 'keyin-empty');
    }
  };

  const handleNameBlur = () => {
    setHasBlurredName(true);
    const currentValue = nameInputRef.current?.value || nameValueRef.current;
    nameValueRef.current = currentValue;
    setName(currentValue);
    if (!currentValue.trim()) {
      setNameState('keyout-error');
    } else {
      setNameState('keyout-empty');
    }
  };

  const handleNameChange = (value: string) => {
    nameValueRef.current = value;
    setName(value);
    if (hasBlurredName && !value.trim()) {
      setNameState('keyout-error');
    } else {
      setNameState(value ? 'keyin-typing' : 'keyin-empty');
    }
  };

  const handleContinue = async () => {
    // 입력 값 검증
    const trimmedEmail = emailInputRef.current?.value || emailValueRef.current;
    const trimmedName = nameInputRef.current?.value || nameValueRef.current;
    
    let hasError = false;
    
    if (!trimmedEmail.trim()) {
      setHasBlurredEmail(true);
      setEmailState('keyout-error');
      hasError = true;
    } else if (!isValidEmail(trimmedEmail)) {
      setHasBlurredEmail(true);
      setEmailState('keyout-error');
      hasError = true;
    }
    
    if (!trimmedName.trim()) {
      setHasBlurredName(true);
      setNameState('keyout-error');
      hasError = true;
    }
    
    if (hasError) {
      return;
    }
    
    try {
      const response = await passwordReset({
        user_id: trimmedEmail.trim(),
        name: trimmedName.trim(),
      });
      console.log(response);
    
      
      // passwordReset은 Response 객체를 반환
      if (response instanceof Response) {
        if (response.ok) {
          // 성공 시 모든 풀 시트 클리어 및 토스트 표시
          closeFullSheet();
          showToast('비밀번호 재설정 메일이 발송되었습니다');
        } else {
          // 에러 처리
          if (response.status === 404) {
            // 404 응답: 이메일 혹은 이름을 잘못 입력
            showToast('이메일 혹은 이름을 잘못 입력하였습니다');
          } else {
            // 기타 에러 처리
            try {
              const errorData = await response.json();
              console.error('비밀번호 재설정 실패:', errorData);
            } catch (e) {
              console.error('비밀번호 재설정 실패:', response.status, response.statusText);
            }
          }
        }
      } else {
        // 예상치 못한 응답 형식
        console.error('비밀번호 재설정 응답 형식 오류:', response);
      }
    } catch (error) {
      console.error('비밀번호 재설정 요청 실패:', error);
    }
  };

  return (
    <div className="relative inset-0 flex flex-col items-center h-full bg-white">
      {/* 헤더 */}
      <div className="box-border flex gap-[20px] h-[68px] items-center p-[20px] relative shrink-0 w-full">
        <button
          type="button"
          onClick={() => popFullSheet({ exitAnimationDirection: 'right' })}
          className="relative shrink-0 w-[24px] h-[24px] flex items-center justify-center"
          aria-label="뒤로 가기"
        >
          <IconArrowLeft width={24} height={24} className="text-gray-400" />
        </button>
        <div className="flex flex-col font-['Pretendard_Variable',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-gray-800 text-[18px] text-nowrap">
          <p className="leading-[24px] whitespace-pre">비밀번호 찾기</p>
        </div>
      </div>

      {/* 콘텐츠 */}
      <motion.div
        className="basis-0 bg-white box-border flex flex-col gap-[24px] grow items-start min-h-0 min-w-0 pb-[40px] pt-0 px-[20px] relative shrink-0 w-full"
        variants={contentSlideUpVariants}
        initial="initial"
        animate={shouldAnimateContent ? 'animate' : 'initial'}
        exit="exit"
        transition={contentSlideUpTransition}
      >
        {/* 안내 메시지 */}
        <div className="bg-mint-25 box-border flex gap-[10px] items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-full">
          <div className="basis-0 font-['Pretendard_Variable',sans-serif] font-medium grow leading-[18px] min-h-px min-w-px relative shrink-0 text-primary-500 text-[13px]">
            <p className="mb-0">가입하신 이메일 주소를 입력해주세요.</p>
            <p>비밀번호를 재설정할 수 있는 메일을 보내드립니다.</p>
          </div>
        </div>

        {/* 입력 필드 */}
        <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          {/* 이메일 입력 */}
          <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <p className="font-['Pretendard_Variable',sans-serif] font-medium leading-[20px] relative shrink-0 text-gray-800 text-[15px] text-nowrap w-full">
              이메일
            </p>
            <InputNormal
              placeholder="abc@nextvine.com"
              value={email}
              state={emailState}
              errorMessage={
                showEmailError 
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
                setHasBlurredEmail(false);
                if (emailInputRef.current) {
                  emailInputRef.current.value = '';
                }
              }}
              ref={emailInputRef}
            />
          </div>

          {/* 이름 입력 */}
          <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <p className="font-['Pretendard_Variable',sans-serif] font-medium leading-[20px] relative shrink-0 text-gray-800 text-[15px] text-nowrap w-full">
              이름
            </p>
            <InputNormal
              placeholder="이름을 입력해주세요"
              value={name}
              state={nameState}
              errorMessage={
                showNameError 
                  ? '이름을 입력해주세요'
                  : undefined
              }
              onChange={handleNameChange}
              onFocus={handleNameFocus}
              onBlur={handleNameBlur}
              onClear={() => {
                nameValueRef.current = '';
                setName('');
                setNameState('keyin-empty');
                setHasBlurredName(false);
                if (nameInputRef.current) {
                  nameInputRef.current.value = '';
                }
              }}
              ref={nameInputRef}
            />
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
            비밀번호 찾기
          </DefaultBtn>
        </div>
      </div>
    </div>
  );
}

