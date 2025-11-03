import { type ReactElement, useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useFullSheet } from '../../hooks/useFullSheet';
import { useCacheStorage } from '../../hooks/useCacheStorage';
import { DefaultBtn } from '../button/DefaultBtn';
import { BirthSelect } from '../select/BirthSelect';
import type { InputState } from '../../types/input';
import { contentSlideUpVariants, contentSlideUpTransition } from './contentAnimation';
import { SIGNUP_DATA_KEY, type SignupData } from '../../types/signup';
import { IconArrowLeft } from '../../assets/Icon';
import { SignupGenderFullSheet } from './SignupGenderFullSheet';

/**
 * 회원가입 생년월일 입력 풀 시트 컴포넌트
 */
export function SignupBirthFullSheet(): ReactElement {
  const { popFullSheet, pushFullSheet } = useFullSheet();
  const cache = useCacheStorage();
  const birthYearValueRef = useRef('');
  const birthMonthValueRef = useRef('');
  const birthDayValueRef = useRef('');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthYearState, setBirthYearState] = useState<InputState>('keyout-empty');
  const [birthMonthState, setBirthMonthState] = useState<InputState>('keyout-empty');
  const [birthDayState, setBirthDayState] = useState<InputState>('keyout-empty');
  const [shouldAnimateContent, setShouldAnimateContent] = useState(false);
  const isInitialRender = useRef(true);

  // 오늘 날짜 기준 연도 리스트 생성 (현재 연도부터 1900년까지)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years: string[] = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year.toString());
    }
    return years;
  }, []);

  // 월 리스트 생성 (1-12월, 오늘 날짜까지 제한)
  const monthOptions = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    
    // 선택된 연도가 현재 연도인 경우, 현재 월까지만 표시
    let maxMonth = 12;
    if (birthYear) {
      const selectedYear = parseInt(birthYear, 10);
      if (selectedYear === currentYear) {
        maxMonth = currentMonth;
      }
    }
    
    return Array.from({ length: maxMonth }, (_, i) => {
      const month = i + 1;
      return month.toString().padStart(2, '0');
    });
  }, [birthYear]);

  // 일 리스트 생성 (선택된 연도와 월에 따라, 오늘 날짜까지 제한)
  const dayOptions = useMemo(() => {
    if (!birthYear || !birthMonth) {
      return Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        return day.toString().padStart(2, '0');
      });
    }

    const year = parseInt(birthYear, 10);
    const month = parseInt(birthMonth, 10);
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // getMonth()는 0부터 시작
    const currentDay = today.getDate();
    
    // 해당 월의 마지막 날짜 계산
    const daysInMonth = new Date(year, month, 0).getDate();
    let maxDay = daysInMonth;
    
    // 오늘 날짜를 넘어가지 않도록 제한
    if (year === currentYear && month === currentMonth) {
      maxDay = currentDay;
    }
    
    return Array.from({ length: maxDay }, (_, i) => {
      const day = i + 1;
      return day.toString().padStart(2, '0');
    });
  }, [birthYear, birthMonth]);

  // 캐시에서 이전 생년월일 값 복원 (있는 경우)
  useEffect(() => {
    const signupData = cache.get<SignupData>(SIGNUP_DATA_KEY);
    if (signupData?.birthYear) {
      birthYearValueRef.current = signupData.birthYear;
      setBirthYear(signupData.birthYear);
    }
    if (signupData?.birthMonth) {
      birthMonthValueRef.current = signupData.birthMonth;
      setBirthMonth(signupData.birthMonth);
    }
    if (signupData?.birthDay) {
      birthDayValueRef.current = signupData.birthDay;
      setBirthDay(signupData.birthDay);
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

  // 버튼 disabled 상태: 생년, 월, 일 모두 입력되어야 활성화
  const isButtonDisabled = useMemo(() => {
    return !birthYear || !birthMonth || !birthDay;
  }, [birthYear, birthMonth, birthDay]);

  const handleBirthYearFocus = () => {
    if (birthYearState === 'keyout-error') {
      setBirthYearState('keyin-typing');
    } else {
      setBirthYearState(birthYear ? 'keyin-typing' : 'keyin-empty');
    }
  };

  const handleBirthYearBlur = () => {
    setBirthYearState('keyout-empty');
  };

  const handleBirthYearChange = (value: string) => {
    birthYearValueRef.current = value;
    setBirthYear(value);
    setBirthYearState('keyin-typing');
    
    // 년도가 변경되면 일자 리스트가 바뀔 수 있으므로 일자 재검증
    if (birthDay) {
      const year = parseInt(value, 10);
      const month = parseInt(birthMonth, 10);
      if (month) {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();
        
        let maxDay = new Date(year, month, 0).getDate();
        if (year === currentYear && month === currentMonth) {
          maxDay = currentDay;
        }
        
        const selectedDay = parseInt(birthDay, 10);
        if (selectedDay > maxDay) {
          // 선택된 일자가 유효하지 않으면 초기화
          birthDayValueRef.current = '';
          setBirthDay('');
          setBirthDayState('keyin-empty');
        }
      }
    }
  };

  const handleBirthMonthFocus = () => {
    if (birthMonthState === 'keyout-error') {
      setBirthMonthState('keyin-typing');
    } else {
      setBirthMonthState(birthMonth ? 'keyin-typing' : 'keyin-empty');
    }
  };

  const handleBirthMonthBlur = () => {
    setBirthMonthState('keyout-empty');
  };

  const handleBirthMonthChange = (value: string) => {
    birthMonthValueRef.current = value;
    setBirthMonth(value);
    setBirthMonthState('keyin-typing');
    
    // 월이 변경되면 일자 리스트가 바뀔 수 있으므로 일자 재검증
    if (birthDay) {
      const year = parseInt(birthYear, 10);
      const month = parseInt(value, 10);
      if (year) {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();
        
        let maxDay = new Date(year, month, 0).getDate();
        if (year === currentYear && month === currentMonth) {
          maxDay = currentDay;
        }
        
        const selectedDay = parseInt(birthDay, 10);
        if (selectedDay > maxDay) {
          // 선택된 일자가 유효하지 않으면 초기화
          birthDayValueRef.current = '';
          setBirthDay('');
          setBirthDayState('keyin-empty');
        }
      }
    }
  };

  const handleBirthDayFocus = () => {
    if (birthDayState === 'keyout-error') {
      setBirthDayState('keyin-typing');
    } else {
      setBirthDayState(birthDay ? 'keyin-typing' : 'keyin-empty');
    }
  };

  const handleBirthDayBlur = () => {
    setBirthDayState('keyout-empty');
  };

  const handleBirthDayChange = (value: string) => {
    birthDayValueRef.current = value;
    setBirthDay(value);
    setBirthDayState('keyin-typing');
  };

  const handleStart = () => {
    // ref에서 현재 값 가져오기
    const currentYear = birthYearValueRef.current;
    const currentMonth = birthMonthValueRef.current;
    const currentDay = birthDayValueRef.current;
    
    // 회원가입 데이터에서 생년월일 업데이트
    const signupData = cache.get<SignupData>(SIGNUP_DATA_KEY) || {};
    cache.set(SIGNUP_DATA_KEY, {
      ...signupData,
      birthYear: currentYear,
      birthMonth: currentMonth,
      birthDay: currentDay,
    });
    
    // 회원가입 데이터 확인용 (디버깅)
    const updatedData = cache.get<SignupData>(SIGNUP_DATA_KEY);
    console.log('회원가입 데이터:', updatedData);
    
    // 성별 선택 풀시트로 이동
    pushFullSheet(SignupGenderFullSheet, undefined, {
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
        className="basis-0 bg-white box-border flex flex-col gap-[24px] grow items-start min-h-0 min-w-0 pb-[40px] pt-[20px] px-[20px] relative shrink-0 w-full"
        variants={contentSlideUpVariants}
        initial="initial"
        animate={shouldAnimateContent ? 'animate' : 'initial'}
        exit="exit"
        transition={contentSlideUpTransition}
      >
        {/* 제목 */}
        <div className="font-['Pretendard_Variable',sans-serif] font-bold leading-[38px] max-w-[400px] relative shrink-0 text-gray-700 text-[28px] w-full">
          <p className="mb-0">생년월일을</p>
          <p>입력해주세요</p>
        </div>

        {/* 생년월일 입력 */}
        <div className="flex gap-[8px] items-start relative shrink-0 w-full">
          {/* 년도 */}
          <div className="basis-0 flex flex-col gap-[8px] grow h-[72px] items-start min-h-px relative shrink-0">
            <BirthSelect
              value={birthYear}
              placeholder=" YYYY"
              state={birthYearState}
              options={yearOptions}
              onChange={handleBirthYearChange}
              onFocus={handleBirthYearFocus}
              onBlur={handleBirthYearBlur}
            />
          </div>
          
          {/* 월 */}
          <div className="flex flex-col gap-[8px] h-[72px] items-start relative shrink-0 w-[100px]">
            <BirthSelect
              value={birthMonth}
              placeholder="MM"
              state={birthMonthState}
              options={monthOptions}
              onChange={handleBirthMonthChange}
              onFocus={handleBirthMonthFocus}
              onBlur={handleBirthMonthBlur}
            />
          </div>
          
          {/* 일 */}
          <div className="flex flex-col gap-[8px] h-[72px] items-start relative shrink-0 w-[100px]">
            <BirthSelect
              value={birthDay}
              placeholder="DD"
              state={birthDayState}
              options={dayOptions}
              onChange={handleBirthDayChange}
              onFocus={handleBirthDayFocus}
              onBlur={handleBirthDayBlur}
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

