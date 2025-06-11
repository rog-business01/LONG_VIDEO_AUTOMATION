import React, { useState, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { TimelineItem as TimelineItemType } from '../../types/video';

interface TimelineItemProps {
  item: TimelineItemType;
  duration: number;
  zoom: number;
  isSelected: boolean;
  onMove: (itemId: string, newStartTime: number, newTrack: number) => void;
  onResize: (itemId: string, newDuration: number) => void;
  onSelect: (itemId: string, multiSelect?: boolean) => void;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  item,
  duration,
  zoom,
  isSelected,
  onMove,
  onResize,
  onSelect,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<'left' | 'right' | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'timeline-item',
    item: { id: item.id, startTime: item.startTime },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getItemColor = () => {
    switch (item.type) {
      case 'scene':
        return 'bg-blue-600';
      case 'audio':
        return 'bg-green-600';
      case 'caption':
        return 'bg-yellow-600';
      case 'effect':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getItemPosition = () => {
    const left = (item.startTime / duration) * 100;
    const width = (item.duration / duration) * 100;
    return { left: `${left}%`, width: `${width}%` };
  };

  const handleMouseDown = (event: React.MouseEvent, handle?: 'left' | 'right') => {
    event.preventDefault();
    
    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle);
    } else {
      onSelect(item.id, event.ctrlKey || event.metaKey);
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizing || !itemRef.current) return;

    const rect = itemRef.current.parentElement!.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const timelineWidth = rect.width;
    const newTime = (x / timelineWidth) * duration;

    if (resizeHandle === 'left') {
      const newDuration = item.duration + (item.startTime - newTime);
      if (newDuration > 0.1) {
        onMove(item.id, newTime, item.track);
        onResize(item.id, newDuration);
      }
    } else if (resizeHandle === 'right') {
      const newDuration = newTime - item.startTime;
      if (newDuration > 0.1) {
        onResize(item.id, newDuration);
      }
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    setResizeHandle(null);
  };

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, resizeHandle]);

  const position = getItemPosition();

  return (
    <div
      ref={(node) => {
        itemRef.current = node;
        drag(node);
      }}
      className={`absolute top-1 bottom-1 rounded cursor-pointer transition-all ${getItemColor()} ${
        isSelected ? 'ring-2 ring-white' : ''
      } ${isDragging ? 'opacity-50' : ''}`}
      style={position}
      onMouseDown={(e) => handleMouseDown(e)}
    >
      {/* Left resize handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white bg-opacity-0 hover:bg-opacity-30"
        onMouseDown={(e) => handleMouseDown(e, 'left')}
      />
      
      {/* Content */}
      <div className="px-2 py-1 text-xs text-white truncate h-full flex items-center">
        <span>{item.type}: {item.id}</span>
      </div>
      
      {/* Right resize handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white bg-opacity-0 hover:bg-opacity-30"
        onMouseDown={(e) => handleMouseDown(e, 'right')}
      />
    </div>
  );
};