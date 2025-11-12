import { type ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputNormal } from '../components/input/InputNormal';
import { DefaultBtn } from '../components/button/DefaultBtn';
import { useFullSheet } from '../hooks/useFullSheet';
import { useCacheStorage } from '../hooks/useCacheStorage';
import { SignupEmailFullSheet } from '../components/FullSheet/SignupEmailFullSheet';
import { PasswordResetFullSheet } from '../components/FullSheet/PasswordResetFullSheet';
import { SIGNUP_DATA_KEY, type SignupData } from '../types/signup';
import { IconNextVineLogo } from '../assets/Icon';
import { login } from '../api/auth';
import { setCookie } from '../utils/common';

export function Login(): ReactElement {
  const navigate = useNavigate();
  const { pushFullSheet } = useFullSheet();
  const cache = useCacheStorage();
  const [email, setEmail] = useState('test02@gmail.com');
  const [password, setPassword] = useState('test!@34');
  const [emailState, setEmailState] = useState<'keyout-empty' | 'keyin-empty' | 'keyin-typing' | 'keyout-error'>('keyin-typing');
  const [passwordState, setPasswordState] = useState<'keyout-empty' | 'keyin-empty' | 'keyin-typing' | 'keyout-error'>('keyin-typing');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);

  const handleEmailFocus = () => {
    setEmailState(email ? 'keyin-typing' : 'keyin-empty');
  };

  const handleEmailBlur = () => {
    setEmailState('keyout-empty');
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      // 에러가 표시된 상태에서 입력하면 에러 제거
      setEmailError(undefined);
      setEmailState('keyin-typing');
    } else {
      setEmailState(value ? 'keyin-typing' : 'keyin-empty');
    }
  };

  const handlePasswordFocus = () => {
    setPasswordState(password ? 'keyin-typing' : 'keyin-empty');
  };

  const handlePasswordBlur = () => {
    setPasswordState('keyout-empty');
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) {
      // 에러가 표시된 상태에서 입력하면 에러 제거
      setPasswordError(undefined);
      setPasswordState('keyin-typing');
    } else {
      setPasswordState(value ? 'keyin-typing' : 'keyin-empty');
    }
  };

  const handleLogin = async () => {
    // 입력 값 검증
    let hasError = false;
    
    if (!email.trim()) {
      setEmailError('이메일을 입력해주세요');
      setEmailState('keyout-error');
      hasError = true;
    } else {
      setEmailError(undefined);
    }
    
    if (!password.trim()) {
      setPasswordError('비밀번호를 입력해주세요');
      setPasswordState('keyout-error');
      hasError = true;
    } else {
      setPasswordError(undefined);
    }
    
    if (hasError) {
      return;
    };
    
    try{
      const response = await login({
        "user_id": email,
        "user_pw": password,
      });
      
      // access_token을 쿠키에 저장
      setCookie('userAccessToken', response.access_token);
      
      console.log('로그인 성공:', {
        email: response.email,
        name: response.name,
        user_id: response.user_id,
      });
      
      // 로그인 성공 후 Splash 페이지로 이동 (Splash에서 토큰 확인 후 Home으로 이동)
      navigate('/', { replace: true });
    }catch(error){
      console.error('로그인 실패:', error);
    }



    // if (response.status === 200 && response.data) {
    //   // 로그인 성공 시 토큰 저장
    //   setCookie('userAccessToken', response.data.accessToken);
    //   localStorage.setItem('userRefreshToken', response.data.refreshToken);
    //   // 로그인 성공 시 홈 페이지로 이동
    //   navigate('/home', { replace: true });
    // } else {
    //   // 로그인 실패 시 토스트 알림만 표시
    //   const errorMessage = response.message || '로그인에 실패했습니다.';
    //   showToast(errorMessage);
    // };
  };

  return (
    <div className="min-h-screen bg-white box-border flex flex-col items-center justify-center px-[32px] py-0 shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] relative">
      <div className="w-[296px] max-w-[300px] flex flex-col items-center gap-[60px] shrink-0">
        {/* 로고 섹션 */}
        <div className="flex flex-col items-center gap-[16px] relative shrink-0">
          {/* 로고 이미지 */}
          <IconNextVineLogo width={60} height={60} />

          {/* 브랜드 이름 및 설명 */}
          <div className="flex flex-col items-start gap-[8px] w-full relative shrink-0">
            <div className="h-[24px] relative shrink-0 w-full">
              <h1 className="absolute flex flex-col font-museo font-bold justify-center leading-[0] left-[calc(50%-57.5px)] text-[27.152px] text-nowrap top-[12.5px] tracking-[-0.2715px] text-mint-300" style={{ transform: 'translateY(-50%)' }}>
                <span className="leading-[normal] whitespace-pre">nextvine</span>
              </h1>
            </div>
            <p className="flex flex-col font-['Pretendard_Variable',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-gray-600 text-[16px] text-nowrap">
              <span className="leading-[22px] whitespace-pre">당신의 척추 건강을 측정합니다</span>
            </p>
          </div>
        </div>

        {/* 로그인 폼 */}
        <div className="w-full flex flex-col gap-[8px] items-start relative shrink-0">
          <div className="w-full flex flex-col gap-[8px] items-start relative shrink-0">
            <div className="h-[76px] flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <InputNormal
                placeholder="이메일"
                value={email}
                state={emailState}
                errorMessage={emailError}
                onChange={handleEmailChange}
                onFocus={handleEmailFocus}
                onBlur={handleEmailBlur}
                onClear={() => {
                  setEmail('');
                  setEmailState('keyin-empty');
                  setEmailError(undefined);
                }}
              />
            </div>
            <div className="h-[76px] flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <InputNormal
                type="password"
                placeholder="비밀번호"
                value={password}
                state={passwordState}
                errorMessage={passwordError}
                onChange={handlePasswordChange}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                onClear={() => {
                  setPassword('');
                  setPasswordState('keyin-empty');
                  setPasswordError(undefined);
                }}
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-[16px] items-center relative shrink-0">
            <DefaultBtn
              variant="filled"
              color="primary"
              size="big"
              onClick={handleLogin}
              className="w-full"
            >
              로그인
            </DefaultBtn>
            <DefaultBtn
              variant="text"
              onClick={() => {
                // 비밀번호 찾기 풀시트 열기
                pushFullSheet(PasswordResetFullSheet, undefined, {
                  animationDirection: 'right',
                });
              }}
              className="gap-[2px]"
            >
              비밀번호 찾기
            </DefaultBtn>
          </div>
        </div>

        {/* 회원가입 버튼 */}
        <DefaultBtn
          variant="filled"
          color="gray"
          size="regular"
          onClick={() => {
            // 회원가입 데이터 구조 초기화
            const initialSignupData: SignupData = {
              email: undefined,
              password: undefined,
              name: undefined,
              gender: undefined,
              birthYear: undefined,
              birthMonth: undefined,
              birthDay: undefined,
            };
            cache.set(SIGNUP_DATA_KEY, initialSignupData);
            
            // 이메일 입력 풀시트 열기
            pushFullSheet(SignupEmailFullSheet, undefined, {
              animationDirection: 'right', 
            });
          }}
          className="w-[160px] shrink-0"
        >
          회원가입
        </DefaultBtn>
      </div>
    </div>
  );
}
