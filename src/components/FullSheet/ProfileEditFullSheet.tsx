import { type ReactElement, useState, useEffect, useMemo, useRef } from 'react';
import { InputNormal } from '../input/InputNormal';
import { BirthSelect } from '../select/BirthSelect';
import IconArrowLeft from '../../assets/icon_svg/ProfileEdit/IconArrowLeft.svg';
import type { InputState } from '../../types/input';
import { useToast } from '../../contexts/ToastContext';
import { useFullSheet } from '../../hooks/useFullSheet';
import { useAppData } from '../../contexts/AppDataContext';
import { updateUserProfile, type UpdateUserProfileRequest } from '../../api/users';

/**
 * 프로필 수정 페이지
 */
export function ProfileEdit(): ReactElement {
  const { showToast } = useToast();
  const { popFullSheet } = useFullSheet();
  const { appData, refreshUserData } = useAppData();
  const { user, isLoading } = appData;
  
  // 폼 상태
  const [name, setName] = useState('');
  const [nameState, setNameState] = useState<InputState>('keyout-empty');
  
  const [birthYear, setBirthYear] = useState('');
  const [birthYearState, setBirthYearState] = useState<InputState>('keyout-empty');
  
  const [birthMonth, setBirthMonth] = useState('');
  const [birthMonthState, setBirthMonthState] = useState<InputState>('keyout-empty');
  
  const [birthDay, setBirthDay] = useState('');
  const [birthDayState, setBirthDayState] = useState<InputState>('keyout-empty');
  
  const [gender, setGender] = useState<'male' | 'female'>('male');
  
  const [email, setEmail] = useState('');
  const [emailState, setEmailState] = useState<InputState>('keyout-empty');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  
  // 초기 값 저장 (변경 사항 감지용)
  const initialValuesRef = useRef<{
    name: string;
    birthYear: string;
    birthMonth: string;
    birthDay: string;
    gender: 'male' | 'female';
  }>({
    name: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    gender: 'male',
  });

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
    const currentMonth = today.getMonth() + 1;
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

  // 사용자 정보가 로드되면 폼에 채우기
  useEffect(() => {
    if (user && !isLoading) {
      // 이름
      const userName = user.name || '';
      setName(userName);
      setNameState(userName ? 'keyout-typed' : 'keyout-empty');
      initialValuesRef.current.name = userName;

      // 생년월일 (ISO 8601 형식에서 파싱)
      let year = '';
      let month = '';
      let day = '';
      if (user.birthday) {
        const birthDate = new Date(user.birthday);
        if (!isNaN(birthDate.getTime())) {
          year = birthDate.getFullYear().toString();
          month = String(birthDate.getMonth() + 1).padStart(2, '0');
          day = String(birthDate.getDate()).padStart(2, '0');
          
          setBirthYear(year);
          setBirthYearState('keyout-typed');
          setBirthMonth(month);
          setBirthMonthState('keyout-typed');
          setBirthDay(day);
          setBirthDayState('keyout-typed');
        }
      }
      initialValuesRef.current.birthYear = year;
      initialValuesRef.current.birthMonth = month;
      initialValuesRef.current.birthDay = day;

      // 성별 (boolean: true = 여성, false = 남성)
      const userGender = user.sex ? 'female' : 'male';
      setGender(userGender);
      initialValuesRef.current.gender = userGender;

      // 이메일 (user_id 사용)
      if (user.user_id) {
        setEmail(user.user_id);
        setEmailState('keyout-typed');
      }
    }
  }, [user, isLoading]);

  // 이름 핸들러
  const handleNameFocus = () => {
    setNameState(name ? 'keyin-typing' : 'keyin-empty');
  };

  const handleNameBlur = () => {
    setNameState(name ? 'keyout-typed' : 'keyout-empty');
  };

  const handleNameChange = (value: string) => {
    setName(value);
    
    // 입력 중에는 에러 메시지 제거 및 일반 상태로 변경
    if (errorMessage) {
      setErrorMessage(undefined);
    }
    setNameState(value ? 'keyin-typing' : 'keyin-empty');
  };

  const handleNameClear = () => {
    setName('');
    setNameState('keyin-empty');
    setErrorMessage(undefined);
  };

  // 생년월일 핸들러
  const handleBirthYearFocus = () => {
    setBirthYearState(birthYear ? 'keyin-typing' : 'keyin-empty');
  };

  const handleBirthYearBlur = () => {
    setBirthYearState(birthYear ? 'keyout-typed' : 'keyout-empty');
  };

  const handleBirthYearChange = (value: string) => {
    setBirthYear(value);
    setBirthYearState(value ? 'keyin-typing' : 'keyin-empty');
    
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
          setBirthDay('');
          setBirthDayState('keyin-empty');
        }
      }
    }
  };

  const handleBirthMonthFocus = () => {
    setBirthMonthState(birthMonth ? 'keyin-typing' : 'keyin-empty');
  };

  const handleBirthMonthBlur = () => {
    setBirthMonthState(birthMonth ? 'keyout-typed' : 'keyout-empty');
  };

  const handleBirthMonthChange = (value: string) => {
    setBirthMonth(value);
    setBirthMonthState(value ? 'keyin-typing' : 'keyin-empty');
    
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
          setBirthDay('');
          setBirthDayState('keyin-empty');
        }
      }
    }
  };

  const handleBirthDayFocus = () => {
    setBirthDayState(birthDay ? 'keyin-typing' : 'keyin-empty');
  };

  const handleBirthDayBlur = () => {
    setBirthDayState(birthDay ? 'keyout-typed' : 'keyout-empty');
  };

  const handleBirthDayChange = (value: string) => {
    setBirthDay(value);
    setBirthDayState(value ? 'keyin-typing' : 'keyin-empty');
  };


  // 이메일 핸들러
  const handleEmailFocus = () => {
    setEmailState(email ? 'keyin-typing' : 'keyin-empty');
  };

  const handleEmailBlur = () => {
    setEmailState(email ? 'keyout-typed' : 'keyout-empty');
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailState(value ? 'keyin-typing' : 'keyin-empty');
  };

  const handleEmailClear = () => {
    setEmail('');
    setEmailState('keyin-empty');
  };

  // 변경 사항이 있는지 확인
  const hasChanges = useMemo(() => {
    const initial = initialValuesRef.current;
    const currentName = name.trim();
    const initialName = initial.name.trim();
    
    // 이름 변경 확인
    if (currentName !== initialName) {
      return true;
    }
    
    // 생년월일 변경 확인
    if (birthYear !== initial.birthYear || 
        birthMonth !== initial.birthMonth || 
        birthDay !== initial.birthDay) {
      return true;
    }
    
    // 성별 변경 확인
    if (gender !== initial.gender) {
      return true;
    }
    
    return false;
  }, [name, birthYear, birthMonth, birthDay, gender]);

  // 저장 핸들러
  const handleSave = async () => {
    try {
      // 이름 유효성 검사: 저장 시에만 검사
      const trimmedName = name.trim();
      if (trimmedName.length > 8) {
        // 8자 초과: 빨간색 경고 표시
        setErrorMessage('최대 8자까지 입력 가능합니다');
        setNameState('keyout-error');
        return;
      }
      
      // 유효성 검사 통과: 에러 메시지 제거
      setErrorMessage(undefined);
      setNameState('keyout-empty');
      
      // 생년월일을 ISO 8601 형식으로 변환
      // 년/월/일 중 하나라도 입력되어 있으면 변환 시도
      let birthdayISO: string | undefined = undefined;
      if (birthYear && birthMonth && birthDay) {
        const year = parseInt(birthYear, 10);
        const month = parseInt(birthMonth, 10) - 1; // JavaScript Date는 0부터 시작
        const day = parseInt(birthDay, 10);
        
        // UTC 기준으로 날짜 생성 (시간대 변환 문제 방지)
        const birthDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
        if (!isNaN(birthDate.getTime())) {
          birthdayISO = birthDate.toISOString();
        }
      }

      // 성별을 boolean으로 변환 (true = 여성, false = 남성)
      const sex = gender === 'female';

      // 프로필 업데이트 데이터 준비
      const updateData: UpdateUserProfileRequest = {};

      // 이름 (변경된 경우만 전송)
      if (trimmedName !== initialValuesRef.current.name.trim()) {
        updateData.name = trimmedName;
      }

      // 생년월일 (변경된 경우만 전송)
      const initialBirthday = initialValuesRef.current;
      if (birthYear !== initialBirthday.birthYear || 
          birthMonth !== initialBirthday.birthMonth || 
          birthDay !== initialBirthday.birthDay) {
        if (birthdayISO) {
          updateData.birthday = birthdayISO;
        }
      }

      // 성별 (변경된 경우만 전송)
      if (gender !== initialValuesRef.current.gender) {
        updateData.sex = sex;
      }

      // 변경 사항이 없으면 API 호출하지 않음
      if (Object.keys(updateData).length === 0) {
        showToast('변경된 내용이 없습니다.');
        return;
      }

      // 디버깅: 전송할 데이터 확인
      console.log('프로필 업데이트 데이터:', updateData);

      // API 호출
      const response = await updateUserProfile(updateData);
      
      if (response.ok) {
        // 저장 성공: 초기 값 업데이트
        initialValuesRef.current = {
          name: trimmedName,
          birthYear,
          birthMonth,
          birthDay,
          gender,
        };
        
        // 사용자 정보 새로고침
        await refreshUserData();
        
        showToast('프로필이 저장되었습니다.');
        popFullSheet();
      } else {
        // 저장 실패
        const errorData = await response.json().catch(() => ({}));
        console.error('프로필 저장 실패:', errorData);
        showToast('프로필 저장 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      showToast('프로필 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="bg-white box-border content-stretch flex flex-col items-start relative shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] min-h-screen">
      {/* 헤더 */}
      <div className="box-border content-stretch flex h-[68px] items-center justify-between p-[20px] relative shrink-0 w-full">
        <button
          onClick={() => popFullSheet({ exitAnimationDirection: 'right' })}
          className="content-stretch flex gap-[10px] items-center relative shrink-0"
        >
          <div className="relative shrink-0 size-[24px]">
            <div className="absolute flex inset-[17.71%_32.29%] items-center justify-center">
              <div className="flex-none h-[8.5px] rotate-[90deg] w-[15.5px]">
                <img alt="" className="block max-w-none size-full" src={IconArrowLeft} />
              </div>
            </div>
          </div>
        </button>
        <div className="flex flex-col font-['Pretendard_Variable:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#2b2f36] text-[18px] text-nowrap">
          <p className="leading-[24px] whitespace-pre">프로필 수정</p>
        </div>
        <div className="shrink-0 size-[24px]" />
      </div>

      {/* 폼 컨텐츠 */}
      <div className="basis-0 box-border content-stretch flex flex-col gap-[16px] grow items-end min-h-px min-w-px pb-0 pt-[20px] px-[20px] relative shrink-0 w-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          {/* 이름 */}
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <p className="[white-space-collapse:collapse] font-['Pretendard_Variable:Medium',sans-serif] leading-[20px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#2b2f36] text-[15px] text-nowrap w-full">
              이름
            </p>
            <InputNormal
              value={name}
              placeholder="홍길동"
              state={nameState}
              errorMessage={errorMessage}
              className="content-stretch flex flex-col gap-[8px] h-[72px] items-start relative shrink-0 w-full"
              onChange={handleNameChange}
              onFocus={handleNameFocus}
              onBlur={handleNameBlur}
              onClear={handleNameClear}
            />
          </div>

          {/* 생년월일 */}
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <p className="[white-space-collapse:collapse] font-['Pretendard_Variable:Medium',sans-serif] leading-[20px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#2b2f36] text-[15px] text-nowrap w-full">
              생년월일
            </p>
            <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
              {/* 년도 */}
              <div className="basis-0 content-stretch flex flex-col gap-[8px] grow h-[72px] items-start min-h-px min-w-px relative shrink-0">
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
              <div className="content-stretch flex flex-col gap-[8px] h-[72px] items-start relative shrink-0 w-[100px]">
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
              <div className="content-stretch flex flex-col gap-[8px] h-[72px] items-start relative shrink-0 w-[100px]">
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
          </div>

          {/* 성별 */}
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <p className="[white-space-collapse:collapse] font-['Pretendard_Variable:Medium',sans-serif] leading-[20px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#2b2f36] text-[15px] text-nowrap w-full">
              성별
            </p>
            <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
              {/* 남성 */}
              <button
                type="button"
                onClick={() => setGender('male')}
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
                onClick={() => setGender('female')}
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
          </div>

          {/* 이메일 (읽기 전용) */}
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <p className="[white-space-collapse:collapse] font-['Pretendard_Variable:Medium',sans-serif] leading-[20px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#2b2f36] text-[15px] text-nowrap w-full">
              이메일
            </p>
            <div className="content-stretch flex flex-col gap-[8px] h-[72px] items-start relative shrink-0 w-full">
              <InputNormal
                value={email}
                placeholder="abc@next.com"
                state={emailState}
                type="email"
                disabled={true}
                className="w-full"
                onChange={handleEmailChange}
                onFocus={handleEmailFocus}
                onBlur={handleEmailBlur}
                onClear={handleEmailClear}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
        <div className="bg-white box-border content-stretch flex flex-col items-start pb-[16px] pt-[4px] px-[16px] relative shrink-0 w-full">
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges}
            className={`box-border content-stretch flex gap-[6px] h-[48px] items-center justify-center px-[14px] py-0 relative rounded-[6px] shrink-0 w-full transition-colors ${
              hasChanges
                ? 'bg-[#2c9696] text-white cursor-pointer hover:bg-[#2c9696]/90'
                : 'bg-[#2c9696] text-white opacity-50 cursor-not-allowed'
            }`}
          >
            <p className="font-['Pretendard_Variable:Medium',sans-serif] leading-[22px] not-italic relative shrink-0 text-[16px] text-nowrap whitespace-pre">
              저장
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

