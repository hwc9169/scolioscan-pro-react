import { type ReactElement, useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useFullSheet } from '../../hooks/useFullSheet';
import { useCacheStorage } from '../../hooks/useCacheStorage';
import { DefaultBtn } from '../button/DefaultBtn';
import { contentSlideUpVariants, contentSlideUpTransition } from './contentAnimation';
import { SIGNUP_DATA_KEY, type SignupData } from '../../types/signup';
import { IconArrowLeft } from '../../assets/Icon';

/**
 * 회원가입 성별 선택 풀 시트 컴포넌트
 */
export function SignupGenderFullSheet(): ReactElement {
  const { popFullSheet } = useFullSheet();
  const cache = useCacheStorage();
  const [gender, setGender] = useState<string>('');
  const [shouldAnimateContent, setShouldAnimateContent] = useState(false);
  const isInitialRender = useRef(true);

  // 캐시에서 이전 성별 값 복원 (있는 경우)
  useEffect(() => {
    const signupData = cache.get<SignupData>(SIGNUP_DATA_KEY);
    if (signupData?.gender) {
      setGender(signupData.gender);
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

  // 버튼 disabled 상태: 성별이 선택되지 않으면 disabled
  const isButtonDisabled = useMemo(() => {
    return !gender;
  }, [gender]);

  const handleGenderSelect = (selectedGender: string) => {
    setGender(selectedGender);
  };

  const handleStart = () => {
    if (!gender) return;
    
    // 회원가입 데이터에서 성별 업데이트
    const signupData = cache.get<SignupData>(SIGNUP_DATA_KEY) || {};
    cache.set(SIGNUP_DATA_KEY, {
      ...signupData,
      gender,
    });
    
    // 최종 회원가입 데이터 확인 및 콘솔 출력
    const finalData = cache.get<SignupData>(SIGNUP_DATA_KEY);
    console.log('========== 회원가입 데이터 ==========');
    console.log('이메일:', finalData?.email || '없음');
    console.log('비밀번호:', finalData?.password ? '***' : '없음');
    console.log('이름:', finalData?.name || '없음');
    console.log('생년:', finalData?.birthYear || '없음');
    console.log('생월:', finalData?.birthMonth || '없음');
    console.log('생일:', finalData?.birthDay || '없음');
    console.log('성별:', finalData?.gender === 'male' ? '남성' : finalData?.gender === 'female' ? '여성' : '없음');
    console.log('전체 데이터:', finalData);
    console.log('=====================================');
    
    // TODO: 다음 단계로 진행하는 로직 구현 (예: 회원가입 완료 또는 다음 화면)
    popFullSheet();
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
        className="basis-0 bg-white box-border flex flex-col gap-[24px] grow items-start min-h-0 min-w-0 pb-[40px] pt-[20px] px-[20px] relative shrink-0 w-full"
        variants={contentSlideUpVariants}
        initial="initial"
        animate={shouldAnimateContent ? 'animate' : 'initial'}
        exit="exit"
        transition={contentSlideUpTransition}
      >
        {/* 제목 */}
        <div className="font-['Pretendard_Variable',sans-serif] font-bold leading-[38px] max-w-[400px] relative shrink-0 text-gray-700 text-[28px] w-full whitespace-pre">
          <p className="mb-0">마지막으로</p>
          <p>성별을 알려주세요</p>
        </div>

        {/* 성별 선택 */}
        <div className="flex gap-[8px] items-start relative shrink-0 w-full">
          {/* 남성 */}
          <button
            type="button"
            onClick={() => handleGenderSelect('male')}
            className={`
              basis-0 flex items-center grow h-[60px] min-h-px min-w-px
              pl-[16px] pr-[12px] py-0 rounded-[6px]
              relative shrink-0
              border border-solid transition-colors
              ${
                gender === 'male'
                  ? 'bg-mint-25 border-primary-500'
                  : 'bg-gray-50 border-[rgba(0,0,0,0.04)]'
              }
            `}
          >
            <span className={`
              basis-0 grow min-h-px min-w-px
              font-['Pretendard_Variable',sans-serif]
              text-[18px] leading-[24px]
              text-center whitespace-nowrap
              overflow-hidden overflow-ellipsis
              relative shrink-0
              ${
                gender === 'male'
                  ? 'font-bold text-primary-500'
                  : 'font-medium text-gray-400'
              }
            `}>
              남성
            </span>
          </button>
          
          {/* 여성 */}
          <button
            type="button"
            onClick={() => handleGenderSelect('female')}
            className={`
              basis-0 flex items-center grow h-[60px] min-h-px min-w-px
              pl-[16px] pr-[12px] py-0 rounded-[6px]
              relative shrink-0
              border border-solid transition-colors
              ${
                gender === 'female'
                  ? 'bg-mint-25 border-primary-500'
                  : 'bg-gray-50 border-[rgba(0,0,0,0.04)]'
              }
            `}
          >
            <span className={`
              basis-0 grow min-h-px min-w-px
              font-['Pretendard_Variable',sans-serif]
              text-[18px] leading-[24px]
              text-center whitespace-nowrap
              overflow-hidden overflow-ellipsis
              relative shrink-0
              ${
                gender === 'female'
                  ? 'font-bold text-primary-500'
                  : 'font-medium text-gray-400'
              }
            `}>
              여성
            </span>
          </button>
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
            시작하기
          </DefaultBtn>
        </div>
      </div>
    </div>
  );
}

