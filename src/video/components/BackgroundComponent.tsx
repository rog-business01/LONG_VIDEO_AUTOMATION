import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import { Background, Animation } from '../../types/video';
import { useAnimationValue } from '../hooks/useAnimationValue';

interface BackgroundComponentProps {
  background: Background;
  animations: Animation[];
  currentTime: number;
}

export const BackgroundComponent: React.FC<BackgroundComponentProps> = ({
  background,
  animations,
  currentTime,
}) => {
  const animationValue = useAnimationValue(animations, currentTime);

  const getBackgroundStyle = () => {
    const baseStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      filter: background.blur ? `blur(${background.blur}px)` : undefined,
      opacity: animationValue.opacity ?? 1,
      transform: `scale(${animationValue.scale ?? 1})`,
      transition: 'all 0.3s ease',
    };

    if (background.type === 'solid') {
      return {
        ...baseStyle,
        backgroundColor: background.source || '#000000',
      };
    }

    return baseStyle;
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: background.overlay?.color || 'transparent',
    opacity: background.overlay?.opacity || 0,
    pointerEvents: 'none',
  };

  return (
    <AbsoluteFill>
      {background.type === 'image' && background.source && (
        <Img
          src={background.source}
          style={getBackgroundStyle()}
        />
      )}
      
      {background.type === 'gradient' && (
        <div
          style={{
            ...getBackgroundStyle(),
            background: background.source || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        />
      )}
      
      {background.type === 'solid' && (
        <div style={getBackgroundStyle()} />
      )}
      
      {background.overlay && (
        <div style={overlayStyle} />
      )}
    </AbsoluteFill>
  );
};