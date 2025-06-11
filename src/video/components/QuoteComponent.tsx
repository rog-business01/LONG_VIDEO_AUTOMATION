import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Quote, Animation, GlobalStyles } from '../../types/video';
import { useAnimationValue } from '../hooks/useAnimationValue';

interface QuoteComponentProps {
  quote: Quote;
  animations: Animation[];
  globalStyles: GlobalStyles;
  currentTime: number;
}

export const QuoteComponent: React.FC<QuoteComponentProps> = ({
  quote,
  animations,
  globalStyles,
  currentTime,
}) => {
  const quoteAnimations = animations.filter(a => a.target === 'quote');
  const authorAnimations = animations.filter(a => a.target === 'author');
  
  const quoteAnimationValue = useAnimationValue(quoteAnimations, currentTime);
  const authorAnimationValue = useAnimationValue(authorAnimations, currentTime);

  const quoteStyle: React.CSSProperties = {
    fontSize: quote.styling.fontSize,
    fontWeight: quote.styling.fontWeight,
    color: quote.styling.color,
    textAlign: quote.styling.textAlign,
    lineHeight: quote.styling.lineHeight,
    maxWidth: quote.styling.maxWidth,
    padding: quote.styling.padding,
    fontFamily: globalStyles.fontFamily,
    opacity: quoteAnimationValue.opacity ?? 1,
    transform: `translateY(${quoteAnimationValue.translateY ?? 0}px) scale(${quoteAnimationValue.scale ?? 1})`,
    transition: `all ${globalStyles.transitionDuration}s ease`,
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
    backgroundColor: quote.styling.background?.color ? 
      `${quote.styling.background.color}${Math.round((quote.styling.background.opacity || 1) * 255).toString(16).padStart(2, '0')}` : 
      'transparent',
    backdropFilter: quote.styling.background?.blur ? `blur(${quote.styling.background.blur}px)` : undefined,
    borderRadius: quote.styling.background ? '16px' : undefined,
  };

  const authorStyle: React.CSSProperties = {
    fontSize: quote.styling.fontSize * 0.4,
    fontWeight: '500',
    color: quote.styling.color,
    textAlign: quote.styling.textAlign,
    fontFamily: globalStyles.fontFamily,
    marginTop: '32px',
    opacity: authorAnimationValue.opacity ?? 1,
    transform: `translateY(${authorAnimationValue.translateY ?? 0}px) scale(${authorAnimationValue.scale ?? 1})`,
    transition: `all ${globalStyles.transitionDuration}s ease`,
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
  };

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '80px',
      }}
    >
      <div style={quoteStyle}>
        "{quote.text}"
      </div>
      
      <div style={authorStyle}>
        — {quote.author}
        {quote.attribution && (
          <div style={{ fontSize: '0.8em', opacity: 0.8, marginTop: '8px' }}>
            {quote.attribution}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};