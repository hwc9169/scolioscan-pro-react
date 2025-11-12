import { type ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconArrowLeft from '../../assets/icon_svg/ProfileEdit/IconArrowLeft.svg';
import IconCrown from '../../assets/icon_svg/Subscription/IconCrown.svg';
import Icon16LineCheck from '../../assets/icon_svg/Subscription/Icon16LineCheck.svg';
import Icon16LineCheckGray from '../../assets/icon_svg/Subscription/Icon16LineCheckGray.svg';
import IconArrowDown from '../../assets/icon_svg/Subscription/IconArrowDown.svg';

/**
 * 구독 설정 페이지
 */
export function Subscription(): ReactElement {
  const navigate = useNavigate();
  const [showNotes, setShowNotes] = useState(false);

  const handleSubscribe = () => {
    // TODO: 구독 API 호출
    console.log('구독하기');
  };

  return (
    <div className="bg-[#f3f4f7] box-border content-stretch flex flex-col items-center min-h-screen relative w-full">
      {/* 헤더 */}
      <div className="bg-white box-border content-stretch flex h-[68px] items-center justify-between p-[20px] relative shrink-0 w-full">
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
          <p className="leading-[24px] whitespace-pre">구독 설정</p>
        </div>
        <div className="shrink-0 size-[24px]" />
      </div>

      {/* 컨텐츠 */}
      <div className="box-border content-stretch flex flex-col items-center p-[20px] relative w-full">
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
              <p className="leading-[22px]">프리미엄 구독</p>
            </div>
          </div>

          {/* 구분선 */}
          <div className="bg-[#ededed] h-px shrink-0 w-full" />

          {/* 기능 리스트 */}
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              {/* 광고 없이 감상 */}
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[280px]">
                <div className="relative shrink-0 size-[16px]">
                  <img alt="" className="block max-w-none size-full" src={Icon16LineCheck} />
                </div>
                <p className="basis-0 font-['Pretendard_Variable:Regular',sans-serif] grow leading-[18px] min-h-px min-w-px not-italic relative shrink-0 text-[#2c9696] text-[13px]">
                  광고 없이 감상
                </p>
              </div>

              {/* 프로필 4인, 동시사용 가능 */}
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[280px]">
                <div className="relative shrink-0 size-[16px]">
                  <img alt="" className="block max-w-none size-full" src={Icon16LineCheckGray} />
                </div>
                <p className="basis-0 font-['Pretendard_Variable:Regular',sans-serif] grow leading-[18px] min-h-px min-w-px not-italic relative shrink-0 text-[#25272d] text-[13px]">
                  프로필 4인, 동시사용 가능
                </p>
              </div>

              {/* 최신화 시청, 다운로드 지원 */}
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[280px]">
                <div className="relative shrink-0 size-[16px]">
                  <img alt="" className="block max-w-none size-full" src={Icon16LineCheckGray} />
                </div>
                <p className="basis-0 font-['Pretendard_Variable:Regular',sans-serif] grow leading-[18px] min-h-px min-w-px not-italic relative shrink-0 text-[#25272d] text-[13px]">
                  최신화 시청, 다운로드 지원
                </p>
              </div>

              {/* TV 앱 지원 */}
              <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[280px]">
                <div className="relative shrink-0 size-[16px]">
                  <img alt="" className="block max-w-none size-full" src={Icon16LineCheckGray} />
                </div>
                <p className="basis-0 font-['Pretendard_Variable:Regular',sans-serif] grow leading-[18px] min-h-px min-w-px not-italic relative shrink-0 text-[#25272d] text-[13px]">
                  TV 앱 지원
                </p>
              </div>
            </div>

            {/* 가격 */}
            <div className="flex flex-col font-['Pretendard_Variable:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[15px] text-black text-right w-full">
              <p className="leading-[20px]">월 14,900원</p>
            </div>

            {/* 구독하기 버튼 */}
            <button
              type="button"
              onClick={handleSubscribe}
              className="bg-[#2c9696] box-border content-stretch flex gap-[6px] h-[40px] items-center justify-center px-[14px] py-0 relative rounded-[6px] shrink-0 w-full"
            >
              <p className="font-['Pretendard_Variable:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">
                구독하기
              </p>
            </button>
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
    </div>
  );
}

