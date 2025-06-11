import { Caption, CaptionStyling } from '../types/video';

export class CaptionService {
  generateCaptions(
    text: string,
    audioTimings: Array<{ word: string; start: number; end: number }>,
    style: 'netflix' | 'youtube' | 'broadcast' | 'custom' = 'netflix'
  ): Caption[] {
    const captions: Caption[] = [];
    const styling = this.getCaptionStyling(style);
    
    if (audioTimings.length === 0) {
      // Fallback to time-based chunking
      return this.generateTimeBasedCaptions(text, styling);
    }

    // Group words into caption chunks
    const chunks = this.groupWordsIntoChunks(audioTimings, style);
    
    chunks.forEach((chunk, index) => {
      const captionText = chunk.words.map(w => w.word).join(' ');
      const startTime = chunk.words[0].start;
      const endTime = chunk.words[chunk.words.length - 1].end;
      
      captions.push({
        text: captionText,
        startTime,
        duration: endTime - startTime,
        styling,
        style,
        wordHighlight: style === 'youtube' || style === 'broadcast',
        animations: this.getCaptionAnimations(style),
      });
    });

    return captions;
  }

  private getCaptionStyling(style: string): CaptionStyling {
    const baseStyles = {
      fontWeight: '600',
      borderRadius: 8,
      margin: 40,
    };

    switch (style) {
      case 'netflix':
        return {
          ...baseStyles,
          fontSize: 32,
          color: '#ffffff',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 16,
          position: 'bottom' as const,
          maxWidth: 800,
          border: {
            width: 0,
            color: 'transparent',
            style: 'solid' as const,
          },
          shadow: {
            offsetX: 0,
            offsetY: 2,
            blur: 8,
            spread: 0,
            color: 'rgba(0, 0, 0, 0.5)',
          },
        };

      case 'youtube':
        return {
          ...baseStyles,
          fontSize: 28,
          color: '#ffffff',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          padding: 12,
          position: 'bottom' as const,
          maxWidth: 700,
          border: {
            width: 2,
            color: '#ff0000',
            style: 'solid' as const,
          },
          shadow: {
            offsetX: 2,
            offsetY: 2,
            blur: 4,
            spread: 0,
            color: 'rgba(0, 0, 0, 0.7)',
          },
        };

      case 'broadcast':
        return {
          ...baseStyles,
          fontSize: 36,
          color: '#000000',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: 20,
          position: 'bottom' as const,
          maxWidth: 900,
          border: {
            width: 3,
            color: '#000000',
            style: 'solid' as const,
          },
          shadow: {
            offsetX: 0,
            offsetY: 0,
            blur: 0,
            spread: 0,
            color: 'transparent',
          },
        };

      default:
        return {
          ...baseStyles,
          fontSize: 32,
          color: '#ffffff',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 16,
          position: 'bottom' as const,
          maxWidth: 800,
        };
    }
  }

  private getCaptionAnimations(style: string) {
    switch (style) {
      case 'netflix':
        return [
          {
            type: 'fadeIn' as const,
            timing: 'line' as const,
            duration: 0.3,
          },
        ];

      case 'youtube':
        return [
          {
            type: 'slideUp' as const,
            timing: 'line' as const,
            duration: 0.2,
          },
          {
            type: 'highlight' as const,
            timing: 'word' as const,
            duration: 0.1,
          },
        ];

      case 'broadcast':
        return [
          {
            type: 'typewriter' as const,
            timing: 'character' as const,
            duration: 0.05,
          },
        ];

      default:
        return [
          {
            type: 'fadeIn' as const,
            timing: 'line' as const,
            duration: 0.3,
          },
        ];
    }
  }

  private groupWordsIntoChunks(
    audioTimings: Array<{ word: string; start: number; end: number }>,
    style: string
  ) {
    const maxWordsPerChunk = this.getMaxWordsPerChunk(style);
    const chunks: Array<{ words: Array<{ word: string; start: number; end: number }> }> = [];
    
    let currentChunk: Array<{ word: string; start: number; end: number }> = [];
    
    audioTimings.forEach((timing, index) => {
      currentChunk.push(timing);
      
      // Check if we should end the current chunk
      const shouldEndChunk = 
        currentChunk.length >= maxWordsPerChunk ||
        (index < audioTimings.length - 1 && 
         audioTimings[index + 1].start - timing.end > 0.5) || // Long pause
        timing.word.endsWith('.') ||
        timing.word.endsWith('!') ||
        timing.word.endsWith('?');
      
      if (shouldEndChunk || index === audioTimings.length - 1) {
        chunks.push({ words: [...currentChunk] });
        currentChunk = [];
      }
    });
    
    return chunks;
  }

  private getMaxWordsPerChunk(style: string): number {
    switch (style) {
      case 'netflix':
        return 8;
      case 'youtube':
        return 6;
      case 'broadcast':
        return 10;
      default:
        return 8;
    }
  }

  private generateTimeBasedCaptions(text: string, styling: CaptionStyling): Caption[] {
    const words = text.split(' ');
    const captions: Caption[] = [];
    const wordsPerCaption = 8;
    const averageWordDuration = 0.5; // seconds per word
    
    for (let i = 0; i < words.length; i += wordsPerCaption) {
      const chunkWords = words.slice(i, i + wordsPerCaption);
      const captionText = chunkWords.join(' ');
      const startTime = i * averageWordDuration;
      const duration = chunkWords.length * averageWordDuration;
      
      captions.push({
        text: captionText,
        startTime,
        duration,
        styling,
        style: 'custom',
        wordHighlight: false,
        animations: [
          {
            type: 'fadeIn',
            timing: 'line',
            duration: 0.3,
          },
        ],
      });
    }
    
    return captions;
  }

  generateWordHighlights(
    caption: Caption,
    audioTimings: Array<{ word: string; start: number; end: number }>
  ): Array<{ word: string; startTime: number; duration: number }> {
    const highlights: Array<{ word: string; startTime: number; duration: number }> = [];
    const captionWords = caption.text.split(' ');
    
    captionWords.forEach((word, index) => {
      const timing = audioTimings.find(t => 
        t.word.toLowerCase().replace(/[^\w]/g, '') === 
        word.toLowerCase().replace(/[^\w]/g, '')
      );
      
      if (timing) {
        highlights.push({
          word,
          startTime: timing.start - caption.startTime,
          duration: timing.end - timing.start,
        });
      }
    });
    
    return highlights;
  }
}