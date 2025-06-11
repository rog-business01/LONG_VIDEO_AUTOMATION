import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Quote, Animation, GlobalStyles, EmphasisConfig } from '../../types/video';
import { useAnimationValue } from '../hooks/useAnimationValue';

interface EnhancedQuoteComponentProps {
  quote: Quote;
  animations: Animation[];
  globalStyles: GlobalStyles;
  currentTime: number;
}

export const EnhancedQuoteComponent: React.FC<EnhancedQuoteComponentProps> = ({
  quote,
  animations,
  globalStyles,
  currentTime,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const quoteAnimations = animations.filter(a => a.target === 'quote');
  const authorAnimations = animations.filter(a => a.target === 'author');
  
  const quoteAnimationValue = useAnimationValue(quoteAnimations, currentTime);
  const authorAnimationValue = useAnimationValue(authorAnimations, currentTime);

  const getTextShadow = () => {
    if (!quote.styling.textShadow) return '2px 2px 4px rgba(0, 0, 0, 0.8)';
    
    const { offsetX, offsetY, blur, color } = quote.styling.textShadow;
    return `${offsetX}px ${offsetY}px ${blur}px ${color}`;
  };

  const getTextOutline = () => {
    if (!quote.styling.outline) return {};
    
    const { width, color } = quote.styling.outline;
    return {
      WebkitTextStroke: `${width}px ${color}`,
      textStroke: `${width}px ${color}`,
    };
  };

  const renderEmphasisText = (text: string, emphasis?: EmphasisConfig[]) => {
    if (!emphasis || emphasis.length === 0) {
      return <span>{text}</span>;
    }

    const words = text.split(' ');
    
    return (
      <span>
        {words.map((word, index) => {
          const wordStartTime = (index / words.length) * 10; // Approximate timing
          const wordEndTime = ((index + 1) / words.length) * 10;
          
          const activeEmphasis = emphasis.find(emp => 
            currentTime >= emp.startTime && 
            currentTime <= emp.startTime + emp.duration &&
            wordStartTime >= emp.startTime &&
            wordEndTime <= emp.startTime + emp.duration
          );

          let wordStyle: React.CSSProperties = {};
          
          if (activeEmphasis) {
            switch (activeEmphasis.type) {
              case 'bold':
                wordStyle.fontWeight = '900';
                break;
              case 'italic':
                wordStyle.fontStyle = 'italic';
                break;
              case 'color':
                wordStyle.color = globalStyles.accentColor;
                break;
              case 'scale':
                wordStyle.transform = `scale(${1 + activeEmphasis.intensity * 0.2})`;
                wordStyle.display = 'inline-block';
                break;
              case 'glow':
                wordStyle.textShadow = `0 0 ${activeEmphasis.intensity * 10}px ${globalStyles.primaryColor}`;
                break;
            }
          }

          return (
            <span key={index} style={wordStyle}>
              {word}
              {index < words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </span>
    );
  };

  const renderMorphingText = () => {
    const morphAnimation = quoteAnimations.find(a => a.type === 'morphText');
    if (!morphAnimation) {
      return renderEmphasisText(quote.text, quote.emphasis);
    }

    // Implement text morphing effect
    const progress = Math.min(1, Math.max(0, (currentTime - morphAnimation.startTime) / morphAnimation.duration));
    const morphIntensity = Math.sin(progress * Math.PI * 2) * 0.1;
    
    return (
      <span style={{
        transform: `skew(${morphIntensity * 5}deg, ${morphIntensity * 2}deg)`,
        display: 'inline-block',
        transition: 'transform 0.1s ease',
      }}>
        {renderEmphasisText(quote.text, quote.emphasis)}
      </span>
    );
  };

  const renderParticleEffect = () => {
    const particleAnimation = quoteAnimations.find(a => a.type === 'particleEffect');
    if (!particleAnimation || currentTime < particleAnimation.startTime) return null;

    const particles = Array.from({ length: 20 }, (_, i) => {
      const angle = (i / 20) * Math.PI * 2;
      const distance = 50 + Math.sin(frame * 0.1 + i) * 20;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '4px',
            height: '4px',
            backgroundColor: globalStyles.accentColor,
            borderRadius: '50%',
            transform: `translate(${x}px, ${y}px)`,
            opacity: 0.6,
            animation: `pulse 2s infinite ${i * 0.1}s`,
          }}
        />
      );
    });

    return <div style={{ position: 'absolute', inset: 0 }}>{particles}</div>;
  };

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
    transform: `translateY(${quoteAnimationValue.translateY ?? 0}px) scale(${quoteAnimationValue.scale ?? 1}) rotate(${quoteAnimationValue.rotate ?? 0}deg)`,
    transition: `all ${globalStyles.transitionDuration}s ease`,
    textShadow: getTextShadow(),
    ...getTextOutline(),
    backgroundColor: quote.styling.background?.color ? 
      `${quote.styling.background.color}${Math.round((quote.styling.background.opacity || 1) * 255).toString(16).padStart(2, '0')}` : 
      'transparent',
    backdropFilter: quote.styling.background?.blur ? `blur(${quote.styling.background.blur}px)` : undefined,
    borderRadius: quote.styling.background ? '16px' : undefined,
    position: 'relative',
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
        "{renderMorphingText()}"
        {renderParticleEffect()}
      </div>
      
      <div style={authorStyle}>
        — {quote.author}
        {quote.attribution && (
          <div style={{ fontSize: '0.8em', opacity: 0.8, marginTop: '8px' }}>
            {quote.attribution}
          </div>
        )}
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </AbsoluteFill>
  );
};