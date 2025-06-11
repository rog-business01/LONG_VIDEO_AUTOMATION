export interface VideoProcessingConfig {
  memoryLimit: number; // in bytes
  maxFileSize: number; // in bytes
  tempDirectory: string;
  maxConcurrentJobs: number;
  enableGPUAcceleration: boolean;
}

export interface VideoMetadata {
  duration: number; // in seconds
  width: number;
  height: number;
  frameRate: number;
  bitrate: number;
  codec: string;
  audioCodec: string;
  fileSize: number;
  format: VideoFormat;
  hasAudio: boolean;
  colorSpace: string;
  aspectRatio: string;
}

export interface ProcessingResult {
  success: boolean;
  processingId: string;
  outputPath?: string;
  metadata?: VideoMetadata;
  processingTime: number;
  compressionRatio?: number;
  qualityScore?: number;
  error?: string;
}

export type VideoFormat = 'mp4' | 'avi' | 'mov' | 'webm' | 'mkv';

export interface ProcessingJob {
  id: string;
  inputPath: string;
  outputPath: string;
  options: VideoProcessingOptions;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export interface VideoProcessingOptions {
  outputFormat: VideoFormat;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  width?: number;
  height?: number;
  bitrate?: number;
  frameRate?: number;
  codec?: string;
  audioCodec?: string;
  removeAudio?: boolean;
  startTime?: number;
  endTime?: number;
}

export interface GeminiAnalysisResult {
  contentType: string;
  duration: number;
  qualityAssessment: {
    videoQuality: number;
    audioQuality: number;
    overallScore: number;
  };
  recommendations: {
    suggestedFormat: VideoFormat;
    suggestedQuality: string;
    optimizations: string[];
  };
  metadata: {
    scenes: number;
    motionLevel: 'low' | 'medium' | 'high';
    complexity: number;
  };
}