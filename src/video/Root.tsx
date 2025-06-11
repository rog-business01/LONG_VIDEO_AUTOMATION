import { Composition } from 'remotion';
import { VideoComposition } from './VideoComposition';
import { VideoScript } from '../types/video';

// Sample video script
const sampleScript: VideoScript = {
  metadata: {
    title: 'Inspirational Quotes Collection',
    duration: 600, // 10 minutes
    fps: 30,
    width: 1920,
    height: 1080,
  },
  scenes: [
    {
      id: 'scene1',
      startTime: 0,
      duration: 120, // 2 minutes
      quote: {
        text: 'The only way to do great work is to love what you do.',
        author: 'Steve Jobs',
        attribution: 'Apple Co-founder',
        styling: {
          fontSize: 64,
          fontWeight: '600',
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.2,
          maxWidth: 1200,
          padding: 40,
          background: {
            color: '#000000',
            opacity: 0.3,
            blur: 10,
          },
        },
      },
      background: {
        type: 'image',
        source: 'https://images.pexels.com/photos/2182863/pexels-photo-2182863.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        overlay: {
          color: '#000000',
          opacity: 0.4,
        },
      },
      animations: [
        {
          type: 'fadeIn',
          startTime: 0,
          duration: 2,
          target: 'quote',
          easing: 'easeOut',
        },
        {
          type: 'fadeIn',
          startTime: 1,
          duration: 2,
          target: 'author',
          easing: 'easeOut',
        },
      ],
      captions: [
        {
          text: 'The only way to do great work',
          startTime: 0.5,
          duration: 3,
          styling: {
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
        },
        {
          text: 'is to love what you do.',
          startTime: 3.5,
          duration: 3,
          styling: {
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
        },
      ],
    },
    {
      id: 'scene2',
      startTime: 120,
      duration: 120,
      quote: {
        text: 'Innovation distinguishes between a leader and a follower.',
        author: 'Steve Jobs',
        attribution: 'Apple Co-founder',
        styling: {
          fontSize: 64,
          fontWeight: '600',
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.2,
          maxWidth: 1200,
          padding: 40,
          background: {
            color: '#000000',
            opacity: 0.3,
            blur: 10,
          },
        },
      },
      background: {
        type: 'image',
        source: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        overlay: {
          color: '#000000',
          opacity: 0.4,
        },
      },
      animations: [
        {
          type: 'slideIn',
          startTime: 0,
          duration: 2,
          target: 'quote',
          easing: 'easeOut',
        },
        {
          type: 'fadeIn',
          startTime: 1,
          duration: 2,
          target: 'author',
          easing: 'easeOut',
        },
      ],
      captions: [
        {
          text: 'Innovation distinguishes between',
          startTime: 0.5,
          duration: 3,
          styling: {
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
        },
        {
          text: 'a leader and a follower.',
          startTime: 3.5,
          duration: 3,
          styling: {
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
        },
      ],
    },
  ],
  globalStyles: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    primaryColor: '#3B82F6',
    secondaryColor: '#14B8A6',
    accentColor: '#F97316',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    transitionDuration: 0.3,
  },
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoComposition"
        component={VideoComposition}
        durationInFrames={sampleScript.metadata.duration * sampleScript.metadata.fps}
        fps={sampleScript.metadata.fps}
        width={sampleScript.metadata.width}
        height={sampleScript.metadata.height}
        defaultProps={{
          script: sampleScript,
        }}
      />
    </>
  );
};