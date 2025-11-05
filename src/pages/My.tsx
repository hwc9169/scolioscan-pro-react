import { type ReactElement, useState, useEffect } from 'react';
import { BannerSlider } from '../components/BannerSlider';
// My 전용 이미지 - 배너 및 앱 아이콘
import BannerImage1 from '../assets/icon_svg/My/BannerImage1.png';
import BannerImage2 from '../assets/icon_svg/My/BannerImage2.png';
import AppIcon1 from '../assets/icon_svg/My/AppIcon1.png';
import AppIcon2 from '../assets/icon_svg/My/AppIcon2.png';
import AppIcon3 from '../assets/icon_svg/My/AppIcon3.png';
import AppIcon4 from '../assets/icon_svg/My/AppIcon4.png';

// My 전용 아이콘
import UserCircleAdd from '../assets/icon_svg/My/UserCircleAdd.svg';
import UserEdit from '../assets/icon_svg/My/UserEdit.svg';
import ChevronRight from '../assets/icon_svg/My/ChevronRight.svg';
import Crown from '../assets/icon_svg/My/Crown.svg';
import Setting from '../assets/icon_svg/My/Setting.svg';
import MessageQuestion from '../assets/icon_svg/My/MessageQuestion.svg';

import { NavigationBottom } from '../components/NavigationBottom';

// 로컬 아이콘 에셋 매핑
const img5 = AppIcon1;
const img6 = AppIcon2;
const img7 = AppIcon3;
const img8 = AppIcon4;
const imgVuesaxBoldUserCirlceAdd = UserCircleAdd;
const img = UserEdit;
const img1 = ChevronRight;
const img2 = Crown;
const img3 = Setting;
const img4 = MessageQuestion;

/**
 * 마이 페이지
 */
export function My(): ReactElement {
  const [bannerImage, setBannerImage] = useState(BannerImage1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 410) {
        setBannerImage(BannerImage2);
      } else {
        setBannerImage(BannerImage1);
      }
    };

    // 초기 설정
    handleResize();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="bg-white content-stretch flex flex-col items-start relative min-h-screen">
      {/* 메인 컨텐츠 */}
      <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full pb-[80px]">
        {/* 프로필 섹션 */}
        <div className="box-border content-stretch flex flex-col gap-[12px] items-center pb-[18px] pt-[24px] px-[24px] relative shrink-0 w-full">
          <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
            <div className="bg-[#f3f4f7] box-border content-stretch flex gap-[11.765px] items-center justify-center p-[11.765px] relative rounded-[16px] shrink-0 size-[80px]">
              <div className="relative shrink-0 size-[48px]">
                <div className="absolute contents inset-0">
                  <img alt="" className="block max-w-none size-full" src={imgVuesaxBoldUserCirlceAdd} />
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col items-start justify-center leading-[0] not-italic relative shrink-0 text-nowrap">
              <div className="flex flex-col font-['Pretendard_Variable:SemiBold',sans-serif] justify-center relative shrink-0 text-[18px] text-black">
                <p className="leading-[24px] text-nowrap whitespace-pre">홍길동</p>
              </div>
              <div className="flex flex-col font-['Pretendard_Variable:Regular',sans-serif] justify-center relative shrink-0 text-[#7e89a0] text-[14px]">
                <p className="leading-[20px] text-nowrap whitespace-pre">ceo@nextvine.com</p>
              </div>
            </div>
          </div>
          <BannerSlider
            items={[
              {
                id: '1',
                image: bannerImage,
                content: (
                  <div className="h-full w-full">
                    <img alt="" className="h-full w-full object-cover" src={bannerImage} />
                  </div>
                ),
              },
              {
                id: '2',
                image: bannerImage,
                content: (
                  <div className="h-full w-full">
                    <img alt="" className="h-full w-full object-cover" src={bannerImage} />
                  </div>
                ),
              },
              {
                id: '3',
                image: bannerImage,
                content: (
                  <div className="h-full w-full">
                    <img alt="" className="h-full w-full object-cover" src={bannerImage} />
                  </div>
                ),
              },
            ]}
            height="100px"
          />
        </div>

        {/* 메뉴 리스트 */}
        <div className="bg-white box-border content-stretch flex flex-col items-center px-0 py-[20px] relative shrink-0 w-full">
          <div className="bg-white box-border content-stretch flex h-[52px] items-center justify-between px-[24px] py-0 relative shrink-0 w-full">
            <div className="content-stretch flex gap-[14px] items-center relative shrink-0">
              <div className="bg-[#f3f4f7] box-border content-stretch flex gap-[10px] items-center justify-center p-[4px] relative rounded-[8px] shrink-0 size-[32px]">
                <div className="relative shrink-0 size-[16.2px]">
                  <div className="absolute contents inset-0">
                    <img alt="" className="block max-w-none size-full" src={img} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-nowrap">
                <p className="leading-[20px] whitespace-pre">프로필 수정</p>
              </div>
            </div>
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute inset-[11.55%_23.29%_11.55%_30.31%]">
                <div className="absolute inset-0">
                  <img alt="" className="block max-w-none size-full" src={img1} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white box-border content-stretch flex h-[52px] items-center justify-between px-[24px] py-0 relative shrink-0 w-full">
            <div className="content-stretch flex gap-[14px] items-center relative shrink-0">
              <div className="bg-[#f3f4f7] box-border content-stretch flex gap-[10px] items-center justify-center p-[4px] relative rounded-[8px] shrink-0 size-[32px]">
                <div className="relative shrink-0 size-[13.5px]">
                  <div className="absolute contents inset-0">
                    <img alt="" className="block max-w-none size-full" src={img2} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-nowrap">
                <p className="leading-[20px] whitespace-pre">구독설정</p>
              </div>
            </div>
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute inset-[11.55%_23.29%_11.55%_30.31%]">
                <div className="absolute inset-0">
                  <img alt="" className="block max-w-none size-full" src={img1} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white box-border content-stretch flex h-[52px] items-center justify-between px-[24px] py-0 relative shrink-0 w-full">
            <div className="content-stretch flex gap-[14px] items-center relative shrink-0">
              <div className="bg-[#f3f4f7] box-border content-stretch flex gap-[10px] items-center justify-center p-[4px] relative rounded-[8px] shrink-0 size-[32px]">
                <div className="relative shrink-0 size-[13.5px]">
                  <div className="absolute contents inset-0">
                    <img alt="" className="block max-w-none size-full" src={img3} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-nowrap">
                <p className="leading-[20px] whitespace-pre">환경설정</p>
              </div>
            </div>
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute inset-[11.55%_23.29%_11.55%_30.31%]">
                <div className="absolute inset-0">
                  <img alt="" className="block max-w-none size-full" src={img1} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white box-border content-stretch flex h-[52px] items-center justify-between px-[24px] py-0 relative shrink-0 w-full">
            <div className="content-stretch flex gap-[14px] items-center relative shrink-0">
              <div className="bg-[#f3f4f7] box-border content-stretch flex gap-[10px] items-center justify-center p-[4px] relative rounded-[8px] shrink-0 size-[32px]">
                <div className="relative shrink-0 size-[13.5px]">
                  <div className="absolute contents inset-0">
                    <img alt="" className="block max-w-none size-full" src={img4} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-nowrap">
                <p className="leading-[20px] whitespace-pre">고객센터</p>
              </div>
            </div>
            <div className="relative shrink-0 size-[16px]">
              <div className="absolute inset-[11.55%_23.29%_11.55%_30.31%]">
                <div className="absolute inset-0">
                  <img alt="" className="block max-w-none size-full" src={img1} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 관련 앱 섹션 */}
        <div className="bg-gray-50 box-border content-stretch flex flex-col gap-[20px] items-start pb-[40px] pt-[24px] px-[20px] relative shrink-0 w-full">
          <div className="flex flex-col font-['Pretendard_Variable:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#2b2f36] text-[16px] text-nowrap">
            <p className="leading-[22px] whitespace-pre">관련 앱 둘러보세요</p>
          </div>
          <div className="content-stretch flex gap-[20px] items-start justify-center relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0">
              <div className="bg-[#f3f4f7] overflow-clip relative rounded-[12px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.12)] shrink-0 size-[64px]">
                <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img5} />
              </div>
              <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#515968] text-[13px] text-center w-[min-content]">
                <p className="leading-[14px]">짐워크</p>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0">
              <div className="bg-[#f3f4f7] overflow-clip relative rounded-[12px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.12)] shrink-0 size-[64px]">
                <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img6} />
              </div>
              <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#515968] text-[13px] text-center w-[min-content]">
                <p className="leading-[14px]">척추건강</p>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0">
              <div className="bg-[#f3f4f7] overflow-clip relative rounded-[12px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.12)] shrink-0 size-[64px]">
                <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img7} />
              </div>
              <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#515968] text-[13px] text-center w-[min-content]">
                <p className="leading-[14px]">스마트슈즈</p>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0">
              <div className="bg-[#f3f4f7] overflow-clip relative rounded-[12px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.12)] shrink-0 size-[64px]">
                <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img8} />
              </div>
              <div className="flex flex-col font-['Pretendard_Variable:Medium',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#515968] text-[13px] text-center w-[min-content]">
                <p className="leading-[14px]">손목닥터</p>
              </div>
            </div>
          </div>
        </div>

        {/* 로그아웃 */}
        <div className="box-border content-stretch flex flex-col gap-[20px] items-center pb-[60px] pt-[32px] px-[20px] relative shrink-0 w-full">
          <p className="font-['Manrope:Medium','Noto_Sans_KR:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#52a8ff] text-[14px] text-nowrap tracking-[0.28px] whitespace-pre">
            로그아웃
          </p>
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <NavigationBottom />
    </div>
  );
}
