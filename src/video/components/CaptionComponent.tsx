import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Caption, Animation } from '../../types/video';
import { useAnimationValue } from '../hooks/useAnimationValue';

interface CaptionComponentProps {
  caption: Caption;
  animations: Animation[];
  currentTime: number;
}

export const CaptionComponent: React.FC<CaptionComponentProps> = ({
  caption,
  animations,
  currentTime,
}) => {
  const animationValue = useAnimationValue(animations, currentTime);
  
  // Check if caption should be visible
  const isVisible = currentTime >= caption.startTime && 
                   currentTime <= caption.startTime + caption.duration;

  if (!isVisible) return null;

  const getPositionStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: caption.styling.maxWidth,
      margin: `0 ${caption.styling.margin}px`,
    };

    switch (caption.styling.position) {
      case 'top':
        return { ...baseStyle, top: caption.styling.margin };
      case 'center':
        return { ...baseStyle, top: '50%', transform: 'translate(-50%, -50%)' };
      case 'bottom':
      default:
        return { ...baseStyle, bottom: caption.styling.margin };
    }
  };

  const captionStyle: React.CSSProperties = {
    ...getPositionStyle(),
    fontSize: caption.styling.fontSize,
    fontWeight: caption.styling.fontWeight,
    color: caption.styling.color,
    backgroundColor: caption.styling.backgroundColor,
    padding: caption.styling.padding,
    borderRadius: caption.styling.borderRadius,
    textAlign: 'center',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    opacity: animationValue.opacity ?? 1,
    transform: `${getPositionStyle().transform} translateY(${animationValue.translateY ?? 0}px)`,
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
  };

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={captionStyle}>
        {caption.text}
      </div>
    </AbsoluteFill>
  );
};