import type { ComponentType } from 'react';

export type AnimationDirection = 'left' | 'right' | 'bottom' | 'top' | 'none';

export interface FullSheetOptions {
  preserveState?: boolean;
  preserveScroll?: boolean;
  keepInDOM?: boolean;
  onBackdropClick?: () => void;
  closeOnBackdropClick?: boolean;
  backdropClickValue?: any;
  // 애니메이션 설정
  // pushFullSheet/openFullSheet 시: 새로 추가되는 풀시트의 등장 애니메이션 방향 (기본값: 'none')
  // 'right': 우측에서 중앙으로, 'left': 좌측에서 중앙으로, 'bottom': 아래에서 중앙으로, 'top': 위에서 중앙으로
  // 'none': 애니메이션 없이 즉시 표시 (딜레이 없음)
  animationDirection?: AnimationDirection;
  // popFullSheet/closeFullSheet 시: 이 풀시트가 사라질 때의 퇴장 애니메이션 방향 (기본값: 'none')
  // 'right': 중앙에서 우측으로, 'left': 중앙에서 좌측으로, 'bottom': 중앙에서 아래로, 'top': 중앙에서 위로
  // 'none': 애니메이션 없이 즉시 사라짐 (딜레이 없음)
  // 단, popFullSheet 호출 시 전달된 exitAnimationDirection이 우선됨
  exitAnimationDirection?: AnimationDirection;
}

export interface PopFullSheetOptions {
  exitAnimationDirection?: AnimationDirection; // pop 시 퇴장 애니메이션 방향 (기본값: 'none')
}

export interface FullSheetStack {
  id: string;
  component: ComponentType<Record<string, unknown>>;
  props?: Record<string, unknown>;
  options?: FullSheetOptions;
  isActive: boolean;
  resolve?: (value: any) => void;
}

export interface FullSheetContextType {
  stack: FullSheetStack[];
  activeIndex: number;
  pendingPopOptions?: PopFullSheetOptions; // popFullSheet 호출 시 전달된 옵션
  openFullSheet: (component: ComponentType<Record<string, unknown>>, props?: Record<string, unknown>, options?: FullSheetOptions) => void;
  closeFullSheet: () => void;
  pushFullSheet: (component: ComponentType<Record<string, unknown>>, props?: Record<string, unknown>, options?: FullSheetOptions) => void;
  popFullSheet: (options?: PopFullSheetOptions) => void;
  goToFullSheet: (index: number) => void;
  clearStack: () => void;
  openAwaitFullSheet: (component: ComponentType<Record<string, unknown>>, props?: Record<string, unknown>, options?: FullSheetOptions) => Promise<any>;
  pushAwaitFullSheet: (component: ComponentType<Record<string, unknown>>, props?: Record<string, unknown>, options?: FullSheetOptions) => Promise<any>;
  resolveFullSheet: (value: any) => void;
}

