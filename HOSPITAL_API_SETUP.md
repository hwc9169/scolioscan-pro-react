# 병원 페이지 API 설정 가이드

병원 페이지에서 실제 지도와 병원 검색 기능을 사용하려면 Kakao API 키가 필요합니다.

## 1. Kakao Developers 계정 만들기

1. [Kakao Developers](https://developers.kakao.com/)에 접속
2. 로그인 후 '내 애플리케이션' 메뉴로 이동
3. '애플리케이션 추가하기' 클릭
4. 앱 이름 입력 (예: "스콜리오스캔")
5. 회사명 입력 후 저장

## 2. API 키 발급받기

애플리케이션을 만들면 두 가지 키가 필요합니다:

### JavaScript 키 (지도 표시용)
1. 생성한 애플리케이션 선택
2. '앱 키' 탭에서 **JavaScript 키** 복사
3. `src/hooks/useKakaoMap.ts` 파일 열기
4. 6번 줄에서 `YOUR_KAKAO_APP_KEY`를 복사한 키로 교체:
   ```typescript
   script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=여기에_JavaScript_키_붙여넣기&autoload=false&libraries=services`;
   ```

### REST API 키 (병원 검색용)
1. 같은 페이지의 '앱 키' 탭에서 **REST API 키** 복사
2. `src/hooks/useHospitalSearch.ts` 파일 열기
3. 16번 줄과 43번 줄에서 `YOUR_KAKAO_REST_API_KEY`를 복사한 키로 교체:
   ```typescript
   const REST_API_KEY = '여기에_REST_API_키_붙여넣기';
   ```

## 3. 플랫폼 등록

JavaScript 키를 사용하려면 도메인을 등록해야 합니다:

1. Kakao Developers 애플리케이션 페이지
2. '플랫폼' 탭 선택
3. 'Web 플랫폼 등록' 클릭
4. 개발 환경 URL 추가:
   - `http://localhost:5173` (Vite 개발 서버)
   - `http://localhost:3000` (기타 개발 서버)
5. 실제 배포 시 배포 도메인도 추가

## 4. 테스트

모든 설정이 완료되면:

```bash
npm run dev
```

실행 후 병원 페이지로 이동하면:
- ✅ 실제 지도가 표시됩니다
- ✅ 현재 위치 기반으로 주변 병원이 자동 검색됩니다
- ✅ 검색바에서 병원을 검색할 수 있습니다
- ✅ 지도에 마커가 표시되고 클릭하면 상세정보가 나타납니다

## 주요 기능

### 🗺️ 실시간 지도
- Kakao Maps API를 사용한 실제 지도
- 사용자 현재 위치 자동 감지
- 확대/축소, 드래그 가능

### 🔍 병원 검색
- 키워드로 병원 검색 (예: "강남 정형외과")
- 현재 위치 기반 거리순 정렬
- 검색 결과 실시간 표시

### 📍 마커 표시
- 검색된 병원들을 지도에 마커로 표시
- 마커 클릭 시 해당 병원 정보 표시
- 자동으로 모든 마커가 보이도록 지도 범위 조정

### 📋 병원 목록
- '목록' 버튼 클릭 시 전체 병원 리스트 표시
- 리스트에서 병원 선택 가능
- 거리 정보 표시

### 📞 상세 정보
- 병원 이름, 카테고리
- 전화번호 (클릭 시 전화 걸기)
- 도로명 주소
- 현재 위치로부터의 거리

## 문제 해결

### 지도가 안 보여요
- JavaScript 키가 올바르게 입력되었는지 확인
- 플랫폼에 현재 도메인이 등록되었는지 확인
- 브라우저 콘솔에서 에러 메시지 확인

### 검색이 안 돼요
- REST API 키가 올바르게 입력되었는지 확인
- 네트워크 탭에서 API 요청 실패 여부 확인
- CORS 에러가 있는지 확인

### 위치 권한 요청이 안 나와요
- HTTPS 또는 localhost에서만 Geolocation API 사용 가능
- 브라우저 설정에서 위치 권한 확인

## 추가 개선 사항

원하시면 다음 기능들도 추가할 수 있습니다:

- [ ] 병원 즐겨찾기 기능
- [ ] 길찾기 기능 (카카오내비 연동)
- [ ] 병원 상세 페이지
- [ ] 진료 과목별 필터링
- [ ] 진료시간 정보 표시
- [ ] 리뷰 기능

## 참고 문서

- [Kakao Maps API](https://apis.map.kakao.com/)
- [Kakao Local API](https://developers.kakao.com/docs/latest/ko/local/dev-guide)

