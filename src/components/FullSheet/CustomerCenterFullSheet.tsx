import { type ReactElement, useState } from 'react';
import IconArrowLeft from '../../assets/icon_svg/ProfileEdit/IconArrowLeft.svg';
import Icon16LineChevronDown from '../../assets/icon_svg/CustomerCenter/Icon16LineChevronDown.svg';
import IconCursor from '../../assets/icon_svg/CustomerCenter/IconCursor.svg';
import { InputNormal } from '../input/InputNormal';
import type { InputState } from '../../types/input';
import { sendContact } from '../../api/contact';
import { useToast } from '../../contexts/ToastContext';
import { useFullSheet } from '../../hooks/useFullSheet';

/**
 * 고객센터 페이지
 */
export function CustomerCenter(): ReactElement {
  const { showToast } = useToast();
  const { popFullSheet } = useFullSheet();

  // 폼 상태
  const [email, setEmail] = useState('');
  const [emailState, setEmailState] = useState<InputState>('keyin-empty');
  
  const [inquiryType, setInquiryType] = useState('구독 문의');
  const [showInquiryTypeDropdown, setShowInquiryTypeDropdown] = useState(false);
  
  const [inquiryContent, setInquiryContent] = useState('');
  const [isContentFocused, setIsContentFocused] = useState(false);

  const inquiryTypes = ['구독 문의', '결제 문의', '기능 문의', '기타 문의'];

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

  // 문의하기 핸들러
  const handleSubmit = async () => {
    // 입력 값 검증
    if (!email.trim()) {
      showToast('이메일을 입력해주세요.');
      return;
    }
    
    if (!inquiryContent.trim()) {
      showToast('문의 내용을 입력해주세요.');
      return;
    }

    try {
      const response = await sendContact({
        email: email.trim(),
        inquiry_type: inquiryType,
        inquiry_content: inquiryContent.trim(),
      });

      if (response.ok) {
        showToast('문의가 접수되었습니다.');
        // 폼 초기화
        setEmail('');
        setEmailState('keyin-empty');
        setInquiryType('구독 문의');
        setInquiryContent('');
        // FullSheet 닫기
        popFullSheet();
      } else {
        // 상태 코드에 따른 메시지 우선 표시
        let errorMessage = '문의 접수에 실패했습니다.';
        
        if (response.status === 500) {
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        } else if (response.status === 400) {
          errorMessage = '입력 정보를 확인해주세요.';
        } else if (response.status === 401) {
          errorMessage = '로그인이 필요합니다.';
        } else if (response.status === 403) {
          errorMessage = '권한이 없습니다.';
        } else if (response.status === 404) {
          errorMessage = '요청한 페이지를 찾을 수 없습니다.';
        } else if (response.status >= 500) {
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
        
        showToast(errorMessage);
      }
    } catch (error) {
      console.error('문의 접수 실패:', error);
      showToast('문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
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
          <p className="leading-[24px] whitespace-pre">고객 센터</p>
        </div>
        <div className="shrink-0 size-[24px]" />
      </div>

      {/* 폼 컨텐츠 */}
      <div className="bg-white box-border content-stretch flex flex-col gap-[16px] items-center pb-0 pt-[20px] px-[20px] relative shrink-0 w-full">
        {/* 답변 받으실 이메일 */}
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          <p className="[white-space-collapse:collapse] font-['Pretendard_Variable:Medium',sans-serif] leading-[20px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#2b2f36] text-[15px] text-nowrap w-full">
            답변 받으실 이메일
          </p>
          <InputNormal
            value={email}
            placeholder="abc@nextvine.com"
            state={emailState}
            type="email"
            className="content-stretch flex flex-col gap-[8px] h-[72px] items-start relative shrink-0 w-full"
            onChange={handleEmailChange}
            onFocus={handleEmailFocus}
            onBlur={handleEmailBlur}
            onClear={handleEmailClear}
          />
        </div>

        {/* 문의 유형 */}
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          <p className="[white-space-collapse:collapse] font-['Pretendard_Variable:Medium',sans-serif] leading-[20px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#2b2f36] text-[15px] text-nowrap w-full">
            문의 유형
          </p>
          <div className="box-border content-stretch flex flex-col gap-[8px] items-start pb-[20px] pt-0 px-0 relative shrink-0 w-full">
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => setShowInquiryTypeDropdown(!showInquiryTypeDropdown)}
                className="bg-[#f3f4f7] border border-[#d4d9e2] border-solid box-border content-stretch flex h-[52px] items-center justify-between pl-[16px] pr-[12px] py-0 relative rounded-[6px] shrink-0 w-full"
              >
                <p className="[white-space-collapse:collapse] font-['Pretendard_Variable:Medium',sans-serif] leading-[20px] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#2b2f36] text-[15px] text-left text-nowrap">
                  {inquiryType}
                </p>
                <div className="content-stretch flex items-center justify-center relative shrink-0 size-[32px]">
                  <div className="relative shrink-0 size-[16px]">
                    <div className="absolute inset-[31.63%_12.88%_25.94%_12.88%]">
                      <img alt="" className="block max-w-none size-full" src={Icon16LineChevronDown} />
                    </div>
                  </div>
                </div>
              </button>

              {/* 드롭다운 메뉴 */}
              {showInquiryTypeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#d4d9e2] border-solid rounded-[6px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)] z-10">
                  {inquiryTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setInquiryType(type);
                        setShowInquiryTypeDropdown(false);
                      }}
                      className={`w-full text-left px-[16px] py-[12px] text-[15px] leading-[20px] font-['Pretendard_Variable:Medium',sans-serif] ${
                        inquiryType === type
                          ? 'bg-[#f3f4f7] text-[#2b2f36]'
                          : 'text-[#2b2f36] hover:bg-[#f3f4f7]'
                      } first:rounded-t-[6px] last:rounded-b-[6px]`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 문의 내용 */}
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          <p className="[white-space-collapse:collapse] font-['Pretendard_Variable:Medium',sans-serif] leading-[20px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#2b2f36] text-[15px] text-nowrap w-full">
            문의 내용
          </p>
          <div className="bg-[#f3f4f7] border border-[#d4d9e2] border-solid box-border content-stretch flex h-[202px] items-start pb-0 pl-[16px] pr-[12px] pt-[14px] relative rounded-[6px] shrink-0 w-full">
            {isContentFocused && (
              <div className="absolute h-[20px] left-[16px] top-[14px] w-0">
                <div className="absolute bottom-0 left-[-0.3px] right-[-0.3px] top-0">
                  <img alt="" className="block max-w-none size-full" src={IconCursor} />
                </div>
              </div>
            )}
            <textarea
              value={inquiryContent}
              onChange={(e) => setInquiryContent(e.target.value)}
              onFocus={() => setIsContentFocused(true)}
              onBlur={() => setIsContentFocused(false)}
              placeholder="문의 내용을 작성해주세요"
              className="[white-space-collapse:collapse] basis-0 font-['Pretendard_Variable:Medium',sans-serif] grow leading-[20px] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[15px] w-full h-full bg-transparent border-0 outline-0 resize-none placeholder:text-[#b6bece] text-[#2b2f36]"
            />
          </div>
        </div>
      </div>

      {/* 문의하기 버튼 */}
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full mt-auto">
        <div className="bg-white box-border content-stretch flex flex-col items-start pb-[16px] pt-[4px] px-[16px] relative shrink-0 w-full">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-[#2c9696] box-border content-stretch flex gap-[6px] h-[48px] items-center justify-center px-[14px] py-0 relative rounded-[6px] shrink-0 w-full"
          >
            <p className="font-['Pretendard_Variable:Medium',sans-serif] leading-[22px] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">
              문의하기
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

