import React from 'react';
import { useDrop } from 'react-dnd';
import { Volume2, VolumeX, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { TimelineItem } from './TimelineItem';
import { Track, TimelineItem as TimelineItemType } from '../../types/video';

interface TimelineTrackProps {
  track: Track;
  duration: number;
  zoom: number;
  selectedItems: string[];
  onItemMove: (itemId: string, newStartTime: number, newTrack: number) => void;
  onItemResize: (itemId: string, newDuration: number) => void;
  onItemSelect: (itemId: string, multiSelect?: boolean) => void;
}

export const TimelineTrack: React.FC<TimelineTrackProps> = ({
  track,
  duration,
  zoom,
  selectedItems,
  onItemMove,
  onItemResize,
  onItemSelect,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'timeline-item',
    drop: (item: { id: string; startTime: number }, monitor) => {
      const offset = monitor.getDropResult();
      if (offset) {
        // Calculate new start time based on drop position
        // This is a simplified calculation
        onItemMove(item.id, item.startTime, track.id as any);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const getTrackColor = () => {
    switch (track.type) {
      case 'video':
        return 'bg-blue-900';
      case 'audio':
        return 'bg-green-900';
      case 'caption':
        return 'bg-yellow-900';
      case 'effect':
        return 'bg-purple-900';
      default:
        return 'bg-gray-900';
    }
  };

  const getTrackIcon = () => {
    switch (track.type) {
      case 'audio':
        return track.muted ? <VolumeX size={16} /> : <Volume2 size={16} />;
      case 'video':
        return track.locked ? <Lock size={16} /> : <Eye size={16} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={drop}
      className={`border-b border-gray-700 h-16 flex ${getTrackColor()} ${
        isOver ? 'bg-opacity-50' : 'bg-opacity-20'
      }`}
    >
      {/* Track Label */}
      <div className="w-48 px-4 flex items-center justify-between bg-gray-800 border-r border-gray-700">
        <div className="flex items-center space-x-2">
          {getTrackIcon()}
          <span className="text-sm font-medium truncate">{track.name}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            className={`p-1 rounded ${track.muted ? 'text-red-400' : 'text-gray-400'} hover:text-white`}
            onClick={() => {
              // Toggle mute
            }}
          >
            {track.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          
          <button
            className={`p-1 rounded ${track.locked ? 'text-red-400' : 'text-gray-400'} hover:text-white`}
            onClick={() => {
              // Toggle lock
            }}
          >
            {track.locked ? <Lock size={14} /> : <Unlock size={14} />}
          </button>
        </div>
      </div>

      {/* Track Content */}
      <div className="flex-1 relative overflow-hidden">
        {track.items.map((item) => (
          <TimelineItem
            key={item.id}
            item={item}
            duration={duration}
            zoom={zoom}
            isSelected={selectedItems.includes(item.id)}
            onMove={onItemMove}
            onResize={onItemResize}
            onSelect={onItemSelect}
          />
        ))}
      </div>
    </div>
  );
};