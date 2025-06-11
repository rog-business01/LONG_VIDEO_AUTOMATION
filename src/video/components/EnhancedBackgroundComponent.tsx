import React from 'react';
import { AbsoluteFill, Img, Video, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background, Animation, KenBurnsEffect, ParallaxConfig, ColorGradingConfig } from '../../types/video';
import { useAnimationValue } from '../hooks/useAnimationValue';

interface EnhancedBackgroundComponentProps {
  background: Background;
  animations: Animation[];
  currentTime: number;
}

export const EnhancedBackgroundComponent: React.FC<EnhancedBackgroundComponentProps> = ({
  background,
  animations,
  currentTime,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const animationValue = useAnimationValue(animations, currentTime);

  const getKenBurnsTransform = (kenBurns?: KenBurnsEffect) => {
    if (!kenBurns?.enabled) return {};

    const progress = Math.min(1, currentTime / (kenBurns.duration || 10));
    const scale = kenBurns.startScale + (kenBurns.endScale - kenBurns.startScale) * progress;
    
    let translateX = 0;
    let translateY = 0;

    switch (kenBurns.direction) {
      case 'pan-left':
        translateX = -progress * 50;
        break;
      case 'pan-right':
        translateX = progress * 50;
        break;
      case 'zoom-in':
      case 'zoom-out':
        // No translation needed
        break;
    }

    return {
      transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
      transition: 'transform 0.1s linear',
    };
  };

  const getColorGradingFilter = (colorGrading?: ColorGradingConfig) => {
    if (!colorGrading) return {};

    const filters = [
      `brightness(${1 + colorGrading.brightness / 100})`,
      `contrast(${1 + colorGrading.contrast / 100})`,
      `saturate(${1 + colorGrading.saturation / 100})`,
      `hue-rotate(${colorGrading.temperature}deg)`,
    ];

    return {
      filter: filters.join(' '),
    };
  };

  const getVignetteOverlay = (colorGrading?: ColorGradingConfig) => {
    if (!colorGrading?.vignette) return null;

    const { intensity, color } = colorGrading.vignette;
    
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle, transparent 30%, ${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')} 100%)`,
          pointerEvents: 'none',
        }}
      />
    );
  };

  const renderParallaxLayers = (parallax?: ParallaxConfig) => {
    if (!parallax?.enabled || !parallax.layers.length) return null;

    return parallax.layers.map((layer, index) => (
      <div
        key={index}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `translateX(${currentTime * layer.speed}px)`,
          opacity: layer.opacity,
          mixBlendMode: layer.blendMode as any,
        }}
      >
        <Img
          src={layer.source}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
    ));
  };

  const getBackgroundStyle = () => {
    const baseStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: animationValue.opacity ?? 1,
      transform: `scale(${animationValue.scale ?? 1})`,
      ...getKenBurnsTransform(background.kenBurns),
      ...getColorGradingFilter(background.colorGrading),
    };

    if (background.blur) {
      baseStyle.filter = `${baseStyle.filter || ''} blur(${background.blur}px)`.trim();
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
      {/* Parallax layers (background) */}
      {renderParallaxLayers(background.parallax)}
      
      {/* Main background */}
      {background.type === 'image' && background.source && (
        <Img
          src={background.source}
          style={getBackgroundStyle()}
        />
      )}
      
      {background.type === 'video' && background.source && (
        <Video
          src={background.source}
          style={getBackgroundStyle()}
          muted
          loop
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
        <div 
          style={{
            ...getBackgroundStyle(),
            backgroundColor: background.source || '#000000',
          }} 
        />
      )}
      
      {/* Color overlay */}
      {background.overlay && (
        <div style={overlayStyle} />
      )}
      
      {/* Vignette overlay */}
      {getVignetteOverlay(background.colorGrading)}
    </AbsoluteFill>
  );
};