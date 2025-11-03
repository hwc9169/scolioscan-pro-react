import { createContext, useContext, useReducer, type ReactElement, type ReactNode } from 'react';
import type { CacheStorageContextType } from '../types/cacheStorage';

export const CacheStorageContext = createContext<CacheStorageContextType | undefined>(undefined);

type CacheAction =
  | { type: 'SET'; payload: { key: string; value: unknown } }
  | { type: 'REMOVE'; payload: { key: string } }
  | { type: 'CLEAR' };

interface CacheState {
  data: Record<string, unknown>;
}

const cacheReducer = (state: CacheState, action: CacheAction): CacheState => {
  switch (action.type) {
    case 'SET': {
      return {
        data: {
          ...state.data,
          [action.payload.key]: action.payload.value,
        },
      };
    }

    case 'REMOVE': {
      const { [action.payload.key]: removed, ...rest } = state.data;
      return {
        data: rest,
      };
    }

    case 'CLEAR':
      return {
        data: {},
      };

    default:
      return state;
  }
};

interface CacheStorageProviderProps {
  children: ReactNode;
}

export const CacheStorageProvider = ({ children }: CacheStorageProviderProps): ReactElement => {
  const [state, dispatch] = useReducer(cacheReducer, { data: {} });

  const set = <T = unknown,>(key: string, value: T) => {
    dispatch({ type: 'SET', payload: { key, value } });
  };

  const get = <T = unknown,>(key: string): T | undefined => {
    return state.data[key] as T | undefined;
  };

  const remove = (key: string) => {
    dispatch({ type: 'REMOVE', payload: { key } });
  };

  const has = (key: string): boolean => {
    return key in state.data;
  };

  const clear = () => {
    dispatch({ type: 'CLEAR' });
  };

  const keys = (): string[] => {
    return Object.keys(state.data);
  };

  const getAll = (): Record<string, unknown> => {
    return { ...state.data };
  };

  return (
    <CacheStorageContext.Provider
      value={{
        set,
        get,
        remove,
        has,
        clear,
        keys,
        getAll,
      }}
    >
      {children}
    </CacheStorageContext.Provider>
  );
};

export const useCacheStorageContext = () => {
  const context = useContext(CacheStorageContext);
  if (!context) {
    throw new Error('useCacheStorageContext must be used within CacheStorageProvider');
  }
  return context;
};

