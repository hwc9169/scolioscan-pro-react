import { useContext } from 'react';
import { FullSheetContext } from '../contexts/FullSheetContext';
import type { FullSheetContextType, FullSheetStack } from '../types/fullSheet';

interface ExtendedFullSheetContextType extends FullSheetContextType {
  isFullSheetOpen: boolean;
  currentFullSheet: FullSheetStack | undefined;
  stackLength: number;
}

export const useFullSheet = (): ExtendedFullSheetContextType => {
  const context = useContext(FullSheetContext);
  if (!context) {
    throw new Error('useFullSheet must be used within FullSheetProvider');
  }

  return {
    ...context,
    // 편의 함수들
    isFullSheetOpen: context.stack.length > 0,
    currentFullSheet: context.stack[context.activeIndex],
    stackLength: context.stack.length,
  };
};
