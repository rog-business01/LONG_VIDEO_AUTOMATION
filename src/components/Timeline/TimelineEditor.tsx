import React, { useState, useRef, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Play, Pause, Square, ZoomIn, ZoomOut, Volume2, VolumeX } from 'lucide-react';
import { TimelineTrack } from './TimelineTrack';
import { WaveformVisualization } from './WaveformVisualization';
import { EditorState, Track, TimelineItem } from '../../types/video';

interface TimelineEditorProps {
  editorState: EditorState;
  onStateChange: (state: EditorState) => void;
  duration: number;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({
  editorState,
  onStateChange,
  duration,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);

  const handlePlayPause = () => {
    const newState = editorState.playbackState === 'playing' ? 'paused' : 'playing';
    onStateChange({
      ...editorState,
      playbackState: newState,
    });
  };

  const handleStop = () => {
    onStateChange({
      ...editorState,
      playbackState: 'stopped',
      currentTime: 0,
    });
  };

  const handleTimelineClick = (event: React.MouseEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const timelineWidth = rect.width - 200; // Account for track labels
    const newTime = (x / timelineWidth) * duration;
    
    onStateChange({
      ...editorState,
      currentTime: Math.max(0, Math.min(duration, newTime)),
    });
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const zoomFactor = direction === 'in' ? 1.5 : 0.75;
    const newZoom = Math.max(0.1, Math.min(10, editorState.zoom * zoomFactor));
    
    onStateChange({
      ...editorState,
      zoom: newZoom,
    });
  };

  const handleItemMove = (itemId: string, newStartTime: number, newTrack: number) => {
    const updatedTracks = editorState.tracks.map(track => ({
      ...track,
      items: track.items.map(item => 
        item.id === itemId 
          ? { ...item, startTime: newStartTime, track: newTrack }
          : item
      ),
    }));

    onStateChange({
      ...editorState,
      tracks: updatedTracks,
    });
  };

  const handleItemResize = (itemId: string, newDuration: number) => {
    const updatedTracks = editorState.tracks.map(track => ({
      ...track,
      items: track.items.map(item => 
        item.id === itemId 
          ? { ...item, duration: newDuration }
          : item
      ),
    }));

    onStateChange({
      ...editorState,
      tracks: updatedTracks,
    });
  };

  const handleItemSelect = (itemId: string, multiSelect: boolean = false) => {
    let newSelection: string[];
    
    if (multiSelect) {
      newSelection = editorState.selectedItems.includes(itemId)
        ? editorState.selectedItems.filter(id => id !== itemId)
        : [...editorState.selectedItems, itemId];
    } else {
      newSelection = [itemId];
    }

    onStateChange({
      ...editorState,
      selectedItems: newSelection,
    });
  };

  const getPlayheadPosition = () => {
    const timelineWidth = timelineRef.current?.clientWidth || 0;
    const trackLabelWidth = 200;
    const availableWidth = timelineWidth - trackLabelWidth;
    return trackLabelWidth + (editorState.currentTime / duration) * availableWidth;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-gray-900 text-white h-full flex flex-col">
        {/* Timeline Controls */}
        <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayPause}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              {editorState.playbackState === 'playing' ? (
                <Pause size={20} />
              ) : (
                <Play size={20} />
              )}
              <span>{editorState.playbackState === 'playing' ? 'Pause' : 'Play'}</span>
            </button>
            
            <button
              onClick={handleStop}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Square size={20} />
              <span>Stop</span>
            </button>
            
            <div className="text-sm text-gray-400">
              {Math.floor(editorState.currentTime / 60)}:{(editorState.currentTime % 60).toFixed(1).padStart(4, '0')} / {Math.floor(duration / 60)}:{(duration % 60).toFixed(0).padStart(2, '0')}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleZoom('out')}
              className="p-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
            >
              <ZoomOut size={16} />
            </button>
            
            <span className="text-sm text-gray-400">
              {Math.round(editorState.zoom * 100)}%
            </span>
            
            <button
              onClick={() => handleZoom('in')}
              className="p-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-auto">
          <div
            ref={timelineRef}
            className="relative min-h-full cursor-pointer"
            onClick={handleTimelineClick}
          >
            {/* Time Ruler */}
            <div className="bg-gray-800 border-b border-gray-700 h-12 flex items-center relative">
              <div className="w-48 px-4 text-sm font-medium">Time</div>
              <div className="flex-1 relative">
                {Array.from({ length: Math.ceil(duration / 10) + 1 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 h-full border-l border-gray-600 text-xs text-gray-400 pl-1"
                    style={{
                      left: `${(i * 10 / duration) * 100}%`,
                    }}
                  >
                    {i * 10}s
                  </div>
                ))}
              </div>
            </div>

            {/* Tracks */}
            {editorState.tracks.map((track, index) => (
              <TimelineTrack
                key={track.id}
                track={track}
                duration={duration}
                zoom={editorState.zoom}
                selectedItems={editorState.selectedItems}
                onItemMove={handleItemMove}
                onItemResize={handleItemResize}
                onItemSelect={handleItemSelect}
              />
            ))}

            {/* Playhead */}
            <div
              ref={playheadRef}
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none z-50"
              style={{
                left: `${getPlayheadPosition()}px`,
              }}
            >
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Waveform Visualization */}
        <div className="bg-gray-800 border-t border-gray-700 h-32">
          <WaveformVisualization
            audioUrl="/path/to/audio.wav" // This would be the actual audio URL
            currentTime={editorState.currentTime}
            duration={duration}
            onTimeChange={(time) => onStateChange({ ...editorState, currentTime: time })}
          />
        </div>
      </div>
    </DndProvider>
  );
};