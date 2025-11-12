import { type ReactElement, createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { getCurrentUser } from '../api/users';
import { getUnreadAlarmCount, getAlarms, type Alarm } from '../api/alarms';
import type { CurrentUserResponse } from '../api/users';
import { getCookie } from '../utils/common';

/**
 * 앱 전역 데이터 타입
 */
export interface AppData {
  user: CurrentUserResponse | null;
  unreadAlarmCount: number;
  alarms: Alarm[];
  isLoading: boolean;
}

interface AppDataContextType {
  appData: AppData;
  refreshUserData: () => Promise<void>;
  refreshUnreadAlarmCount: () => Promise<void>;
  refreshAlarms: () => Promise<void>;
  refreshAllData: () => Promise<void>;
  clearAppData: () => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

interface AppDataProviderProps {
  children: ReactNode;
}

/**
 * 앱 전역 데이터 Provider
 * - 로그인한 사용자 정보
 * - 읽지 않은 알람 개수
 * - 기타 전역으로 사용할 데이터들
 */
export function AppDataProvider({ children }: AppDataProviderProps): ReactElement {
  const [appData, setAppData] = useState<AppData>({
    user: null,
    unreadAlarmCount: 0,
    alarms: [],
    isLoading: false,
  });

  /**
   * 사용자 정보 새로고침
   */
  const refreshUserData = useCallback(async () => {
    try {
      const response = await getCurrentUser();
      if (response instanceof Response && response.ok) {
        const userData = await response.json();
        setAppData((prev) => ({
          ...prev,
          user: userData,
        }));
      }
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
    }
  }, []);

  /**
   * 읽지 않은 알람 개수 새로고침
   */
  const refreshUnreadAlarmCount = useCallback(async () => {
    try {
      const response = await getUnreadAlarmCount();
      if (response instanceof Response && response.ok) {
        const data = await response.json();
        // API 응답이 string인 경우 parseInt, 이미 number인 경우 그대로 사용
        const count = typeof data === 'string' ? parseInt(data, 10) : typeof data === 'number' ? data : 0;
        setAppData((prev) => ({
          ...prev,
          unreadAlarmCount: count,
        }));
      }
    } catch (error) {
      console.error('알람 개수 조회 실패:', error);
    }
  }, []);

  /**
   * 알림 리스트 새로고침
   */
  const refreshAlarms = useCallback(async () => {
    try {
      const response = await getAlarms();
      if (response instanceof Response && response.ok) {
        const alarmsData = await response.json();
        // API 응답이 배열인지 확인
        const alarms = Array.isArray(alarmsData) ? alarmsData : [];
        setAppData((prev) => ({
          ...prev,
          alarms,
        }));
      }
    } catch (error) {
      console.error('알림 리스트 조회 실패:', error);
    }
  }, []);

  /**
   * 모든 데이터 새로고침
   */
  const refreshAllData = useCallback(async () => {
    setAppData((prev) => ({ ...prev, isLoading: true }));
    try {
      await Promise.all([
        refreshUserData(),
        refreshUnreadAlarmCount(),
        refreshAlarms(),
      ]);
    } finally {
      setAppData((prev) => ({ ...prev, isLoading: false }));
    }
  }, [refreshUserData, refreshUnreadAlarmCount, refreshAlarms]);

  /**
   * 앱 데이터 클리어 (로그아웃 시 사용)
   */
  const clearAppData = useCallback(() => {
    setAppData({
      user: null,
      unreadAlarmCount: 0,
      alarms: [],
      isLoading: false,
    });
  }, []);

  /**
   * 초기 마운트 시 토큰이 있으면 데이터 자동 조회
   * - 새로고침 시에도 자동으로 데이터를 다시 불러옴
   * - 스플래시 페이지를 거치지 않아도 데이터가 로드됨
   */
  useEffect(() => {
    const initializeData = async () => {
      const accessToken = getCookie('userAccessToken');
      if (accessToken) {
        // 토큰이 있으면 초기 데이터 조회
        await refreshAllData();
      }
    };

    initializeData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // refreshAllData는 useCallback으로 메모이제이션되어 있으므로 의존성 배열에 포함하지 않음

  return (
    <AppDataContext.Provider
      value={{
        appData,
        refreshUserData,
        refreshUnreadAlarmCount,
        refreshAlarms,
        refreshAllData,
        clearAppData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

/**
 * AppDataContext 사용 훅
 */
export function useAppData(): AppDataContextType {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
}

