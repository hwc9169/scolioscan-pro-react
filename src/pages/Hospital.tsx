import { type ReactElement, useState } from 'react';
import { NavigationBottom } from '../components/NavigationBottom';
import type { Hospital as HospitalType } from '../types/hospital';

// Hospital 페이지 아이콘
import MapImage from '../assets/icon_svg/Hospital/MapImage.png';
import IconAddress from '../assets/icon_svg/Hospital/IconAddress.svg';
import IconPhone from '../assets/icon_svg/Hospital/IconPhone.svg';
import IconSearch from '../assets/icon_svg/Hospital/IconSearch.svg';
import IconArrowLeft from '../assets/icon_svg/Hospital/IconArrowLeft.svg';

// 병원 이미지
import Hospital1 from '../assets/icon_svg/Hospital/Hospital1.png';
import Hospital2 from '../assets/icon_svg/Hospital/Hospital2.png';
import Hospital3 from '../assets/icon_svg/Hospital/Hospital3.png';
import Hospital4 from '../assets/icon_svg/Hospital/Hospital4.png';

// 테스트용 더미 병원 데이터
const DUMMY_HOSPITALS: HospitalType[] = [
  {
    id: '1',
    name: '강남바른 정형외과',
    category: '정형외과',
    phone: '02-1234-5678',
    address: '서울 강남구 선릉로 82길 214',
    roadAddress: '강남구 선릉로 82길 214',
    x: '127.047',
    y: '37.505',
    distance: '350',
    imageUrl: Hospital1,
  },
  {
    id: '2',
    name: '더케어통증의학과',
    category: '통증의학과',
    phone: '02-2345-6789',
    address: '서울 강남구 압구정로 123',
    roadAddress: '강남구 압구정로 123',
    x: '127.028',
    y: '37.527',
    distance: '850',
    imageUrl: Hospital2,
  },
  {
    id: '3',
    name: '굿본 재활의학과의원',
    category: '재활의학과',
    phone: '02-3456-7890',
    address: '서울 강남구 신사동 456',
    roadAddress: '강남구 신사동 456',
    x: '127.020',
    y: '37.520',
    distance: '1200',
    imageUrl: Hospital3,
  },
  {
    id: '4',
    name: '마디랑정형외과의원',
    category: '정형외과',
    phone: '02-4567-8901',
    address: '서울 강남구 청담동 789',
    roadAddress: '강남구 청담동 789',
    x: '127.055',
    y: '37.525',
    distance: '1500',
    imageUrl: Hospital4,
  },
];

/**
 * 병원 페이지
 * TODO: 실제 Kakao API 연동 시 useKakaoMap, useHospitalSearch 활성화
 */
export function Hospital(): ReactElement {
  const [searchQuery, setSearchQuery] = useState('');
  const [hospitals] = useState<HospitalType[]>(DUMMY_HOSPITALS);
  const [selectedHospital, setSelectedHospital] = useState<HospitalType | null>(DUMMY_HOSPITALS[0]);
  const [showList, setShowList] = useState(false);
  const [isLoading] = useState(false);

  // 검색 실행 (현재는 더미 데이터 필터링)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 실제 API 연동 시 searchHospitals 호출
    console.log('검색:', searchQuery);
  };

  // 검색어 입력
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 목록 토글
  const toggleList = () => {
    setShowList(!showList);
  };

  // 목록 화면 (Figma 디자인대로)
  if (showList) {
    return (
      <div className="bg-white min-h-screen flex flex-col pb-[80px]">
        {/* 헤더 - 지도로 돌아가기 */}
        <div className="box-border flex gap-[20px] h-[68px] items-center p-[20px] shrink-0 w-full">
          <button
            onClick={toggleList}
            className="flex gap-[10px] items-center"
          >
            <div className="relative shrink-0 size-[24px]">
              <div className="absolute flex inset-[17.71%_32.29%] items-center justify-center">
                <div className="flex-none h-[8.5px] rotate-[90deg] w-[15.5px]">
                  <img alt="" className="block max-w-none size-full" src={IconArrowLeft} />
                </div>
              </div>
            </div>
          </button>
          <div className="flex flex-col font-['Pretendard_Variable',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#2b2f36] text-[18px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">지도로 돌아가기</p>
          </div>
        </div>

        {/* 구분선 */}
        <div className="bg-neutral-100 h-px shrink-0 w-full" />

        {/* 병원 목록 */}
        <div className="bg-white flex flex-col items-start pb-[80px] pt-0 px-0 shrink-0 w-full">
          {hospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="box-border flex gap-[16px] items-start p-[16px] shrink-0 w-full"
            >
              {/* 병원 이미지 */}
              <div className="opacity-90 relative rounded-[12px] shrink-0 size-[148px]">
                {hospital.imageUrl ? (
                  <img
                    alt={hospital.name}
                    className="absolute inset-0 max-w-none object-cover rounded-[12px] size-full"
                    src={hospital.imageUrl}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-100 rounded-[12px]" />
                )}
              </div>

              {/* 병원 정보 */}
              <div className="basis-0 flex flex-col gap-[12px] grow items-start min-h-px min-w-px relative shrink-0">
                <div className="flex flex-col gap-[2px] items-start leading-[0] not-italic relative shrink-0 w-full">
                  <div className="flex flex-col font-['Pretendard_Variable',sans-serif] font-semibold justify-center relative shrink-0 text-[#25272d] text-[18px] w-full">
                    <p className="leading-[24px]">{hospital.name}</p>
                  </div>
                  <div className="flex flex-col font-['Pretendard_Variable',sans-serif] font-medium justify-center relative shrink-0 text-[#2e96ff] text-[14px] w-full">
                    <p className="leading-[20px]">
                      {hospital.id === '2' 
                        ? '스포츠 손상 전문 통증의학과 전문의 2인'
                        : hospital.id === '3'
                        ? '정형외과 x 통증의학과 통증치료 선릉역 4번역 위치'
                        : '평일 매일 20시 야간진료'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                  {/* 전화번호 */}
                  <div className="flex gap-[4px] items-center relative shrink-0 w-full">
                    <div className="overflow-clip relative shrink-0 size-[16px]">
                      <div className="absolute inset-[12.5%_12.97%_12.82%_12.5%]">
                        <img alt="" className="block max-w-none size-full" src={IconPhone} />
                      </div>
                    </div>
                    <div className="flex flex-col font-['Pretendard_Variable',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#515968] text-[14px] text-nowrap">
                      <p className="leading-[20px] whitespace-pre">{hospital.phone}</p>
                    </div>
                  </div>
                  {/* 주소 */}
                  <div className="flex gap-[4px] items-center relative shrink-0 w-full">
                    <div className="overflow-clip relative shrink-0 size-[16px]">
                      <div className="absolute h-[12.727px] left-1/2 top-[calc(50%+0.363px)] translate-x-[-50%] translate-y-[-50%] w-[10px]">
                        <img alt="" className="block max-w-none size-full" src={IconAddress} />
                      </div>
                    </div>
                    <div className="flex flex-col font-['Pretendard_Variable',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#515968] text-[14px] text-nowrap">
                      <p className="leading-[20px] whitespace-pre">{hospital.roadAddress || hospital.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 네비게이션 바 */}
        <NavigationBottom />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col relative">
      {/* 헤더 - 검색바 */}
      <div className="bg-white p-[12px] shrink-0 z-20 relative">
        <form onSubmit={handleSearch}>
          <div className="bg-white flex gap-[8px] items-center px-[16px] py-[12px] rounded-[21px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.2)]">
            <button type="submit" className="relative shrink-0 size-[16px]">
              <img alt="검색" className="w-full h-full object-contain" src={IconSearch} />
            </button>
            <input
              type="text"
              placeholder="병원을 검색하세요"
              value={searchQuery}
              onChange={handleSearchInput}
              className="flex-1 font-['Pretendard_Variable',sans-serif] font-medium text-[#25272d] text-[13px] leading-[18px] outline-none bg-transparent placeholder:text-[#7e89a0]"
            />
          </div>
        </form>
      </div>

      {/* 지도 영역 - 임시 이미지 */}
      <div 
        className="flex-1 relative overflow-hidden transition-all duration-300"
        style={{
          paddingBottom: selectedHospital && !showList ? '280px' : showList ? '50vh' : '0'
        }}
      >
        <img 
          src={MapImage} 
          alt="지도" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* API 안내 배너 */}
        <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-[12px] p-4 shadow-lg z-10">
          <p className="font-['Pretendard_Variable',sans-serif] font-semibold text-[#25272d] text-[14px] leading-[20px] mb-1">
            💡 지도 기능 테스트 모드
          </p>
          <p className="font-['Pretendard_Variable',sans-serif] font-medium text-[#515968] text-[12px] leading-[18px]">
            실제 지도를 사용하려면 Kakao API 키를 설정하세요.<br/>
            자세한 내용은 HOSPITAL_API_SETUP.md 파일을 확인하세요.
          </p>
        </div>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50">
            <div className="text-[#25272d] font-['Pretendard_Variable',sans-serif] font-medium text-[14px]">
              검색 중...
            </div>
          </div>
        )}
      </div>

      {/* 하단 컨텐츠 영역 */}
      {selectedHospital && !showList && (
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-tl-[20px] rounded-tr-[20px] shadow-[0px_0px_16px_0px_rgba(0,0,0,0.1)] z-10 pb-[80px] animate-slide-up">
          {/* 목록 탭 버튼 */}
          <div className="flex justify-center pt-[12px] pb-[8px]">
            <button
              onClick={toggleList}
              className="bg-white flex gap-[6px] items-center justify-center px-[20px] py-[10px] rounded-[22px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.2)]"
            >
              <svg className="w-[11px] h-[11px]" viewBox="0 0 11 11" fill="none">
                <path
                  d="M3.5 2.5H9.5M3.5 5.5H9.5M3.5 8.5H9.5M1.5 2.5H1.51M1.5 5.5H1.51M1.5 8.5H1.51"
                  stroke="#2b2f36"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-['Pretendard_Variable',sans-serif] font-medium text-[#2b2f36] text-[13px] leading-[18px]">
                목록 {hospitals.length > 0 && `(${hospitals.length})`}
              </span>
            </button>
          </div>

          {/* 병원 카드 */}
          <div className="px-[16px] py-[16px]">
            <div className="flex gap-[16px]">
              {/* 병원 이미지 */}
              <div className="shrink-0 w-[148px] h-[148px] rounded-[12px] overflow-hidden">
                {selectedHospital.imageUrl ? (
                  <img
                    src={selectedHospital.imageUrl}
                    alt={selectedHospital.name}
                    className="w-full h-full object-cover opacity-90"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <svg
                      className="w-[48px] h-[48px] text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* 병원 정보 */}
              <div className="flex-1 flex flex-col gap-[8px] min-w-0">
                <div className="flex flex-col gap-[2px]">
                  <h3 className="font-['Pretendard_Variable',sans-serif] font-semibold text-[#25272d] text-[16px] leading-[22px] truncate">
                    {selectedHospital.name}
                  </h3>
                  <p className="font-['Pretendard_Variable',sans-serif] font-medium text-[#2e96ff] text-[13px] leading-[18px]">
                    {selectedHospital.category}
                  </p>
                </div>

                <div className="flex flex-col gap-[4px]">
                  {/* 전화번호 */}
                  <div className="flex gap-[4px] items-center">
                    <div className="relative shrink-0 size-[16px]">
                      <img alt="" className="w-full h-full object-contain" src={IconPhone} />
                    </div>
                    <a
                      href={`tel:${selectedHospital.phone}`}
                      className="font-['Pretendard_Variable',sans-serif] font-medium text-[#515968] text-[13px] leading-[18px] hover:text-[#2e96ff] truncate"
                    >
                      {selectedHospital.phone}
                    </a>
                  </div>

                  {/* 주소 */}
                  <div className="flex gap-[4px] items-start">
                    <div className="relative shrink-0 size-[16px] mt-[2px]">
                      <img alt="" className="w-full h-full object-contain" src={IconAddress} />
                    </div>
                    <span className="font-['Pretendard_Variable',sans-serif] font-medium text-[#515968] text-[13px] leading-[18px] flex-1">
                      {selectedHospital.roadAddress || selectedHospital.address}
                    </span>
                  </div>

                  {/* 거리 정보 */}
                  {selectedHospital.distance && (
                    <div className="flex gap-[4px] items-center mt-[4px]">
                      <span className="font-['Pretendard_Variable',sans-serif] font-medium text-[#97a2b9] text-[12px] leading-[16px]">
                        현재 위치에서 약 {Math.round(parseInt(selectedHospital.distance))}m
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* 하단 네비게이션 바 */}
      <NavigationBottom />
    </div>
  );
}

