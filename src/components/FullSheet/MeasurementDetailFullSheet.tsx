import { type ReactElement } from 'react';
import IconArrowLeft from '../../assets/icon_svg/ProfileEdit/IconArrowLeft.svg';
import ChartGraph from '../../assets/icon_svg/MeasurementDetail/ChartGraph.svg';
import MeasurementImage from '../../assets/icon_svg/MeasurementDetail/MeasurementImage.png';
import { useFullSheet } from '../../hooks/useFullSheet';
import type { Analysis } from '../../api/analysis';

/**
 * 날짜를 한국어 형식으로 변환 (예: "2025년 10월 3일")
 */
function formatMeasurementDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

interface MeasurementDetailProps {
  measurement?: Analysis;
}

/**
 * 측정 상세 풀 시트 컴포넌트
 */
export function MeasurementDetail(props: MeasurementDetailProps & Record<string, unknown>): ReactElement {
  const { measurement } = props;
  
  // measurement가 없으면 더미 데이터 사용
  const defaultMeasurement: Analysis = {
    id: 'dummy',
    user_uuid: 'dummy-user',
    analysis_type: 1,
    main_thoracic: 25,
    lumbar: 12,
    score: 0,
    image_url: '',
    created_at: new Date().toISOString(),
  };
  
  const measurementData = measurement || defaultMeasurement;
  const { popFullSheet } = useFullSheet();

  // 더미 진행률 데이터 (실제로는 이전 측정과 비교해서 계산)
  const progression = 1.2;
  const secondThoracic = 18; // 더미 데이터

  // 차트 데이터 (더미)
  const chartMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

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
          <p className="leading-[24px] whitespace-pre">{formatMeasurementDate(measurementData.created_at)}</p>
        </div>
        <div className="shrink-0 size-[24px]" />
      </div>

      {/* 컨텐츠 */}
      <div className="box-border content-stretch flex flex-col gap-[20px] items-center px-[20px] py-0 relative shrink-0 w-full overflow-y-auto flex-1 min-h-0">
        {/* 측정 결과 섹션 */}
        <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full">
          <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
            <div className="flex flex-col font-['Pretendard_Variable:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#2b2f36] text-[16px] text-nowrap">
              <p className="leading-[22px] whitespace-pre">측정 결과</p>
            </div>
          </div>

          {/* Scoliosis Progression 카드 */}
          <div className="bg-white box-border content-stretch flex flex-col gap-[44px] items-start overflow-clip px-[20px] py-[16px] relative rounded-[12px] shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0">
              <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#515968] text-[13px] text-nowrap">
                <p className="leading-[18px] whitespace-pre">Scoliosis Progression</p>
              </div>
              <div className="content-stretch flex gap-[7px] items-center relative shrink-0">
                <div className="flex flex-col font-['Pretendard_Variable:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#25272d] text-[28px] text-nowrap">
                  <p className="leading-[38px] whitespace-pre">+ {progression}%</p>
                </div>
                <div className="bg-[#edfdfc] box-border content-stretch flex gap-[10px] items-center justify-center px-[8px] py-[4px] relative rounded-[5px] shrink-0">
                  <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#20797e] text-[11px] text-nowrap">
                    <p className="leading-[16px] whitespace-pre">이번 달+{progression}%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full">
              {/* 차트 이미지 */}
              <div className="h-[97.5px] relative shrink-0 w-[295px]">
                <div className="absolute bottom-0 left-0 right-0 top-[-0.51%]">
                  <img alt="" className="block max-w-none size-full" src={ChartGraph} />
                </div>
              </div>
              {/* 차트 월 레이블 */}
              <div className="content-stretch flex font-['Pretendard_Variable:Regular',sans-serif] font-normal items-center justify-between leading-[0] relative shrink-0 text-[#97a2b9] text-[13px] w-full">
                {chartMonths.map((month) => (
                  <div key={month} className="flex flex-col h-[18px] justify-center relative shrink-0 w-[30px]">
                    <p className="leading-[18px]">{month}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 측정값 카드들 */}
          <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
            {/* Main Thoracic */}
            <div className="basis-0 bg-white box-border content-stretch flex flex-col gap-[12px] grow items-center justify-center leading-[0] min-h-px min-w-px px-[20px] py-[16px] relative rounded-[12px] self-stretch shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] shrink-0 text-nowrap">
              <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] font-normal justify-center leading-[16px] relative shrink-0 text-[#515968] text-[13px] text-center whitespace-pre">
                <p className="mb-0">Main</p>
                <p>Thoracic</p>
              </div>
              <div className="flex flex-col font-['Pretendard_Variable:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[#25272d] text-[18px]">
                <p className="leading-[24px] text-nowrap whitespace-pre">{measurementData.main_thoracic}°</p>
              </div>
            </div>

            {/* Second Thoracic */}
            <div className="basis-0 bg-white box-border content-stretch flex flex-col gap-[12px] grow items-center justify-center leading-[0] min-h-px min-w-px px-[20px] py-[16px] relative rounded-[12px] self-stretch shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] shrink-0 text-nowrap">
              <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] font-normal justify-center leading-[16px] relative shrink-0 text-[#515968] text-[13px] text-center whitespace-pre">
                <p className="mb-0">Second</p>
                <p>Thoracic</p>
              </div>
              <div className="flex flex-col font-['Pretendard_Variable:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[#25272d] text-[18px]">
                <p className="leading-[24px] text-nowrap whitespace-pre">{secondThoracic}°</p>
              </div>
            </div>

            {/* Lumber */}
            <div className="basis-0 bg-white box-border content-stretch flex flex-col gap-[12px] grow items-center justify-center leading-[0] min-h-px min-w-px px-[20px] py-[16px] relative rounded-[12px] self-stretch shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] shrink-0">
              <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] font-normal h-[32px] justify-center relative shrink-0 text-[#515968] text-[13px] text-center w-[45px]">
                <p className="leading-[16px]">Lumber</p>
              </div>
              <div className="flex flex-col font-['Pretendard_Variable:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[#25272d] text-[18px] text-nowrap">
                <p className="leading-[24px] whitespace-pre">{measurementData.lumbar}°</p>
              </div>
            </div>
          </div>
        </div>

        {/* 이미지 섹션 */}
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start pb-[40px] pt-0 px-0 relative shrink-0 w-full">
          <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
            <div className="flex flex-col font-['Pretendard_Variable:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#2b2f36] text-[16px] text-nowrap">
              <p className="leading-[22px] whitespace-pre">이미지</p>
            </div>
          </div>
          <div className="aspect-[335/255] relative rounded-[12px] shrink-0 w-full">
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[12px]">
              <img 
                alt="측정 이미지" 
                className="absolute h-[120.62%] left-[-18.91%] max-w-none top-[-20.59%] w-[137.81%]" 
                src={measurementData.image_url || MeasurementImage} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

