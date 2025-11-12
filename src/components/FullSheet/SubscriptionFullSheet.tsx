import { type ReactElement, useState, useEffect } from 'react';
import IconArrowLeft from '../../assets/icon_svg/ProfileEdit/IconArrowLeft.svg';
import IconCrown from '../../assets/icon_svg/Subscription/IconCrown.svg';
import Icon16LineCheck from '../../assets/icon_svg/Subscription/Icon16LineCheck.svg';
import Icon16LineCheckGray from '../../assets/icon_svg/Subscription/Icon16LineCheckGray.svg';
import IconArrowDown from '../../assets/icon_svg/Subscription/IconArrowDown.svg';
import { useFullSheet } from '../../hooks/useFullSheet';
import { getSubscribeTypes, getCurrentSubscription, createSubscription, cancelSubscription } from '../../api/subscribe';
import type { SubscribeType, Subscription } from '../../api/subscribe';
import { useToast } from '../../contexts/ToastContext';
import { useAppData } from '../../contexts/AppDataContext';

/**
 * 구독 설정 페이지
 */
export function Subscription(): ReactElement {
  const { popFullSheet } = useFullSheet();
  const { showToast } = useToast();
  const { appData } = useAppData();
  const { user } = appData;
  
  const [showNotes, setShowNotes] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscribeTypes, setSubscribeTypes] = useState<SubscribeType[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  // 구독 타입 및 현재 구독 정보 조회
  useEffect(() => {
    const loadSubscriptionData = async () => {
      try {
        setLoading(true);
        
        // 구독 타입 목록 조회
        const typesResponse = await getSubscribeTypes();
        if (typesResponse.ok) {
          const typesData = await typesResponse.json();
          const typesArray = Array.isArray(typesData) ? typesData : [];
          setSubscribeTypes(typesArray);
          // 첫 번째 플랜을 기본 선택
          if (typesArray.length > 0) {
            setSelectedPlanId(typesArray[0].id);
          }
        }
        
        // 현재 구독 정보 조회
        const currentResponse = await getCurrentSubscription();
        if (currentResponse.ok) {
          const currentData = await currentResponse.json();
          setCurrentSubscription(currentData || null);
        } else if (currentResponse.status === 404) {
          // 구독이 없을 경우
          setCurrentSubscription(null);
        }
      } catch (error) {
        console.error('구독 정보 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptionData();
  }, []);

  // 구독하기 핸들러
  const handleSubscribe = async () => {
    if (!user?.id || subscribeTypes.length === 0 || !selectedPlanId) {
      showToast('구독 정보를 불러올 수 없습니다.');
      return;
    }

    try {
      const selectedPlan = subscribeTypes.find(plan => plan.id === selectedPlanId);
      if (!selectedPlan) {
        showToast('선택한 구독 플랜을 찾을 수 없습니다.');
        return;
      }
      const now = new Date();
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const subscriptionData = {
        user_uuid: user.id,
        subscribe_card: '', // TODO: 실제 카드 UUID 필요
        subscribe_type: selectedPlan.id,
        started_at: now.toISOString(),
        ended_at: nextMonth.toISOString(),
      };

      const response = await createSubscription(subscriptionData);
      
      if (response.ok || response.status === 201) {
        showToast('구독이 완료되었습니다.');
        // 구독 정보 다시 조회
        const currentResponse = await getCurrentSubscription();
        if (currentResponse.ok) {
          const currentData = await currentResponse.json();
          setCurrentSubscription(currentData || null);
        }
      } else {
        let errorMessage = '구독에 실패했습니다.';
        if (response.status === 500) {
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        } else if (response.status === 400) {
          errorMessage = '입력 정보를 확인해주세요.';
        }
        showToast(errorMessage);
      }
    } catch (error) {
      console.error('구독 실패:', error);
      showToast('구독 중 오류가 발생했습니다.');
    }
  };

  // 구독 취소 핸들러
  const handleCancelSubscription = async () => {
    try {
      const response = await cancelSubscription();
      
      if (response.ok) {
        showToast('구독이 취소되었습니다.');
        setCurrentSubscription(null);
        setShowCancelModal(false);
      } else {
        let errorMessage = '구독 취소에 실패했습니다.';
        if (response.status === 500) {
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        } else if (response.status === 400) {
          errorMessage = '구독 취소할 수 없습니다.';
        }
        showToast(errorMessage);
      }
    } catch (error) {
      console.error('구독 취소 실패:', error);
      showToast('구독 취소 중 오류가 발생했습니다.');
    }
  };

  // 선택된 구독 플랜 정보 가져오기
  const selectedPlan = selectedPlanId 
    ? subscribeTypes.find(plan => plan.id === selectedPlanId) || null
    : (subscribeTypes.length > 0 ? subscribeTypes[0] : null);
  const isSubscribed = currentSubscription !== null && currentSubscription.terminated_at === null;
  
  // 기능 리스트 타입
  type FeatureItem = {
    name: string;
    highlighted?: boolean;
  };

  // 더미 기능 리스트 (데이터가 없을 때 사용)
  const defaultFeatures: FeatureItem[] = [
    { name: '광고 없이 감상', highlighted: true },
    { name: '프로필 4인, 동시사용 가능', highlighted: false },
    { name: '최신화 시청, 다운로드 지원', highlighted: false },
    { name: 'TV 앱 지원', highlighted: false },
  ];

  // description에서 기능 리스트 파싱 (JSON 문자열이거나 줄바꿈으로 구분된 텍스트일 수 있음)
  const parseFeaturesFromDescription = (description: string | null): FeatureItem[] => {
    if (!description) return defaultFeatures;
    
    try {
      // JSON 형식인 경우
      const parsed = JSON.parse(description);
      if (Array.isArray(parsed)) {
        return parsed.map((item: unknown) => {
          if (typeof item === 'string') {
            return { name: item, highlighted: false };
          }
          if (typeof item === 'object' && item !== null) {
            const obj = item as { name?: string; highlighted?: boolean };
            return {
              name: obj.name || String(item),
              highlighted: obj.highlighted || false,
            };
          }
          return { name: String(item), highlighted: false };
        });
      }
    } catch {
      // JSON이 아니면 줄바꿈으로 구분된 텍스트로 처리
      const lines = description.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        return lines.map((line, index) => ({
          name: line.trim(),
          highlighted: index === 0, // 첫 번째 항목을 강조
        }));
      }
    }
    
    return defaultFeatures;
  };

  // 표시할 플랜 정보 결정
  const displayPlan = selectedPlan || {
    id: 0,
    name: '프리미엄 구독',
    price: 14900,
    description: null,
    created_at: '',
  };

  // 표시할 기능 리스트 결정 (description에서 파싱하거나 더미 사용)
  const displayFeatures: FeatureItem[] = displayPlan.description
    ? parseFeaturesFromDescription(displayPlan.description)
    : defaultFeatures;

  // 다음 결제일 계산
  const getNextBillingDate = (): string => {
    if (!currentSubscription?.ended_at) return '';
    const date = new Date(currentSubscription.ended_at);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <div className="bg-[#f3f4f7] box-border content-stretch flex flex-col items-center min-h-screen relative w-full">
      {/* 헤더 */}
      <div className="bg-white box-border content-stretch flex h-[68px] items-center justify-between p-[20px] relative shrink-0 w-full">
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
          <p className="leading-[24px] whitespace-pre">구독 설정</p>
        </div>
        <div className="shrink-0 size-[24px]" />
      </div>

      {/* 컨텐츠 */}
      <div className="box-border content-stretch flex flex-col items-center p-[20px] relative w-full">
        {/* 구독 플랜 선택 (여러 개일 경우) */}
        {subscribeTypes.length > 1 && !isSubscribed && (
          <div className="bg-white box-border content-stretch flex flex-col gap-[12px] items-start px-[16px] py-[16px] relative rounded-[16px] shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] shrink-0 w-full mb-[16px]">
            <p className="font-['Pretendard_Variable:Medium',sans-serif] text-[14px] text-[#2b2f36]">
              구독 플랜 선택
            </p>
            <div className="flex flex-col gap-[8px] w-full">
              {subscribeTypes.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`box-border content-stretch flex h-[52px] items-center justify-between px-[16px] py-0 relative rounded-[8px] shrink-0 w-full text-left ${
                    selectedPlanId === plan.id
                      ? 'bg-[#edfdfc] border border-[#2c9696] border-solid'
                      : 'bg-[#f3f4f7] border border-[rgba(0,0,0,0.04)] border-solid'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <p className={`font-['Pretendard_Variable:Medium',sans-serif] text-[14px] ${
                      selectedPlanId === plan.id ? 'text-[#2c9696]' : 'text-[#2b2f36]'
                    }`}>
                      {plan.name}
                    </p>
                    <p className="font-['Pretendard_Variable:Regular',sans-serif] text-[12px] text-[#515968]">
                      월 {plan.price.toLocaleString()}원
                    </p>
                  </div>
                  {selectedPlanId === plan.id && (
                    <div className="relative shrink-0 size-[20px]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="size-[12px] rounded-full bg-[#2c9696]" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 프리미엄 구독 카드 */}
        <div className="bg-white box-border content-stretch flex flex-col gap-[16px] items-center px-[16px] py-[20px] relative rounded-[16px] shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] shrink-0 w-full">
          {/* 카드 헤더 */}
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
            <div className="relative shrink-0 size-[24px]">
              <div className="absolute contents inset-0">
                <img alt="" className="block max-w-none size-full" src={IconCrown} />
              </div>
            </div>
            <div className="flex flex-col font-['Pretendard_Variable:Bold',sans-serif] h-full justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black w-[263px]">
              <p className="leading-[22px]">{displayPlan.name}</p>
            </div>
          </div>

          {/* 구분선 */}
          <div className="bg-[#ededed] h-px shrink-0 w-full" />

          {/* 기능 리스트 */}
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              {displayFeatures.map((feature, index) => (
                <div key={index} className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[280px]">
                  <div className="relative shrink-0 size-[16px]">
                    <img 
                      alt="" 
                      className="block max-w-none size-full" 
                      src={feature.highlighted ? Icon16LineCheck : Icon16LineCheckGray} 
                    />
                  </div>
                  <p className={`basis-0 font-['Pretendard_Variable:Regular',sans-serif] grow leading-[18px] min-h-px min-w-px not-italic relative shrink-0 text-[13px] ${
                    feature.highlighted ? 'text-[#2c9696]' : 'text-[#25272d]'
                  }`}>
                    {feature.name}
                  </p>
                </div>
              ))}
            </div>

            {/* 가격 */}
            <div className="flex flex-col font-['Pretendard_Variable:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[15px] text-black text-right w-full">
              <p className="leading-[20px]">월 {displayPlan.price.toLocaleString()}원</p>
            </div>

            {/* 구독 상태에 따른 버튼 */}
            {isSubscribed ? (
              <>
                {/* 구독중 버튼 */}
                <button
                  type="button"
                  disabled
                  className="bg-[#d4d9e2] box-border content-stretch flex gap-[6px] h-[40px] items-center justify-center px-[14px] py-0 relative rounded-[6px] shrink-0 w-full cursor-not-allowed"
                >
                  <p className="font-['Pretendard_Variable:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap text-[#7e89a0] whitespace-pre">
                    구독중
                  </p>
                </button>
                
                {/* 다음 결제일 표시 */}
                {currentSubscription?.ended_at && (
                  <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[#515968] text-center w-full">
                    <p className="leading-[18px]">다음 결제일: {getNextBillingDate()}</p>
                  </div>
                )}
                
                {/* 구독 취소 버튼 */}
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="bg-white border border-[#d4d9e2] border-solid box-border content-stretch flex gap-[6px] h-[40px] items-center justify-center px-[14px] py-0 relative rounded-[6px] shrink-0 w-full mt-[8px]"
                >
                  <p className="font-['Pretendard_Variable:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap text-[#515968] whitespace-pre">
                    구독 취소
                  </p>
                </button>
              </>
            ) : (
              /* 구독하기 버튼 */
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={loading || !selectedPlan}
                className="bg-[#2c9696] box-border content-stretch flex gap-[6px] h-[40px] items-center justify-center px-[14px] py-0 relative rounded-[6px] shrink-0 w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <p className="font-['Pretendard_Variable:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">
                  {loading ? '로딩 중...' : '구독하기'}
                </p>
              </button>
            )}
          </div>
        </div>

        {/* 멤버십 유의사항 */}
        <div className="bg-gray-50 content-stretch flex flex-col items-start relative shrink-0 w-full mt-[16px]">
          {/* 헤더 */}
          <div className="bg-gray-50 box-border content-stretch flex gap-[10px] items-start px-[24px] py-[20px] relative shrink-0 w-full">
            <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
              <p className="font-['Pretendard_Variable:Medium',sans-serif] leading-[20px] min-w-full not-italic relative shrink-0 text-[#515968] text-[15px] w-[min-content]">
                멤버십 유의사항
              </p>
            </div>
            <div className="relative shrink-0 size-[24px]">
              <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ '--transform-inner-width': '6', '--transform-inner-height': '14' } as React.CSSProperties}>
                <button
                  type="button"
                  onClick={() => setShowNotes(!showNotes)}
                  className={`flex-none transition-transform ${showNotes ? 'rotate-[270deg]' : 'rotate-[90deg]'}`}
                >
                  <div className="h-[14px] relative w-[6px]">
                    <div className="absolute inset-[-5.36%_-12.5%]">
                      <img alt="" className="block max-w-none size-full" src={IconArrowDown} />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* 내용 */}
          {showNotes && (
            <div className="bg-gray-50 box-border content-stretch flex gap-[10px] items-start pb-[32px] pt-0 px-[24px] relative shrink-0 w-full">
              <div className="basis-0 font-['Pretendard_Variable:Regular',sans-serif] grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#5c5c5c] text-[14px]">
                <p className="leading-[20px] mb-0">구매안내</p>
                <p className="leading-[20px] mb-0">&nbsp;</p>
                <ul className="list-disc mb-0">
                  <li className="mb-0 ms-[21px]">
                    <span className="leading-[20px]">결제금액은 부가세가 포함된 가격입니다</span>
                  </li>
                  <li className="mb-0 ms-[21px]">
                    <span className="leading-[20px]">등록하신 결제수단으로 매월 정기결제일에 멤버십 이용 금액이 자동으로 결제됩니다.</span>
                  </li>
                  <li className="ms-[21px]">
                    <span className="leading-[20px]">멤버십은 언제든 해지할 수 있으며 해지해도 결제만료일까지 사용 가능합니다</span>
                  </li>
                </ul>
                <p className="leading-[20px] mb-0">&nbsp;</p>
                <p className="leading-[20px] mb-0">환불안내</p>
                <p className="leading-[20px] mb-0">&nbsp;</p>
                <ul className="list-disc">
                  <li className="mb-0 ms-[21px]">
                    <span className="leading-[20px]">결제금액은 부가세가 포함된 가격입니다</span>
                  </li>
                  <li className="mb-0 ms-[21px]">
                    <span className="leading-[20px]">등록하신 결제수단으로 매월 정기결제일에 멤버십 이용 금액이 자동으로 결제됩니다.</span>
                  </li>
                  <li className="ms-[21px]">
                    <span className="leading-[20px]">멤버십은 언제든 해지할 수 있으며 해지해도 결제만료일까지 사용 가능합니다</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 구독 취소 확인 모달 */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[16px] p-[24px] max-w-[320px] w-full mx-[20px]">
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[8px]">
                <p className="font-['Pretendard_Variable:SemiBold',sans-serif] text-[18px] text-[#2b2f36]">
                  구독 취소
                </p>
                <p className="font-['Pretendard_Variable:Regular',sans-serif] text-[14px] text-[#515968] leading-[20px]">
                  정말 구독을 취소하시겠습니까?<br />
                  취소해도 결제 만료일까지는 사용할 수 있습니다.
                </p>
              </div>
              <div className="flex gap-[8px]">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-[#f3f4f7] text-[#515968] font-['Pretendard_Variable:Medium',sans-serif] text-[14px] h-[40px] rounded-[6px]"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleCancelSubscription}
                  className="flex-1 bg-[#2c9696] text-white font-['Pretendard_Variable:Medium',sans-serif] text-[14px] h-[40px] rounded-[6px]"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

