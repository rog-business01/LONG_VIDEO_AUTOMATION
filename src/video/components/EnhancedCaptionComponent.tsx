import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Caption, Animation } from '../../types/video';
import { useAnimationValue } from '../hooks/useAnimationValue';

interface EnhancedCaptionComponentProps {
  caption: Caption;
  animations: Animation[];
  currentTime: number;
  wordHighlights?: Array<{ word: string; startTime: number; duration: number }>;
}

export const EnhancedCaptionComponent: React.FC<EnhancedCaptionComponentProps> = ({
  caption,
  animations,
  currentTime,
  wordHighlights = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
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

  const getStyleBasedStyling = () => {
    const baseStyling = {
      fontSize: caption.styling.fontSize,
      fontWeight: caption.styling.fontWeight,
      color: caption.styling.color,
      backgroundColor: caption.styling.backgroundColor,
      padding: caption.styling.padding,
      borderRadius: caption.styling.borderRadius,
      textAlign: 'center' as const,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    };

    // Apply style-specific enhancements
    switch (caption.style) {
      case 'netflix':
        return {
          ...baseStyling,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(4px)',
        };
      
      case 'youtube':
        return {
          ...baseStyling,
          border: `2px solid ${caption.styling.border?.color || '#ff0000'}`,
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
        };
      
      case 'broadcast':
        return {
          ...baseStyling,
          border: `3px solid ${caption.styling.border?.color || '#000000'}`,
          letterSpacing: '0.5px',
          textTransform: 'uppercase' as const,
        };
      
      default:
        return baseStyling;
    }
  };

  const captionStyle: React.CSSProperties = {
    ...getPositionStyle(),
    ...getStyleBasedStyling(),
    opacity: animationValue.opacity ?? 1,
    transform: `${getPositionStyle().transform} translateY(${animationValue.translateY ?? 0}px) scale(${animationValue.scale ?? 1})`,
    zIndex: 1000,
  };

  const renderWordHighlights = () => {
    if (!caption.wordHighlight || !wordHighlights.length) {
      return <span>{caption.text}</span>;
    }

    const words = caption.text.split(' ');
    const relativeTime = currentTime - caption.startTime;

    return (
      <span>
        {words.map((word, index) => {
          const highlight = wordHighlights.find(h => 
            h.word.toLowerCase().replace(/[^\w]/g, '') === 
            word.toLowerCase().replace(/[^\w]/g, '')
          );
          
          const isHighlighted = highlight && 
            relativeTime >= highlight.startTime && 
            relativeTime <= highlight.startTime + highlight.duration;

          return (
            <span
              key={index}
              style={{
                backgroundColor: isHighlighted ? '#ffff00' : 'transparent',
                color: isHighlighted ? '#000000' : 'inherit',
                transition: 'all 0.1s ease',
                padding: isHighlighted ? '2px 4px' : '0',
                borderRadius: isHighlighted ? '4px' : '0',
              }}
            >
              {word}
              {index < words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </span>
    );
  };

  const renderAnimatedText = () => {
    if (!caption.animations?.some(a => a.type === 'typewriter')) {
      return renderWordHighlights();
    }

    const typewriterAnimation = caption.animations.find(a => a.type === 'typewriter');
    if (!typewriterAnimation) return renderWordHighlights();

    const relativeTime = currentTime - caption.startTime;
    const animationProgress = Math.min(1, Math.max(0, relativeTime / caption.duration));
    
    let visibleText = '';
    
    switch (typewriterAnimation.timing) {
      case 'character':
        const totalChars = caption.text.length;
        const visibleChars = Math.floor(totalChars * animationProgress);
        visibleText = caption.text.substring(0, visibleChars);
        break;
      
      case 'word':
        const words = caption.text.split(' ');
        const visibleWords = Math.floor(words.length * animationProgress);
        visibleText = words.slice(0, visibleWords).join(' ');
        break;
      
      case 'line':
      default:
        visibleText = animationProgress > 0.5 ? caption.text : '';
        break;
    }

    return (
      <span>
        {visibleText}
        {animationProgress < 1 && (
          <span 
            style={{ 
              opacity: Math.sin(frame * 0.2) > 0 ? 1 : 0,
              transition: 'opacity 0.1s'
            }}
          >
            |
          </span>
        )}
      </span>
    );
  };

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={captionStyle}>
        {renderAnimatedText()}
      </div>
    </AbsoluteFill>
  );
};