import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Scene, GlobalStyles } from '../../types/video';
import { BackgroundComponent } from './BackgroundComponent';
import { QuoteComponent } from './QuoteComponent';
import { CaptionComponent } from './CaptionComponent';

interface SceneComponentProps {
  scene: Scene;
  globalStyles: GlobalStyles;
  currentTime: number;
}

export const SceneComponent: React.FC<SceneComponentProps> = ({
  scene,
  globalStyles,
  currentTime,
}) => {
  return (
    <AbsoluteFill>
      <BackgroundComponent
        background={scene.background}
        animations={scene.animations.filter(a => a.target === 'background')}
        currentTime={currentTime}
      />
      
      <QuoteComponent
        quote={scene.quote}
        animations={scene.animations.filter(a => a.target === 'quote' || a.target === 'author')}
        globalStyles={globalStyles}
        currentTime={currentTime}
      />
      
      {scene.captions.map((caption, index) => (
        <CaptionComponent
          key={index}
          caption={caption}
          animations={scene.animations.filter(a => a.target === 'caption')}
          currentTime={currentTime}
        />
      ))}
    </AbsoluteFill>
  );
};