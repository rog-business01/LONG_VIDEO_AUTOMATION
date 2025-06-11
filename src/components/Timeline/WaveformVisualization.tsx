import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformVisualizationProps {
  audioUrl: string;
  currentTime: number;
  duration: number;
  onTimeChange: (time: number) => void;
}

export const WaveformVisualization: React.FC<WaveformVisualizationProps> = ({
  audioUrl,
  currentTime,
  duration,
  onTimeChange,
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    // Initialize WaveSurfer
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#4F46E5',
      progressColor: '#EF4444',
      cursorColor: '#FFFFFF',
      barWidth: 2,
      barRadius: 1,
      responsive: true,
      height: 80,
      normalize: true,
      backend: 'WebAudio',
      mediaControls: false,
    });

    // Load audio
    if (audioUrl) {
      wavesurferRef.current.load(audioUrl);
    }

    // Event listeners
    wavesurferRef.current.on('ready', () => {
      setIsLoaded(true);
    });

    wavesurferRef.current.on('seek', (progress) => {
      const time = progress * duration;
      onTimeChange(time);
    });

    wavesurferRef.current.on('audioprocess', (time) => {
      onTimeChange(time);
    });

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [audioUrl]);

  // Update playback position
  useEffect(() => {
    if (wavesurferRef.current && isLoaded) {
      const progress = currentTime / duration;
      wavesurferRef.current.seekTo(progress);
    }
  }, [currentTime, duration, isLoaded]);

  const handleRegionAdd = (start: number, end: number) => {
    if (wavesurferRef.current) {
      // Add region for precise editing
      const region = wavesurferRef.current.addRegion({
        start,
        end,
        color: 'rgba(255, 255, 0, 0.3)',
        drag: true,
        resize: true,
      });
    }
  };

  return (
    <div className="h-full bg-gray-900 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-white">Audio Waveform</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleRegionAdd(currentTime, currentTime + 5)}
            className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
          >
            Add Region
          </button>
          <span className="text-xs text-gray-400">
            {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
          </span>
        </div>
      </div>
      
      <div
        ref={waveformRef}
        className="w-full h-20 bg-gray-800 rounded"
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 rounded">
          <div className="text-sm text-gray-400">Loading waveform...</div>
        </div>
      )}
    </div>
  );
};