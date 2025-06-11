import { useMemo } from 'react';
import { Animation } from '../../types/video';

interface AnimationValue {
  opacity?: number;
  translateX?: number;
  translateY?: number;
  scale?: number;
  rotate?: number;
}

export const useAnimationValue = (animations: Animation[], currentTime: number): AnimationValue => {
  return useMemo(() => {
    let result: AnimationValue = {};

    animations.forEach(animation => {
      const relativeTime = currentTime - animation.startTime;
      
      // Skip if animation hasn't started or has finished
      if (relativeTime < 0 || relativeTime > animation.duration) {
        return;
      }

      // Calculate progress (0 to 1)
      const progress = Math.min(1, Math.max(0, relativeTime / animation.duration));
      const easedProgress = applyEasing(progress, animation.easing || 'ease');

      switch (animation.type) {
        case 'fadeIn':
          result.opacity = easedProgress;
          break;
        case 'fadeOut':
          result.opacity = 1 - easedProgress;
          break;
        case 'slideIn':
          result.translateY = (1 - easedProgress) * 50;
          result.opacity = easedProgress;
          break;
        case 'slideOut':
          result.translateY = easedProgress * -50;
          result.opacity = 1 - easedProgress;
          break;
        case 'zoom':
          result.scale = 0.8 + (easedProgress * 0.2);
          result.opacity = easedProgress;
          break;
      }

      // Apply custom properties if provided
      if (animation.properties) {
        Object.keys(animation.properties).forEach(key => {
          const value = animation.properties![key];
          if (typeof value === 'number') {
            (result as any)[key] = value * easedProgress;
          }
        });
      }
    });

    return result;
  }, [animations, currentTime]);
};

const applyEasing = (progress: number, easing: string): number => {
  switch (easing) {
    case 'linear':
      return progress;
    case 'easeIn':
      return progress * progress;
    case 'easeOut':
      return 1 - Math.pow(1 - progress, 2);
    case 'easeInOut':
      return progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    case 'ease':
    default:
      return progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
  }
};