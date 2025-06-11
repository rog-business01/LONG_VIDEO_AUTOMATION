import { VideoScript, Scene, Caption } from '../../types/video';
import { splitTextIntoChunks, calculateCaptionTiming } from './ttsUtils';

export const processVideoScript = (inputScript: any): VideoScript => {
  // Process and validate the input script
  const processedScenes: Scene[] = inputScript.scenes.map((scene: any, index: number) => {
    // Generate captions from quote text
    const textChunks = splitTextIntoChunks(scene.quote.text);
    const captions: Caption[] = [];
    
    let currentTime = 1; // Start captions 1 second after scene starts
    
    textChunks.forEach((chunk, chunkIndex) => {
      const duration = calculateCaptionTiming(chunk);
      
      captions.push({
        text: chunk,
        startTime: currentTime,
        duration: duration,
        styling: scene.captions?.[0]?.styling || {
          fontSize: 32,
          fontWeight: '500',
          color: '#ffffff',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 16,
          borderRadius: 8,
          position: 'bottom',
          margin: 40,
          maxWidth: 800,
        },
      });
      
      currentTime += duration + 0.5; // Add 0.5s pause between captions
    });
    
    return {
      ...scene,
      captions: scene.captions || captions,
    };
  });

  return {
    ...inputScript,
    scenes: processedScenes,
  };
};

export const validateVideoScript = (script: VideoScript): boolean => {
  // Validate script structure
  if (!script.metadata || !script.scenes || !script.globalStyles) {
    console.error('Invalid script structure');
    return false;
  }

  // Validate each scene
  for (const scene of script.scenes) {
    if (!scene.quote || !scene.background || !scene.animations) {
      console.error('Invalid scene structure:', scene.id);
      return false;
    }
  }

  return true;
};

export const generateAudioTimeline = (script: VideoScript) => {
  const timeline = [];
  
  for (const scene of script.scenes) {
    timeline.push({
      sceneId: scene.id,
      startTime: scene.startTime,
      duration: scene.duration,
      text: scene.quote.text,
      author: scene.quote.author,
      audioFile: `/audio/${scene.id}.wav`, // Placeholder path
    });
  }
  
  return timeline;
};