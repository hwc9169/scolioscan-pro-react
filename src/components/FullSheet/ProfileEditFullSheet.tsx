import { type ReactElement, useState, useEffect } from 'react';
import { InputNormal } from '../input/InputNormal';
import IconArrowLeft from '../../assets/icon_svg/ProfileEdit/IconArrowLeft.svg';
import type { InputState } from '../../types/input';
import { useToast } from '../../contexts/ToastContext';
import { useFullSheet } from '../../hooks/useFullSheet';
import { useAppData } from '../../contexts/AppDataContext';

/**
 * 프로필 수정 페이지
 */
export function ProfileEdit(): ReactElement {
  const { showToast } = useToast();
  const { popFullSheet } = useFullSheet();
  const { appData } = useAppData();
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

  // 사용자 정보가 로드되면 폼에 채우기
  useEffect(() => {
    if (user && !isLoading) {
      // 이름
      if (user.name) {
        setName(user.name);
        setNameState('keyout-typed');
      }

      // 생년월일 (ISO 8601 형식에서 파싱)
      if (user.birthday) {
        const birthDate = new Date(user.birthday);
        if (!isNaN(birthDate.getTime())) {
          const year = birthDate.getFullYear().toString();
          const month = String(birthDate.getMonth() + 1).padStart(2, '0');
          const day = String(birthDate.getDate()).padStart(2, '0');
          
          setBirthYear(year);
          setBirthYearState('keyout-typed');
          setBirthMonth(month);
          setBirthMonthState('keyout-typed');
          setBirthDay(day);
          setBirthDayState('keyout-typed');
        }
      }

      // 성별 (boolean: true = 여성, false = 남성)
      setGender(user.sex ? 'female' : 'male');

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
    setNameState(value ? 'keyin-typing' : 'keyin-empty');
  };

  const handleNameClear = () => {
    setName('');
    setNameState('keyin-empty');
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

  const handleBirthYearClear = () => {
    setBirthYear('');
    setBirthYearState('keyin-empty');
  };

  const handleBirthMonthClear = () => {
    setBirthMonth('');
    setBirthMonthState('keyin-empty');
  };

  const handleBirthDayClear = () => {
    setBirthDay('');
    setBirthDayState('keyin-empty');
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

  // 저장 핸들러
  const handleSave = async () => {
    try {
      // 생년월일을 ISO 8601 형식으로 변환
      // 년/월/일 중 하나라도 입력되어 있으면 변환 시도
      let birthdayISO = '';
      if (birthYear || birthMonth || birthDay) {
        const year = birthYear ? parseInt(birthYear, 10) : new Date().getFullYear();
        const month = birthMonth ? parseInt(birthMonth, 10) - 1 : 0; // JavaScript Date는 0부터 시작
        const day = birthDay ? parseInt(birthDay, 10) : 1;
        
        // UTC 기준으로 날짜 생성 (시간대 변환 문제 방지)
        const birthDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
        if (!isNaN(birthDate.getTime())) {
          birthdayISO = birthDate.toISOString();
        }
      }

      // 성별을 boolean으로 변환 (true = 여성, false = 남성)
      const sex = gender === 'female';

      // 프로필 업데이트 데이터 준비
      // API 스펙에 맞게 필요한 필드만 전송 (이메일은 수정 불가)
      const updateData: {
        name?: string;
        phone?: string;
        address?: string;
        detail_address?: string;
        birthday?: string;
        sex?: boolean;
      } = {};

      // 이름
      if (name) {
        updateData.name = name;
      }

      // 생년월일 (변환된 값이 있으면 전송)
      if (birthdayISO) {
        updateData.birthday = birthdayISO;
      }

      // 성별 (항상 전송)
      updateData.sex = sex;

      // 디버깅: 전송할 데이터 확인
      console.log('프로필 업데이트 데이터:', updateData);

      // TODO: API 호출
      // const response = await userAPI.updateProfile(updateData);
      
      // 임시: 저장 성공 처리
      showToast('프로필이 저장되었습니다.');
      popFullSheet();
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
          onClick={() => popFullSheet()}
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
              placeholder="이름을 입력해주세요"
              state={nameState}
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
              <div className="basis-0 content-stretch flex flex-col gap-[8px] grow h-[72px] items-start min-h-px min-w-px relative shrink-0">
                <InputNormal
                  value={birthYear}
                  placeholder="년"
                  state={birthYearState}
                  type="number"
                  maxLength={4}
                  className="w-full"
                  onChange={handleBirthYearChange}
                  onFocus={handleBirthYearFocus}
                  onBlur={handleBirthYearBlur}
                  onClear={handleBirthYearClear}
                />
              </div>
              <div className="content-stretch flex flex-col gap-[8px] h-[72px] items-start relative shrink-0 w-[100px]">
                <InputNormal
                  value={birthMonth}
                  placeholder="월"
                  state={birthMonthState}
                  type="number"
                  maxLength={2}
                  className="w-full"
                  onChange={handleBirthMonthChange}
                  onFocus={handleBirthMonthFocus}
                  onBlur={handleBirthMonthBlur}
                  onClear={handleBirthMonthClear}
                />
              </div>
              <div className="content-stretch flex flex-col gap-[8px] h-[72px] items-start relative shrink-0 w-[100px]">
                <InputNormal
                  value={birthDay}
                  placeholder="일"
                  state={birthDayState}
                  type="number"
                  maxLength={2}
                  className="w-full"
                  onChange={handleBirthDayChange}
                  onFocus={handleBirthDayFocus}
                  onBlur={handleBirthDayBlur}
                  onClear={handleBirthDayClear}
                />
              </div>
            </div>
          </div>

          {/* 성별 */}
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <p className="[white-space-collapse:collapse] font-['Pretendard_Variable:Medium',sans-serif] leading-[20px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#2b2f36] text-[15px] text-nowrap w-full">
              성별
            </p>
            <div className="content-stretch flex gap-[8px] h-[72px] items-start relative shrink-0 w-full">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`basis-0 box-border content-stretch flex grow h-[52px] items-center min-h-px min-w-px pl-[16px] pr-[12px] py-0 relative rounded-[6px] shrink-0 ${
                  gender === 'male'
                    ? 'bg-[#edfdfc] border border-[#2c9696] border-solid'
                    : 'bg-[#f3f4f7] border border-[rgba(0,0,0,0.04)] border-solid'
                }`}
              >
                <p
                  className={`[white-space-collapse:collapse] basis-0 font-['Pretendard_Variable',sans-serif] grow leading-[20px] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[15px] text-center text-nowrap ${
                    gender === 'male'
                      ? 'font-bold text-[#2c9696]'
                      : 'font-medium text-[#7e89a0]'
                  }`}
                >
                  남성
                </p>
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`basis-0 box-border content-stretch flex grow h-[52px] items-center min-h-px min-w-px pl-[16px] pr-[12px] py-0 relative rounded-[6px] shrink-0 ${
                  gender === 'female'
                    ? 'bg-[#edfdfc] border border-[#2c9696] border-solid'
                    : 'bg-[#f3f4f7] border border-[rgba(0,0,0,0.04)] border-solid'
                }`}
              >
                <p
                  className={`[white-space-collapse:collapse] basis-0 font-['Pretendard_Variable',sans-serif] grow leading-[20px] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[15px] text-center text-nowrap ${
                    gender === 'female'
                      ? 'font-bold text-[#2c9696]'
                      : 'font-medium text-[#7e89a0]'
                  }`}
                >
                  여성
                </p>
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
            className="bg-[#2c9696] box-border content-stretch flex gap-[6px] h-[48px] items-center justify-center px-[14px] py-0 relative rounded-[6px] shrink-0 w-full"
          >
            <p className="font-['Pretendard_Variable:Medium',sans-serif] leading-[22px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">
              저장
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

