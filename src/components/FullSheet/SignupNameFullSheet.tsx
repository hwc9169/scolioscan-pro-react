import { type ReactElement, useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useFullSheet } from '../../hooks/useFullSheet';
import { useCacheStorage } from '../../hooks/useCacheStorage';
import { InputNormal } from '../input/InputNormal';
import { DefaultBtn } from '../button/DefaultBtn';
import type { InputState } from '../../types/input';
import { contentSlideUpVariants, contentSlideUpTransition } from './contentAnimation';
import { SIGNUP_DATA_KEY, type SignupData } from '../../types/signup';
import { IconArrowLeft } from '../../assets/Icon';
import { SignupBirthFullSheet } from './SignupBirthFullSheet';
/**
 * 회원가입 이름 입력 풀 시트 컴포넌트
 */
export function SignupNameFullSheet(): ReactElement {
  const { popFullSheet, pushFullSheet } = useFullSheet();
  const cache = useCacheStorage();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const nameValueRef = useRef('');
  const [name, setName] = useState(''); // UI 업데이트를 위한 최소 상태
  const [nameState, setNameState] = useState<InputState>('keyout-empty');
  const [shouldAnimateContent, setShouldAnimateContent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const isInitialRender = useRef(true);

  // 캐시에서 이전 이름 값 복원 (있는 경우)
  useEffect(() => {
    const signupData = cache.get<SignupData>(SIGNUP_DATA_KEY);
    if (signupData?.name) {
      nameValueRef.current = signupData.name;
      setName(signupData.name);
    }
  }, [cache]);

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

  // 버튼 disabled 상태: 값이 없을 때만 disabled (유효성 검사와 무관)
  const isButtonDisabled = useMemo(() => {
    const trimmedName = nameValueRef.current.trim();
    return !trimmedName;
  }, [name]);

  const handleNameFocus = () => {
    if (nameState === 'keyout-error') {
      setNameState('keyin-typing');
    } else {
      setNameState(nameValueRef.current ? 'keyin-typing' : 'keyin-empty');
    }
  };

  const handleNameBlur = () => {
    const currentValue = nameInputRef.current?.value || nameValueRef.current;
    nameValueRef.current = currentValue;
    setName(currentValue); // UI 업데이트를 위한 상태 동기화
    
    // blur 시에는 에러 상태를 설정하지 않음 (계속하기 클릭 시에만 검사)
    setNameState('keyout-empty');
  };

  const handleNameChange = (value: string) => {
    nameValueRef.current = value;
    setName(value); // UI 업데이트를 위한 상태 동기화
    
    // 입력 중에는 에러 메시지 제거 및 일반 상태로 변경
    if (errorMessage) {
      setErrorMessage(undefined);
    }
    setNameState(value ? 'keyin-typing' : 'keyin-empty');
  };

  const handleStart = () => {
    // ref에서 현재 값 가져오기
    const currentName = nameInputRef.current?.value || nameValueRef.current;
    const trimmedName = currentName.trim();
    
    // ref 값 업데이트
    nameValueRef.current = trimmedName;
    setName(trimmedName); // UI 업데이트
    
    // 유효성 검사: 계속하기 클릭 시에만 검사
    if (trimmedName.length > 8) {
      // 8자 초과: 빨간색 경고 표시
      setErrorMessage('최대 8자까지 입력 가능합니다');
      setNameState('keyout-error');
      return;
    }
    
    // 유효성 검사 통과: 에러 메시지 제거 및 다음 단계 진행
    setErrorMessage(undefined);
    setNameState('keyout-empty');
    
    // 회원가입 데이터에서 이름 업데이트
    const signupData = cache.get<SignupData>(SIGNUP_DATA_KEY) || {};
    cache.set(SIGNUP_DATA_KEY, {
      ...signupData,
      name: trimmedName,
    });
    
    // 회원가입 데이터 확인용 (디버깅)
    const updatedData = cache.get<SignupData>(SIGNUP_DATA_KEY);
    console.log('회원가입 데이터:', updatedData);
    
    // 생년월일 입력 풀시트로 이동
    pushFullSheet(SignupBirthFullSheet, undefined, {
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
          <p className="mb-0">이름을</p>
          <p>입력해주세요</p>
        </div>

        {/* 이름 입력 */}
        <div className="flex flex-col gap-[4px] items-start max-w-[400px] relative shrink-0 w-full">
          <InputNormal
            placeholder="홍길동"
            value={name}
            state={nameState}
            errorMessage={errorMessage}
            onChange={handleNameChange}
            onFocus={handleNameFocus}
            onBlur={handleNameBlur}
            onClear={() => {
              nameValueRef.current = '';
              setName('');
              setNameState('keyin-empty');
              setErrorMessage(undefined);
              // ref의 input 요소도 직접 업데이트
              if (nameInputRef.current) {
                nameInputRef.current.value = '';
              }
            }}
            ref={nameInputRef}
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
            onClick={handleStart}
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

