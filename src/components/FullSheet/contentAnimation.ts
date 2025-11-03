import type { Variants } from 'framer-motion';

/**
 * 콘텐츠 영역의 아래에서 위로 나타나는 애니메이션 variants
 * 투명도와 스케일 조절과 함께 자연스럽게 등장하고 사라집니다.
 * 토스 앱 스타일의 부드러운 애니메이션
 */
export const contentSlideUpVariants: Variants = {
  initial: {
    y: 30,
    opacity: 0,
    scale: 0.96,
  },
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
  },
  exit: {
    y: 20,
    opacity: 0,
    scale: 0.98,
  },
};

/**
 * 콘텐츠 애니메이션의 transition 설정
 * 토스 앱 스타일의 부드러운 easeOut 애니메이션
 */
export const contentSlideUpTransition = {
  type: 'tween' as const,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // easeOutExpo 커스텀 커브 (토스 스타일)
  duration: 0.5,
};

