import { createContext, useContext, useReducer, type ComponentType, type ReactElement, type ReactNode } from 'react';
import type { FullSheetContextType, FullSheetStack, FullSheetOptions, PopFullSheetOptions } from '../types/fullSheet';

export const FullSheetContext = createContext<FullSheetContextType | undefined>(undefined);

type FullSheetAction =
  | { type: 'OPEN_FULLSHEET'; payload: { component: ComponentType<Record<string, unknown>>; props?: Record<string, unknown>; options?: FullSheetOptions } }
  | { type: 'CLOSE_FULLSHEET' }
  | { type: 'PUSH_FULLSHEET'; payload: { component: ComponentType<Record<string, unknown>>; props?: Record<string, unknown>; options?: FullSheetOptions } }
  | { type: 'POP_FULLSHEET'; payload: { options?: PopFullSheetOptions } }
  | { type: 'GO_TO_FULLSHEET'; payload: { index: number } }
  | { type: 'CLEAR_STACK' }
  | { type: 'AWAIT_FULLSHEET'; payload: { component: ComponentType<Record<string, unknown>>; props?: Record<string, unknown>; options?: FullSheetOptions; resolve: (value: any) => void } }
  | { type: 'PUSH_AWAIT_FULLSHEET'; payload: { component: ComponentType<Record<string, unknown>>; props?: Record<string, unknown>; options?: FullSheetOptions; resolve: (value: any) => void } }
  | { type: 'RESOLVE_FULLSHEET'; payload: { value: any } };

interface FullSheetState {
  stack: FullSheetStack[];
  activeIndex: number;
  // popFullSheet 호출 시 전달된 옵션을 임시 저장
  pendingPopOptions?: PopFullSheetOptions;
}

// 고유 ID 생성 함수
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

const fullSheetReducer = (state: FullSheetState, action: FullSheetAction): FullSheetState => {
  switch (action.type) {
    case 'OPEN_FULLSHEET': {
      return {
        stack: [{
          id: generateId(),
          component: action.payload.component,
          props: action.payload.props || {},
          options: {
            preserveState: true,
            preserveScroll: true,
            keepInDOM: true,
            ...action.payload.options,
          },
          isActive: true,
        }],
        activeIndex: 0,
        pendingPopOptions: undefined,
      };
    }

    case 'PUSH_FULLSHEET': {
      const newStack = state.stack.map(item => ({ ...item, isActive: false }));
      newStack.push({
        id: generateId(),
        component: action.payload.component,
        props: action.payload.props || {},
        options: {
          preserveState: true,
          preserveScroll: true,
          keepInDOM: true,
          ...action.payload.options,
        },
        isActive: true,
      });
      return {
        stack: newStack,
        activeIndex: newStack.length - 1,
        pendingPopOptions: undefined,
      };
    }

    case 'POP_FULLSHEET': {
      if (state.stack.length <= 1) {
        return { stack: [], activeIndex: -1, pendingPopOptions: undefined };
      }
      const updatedStack = state.stack.slice(0, -1);
      updatedStack[updatedStack.length - 1].isActive = true;
      return {
        stack: updatedStack,
        activeIndex: updatedStack.length - 1,
        pendingPopOptions: action.payload.options, // pop 시 전달된 옵션 저장
      };
    }

    case 'GO_TO_FULLSHEET': {
      if (action.payload.index < 0 || action.payload.index >= state.stack.length) {
        return state;
      }
      const stackWithActive = state.stack.map((item, index) => ({
        ...item,
        isActive: index === action.payload.index,
      }));
      return {
        stack: stackWithActive,
        activeIndex: action.payload.index,
        pendingPopOptions: undefined,
      };
    }

    case 'CLEAR_STACK':
      return { stack: [], activeIndex: -1, pendingPopOptions: undefined };

    case 'CLOSE_FULLSHEET':
      return { stack: [], activeIndex: -1, pendingPopOptions: undefined };

    case 'AWAIT_FULLSHEET': {
      return {
        stack: [{
          id: generateId(),
          component: action.payload.component,
          props: action.payload.props || {},
          options: {
            preserveState: true,
            preserveScroll: true,
            keepInDOM: true,
            ...action.payload.options,
          },
          isActive: true,
          resolve: action.payload.resolve,
        }],
        activeIndex: 0,
        pendingPopOptions: undefined,
      };
    }

    case 'PUSH_AWAIT_FULLSHEET': {
      const newStack = state.stack.map(item => ({ ...item, isActive: false }));
      newStack.push({
        id: generateId(),
        component: action.payload.component,
        props: action.payload.props || {},
        options: {
          preserveState: true,
          preserveScroll: true,
          keepInDOM: true,
          ...action.payload.options,
        },
        isActive: true,
        resolve: action.payload.resolve,
      });
      return {
        stack: newStack,
        activeIndex: newStack.length - 1,
        pendingPopOptions: undefined,
      };
    }

    case 'RESOLVE_FULLSHEET': {
      const currentFullSheet = state.stack[state.activeIndex];
      if (currentFullSheet?.resolve) {
        currentFullSheet.resolve(action.payload.value);
      }

      // 현재 풀 시트만 제거하고 이전 풀 시트로 돌아가기
      const newStack = state.stack.filter((_, index) => index !== state.activeIndex);
      const newActiveIndex = newStack.length > 0 ? Math.max(0, state.activeIndex - 1) : -1;

      return {
        stack: newStack,
        activeIndex: newActiveIndex,
        pendingPopOptions: undefined,
      };
    }

    default:
      return state;
  }
};

interface FullSheetProviderProps {
  children: ReactNode;
}

export const FullSheetProvider = ({ children }: FullSheetProviderProps): ReactElement => {
  "use memo"; // React Compiler 최적화 활성화
  
  const [state, dispatch] = useReducer(fullSheetReducer, { stack: [], activeIndex: -1, pendingPopOptions: undefined });

  const openFullSheet = (component: ComponentType<Record<string, unknown>>, props?: Record<string, unknown>, options?: FullSheetOptions) => {
    dispatch({ type: 'OPEN_FULLSHEET', payload: { component, props, options } });
  };

  const closeFullSheet = () => {
    dispatch({ type: 'CLOSE_FULLSHEET' });
  };

  const pushFullSheet = (component: ComponentType<Record<string, unknown>>, props?: Record<string, unknown>, options?: FullSheetOptions) => {
    dispatch({ type: 'PUSH_FULLSHEET', payload: { component, props, options } });
  };

  const popFullSheet = (options?: PopFullSheetOptions) => {
    dispatch({ type: 'POP_FULLSHEET', payload: { options } });
  };

  const goToFullSheet = (index: number) => {
    dispatch({ type: 'GO_TO_FULLSHEET', payload: { index } });
  };

  const clearStack = () => {
    dispatch({ type: 'CLEAR_STACK' });
  };

  const openAwaitFullSheet = (component: ComponentType<Record<string, unknown>>, props?: Record<string, unknown>, options?: FullSheetOptions): Promise<any> => {
    return new Promise((resolve) => {
      dispatch({ type: 'AWAIT_FULLSHEET', payload: { component, props, options, resolve } });
    });
  };

  const pushAwaitFullSheet = (component: ComponentType<Record<string, unknown>>, props?: Record<string, unknown>, options?: FullSheetOptions): Promise<any> => {
    return new Promise((resolve) => {
      dispatch({ type: 'PUSH_AWAIT_FULLSHEET', payload: { component, props, options, resolve } });
    });
  };

  const resolveFullSheet = (value: any) => {
    dispatch({ type: 'RESOLVE_FULLSHEET', payload: { value } });
  };

  return (
    <FullSheetContext.Provider
      value={{
        stack: state.stack,
        activeIndex: state.activeIndex,
        pendingPopOptions: state.pendingPopOptions,
        openFullSheet,
        closeFullSheet,
        pushFullSheet,
        popFullSheet,
        goToFullSheet,
        clearStack,
        openAwaitFullSheet,
        pushAwaitFullSheet,
        resolveFullSheet,
      }}
    >
      {children}
    </FullSheetContext.Provider>
  );
};

export const useFullSheetContext = () => {
  const context = useContext(FullSheetContext);
  if (!context) {
    throw new Error('useFullSheetContext must be used within FullSheetProvider');
  }
  return context;
};
