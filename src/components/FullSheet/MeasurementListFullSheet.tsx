import { type ReactElement, useState } from 'react';
import IconArrowLeft from '../../assets/icon_svg/ProfileEdit/IconArrowLeft.svg';
import IconChevronDown from '../../assets/icon_svg/MeasurementList/IconChevronDown.svg';
import { useFullSheet } from '../../hooks/useFullSheet';
import { MeasurementDetail } from './MeasurementDetailFullSheet';
import type { Analysis } from '../../api/analysis';

/**
 * 날짜를 한국어 형식으로 변환 (예: "2025년 10월 2일")
 */
function formatMeasurementDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 분석 타입을 문자열로 변환
 */
function getAnalysisTypeString(analysisType: number): string {
  const typeMap: Record<number, string> = {
    1: '2D 카메라 촬영',
    2: '3D 동영상 측정',
    3: '척추측만계 측정',
  };
  return typeMap[analysisType] || '알 수 없음';
}

/**
 * 측정 카드 컴포넌트
 */
function MeasurementCard({ 
  date, 
  type,
  thoracic,
  lumber,
  measurement,
  onClick
}: { 
  date: string; 
  type: string;
  thoracic: string;
  lumber: string;
  measurement: Analysis;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white box-border content-stretch flex items-center justify-between overflow-clip px-[20px] py-[16px] relative rounded-[12px] shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] shrink-0 w-full cursor-pointer text-left"
    >
      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
        <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#25272d] text-[15px] text-nowrap">
          <p className="leading-[20px] whitespace-pre">{date}</p>
        </div>
        <div className="bg-[#edfdfc] box-border content-stretch flex gap-[10px] items-center justify-center px-[8px] py-[4px] relative rounded-[5px] shrink-0">
          <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#20797e] text-[13px] text-nowrap">
            <p className="leading-[18px] whitespace-pre">{type}</p>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[4px] items-end justify-center relative shrink-0">
        <div className="content-stretch flex gap-[8px] items-center leading-[0] relative shrink-0">
          <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#515968] text-[13px] text-center text-nowrap">
            <p className="leading-[16px] whitespace-pre">Thoracic</p>
          </div>
          <div className="flex flex-col font-['Pretendard_Variable:SemiBold',sans-serif] font-semibold justify-center relative shrink-0 text-[#25272d] text-[15px] w-[30px]">
            <p className="leading-[20px]">{thoracic}°</p>
          </div>
        </div>
        <div className="content-stretch flex gap-[8px] items-center leading-[0] relative shrink-0">
          <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#515968] text-[13px] text-center text-nowrap">
            <p className="leading-[16px] whitespace-pre">Lumber</p>
          </div>
          <div className="flex flex-col font-['Pretendard_Variable:SemiBold',sans-serif] font-semibold justify-center relative shrink-0 text-[#25272d] text-[15px] w-[30px]">
            <p className="leading-[20px]">{lumber}°</p>
          </div>
        </div>
      </div>
    </button>
  );
}

/**
 * 드롭다운 버튼 컴포넌트
 */
function DropdownBtnSmall({ 
  value, 
  onClick 
}: { 
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-[#e3e7ed] border-solid box-border content-stretch flex h-[40px] items-center pl-[16px] pr-[4px] py-0 relative rounded-[6px] shrink-0 w-[104px]"
    >
      <p className="[white-space-collapse:collapse] basis-0 font-['Pretendard_Variable:Regular',sans-serif] font-normal grow leading-[20px] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#515968] text-[14px] text-nowrap">
        {value}
      </p>
      <div className="content-stretch flex items-center justify-center relative shrink-0 size-[32px]">
        <div className="relative shrink-0 size-[16px]">
          <div className="absolute inset-[31.64%_12.88%_25.94%_12.88%]">
            <div className="absolute inset-0">
              <img alt="" className="block max-w-none size-full" src={IconChevronDown} />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

/**
 * 측정 목록 풀 시트 컴포넌트
 */
export function MeasurementList(): ReactElement {
  const { popFullSheet, pushFullSheet } = useFullSheet();
  const [sortOrder, setSortOrder] = useState('최신순');

  // 더미 데이터
  const dummyMeasurements: Analysis[] = [
    {
      id: 'dummy-1',
      user_uuid: 'dummy-user',
      analysis_type: 1,
      main_thoracic: 25,
      lumbar: 12,
      score: 0,
      image_url: '',
      created_at: '2025-10-02T00:00:00.000Z',
    },
    {
      id: 'dummy-2',
      user_uuid: 'dummy-user',
      analysis_type: 1,
      main_thoracic: 25,
      lumbar: 12,
      score: 0,
      image_url: '',
      created_at: '2025-10-01T00:00:00.000Z',
    },
    {
      id: 'dummy-3',
      user_uuid: 'dummy-user',
      analysis_type: 1,
      main_thoracic: 25,
      lumbar: 12,
      score: 0,
      image_url: '',
      created_at: '2025-09-30T00:00:00.000Z',
    },
    {
      id: 'dummy-4',
      user_uuid: 'dummy-user',
      analysis_type: 1,
      main_thoracic: 25,
      lumbar: 12,
      score: 0,
      image_url: '',
      created_at: '2025-09-28T00:00:00.000Z',
    },
    {
      id: 'dummy-5',
      user_uuid: 'dummy-user',
      analysis_type: 1,
      main_thoracic: 25,
      lumbar: 12,
      score: 0,
      image_url: '',
      created_at: '2025-09-27T00:00:00.000Z',
    },
    {
      id: 'dummy-6',
      user_uuid: 'dummy-user',
      analysis_type: 1,
      main_thoracic: 25,
      lumbar: 12,
      score: 0,
      image_url: '',
      created_at: '2025-09-25T00:00:00.000Z',
    },
  ];

  // 정렬 처리 (현재는 최신순만 구현)
  const sortedMeasurements = [...dummyMeasurements].sort((a, b) => {
    if (sortOrder === '최신순') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const handleSortClick = () => {
    // 드롭다운 기능은 나중에 구현 가능
    // 현재는 토글만
    setSortOrder(sortOrder === '최신순' ? '오래된순' : '최신순');
  };

  const handleMeasurementClick = (measurement: Analysis) => {
    pushFullSheet(MeasurementDetail, { measurement }, { animationDirection: 'right' });
  };

  return (
    <div className="bg-gray-50 box-border content-stretch flex flex-col items-start relative shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] min-h-screen">
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
        <div className="flex flex-col font-['Pretendard_Variable:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#2b2f36] text-[18px] text-nowrap">
          <p className="leading-[24px] whitespace-pre">측정 목록</p>
        </div>
        <div className="shrink-0 size-[24px]" />
      </div>

      {/* 컨텐츠 */}
      <div className="box-border content-stretch flex flex-col gap-[16px] items-end px-[20px] py-0 relative shrink-0 w-full overflow-y-auto flex-1 min-h-0">
        {/* 정렬 드롭다운 */}
        <div className="content-stretch flex flex-col gap-[8px] h-[40px] items-start relative shrink-0 w-[104px]">
          <DropdownBtnSmall value={sortOrder} onClick={handleSortClick} />
        </div>

        {/* 측정 목록 */}
        <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
          {sortedMeasurements.map((measurement) => (
            <MeasurementCard
              key={measurement.id}
              date={formatMeasurementDate(measurement.created_at)}
              type={getAnalysisTypeString(measurement.analysis_type)}
              thoracic={String(measurement.main_thoracic)}
              lumber={String(measurement.lumbar)}
              measurement={measurement}
              onClick={() => handleMeasurementClick(measurement)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

