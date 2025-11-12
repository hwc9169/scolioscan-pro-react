import { type ReactElement, useState, useEffect } from 'react';
import { BannerSlider } from '../components/BannerSlider';
import { useAppData } from '../contexts/AppDataContext';
import { useFullSheet } from '../hooks/useFullSheet';
import { AlarmList } from '../components/FullSheet/AlarmListFullSheet';
// 공통 아이콘
import BellIcon from '../assets/icon_svg/BellIcon.svg';
import Badge from '../assets/icon_svg/Badge.svg';

// Home 전용 아이콘 - 2D 이미지 측정
import Icon2D_Vector1 from '../assets/icon_svg/Home/Icon2D_Vector1.svg';
import Icon2D_Vector2 from '../assets/icon_svg/Home/Icon2D_Vector2.svg';
import Icon2D_Vector3 from '../assets/icon_svg/Home/Icon2D_Vector3.svg';
import Icon2D_Vector4 from '../assets/icon_svg/Home/Icon2D_Vector4.svg';
import Icon2D_Group from '../assets/icon_svg/Home/Icon2D_Group.svg';
import Icon2D_Vector5 from '../assets/icon_svg/Home/Icon2D_Vector5.svg';
import Icon2D_Vector6 from '../assets/icon_svg/Home/Icon2D_Vector6.svg';
import Icon2D_Vector7 from '../assets/icon_svg/Home/Icon2D_Vector7.svg';

// Home 전용 아이콘 - 3D 동영상 측정
import Icon3D_1 from '../assets/icon_svg/Home/Icon3D_1.svg';
import Icon3D_2 from '../assets/icon_svg/Home/Icon3D_2.svg';
import Icon3D_3 from '../assets/icon_svg/Home/Icon3D_3.svg';
import Icon3D_4 from '../assets/icon_svg/Home/Icon3D_4.svg';
import Icon3D_5 from '../assets/icon_svg/Home/Icon3D_5.svg';
import Icon3D_6 from '../assets/icon_svg/Home/Icon3D_6.svg';
import Icon3D_7 from '../assets/icon_svg/Home/Icon3D_7.svg';
import Icon3D_8 from '../assets/icon_svg/Home/Icon3D_8.svg';
import Icon3D_9 from '../assets/icon_svg/Home/Icon3D_9.svg';
import Icon3D_10 from '../assets/icon_svg/Home/Icon3D_10.svg';
import Icon3D_11 from '../assets/icon_svg/Home/Icon3D_11.svg';
import Icon3D_12 from '../assets/icon_svg/Home/Icon3D_12.svg';

// Home 전용 아이콘 - 척추측만계 측정
import IconScoliometer_1 from '../assets/icon_svg/Home/IconScoliometer_1.svg';
import IconScoliometer_2 from '../assets/icon_svg/Home/IconScoliometer_2.svg';

// Home 전용 이미지 - 배너
import BannerImage1 from '../assets/icon_svg/My/BannerImage1.png';
import BannerImage2 from '../assets/icon_svg/My/BannerImage2.png';

// Home 전용 이미지 - 병원 사진
import Hospital1 from '../assets/icon_svg/Home/Hospital1.png';
import Hospital2 from '../assets/icon_svg/Home/Hospital2.png';

import { NavigationBottom } from '../components/NavigationBottom';

// 로컬 아이콘 에셋 매핑
const img17 = Hospital1;
const img18 = Hospital2;
const imgVector = Icon2D_Vector1;
const imgVector1 = Icon2D_Vector2;
const imgVector2 = Icon2D_Vector3;
const imgVector3 = Icon2D_Vector4;
const imgGroup = Icon2D_Group;
const imgVector4 = Icon2D_Vector5;
const imgVector5 = Icon2D_Vector6;
const imgVector6 = Icon2D_Vector7;
const img = BellIcon;
const img1 = Badge;
const img3 = Icon3D_1;
const img4 = Icon3D_2;
const img5 = Icon3D_3;
const img6 = Icon3D_4;
const img7 = Icon3D_5;
const img8 = Icon3D_6;
const img9 = Icon3D_7;
const img10 = Icon3D_8;
const img11 = Icon3D_9;
const img12 = Icon3D_10;
const img13 = Icon3D_11;
const img14 = Icon3D_12;
const img15 = IconScoliometer_1;
const img16 = IconScoliometer_2;

function IconHomemenu({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="absolute inset-[25.19%_69.35%_67.6%_21.93%]">
        <img alt="" className="block max-w-none size-full" src={imgVector} />
      </div>
      <div className="absolute inset-[22%_14.83%_22.23%_14.83%]">
        <img alt="" className="block max-w-none size-full" src={imgVector1} />
      </div>
      <div className="absolute inset-[35.38%_20.85%_57.58%_72.12%]">
        <div className="absolute inset-[-32.77%]">
          <img alt="" className="block max-w-none size-full" src={imgVector2} />
        </div>
      </div>
      <div className="absolute inset-[22%_53.03%_22.23%_14.83%] mix-blend-multiply">
        <img alt="" className="block max-w-none size-full" src={imgVector3} />
      </div>
      <div className="absolute inset-[39.01%_35.44%_25.36%_28.93%] mix-blend-multiply">
        <div className="absolute inset-[-2.16%_-2.16%_-2.15%_-2.16%]">
          <img alt="" className="block max-w-none size-full" src={imgGroup} />
        </div>
      </div>
      <div className="absolute inset-[36.47%_50%_27.69%_32.08%]">
        <img alt="" className="block max-w-none size-full" src={imgVector4} />
      </div>
      <div className="absolute inset-[36.47%_32.08%_27.69%_32.08%]">
        <img alt="" className="block max-w-none size-full" src={imgVector5} />
      </div>
      <div className="absolute inset-[42.72%_38.35%_33.95%_38.32%]">
        <img alt="" className="block max-w-none size-full" src={imgVector6} />
      </div>
    </div>
  );
}

function CardHomemenu({ 
  title, 
  subtitle, 
  icon 
}: { 
  title: string; 
  subtitle: string; 
  icon: ReactElement;
}) {
  return (
    <div className="bg-white box-border content-stretch flex items-center justify-between overflow-clip px-[20px] py-[16px] relative rounded-[12px] shadow-[0px_0px_16px_0px_rgba(0,0,0,0.04)] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
        <div className="flex flex-col font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#25272d] text-[18px] text-nowrap">
          <p className="leading-[24px] whitespace-pre">{title}</p>
        </div>
        <div className="bg-[#ebf5ff] box-border content-stretch flex gap-[10px] items-center justify-center px-[8px] py-[4px] relative rounded-[5px] shrink-0">
          <div className="flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[#2e96ff] text-[13px] text-nowrap">
            <p className="leading-[18px] whitespace-pre">{subtitle}</p>
          </div>
        </div>
      </div>
      {icon}
    </div>
  );
}

/**
 * 홈 페이지
 */
export function Home(): ReactElement {
  const { appData } = useAppData();
  const { openFullSheet } = useFullSheet();
  const [bannerImage, setBannerImage] = useState(BannerImage1);

  const handleAlarmClick = () => {
    openFullSheet(AlarmList, {}, { animationDirection: 'right' });
  };

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
        {/* 배너 */}
        <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full">
          <BannerSlider
            items={[
              {
                id: '1',
                image: bannerImage,
                content: (
                  <div className="h-full w-full relative">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={bannerImage} />
                  </div>
                ),
              },
              {
                id: '2',
                image: bannerImage,
                content: (
                  <div className="h-full w-full relative">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={bannerImage} />
                  </div>
                ),
              },
              {
                id: '3',
                image: bannerImage,
                content: (
                  <div className="h-full w-full relative">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={bannerImage} />
                  </div>
                ),
              },
            ]}
            height="112px"
          />
        </div>

        {/* 척추검진 섹션 */}
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
          <div className="flex flex-col font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#2b2f36] text-[16px] text-nowrap">
            <p className="leading-[22px] whitespace-pre">3분만에 끝나는 척추검진</p>
          </div>
          <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
            <CardHomemenu
              title="2D 이미지 측정"
              subtitle="카메라를 통한 간편 측정"
              icon={<IconHomemenu className="overflow-clip relative shrink-0 size-[60px]" />}
            />
            <CardHomemenu
              title="3D 동영상 측정"
              subtitle="영상을 통한 정밀 측정"
              icon={
                <div className="overflow-clip relative shrink-0 size-[60px]">
                  <div className="absolute inset-[39.35%_5%_15.9%_8.96%]">
                    <img alt="" className="block max-w-none size-full" src={img3} />
                  </div>
                  <div className="absolute inset-[18.33%_52.07%_60.94%_27.2%]">
                    <img alt="" className="block max-w-none size-full" src={img4} />
                  </div>
                  <div className="absolute inset-[19.25%_55.37%_60.94%_27.2%] mix-blend-multiply">
                    <img alt="" className="block max-w-none size-full" src={img5} />
                  </div>
                  <div className="absolute inset-[12.57%_25.61%_60.94%_47.9%]">
                    <img alt="" className="block max-w-none size-full" src={img6} />
                  </div>
                  <div className="absolute inset-[13.74%_29.81%_15.9%_34.92%] mix-blend-multiply">
                    <img alt="" className="block max-w-none size-full" src={img7} />
                  </div>
                  <div className="absolute inset-[39.04%_27.11%_26.65%_21.38%]">
                    <img alt="" className="block max-w-none size-full" src={img8} />
                  </div>
                  <div className="absolute inset-[39.04%_27.11%_26.65%_21.38%] mix-blend-multiply">
                    <img alt="" className="block max-w-none size-full" src={img9} />
                  </div>
                  <div className="absolute inset-[24.47%_58.22%_67.08%_33.33%]">
                    <img alt="" className="block max-w-none size-full" src={img10} />
                  </div>
                  <div className="absolute inset-[19.67%_32.71%_68.04%_55%]">
                    <img alt="" className="block max-w-none size-full" src={img11} />
                  </div>
                  <div className="absolute inset-[46.27%_34.29%_38.82%_50.8%]">
                    <img alt="" className="block max-w-none size-full" src={img12} />
                  </div>
                  <div className="absolute inset-[46.27%_45.47%_38.82%_50.8%] mix-blend-multiply">
                    <img alt="" className="block max-w-none size-full" src={img13} />
                  </div>
                  <div className="absolute inset-[46.76%_5%_26.96%_72.89%] mix-blend-multiply">
                    <img alt="" className="block max-w-none size-full" src={img14} />
                  </div>
                </div>
              }
            />
            <CardHomemenu
              title="척추측만계 측정"
              subtitle="영상을 통한 정밀 측정"
              icon={
                <div className="overflow-clip relative shrink-0 size-[60px]">
                  <div className="absolute flex inset-[3.45%_9.41%_5.74%_23.73%] items-center justify-center">
                    <div className="flex-none h-[54.489px] rotate-[180deg] scale-y-[-100%] w-[40.115px]">
                      <div className="relative size-full">
                        <img alt="" className="block max-w-none size-full" src={img15} />
                      </div>
                    </div>
                  </div>
                  <div className="absolute flex h-[54.489px] items-center justify-center left-[30.7px] mix-blend-multiply top-[2.06px] w-[10.672px]">
                    <div className="flex-none rotate-[180deg] scale-y-[-100%]">
                      <div className="h-[54.489px] relative w-[10.672px]">
                        <img alt="" className="block max-w-none size-full" src={img16} />
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        </div>

        {/* 병원 찾기 섹션 */}
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
          <div className="flex flex-col font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#2b2f36] text-[16px] text-nowrap">
            <p className="leading-[22px] whitespace-pre">가까운 병원 찾기</p>
          </div>
          <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
            <div className="basis-0 content-stretch flex flex-col gap-[10px] grow items-start min-h-px min-w-px relative shrink-0">
              <div className="aspect-[160/132] opacity-90 relative rounded-[12px] shrink-0 w-full">
                <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[12px] size-full" src={img17} />
              </div>
              <div className="content-stretch flex flex-col items-start leading-[0] not-italic relative shrink-0 w-[150px]">
                <div className="flex flex-col font-semibold justify-center relative shrink-0 text-[#25272d] text-[14px] w-full">
                  <p className="leading-[20px]">판교퍼스트정형외과</p>
                </div>
                <div className="flex flex-col font-medium justify-center relative shrink-0 text-[#2e96ff] text-[13px] w-full">
                  <p className="leading-[18px]">평일 매일 20시 야간진료</p>
                </div>
              </div>
            </div>
            <div className="basis-0 content-stretch flex flex-col gap-[10px] grow items-start min-h-px min-w-px relative shrink-0">
              <div className="aspect-[160/132] opacity-90 relative rounded-[12px] shrink-0 w-full">
                <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[12px] size-full" src={img18} />
              </div>
              <div className="content-stretch flex flex-col items-start leading-[0] not-italic relative shrink-0 w-[150px]">
                <div className="flex flex-col font-semibold justify-center relative shrink-0 text-[#25272d] text-[14px] w-full">
                  <p className="leading-[20px]">더케어통증의학과</p>
                </div>
                <div className="flex flex-col font-medium justify-center relative shrink-0 text-[#2e96ff] text-[13px] w-full">
                  <p className="leading-[18px]">스포츠 손상 통증 전문</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <NavigationBottom />
    </div>
  );
}
