import { type ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconArrowLeft from '../../assets/icon_svg/ProfileEdit/IconArrowLeft.svg';
import IconToggle from '../../assets/icon_svg/Settings/IconToggle.svg';

/**
 * 환경 설정 페이지
 */
export function Settings(): ReactElement {
  const navigate = useNavigate();

  // 토글 상태
  const [cellularData, setCellularData] = useState(true);
  const [otherSettings, setOtherSettings] = useState(false);
  const [importantNotifications, setImportantNotifications] = useState(true);
  const [otherNotifications, setOtherNotifications] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const handleSave = () => {
    // TODO: 설정 저장 API 호출
    console.log('설정 저장:', {
      cellularData,
      otherSettings,
      importantNotifications,
      otherNotifications,
      marketingConsent,
    });
    navigate('/my');
  };

  return (
    <div className="bg-white box-border content-stretch flex flex-col items-start relative shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] min-h-screen">
      {/* 헤더 */}
      <div className="box-border content-stretch flex h-[68px] items-center justify-between p-[20px] relative shrink-0 w-full">
        <button
          onClick={() => navigate('/my')}
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
          <p className="leading-[24px] whitespace-pre">환경 설정</p>
        </div>
        <div className="shrink-0 size-[24px]" />
      </div>

      {/* 설정 리스트 */}
      <div className="bg-white box-border content-stretch flex flex-col items-center px-0 py-[20px] relative shrink-0 w-full">
        {/* 기본 설정 섹션 */}
        <div className="bg-[#f3f4f7] box-border content-stretch flex gap-[54px] h-[40px] items-center px-[24px] py-0 relative shrink-0 w-full">
          <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#657085] text-[14px] text-nowrap">
            <p className="leading-[20px] whitespace-pre">기본 설정</p>
          </div>
        </div>

        {/* 셀룰러 데이터 사용 */}
        <div className="bg-white box-border content-stretch flex h-[64px] items-center justify-between px-[24px] py-0 relative shrink-0 w-full">
          <div className="content-stretch flex flex-col items-start justify-center relative shrink-0">
            <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-nowrap">
              <p className="leading-[20px] whitespace-pre">셀룰러 데이터 사용</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCellularData(!cellularData)}
            className={`box-border content-stretch flex gap-[10px] items-center py-[2px] relative rounded-[14px] shrink-0 transition-colors ${
              cellularData
                ? 'bg-[#2c9696] pl-[16px] pr-[2px]'
                : 'bg-[#d4d9e2] pl-[2px] pr-[16px]'
            }`}
          >
            <div className="relative shrink-0 size-[20px]">
              <img alt="" className="block max-w-none size-full" src={IconToggle} />
            </div>
          </button>
        </div>

        {/* 구분선 */}
        <div className="bg-[#edeff3] h-px shrink-0 w-full" />

        {/* 기타 설정 */}
        <div className="bg-white box-border content-stretch flex h-[64px] items-center justify-between px-[24px] py-0 relative shrink-0 w-full">
          <div className="content-stretch flex flex-col items-start justify-center leading-[0] not-italic relative shrink-0 text-nowrap">
            <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] justify-center relative shrink-0 text-[14px] text-black">
              <p className="leading-[20px] text-nowrap whitespace-pre">기타 설정</p>
            </div>
            <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] justify-center relative shrink-0 text-[#515968] text-[12px]">
              <p className="leading-[16px] text-nowrap whitespace-pre">설정 설명</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOtherSettings(!otherSettings)}
            className={`box-border content-stretch flex gap-[10px] items-center py-[2px] relative rounded-[14px] shrink-0 transition-colors ${
              otherSettings
                ? 'bg-[#2c9696] pl-[16px] pr-[2px]'
                : 'bg-[#d4d9e2] pl-[2px] pr-[16px]'
            }`}
          >
            <div className="relative shrink-0 size-[20px]">
              <img alt="" className="block max-w-none size-full" src={IconToggle} />
            </div>
          </button>
        </div>

        {/* 알림 설정 섹션 */}
        <div className="bg-[#f3f4f7] box-border content-stretch flex gap-[54px] h-[40px] items-center px-[24px] py-0 relative shrink-0 w-full">
          <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#657085] text-[14px] text-nowrap">
            <p className="leading-[20px] whitespace-pre">알림 설정</p>
          </div>
        </div>

        {/* 중요알림 받기 */}
        <div className="bg-white box-border content-stretch flex h-[64px] items-center justify-between px-[24px] py-0 relative shrink-0 w-full">
          <div className="content-stretch flex flex-col items-start justify-center leading-[0] not-italic relative shrink-0 text-nowrap">
            <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] justify-center relative shrink-0 text-[14px] text-black">
              <p className="leading-[20px] text-nowrap whitespace-pre">중요알림 받기</p>
            </div>
            <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] justify-center relative shrink-0 text-[#515968] text-[12px]">
              <p className="leading-[16px] text-nowrap whitespace-pre">측정 결과 알림, 채팅 등</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setImportantNotifications(!importantNotifications)}
            className={`box-border content-stretch flex gap-[10px] items-center py-[2px] relative rounded-[14px] shrink-0 transition-colors ${
              importantNotifications
                ? 'bg-[#2c9696] pl-[16px] pr-[2px]'
                : 'bg-[#d4d9e2] pl-[2px] pr-[16px]'
            }`}
          >
            <div className="relative shrink-0 size-[20px]">
              <img alt="" className="block max-w-none size-full" src={IconToggle} />
            </div>
          </button>
        </div>

        {/* 구분선 */}
        <div className="bg-[#edeff3] h-px shrink-0 w-full" />

        {/* 기타알림 받기 */}
        <div className="bg-white box-border content-stretch flex h-[64px] items-center justify-between px-[24px] py-0 relative shrink-0 w-full">
          <div className="content-stretch flex flex-col items-start justify-center leading-[0] not-italic relative shrink-0 text-nowrap">
            <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] justify-center relative shrink-0 text-[14px] text-black">
              <p className="leading-[20px] text-nowrap whitespace-pre">기타알림 받기</p>
            </div>
            <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] justify-center relative shrink-0 text-[#515968] text-[12px]">
              <p className="leading-[16px] text-nowrap whitespace-pre">신규 상품 등록 등</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOtherNotifications(!otherNotifications)}
            className={`box-border content-stretch flex gap-[10px] items-center py-[2px] relative rounded-[14px] shrink-0 transition-colors ${
              otherNotifications
                ? 'bg-[#2c9696] pl-[16px] pr-[2px]'
                : 'bg-[#d4d9e2] pl-[2px] pr-[16px]'
            }`}
          >
            <div className="relative shrink-0 size-[20px]">
              <img alt="" className="block max-w-none size-full" src={IconToggle} />
            </div>
          </button>
        </div>

        {/* 구분선 */}
        <div className="bg-[#edeff3] h-px shrink-0 w-full" />

        {/* 마케팅 수신 동의 */}
        <div className="bg-white box-border content-stretch flex h-[64px] items-center justify-between px-[24px] py-0 relative shrink-0 w-full">
          <div className="content-stretch flex flex-col items-start justify-center leading-[0] not-italic relative shrink-0 text-nowrap">
            <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] justify-center relative shrink-0 text-[14px] text-black">
              <p className="leading-[20px] text-nowrap whitespace-pre">마케팅 수신 동의</p>
            </div>
            <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] justify-center relative shrink-0 text-[#515968] text-[12px]">
              <p className="leading-[16px] text-nowrap whitespace-pre">이벤트 등</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMarketingConsent(!marketingConsent)}
            className={`box-border content-stretch flex gap-[10px] items-center py-[2px] relative rounded-[14px] shrink-0 transition-colors ${
              marketingConsent
                ? 'bg-[#2c9696] pl-[16px] pr-[2px]'
                : 'bg-[#d4d9e2] pl-[2px] pr-[16px]'
            }`}
          >
            <div className="relative shrink-0 size-[20px]">
              <img alt="" className="block max-w-none size-full" src={IconToggle} />
            </div>
          </button>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full mt-auto">
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

