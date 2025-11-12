import { type ReactElement, useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAppData } from '../contexts/AppDataContext';
import { useFullSheet } from '../hooks/useFullSheet';
import { AlarmList } from '../components/FullSheet/AlarmListFullSheet';
import { MeasurementList } from '../components/FullSheet/MeasurementListFullSheet';
import { MeasurementDetail } from '../components/FullSheet/MeasurementDetailFullSheet';
import { getAnalyses, type Analysis } from '../api/analysis';
import BellIcon from '../assets/icon_svg/BellIcon.svg';
import Badge from '../assets/icon_svg/Badge.svg';
import ArrowRight from '../assets/icon_svg/Analysis/ArrowRight.svg';
import { NavigationBottom } from '../components/NavigationBottom';

// 로컬 아이콘 에셋
const img = BellIcon;
const img1 = Badge;
const img3 = ArrowRight;

// 더미 차트 데이터
const dummyChartData = [
  { month: 'Jan', value: 22.8 },
  { month: 'Feb', value: 23.6 },
  { month: 'Mar', value: 23.1 },
  { month: 'Apr', value: 24.3 },
  { month: 'May', value: 23.7 },
  { month: 'Jun', value: 24.9 },
];

// 더미 분석 데이터 (피그마 디자인 기준)
const dummyAnalyses: Analysis[] = [
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
    created_at: '2025-10-01T00:00:00.000Z',
  },
];

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
 * 날짜를 한국어 형식으로 변환
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 날짜를 차트용 월 형식으로 변환 (Jan, Feb, ...)
 */
function formatDateForChart(dateString: string): string {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[date.getMonth()];
}

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
        <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#25272d] text-[15px] text-nowrap">
          <p className="leading-[20px] whitespace-pre">{date}</p>
        </div>
        <div className="bg-[#edfdfc] box-border content-stretch flex gap-[10px] items-center justify-center px-[8px] py-[4px] relative rounded-[5px] shrink-0">
          <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#20797e] text-[13px] text-nowrap">
            <p className="leading-[18px] whitespace-pre">{type}</p>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[4px] items-end justify-center relative shrink-0">
        <div className="content-stretch flex gap-[8px] items-center leading-[0] not-italic relative shrink-0">
          <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#515968] text-[13px] text-center text-nowrap">
            <p className="leading-[16px] whitespace-pre">Thoracic</p>
          </div>
          <div className="flex flex-col font-['Pretendard_Variable:SemiBold',sans-serif] font-semibold justify-center relative shrink-0 text-[#25272d] text-[15px] w-[30px]">
            <p className="leading-[20px]">{thoracic}°</p>
          </div>
        </div>
        <div className="content-stretch flex gap-[8px] items-center leading-[0] not-italic relative shrink-0">
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
 * 분석 페이지
 */
export function Analysis(): ReactElement {
  const { appData } = useAppData();
  const { openFullSheet } = useFullSheet();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleAlarmClick = () => {
    openFullSheet(AlarmList, {}, { animationDirection: 'right' });
  };

  const handleViewAllMeasurements = () => {
    openFullSheet(MeasurementList, {}, { animationDirection: 'right' });
  };

  const handleMeasurementClick = (measurement: Analysis) => {
    openFullSheet(MeasurementDetail, { measurement }, { animationDirection: 'right' });
  };

  // 분석 데이터 로드
  useEffect(() => {
    const loadAnalyses = async () => {
      try {
        setIsLoading(true);
        const result = await getAnalyses();
        
        console.log('분석 데이터 로드 결과:', result);
        
        if (result instanceof Response) {
          // 에러 응답인 경우
          if (!result.ok) {
            const errorData = await result.json().catch(() => ({}));
            console.error('분석 데이터 조회 실패:', result.status, errorData);
            setAnalyses([]);
            return;
          }
          // 성공 응답인 경우 JSON 파싱
          const data = await result.json();
          console.log('분석 데이터 (Response에서 파싱):', data);
          if (Array.isArray(data)) {
            const sorted = [...data].sort((a, b) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            setAnalyses(sorted);
          } else {
            setAnalyses([]);
          }
        } else if (Array.isArray(result)) {
          // 배열로 직접 반환된 경우
          console.log('분석 데이터 (배열):', result);
          const sorted = [...result].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setAnalyses(sorted);
        } else {
          console.warn('예상치 못한 응답 형식:', result);
          setAnalyses([]);
        }
      } catch (error) {
        console.error('분석 데이터 로드 실패:', error);
        setAnalyses([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalyses();
  }, []);

  // 실제 데이터 또는 더미 데이터 사용
  const displayAnalyses = useMemo(() => {
    return analyses.length > 0 ? analyses : dummyAnalyses;
  }, [analyses]);

  // 차트 데이터 생성 (최근 6개월 데이터)
  const chartData = useMemo(() => {
    // API 데이터가 없으면 더미 차트 데이터 사용
    if (analyses.length === 0) {
      return dummyChartData;
    }
    
    // 최근 6개월 데이터 필터링 및 그룹화
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const filtered = analyses.filter(a => new Date(a.created_at) >= sixMonthsAgo);
    
    // 데이터가 없으면 더미 차트 데이터 사용
    if (filtered.length === 0) {
      return dummyChartData;
    }
    
    // 월별로 그룹화하고 평균값 계산
    const monthlyData: Record<string, { total: number; count: number }> = {};
    
    filtered.forEach(analysis => {
      const monthKey = formatDateForChart(analysis.created_at);
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { total: 0, count: 0 };
      }
      // Main Thoracic 값을 사용 (또는 score 사용)
      monthlyData[monthKey].total += analysis.main_thoracic || analysis.score || 0;
      monthlyData[monthKey].count += 1;
    });
    
    // 차트 데이터 형식으로 변환
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const chartMonths = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1);
    
    const chartDataResult = chartMonths.map(month => ({
      month,
      value: monthlyData[month] ? Number((monthlyData[month].total / monthlyData[month].count).toFixed(1)) : 0,
    }));
    
    // 차트 데이터가 모두 0이면 더미 데이터 사용
    if (chartDataResult.every(d => d.value === 0)) {
      return dummyChartData;
    }
    
    return chartDataResult;
  }, [analyses]);

  // 최신 3개 데이터로 Main Thoracic, Second Thoracic, Lumber 값 계산
  const latestAnalyses = useMemo(() => {
    return displayAnalyses.slice(0, 3);
  }, [displayAnalyses]);

  // 더미 데이터 사용 시 피그마 디자인 기준 값 사용
  const mainThoracic = analyses.length === 0 ? 25 : (latestAnalyses[0]?.main_thoracic ?? 0);
  const secondThoracic = analyses.length === 0 ? 18 : (latestAnalyses[1]?.main_thoracic ?? 0);
  const lumber = analyses.length === 0 ? 12 : (latestAnalyses[0]?.lumbar ?? 0);
  
  console.log('측정값:', { mainThoracic, secondThoracic, lumber, latestAnalysesLength: latestAnalyses.length, isDummy: analyses.length === 0 });

  // 진행률 계산 (이번 달 vs 지난 달)
  const progression = useMemo(() => {
    if (displayAnalyses.length < 2) {
      console.log('진행률 계산: 데이터가 2개 미만', displayAnalyses.length);
      // 더미 데이터 사용 시 1.2% 반환
      return analyses.length === 0 ? 1.2 : 0;
    }
    const current = displayAnalyses[0]?.main_thoracic || 0;
    const previous = displayAnalyses[1]?.main_thoracic || 0;
    console.log('진행률 계산:', { current, previous, analysesLength: displayAnalyses.length });
    if (previous === 0) return analyses.length === 0 ? 1.2 : 0;
    const calculated = Number(((current - previous) / previous * 100).toFixed(1));
    console.log('계산된 진행률:', calculated);
    return calculated;
  }, [displayAnalyses, analyses.length]);

  // 측정 목록 (최신 4개)
  const measurementList = useMemo(() => {
    return displayAnalyses.slice(0, 4);
  }, [displayAnalyses]);

  // 차트 Y축 도메인 계산
  const chartDomain = useMemo(() => {
    if (chartData.length === 0) return [22, 25.5];
    const values = chartData.map(d => d.value).filter(v => v > 0);
    if (values.length === 0) return [22, 25.5];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.2 || 1;
    return [Math.max(0, Math.floor(min - padding)), Math.ceil(max + padding)];
  }, [chartData]);

  return (
    <div className="bg-gray-50 box-border content-stretch flex flex-col items-start pb-[80px] pt-[70px] px-0 shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] min-h-screen">
      {/* 헤더 */}
      <div className="fixed top-0 left-0 right-0 bg-gray-50 box-border content-stretch flex items-center justify-between p-[20px] shrink-0 w-full z-40">
        <div className="h-[24px] relative shrink-0 w-[120px]">
          <div className="absolute flex flex-col font-['MuseoModerno:Bold',sans-serif] font-bold justify-center leading-[0] relative size-full text-[#22bcb7] text-[27.152px] text-nowrap tracking-[-0.2715px]">
            <p className="leading-[normal] whitespace-pre">nextvine</p>
          </div>
        </div>
        <div className="content-stretch flex gap-[14px] items-center relative shrink-0">
          <button
            onClick={handleAlarmClick}
            className="relative shrink-0 size-[28px] cursor-pointer"
          >
            <div className="absolute left-0 size-[32.667px] top-0">
              <div className="absolute inset-[12.5%_16.67%]">
                <div className="absolute inset-[-4.76%_-5.36%]">
                  <img alt="" className="block max-w-none size-full" src={img} />
                </div>
              </div>
            </div>
            {/* 알람 뱃지 */}
            {appData.unreadAlarmCount > 0 && (
              <>
                <div className="absolute left-[23px] top-0 bg-red-500 rounded-full min-w-[16px] h-[16px] flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold leading-none">
                    {appData.unreadAlarmCount > 9 ? '9+' : appData.unreadAlarmCount}
                  </span>
                </div>
                <div className="absolute left-[23px] size-[4.5px] top-px">
                  <div className="absolute inset-0">
                    <img alt="" className="block max-w-none size-full" src={img1} />
                  </div>
                </div>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="box-border content-stretch flex flex-col gap-[16px] items-center px-[20px] py-0 relative shrink-0 w-full">
        {/* 차트 및 측정값 섹션 */}
        <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full">
          {/* Scoliosis Progression 차트 */}
          <div className="bg-white box-border content-stretch flex flex-col gap-[44px] items-start overflow-clip px-[20px] py-[16px] relative rounded-[12px] shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0">
              <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#515968] text-[13px] text-nowrap">
                <p className="leading-[18px] whitespace-pre">Scoliosis Progression</p>
              </div>
              <div className="content-stretch flex gap-[7px] items-center relative shrink-0">
                <div className="flex flex-col font-['Pretendard_Variable:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#25272d] text-[28px] text-nowrap">
                  <p className="leading-[38px] whitespace-pre">
                    {progression > 0 ? '+' : ''}{progression}%
                  </p>
                </div>
                <div className="bg-[#edfdfc] box-border content-stretch flex gap-[10px] items-center justify-center px-[8px] py-[4px] relative rounded-[5px] shrink-0">
                  <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#20797e] text-[11px] text-nowrap">
                    <p className="leading-[16px] whitespace-pre">이번 달{progression > 0 ? '+' : ''}{progression}%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full">
              {isLoading ? (
                <div className="h-[97.5px] w-full flex items-center justify-center">
                  <div className="text-gray-400 text-sm">로딩 중...</div>
                </div>
              ) : chartData.length > 0 ? (
                <>
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
                          domain={chartDomain}
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
                    {chartData.map((item, index) => (
                      <div key={index} className="flex flex-col h-[18px] justify-center relative shrink-0 w-[30px]">
                        <p className="leading-[18px]">{item.month}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[97.5px] w-full flex items-center justify-center">
                  <div className="text-gray-400 text-sm">데이터가 없습니다</div>
                </div>
              )}
            </div>
          </div>

          {/* 3개의 측정 카드 */}
          <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
            <div className="basis-0 bg-white box-border content-stretch flex flex-col gap-[12px] grow items-center justify-center leading-[0] min-h-px min-w-px not-italic px-[20px] py-[16px] relative rounded-[12px] self-stretch shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] shrink-0 text-nowrap">
              <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] font-normal justify-center leading-[16px] relative shrink-0 text-[#515968] text-[13px] text-center whitespace-pre">
                <p className="mb-0">Main</p>
                <p>Thoracic</p>
              </div>
              <div className="flex flex-col font-['Pretendard_Variable:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[#25272d] text-[18px]">
                <p className="leading-[24px] text-nowrap whitespace-pre">{mainThoracic}°</p>
              </div>
            </div>
            <div className="basis-0 bg-white box-border content-stretch flex flex-col gap-[12px] grow items-center justify-center leading-[0] min-h-px min-w-px not-italic px-[20px] py-[16px] relative rounded-[12px] self-stretch shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] shrink-0 text-nowrap">
              <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] font-normal justify-center leading-[16px] relative shrink-0 text-[#515968] text-[13px] text-center whitespace-pre">
                <p className="mb-0">Second</p>
                <p>Thoracic</p>
              </div>
              <div className="flex flex-col font-['Pretendard_Variable:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[#25272d] text-[18px]">
                <p className="leading-[24px] text-nowrap whitespace-pre">{secondThoracic}°</p>
              </div>
            </div>
            <div className="basis-0 bg-white box-border content-stretch flex flex-col gap-[12px] grow items-center justify-center leading-[0] min-h-px min-w-px not-italic px-[20px] py-[16px] relative rounded-[12px] self-stretch shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] shrink-0">
              <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] font-normal h-[32px] justify-center relative shrink-0 text-[#515968] text-[13px] text-center w-[45px]">
                <p className="leading-[16px]">Lumber</p>
              </div>
              <div className="flex flex-col font-['Pretendard_Variable:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[#25272d] text-[18px] text-nowrap">
                <p className="leading-[24px] whitespace-pre">{lumber}°</p>
              </div>
            </div>
          </div>
        </div>

        {/* 측정 목록 섹션 */}
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
          <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
            <div className="flex flex-col font-['Pretendard_Variable:SemiBold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#2b2f36] text-[16px] text-nowrap">
              <p className="leading-[22px] whitespace-pre">측정 목록</p>
            </div>
            <button
              onClick={handleViewAllMeasurements}
              className="content-stretch flex items-center relative shrink-0 cursor-pointer"
            >
              <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#2e96ff] text-[15px] text-nowrap">
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
            </button>
          </div>
          <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
            {isLoading ? (
              <div className="w-full text-center py-8 text-gray-400 text-sm">로딩 중...</div>
            ) : measurementList.length > 0 ? (
              measurementList.map((analysis) => (
                <MeasurementCard
                  key={analysis.id}
                  date={formatDate(analysis.created_at)}
                  type={getAnalysisTypeString(analysis.analysis_type)}
                  thoracic={String(analysis.main_thoracic)}
                  lumber={String(analysis.lumbar)}
                  measurement={analysis}
                  onClick={() => handleMeasurementClick(analysis)}
                />
              ))
            ) : null}
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <NavigationBottom />
    </div>
  );
}

