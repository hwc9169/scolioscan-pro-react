import { type ReactElement, useState, useEffect } from 'react';
import IconArrowLeft from '../../assets/icon_svg/ProfileEdit/IconArrowLeft.svg';
import IconMeasurement from '../../assets/icon_svg/Alarm/IconMeasurement.svg';
import IconShopping from '../../assets/icon_svg/Alarm/IconShopping.svg';
import IconOther from '../../assets/icon_svg/Alarm/IconOther.svg';
import { useFullSheet } from '../../hooks/useFullSheet';
import { useToast } from '../../contexts/ToastContext';
import { getAlarms, markAlarmAsRead, type Alarm } from '../../api/alarms';
import { useAppData } from '../../contexts/AppDataContext';

/**
 * 알림 타입별 아이콘 및 라벨 매핑
 */
function getAlarmTypeInfo(alarmType: number): { icon: string; label: string } {
  switch (alarmType) {
    case 1: // 측정
      return { icon: IconMeasurement, label: '측정' };
    case 2: // 쇼핑
      return { icon: IconShopping, label: '쇼핑' };
    default: // 기타
      return { icon: IconOther, label: '기타' };
  }
}

/**
 * 날짜를 한국어 형식으로 변환 (예: "10월 28일")
 */
function formatAlarmDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

/**
 * 알림 리스트 풀 시트 컴포넌트
 */
export function AlarmList(): ReactElement {
  const { popFullSheet } = useFullSheet();
  const { showToast } = useToast();
  const { refreshUnreadAlarmCount } = useAppData();
  
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 알림 목록 로드
  useEffect(() => {
    const loadAlarms = async () => {
      try {
        setIsLoading(true);
        const result = await getAlarms();
        
        // getAlarms는 배열 또는 Response를 반환
        if (result instanceof Response) {
          // 에러 응답인 경우
          if (!result.ok) {
            console.error('알림 목록 조회 실패:', result.status);
            showToast('알림 목록을 불러오는데 실패했습니다.');
            setAlarms([]);
          } else {
            // 성공 응답인 경우 (일반적으로 발생하지 않지만 안전을 위해)
            const data = await result.json();
            setAlarms(Array.isArray(data) ? data : []);
          }
        } else {
          // 배열인 경우 (성공)
          setAlarms(result || []);
        }
      } catch (error) {
        console.error('알림 목록 조회 오류:', error);
        showToast('알림 목록을 불러오는데 실패했습니다.');
        setAlarms([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAlarms();
  }, [showToast]);

  // 알림 클릭 핸들러 (읽음 처리)
  const handleAlarmClick = async (alarm: Alarm) => {
    // 이미 읽은 알림이면 읽음 처리하지 않음
    if (alarm.read_at) {
      return;
    }

    try {
      const response = await markAlarmAsRead(alarm.id);
      
      if (response.ok) {
        // 로컬 상태 업데이트
        setAlarms(prevAlarms =>
          prevAlarms.map(a =>
            a.id === alarm.id
              ? { ...a, read_at: new Date().toISOString() }
              : a
          )
        );
        
        // 읽지 않은 알림 개수 새로고침
        await refreshUnreadAlarmCount();
      } else {
        console.error('알림 읽음 처리 실패:', response.status);
      }
    } catch (error) {
      console.error('알림 읽음 처리 오류:', error);
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
        <div className="flex flex-col font-['Pretendard_Variable:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#2b2f36] text-[18px] text-nowrap">
          <p className="leading-[24px] whitespace-pre">알림함</p>
        </div>
        <div className="shrink-0 size-[24px]" />
      </div>

      {/* 알림 리스트 */}
      <div className="box-border content-stretch flex flex-col items-start px-0 py-[20px] relative shrink-0 w-full overflow-y-auto flex-1 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center w-full py-[40px]">
            <p className="text-[#657085] text-[14px]">로딩 중...</p>
          </div>
        ) : alarms.length === 0 ? (
          <div className="flex items-center justify-center w-full py-[40px]">
            <p className="text-[#657085] text-[14px]">알림이 없습니다.</p>
          </div>
        ) : (
          alarms.map((alarm) => {
            const { icon, label } = getAlarmTypeInfo(alarm.alarm_type);
            const isUnread = !alarm.read_at;
            
            return (
              <div
                key={alarm.id}
                onClick={() => handleAlarmClick(alarm)}
                className={`box-border content-stretch flex flex-col gap-[4px] items-start justify-center px-[20px] py-[16px] relative shrink-0 w-full cursor-pointer transition-colors ${
                  isUnread ? 'bg-[#ebf5ff]' : ''
                }`}
              >
                {/* 상단: 아이콘/타입 + 날짜 */}
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                    <div className="relative shrink-0 size-[24px]">
                      <div className="absolute left-0 size-[24px] top-0">
                        <img alt="" className="block max-w-none size-full" src={icon} />
                      </div>
                    </div>
                    <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#657085] text-[14px] text-center text-nowrap">
                      <p className="leading-[20px] whitespace-pre">{label}</p>
                    </div>
                  </div>
                  <div className="flex flex-col font-['Manrope:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#8f8f8f] text-[13px] text-center text-nowrap tracking-[0.26px]">
                    <p className="leading-[18px] whitespace-pre">{formatAlarmDate(alarm.created_at)}</p>
                  </div>
                </div>
                
                {/* 하단: 메시지 */}
                <div className="box-border content-stretch flex gap-[10px] items-center justify-center pl-[32px] pr-0 py-0 relative shrink-0 w-full">
                  <div className="basis-0 flex flex-col font-['Pretendard_Variable:Medium',sans-serif] font-medium grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#2b2f36] text-[15px]">
                    <p className="leading-[20px]">{alarm.content || alarm.title}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

