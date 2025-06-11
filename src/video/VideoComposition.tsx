import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { VideoScript } from '../types/video';
import { SceneComponent } from './components/SceneComponent';

interface VideoCompositionProps {
  script: VideoScript;
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({ script }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const currentTime = frame / fps;

  return (
    <AbsoluteFill style={{ backgroundColor: script.globalStyles.backgroundColor }}>
      {script.scenes.map((scene) => {
        const startFrame = scene.startTime * fps;
        const durationInFrames = scene.duration * fps;
        
        return (
          <Sequence
            key={scene.id}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <SceneComponent
              scene={scene}
              globalStyles={script.globalStyles}
              currentTime={currentTime - scene.startTime}
            />
          </Sequence>
        );
      })}
      
      {/* Global audio track would go here */}
      {/* <Audio src={audioUrl} /> */}
    </AbsoluteFill>
  );
};