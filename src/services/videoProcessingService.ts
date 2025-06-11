import { VideoProcessor, VideoProcessingOptions } from './videoProcessor';
import { GeminiVideoAnalyzer } from './geminiVideoAnalyzer';
import { VideoProcessingConfig, ProcessingJob, ProcessingResult } from '../types/video-processing';
import { Logger } from '../utils/logger';
import { EventEmitter } from 'events';

/**
 * Main Video Processing Service
 * Orchestrates video processing with AI analysis and job management
 */
export class VideoProcessingService extends EventEmitter {
  private processor: VideoProcessor;
  private geminiAnalyzer: GeminiVideoAnalyzer;
  private logger: Logger;
  private jobs: Map<string, ProcessingJob> = new Map();
  private config: VideoProcessingConfig;

  constructor(config: VideoProcessingConfig, geminiApiKey?: string) {
    super();
    
    this.config = config;
    this.logger = new Logger('VideoProcessingService');
    this.processor = new VideoProcessor(config);
    
    if (geminiApiKey) {
      this.geminiAnalyzer = new GeminiVideoAnalyzer(geminiApiKey);
    }
    
    this.logger.info('VideoProcessingService initialized', { 
      hasGemini: !!geminiApiKey,
      config 
    });
  }

  /**
   * Process video with optional AI analysis
   */
  async processVideo(
    inputPath: string,
    outputPath: string,
    options: VideoProcessingOptions,
    useAIAnalysis: boolean = false
  ): Promise<ProcessingResult> {
    const jobId = this.generateJobId();
    
    try {
      // Create processing job
      const job: ProcessingJob = {
        id: jobId,
        inputPath,
        outputPath,
        options,
        status: 'queued',
        progress: 0,
        createdAt: new Date()
      };
      
      this.jobs.set(jobId, job);
      this.emit('jobCreated', job);
      
      this.logger.info('Starting video processing job', { 
        jobId, 
        inputPath, 
        outputPath, 
        options,
        useAIAnalysis 
      });

      // Update job status
      job.status = 'processing';
      job.startedAt = new Date();
      this.emit('jobStarted', job);

      let enhancedOptions = options;

      // Step 1: AI Analysis (if enabled)
      if (useAIAnalysis && this.geminiAnalyzer) {
        try {
          job.progress = 10;
          this.emit('jobProgress', job);
          
          const metadata = await this.processor['getVideoMetadata'](inputPath);
          const analysis = await this.geminiAnalyzer.analyzeVideo(inputPath, metadata);
          
          // Enhance processing options based on AI recommendations
          enhancedOptions = this.enhanceOptionsWithAI(options, analysis);
          
          this.logger.info('AI analysis completed', { jobId, analysis });
          
          job.progress = 30;
          this.emit('jobProgress', job);
          
        } catch (aiError) {
          this.logger.warn('AI analysis failed, proceeding with original options', { 
            jobId, 
            error: aiError.message 
          });
        }
      }

      // Step 2: Process video
      job.progress = 40;
      this.emit('jobProgress', job);
      
      const result = await this.processor.processVideo(
        inputPath,
        outputPath,
        enhancedOptions
      );

      // Update job with results
      if (result.success) {
        job.status = 'completed';
        job.progress = 100;
        job.completedAt = new Date();
        this.emit('jobCompleted', job);
        
        this.logger.info('Video processing completed successfully', { jobId, result });
      } else {
        job.status = 'failed';
        job.error = result.error;
        job.completedAt = new Date();
        this.emit('jobFailed', job);
        
        this.logger.error('Video processing failed', { jobId, error: result.error });
      }

      return result;

    } catch (error) {
      const job = this.jobs.get(jobId);
      if (job) {
        job.status = 'failed';
        job.error = error.message;
        job.completedAt = new Date();
        this.emit('jobFailed', job);
      }
      
      this.logger.error('Video processing service error', { jobId, error: error.message });
      
      return {
        success: false,
        processingId: jobId,
        error: error.message,
        processingTime: Date.now() - (job?.createdAt.getTime() || Date.now())
      };
    }
  }

  /**
   * Enhance processing options based on AI analysis
   */
  private enhanceOptionsWithAI(
    originalOptions: VideoProcessingOptions,
    analysis: any
  ): VideoProcessingOptions {
    const enhanced = { ...originalOptions };
    
    // Apply AI recommendations
    if (analysis.recommendations) {
      // Update format if AI suggests a better one
      if (analysis.recommendations.suggestedFormat && 
          analysis.recommendations.suggestedFormat !== originalOptions.outputFormat) {
        enhanced.outputFormat = analysis.recommendations.suggestedFormat;
        this.logger.info('AI recommended format change', {
          original: originalOptions.outputFormat,
          recommended: analysis.recommendations.suggestedFormat
        });
      }
      
      // Update quality if AI suggests optimization
      if (analysis.recommendations.suggestedQuality &&
          analysis.recommendations.suggestedQuality !== originalOptions.quality) {
        enhanced.quality = analysis.recommendations.suggestedQuality;
        this.logger.info('AI recommended quality change', {
          original: originalOptions.quality,
          recommended: analysis.recommendations.suggestedQuality
        });
      }
    }
    
    return enhanced;
  }

  /**
   * Get job status
   */
  getJob(jobId: string): ProcessingJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Get all jobs
   */
  getAllJobs(): ProcessingJob[] {
    return Array.from(this.jobs.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  /**
   * Cancel a processing job
   */
  async cancelJob(jobId: string): Promise<boolean> {
    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'processing') {
      return false;
    }
    
    job.status = 'failed';
    job.error = 'Cancelled by user';
    job.completedAt = new Date();
    
    this.emit('jobCancelled', job);
    this.logger.info('Job cancelled', { jobId });
    
    return true;
  }

  /**
   * Get processing statistics
   */
  async getProcessingStats() {
    const jobs = this.getAllJobs();
    const completed = jobs.filter(j => j.status === 'completed');
    const failed = jobs.filter(j => j.status === 'failed');
    const processing = jobs.filter(j => j.status === 'processing');
    
    const avgProcessingTime = completed.length > 0 
      ? completed.reduce((sum, job) => {
          const duration = job.completedAt!.getTime() - job.startedAt!.getTime();
          return sum + duration;
        }, 0) / completed.length
      : 0;
    
    const processorStats = await this.processor.getProcessingStats();
    
    return {
      totalJobs: jobs.length,
      completedJobs: completed.length,
      failedJobs: failed.length,
      processingJobs: processing.length,
      successRate: jobs.length > 0 ? (completed.length / jobs.length) * 100 : 0,
      averageProcessingTime: avgProcessingTime,
      ...processorStats
    };
  }

  /**
   * Test Gemini AI connection
   */
  async testGeminiConnection(): Promise<boolean> {
    if (!this.geminiAnalyzer) {
      return false;
    }
    
    try {
      return await this.geminiAnalyzer.testConnection();
    } catch {
      return false;
    }
  }

  /**
   * Generate unique job ID
   */
  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup old jobs
   */
  async cleanupOldJobs(maxAge: number = 24 * 60 * 60 * 1000): Promise<number> {
    const cutoffTime = Date.now() - maxAge;
    let cleaned = 0;
    
    for (const [jobId, job] of this.jobs.entries()) {
      if (job.createdAt.getTime() < cutoffTime && job.status !== 'processing') {
        this.jobs.delete(jobId);
        cleaned++;
      }
    }
    
    this.logger.info('Cleaned up old jobs', { cleaned });
    return cleaned;
  }
}