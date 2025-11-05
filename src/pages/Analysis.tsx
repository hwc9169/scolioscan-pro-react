import { type ReactElement } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import BellIcon from '../assets/icon_svg/BellIcon.svg';
import Badge from '../assets/icon_svg/Badge.svg';
import ArrowRight from '../assets/icon_svg/Analysis/ArrowRight.svg';
import { NavigationBottom } from '../components/NavigationBottom';

// 로컬 아이콘 에셋
const img = BellIcon;
const img1 = Badge;
const img3 = ArrowRight;

// 더미 차트 데이터 (API로 교체 가능) - 더 동적인 변동
const chartData = [
  { month: 'Jan', value: 22.8 },
  { month: 'Feb', value: 23.6 },
  { month: 'Mar', value: 23.1 },
  { month: 'Apr', value: 24.3 },
  { month: 'May', value: 23.7 },
  { month: 'Jun', value: 24.9 },
];

function MeasurementCard({ 
  date, 
  type,
  thoracic,
  lumber
}: { 
  date: string; 
  type: string;
  thoracic: string;
  lumber: string;
}) {
  return (
    <div className="bg-white box-border content-stretch flex items-center justify-between overflow-clip px-[20px] py-[16px] relative rounded-[12px] shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
        <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#25272d] text-[15px] text-nowrap">
          <p className="leading-[20px] whitespace-pre">{date}</p>
        </div>
        <div className="bg-[#edfdfc] box-border content-stretch flex gap-[10px] items-center justify-center px-[8px] py-[4px] relative rounded-[5px] shrink-0">
          <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#20797e] text-[13px] text-nowrap">
            <p className="leading-[18px] whitespace-pre">{type}</p>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[4px] items-end justify-center relative shrink-0">
        <div className="content-stretch flex gap-[8px] items-center leading-[0] not-italic relative shrink-0">
          <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] justify-center relative shrink-0 text-[#515968] text-[13px] text-center text-nowrap">
            <p className="leading-[16px] whitespace-pre">Thoracic</p>
          </div>
          <div className="flex flex-col font-['Pretendard_Variable:SemiBold',sans-serif] justify-center relative shrink-0 text-[#25272d] text-[15px] w-[30px]">
            <p className="leading-[20px]">{thoracic}°</p>
          </div>
        </div>
        <div className="content-stretch flex gap-[8px] items-center leading-[0] not-italic relative shrink-0">
          <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] justify-center relative shrink-0 text-[#515968] text-[13px] text-center text-nowrap">
            <p className="leading-[16px] whitespace-pre">Lumber</p>
          </div>
          <div className="flex flex-col font-['Pretendard_Variable:SemiBold',sans-serif] justify-center relative shrink-0 text-[#25272d] text-[15px] w-[30px]">
            <p className="leading-[20px]">{lumber}°</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 분석 페이지
 */
export function Analysis(): ReactElement {
  return (
    <div className="bg-gray-50 box-border content-stretch flex flex-col items-start pb-[80px] pt-[70px] px-0 shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] min-h-screen">
      {/* 헤더 */}
      <div className="fixed top-0 left-0 right-0 bg-gray-50 box-border content-stretch flex items-center justify-between p-[20px] shrink-0 w-full z-40">
        <div className="h-[24px] relative shrink-0 w-[120px]">
          <div className="absolute flex flex-col font-bold justify-center leading-[0] left-[calc(50%-57.5px)] text-[#22bcb7] text-[27px] text-nowrap top-[12.5px] tracking-[-0.27px] translate-y-[-50%]">
            <p className="leading-[normal] whitespace-pre">nextvine</p>
          </div>
        </div>
        <div className="content-stretch flex gap-[14px] items-center relative shrink-0">
          <div className="relative shrink-0 size-[28px]">
            <div className="absolute left-0 size-[32.667px] top-0">
              <div className="absolute inset-[12.5%_16.67%]">
                <div className="absolute inset-[-4.76%_-5.36%]">
                  <img alt="" className="block max-w-none size-full" src={img} />
                </div>
              </div>
            </div>
            <div className="absolute left-[23px] size-[4.5px] top-px">
              <div className="absolute inset-0">
                <img alt="" className="block max-w-none size-full" src={img1} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="box-border content-stretch flex flex-col gap-[16px] items-center px-[20px] py-0 relative shrink-0 w-full">
        {/* 차트 및 측정값 섹션 */}
        <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full">
          {/* Scoliosis Progression 차트 */}
          <div className="bg-white box-border content-stretch flex flex-col gap-[44px] items-start overflow-clip px-[20px] py-[16px] relative rounded-[12px] shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0">
              <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#515968] text-[13px] text-nowrap">
                <p className="leading-[18px] whitespace-pre">Scoliosis Progression</p>
              </div>
              <div className="content-stretch flex gap-[7px] items-center relative shrink-0">
                <div className="flex flex-col font-['Pretendard_Variable:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#25272d] text-[28px] text-nowrap">
                  <p className="leading-[38px] whitespace-pre">+ 1.2%</p>
                </div>
                <div className="bg-[#edfdfc] box-border content-stretch flex gap-[10px] items-center justify-center px-[8px] py-[4px] relative rounded-[5px] shrink-0">
                  <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#20797e] text-[11px] text-nowrap">
                    <p className="leading-[16px] whitespace-pre">이번 달+1.2%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full">
              <div className="h-[97.5px] relative shrink-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2E96FF" stopOpacity={0.3}/>
                        <stop offset="100%" stopColor="#2E96FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      hide
                    />
                    <YAxis 
                      hide
                      domain={[22, 25.5]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#2E96FF" 
                      strokeWidth={2}
                      fill="url(#colorGradient)"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="content-stretch flex font-['Pretendard_Variable:Regular',sans-serif] items-center justify-between leading-[0] not-italic relative shrink-0 text-[#97a2b9] text-[13px] w-full">
                <div className="flex flex-col h-[18px] justify-center relative shrink-0 w-[30px]">
                  <p className="leading-[18px]">Jan</p>
                </div>
                <div className="flex flex-col h-[18px] justify-center relative shrink-0 w-[30px]">
                  <p className="leading-[18px]">Feb</p>
                </div>
                <div className="flex flex-col h-[18px] justify-center relative shrink-0 w-[30px]">
                  <p className="leading-[18px]">Mar</p>
                </div>
                <div className="flex flex-col h-[18px] justify-center relative shrink-0 w-[30px]">
                  <p className="leading-[18px]">Apr</p>
                </div>
                <div className="flex flex-col h-[18px] justify-center relative shrink-0 w-[30px]">
                  <p className="leading-[18px]">May</p>
                </div>
                <div className="flex flex-col h-[18px] justify-center relative shrink-0 w-[30px]">
                  <p className="leading-[18px]">Jun</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3개의 측정 카드 */}
          <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
            <div className="basis-0 bg-white box-border content-stretch flex flex-col gap-[12px] grow items-center justify-center leading-[0] min-h-px min-w-px not-italic px-[20px] py-[16px] relative rounded-[12px] self-stretch shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] shrink-0 text-nowrap">
              <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] justify-center leading-[16px] relative shrink-0 text-[#515968] text-[13px] text-center whitespace-pre">
                <p className="mb-0">Main</p>
                <p>Thoracic</p>
              </div>
              <div className="flex flex-col font-['Pretendard_Variable:Bold',sans-serif] justify-center relative shrink-0 text-[#25272d] text-[18px]">
                <p className="leading-[24px] text-nowrap whitespace-pre">25°</p>
              </div>
            </div>
            <div className="basis-0 bg-white box-border content-stretch flex flex-col gap-[12px] grow items-center justify-center leading-[0] min-h-px min-w-px not-italic px-[20px] py-[16px] relative rounded-[12px] self-stretch shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] shrink-0 text-nowrap">
              <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] justify-center leading-[16px] relative shrink-0 text-[#515968] text-[13px] text-center whitespace-pre">
                <p className="mb-0">Second</p>
                <p>Thoracic</p>
              </div>
              <div className="flex flex-col font-['Pretendard_Variable:Bold',sans-serif] justify-center relative shrink-0 text-[#25272d] text-[18px]">
                <p className="leading-[24px] text-nowrap whitespace-pre">18°</p>
              </div>
            </div>
            <div className="basis-0 bg-white box-border content-stretch flex flex-col gap-[12px] grow items-center justify-center leading-[0] min-h-px min-w-px not-italic px-[20px] py-[16px] relative rounded-[12px] self-stretch shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] shrink-0">
              <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] h-[32px] justify-center relative shrink-0 text-[#515968] text-[13px] text-center w-[45px]">
                <p className="leading-[16px]">Lumber</p>
              </div>
              <div className="flex flex-col font-['Pretendard_Variable:Bold',sans-serif] justify-center relative shrink-0 text-[#25272d] text-[18px] text-nowrap">
                <p className="leading-[24px] whitespace-pre">12°</p>
              </div>
            </div>
          </div>
        </div>

        {/* 측정 목록 섹션 */}
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
          <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
            <div className="flex flex-col font-['Pretendard_Variable:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#2b2f36] text-[16px] text-nowrap">
              <p className="leading-[22px] whitespace-pre">측정 목록</p>
            </div>
            <div className="content-stretch flex items-center relative shrink-0">
              <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#2e96ff] text-[15px] text-nowrap">
                <p className="leading-[20px] whitespace-pre">모두 보기</p>
              </div>
              <div className="relative shrink-0 size-[20px]">
                <div className="absolute flex inset-[17.71%_32.29%] items-center justify-center">
                  <div className="flex-none h-[7.083px] rotate-[270deg] w-[12.917px]">
                    <div className="relative size-full">
                      <div className="absolute bottom-0 left-0 right-[-0.01%] top-0">
                        <img alt="" className="block max-w-none size-full" src={img3} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
            <MeasurementCard
              date="2025년 10월 2일"
              type="2D 카메라 촬영"
              thoracic="25"
              lumber="12"
            />
            <MeasurementCard
              date="2025년 10월 1일"
              type="2D 카메라 촬영"
              thoracic="25"
              lumber="12"
            />
            <MeasurementCard
              date="2025년 9월 30일"
              type="2D 카메라 촬영"
              thoracic="25"
              lumber="12"
            />
            <MeasurementCard
              date="2025년 9월 29일"
              type="2D 카메라 촬영"
              thoracic="25"
              lumber="12"
            />
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <NavigationBottom />
    </div>
  );
}

