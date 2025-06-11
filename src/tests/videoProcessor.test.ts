import { VideoProcessor } from '../services/videoProcessor';
import { VideoProcessingConfig } from '../types/video-processing';

describe('VideoProcessor', () => {
  let processor: VideoProcessor;
  let config: VideoProcessingConfig;

  beforeEach(() => {
    config = {
      memoryLimit: 1024 * 1024 * 1024, // 1GB
      maxFileSize: 500 * 1024 * 1024, // 500MB
      tempDirectory: '/tmp',
      maxConcurrentJobs: 2,
      enableGPUAcceleration: false
    };
    
    processor = new VideoProcessor(config);
  });

  describe('processVideo', () => {
    it('should successfully process a valid video file', async () => {
      const inputPath = '/test/input.mp4';
      const outputPath = '/test/output.mp4';
      const options = {
        outputFormat: 'mp4' as const,
        quality: 'medium' as const,
        width: 1280,
        height: 720
      };

      // Mock file validation
      jest.spyOn(processor as any, 'validateInputFile').mockResolvedValue(undefined);
      jest.spyOn(processor as any, 'getVideoMetadata').mockResolvedValue({
        duration: 60,
        width: 1920,
        height: 1080,
        frameRate: 30,
        bitrate: 5000000,
        codec: 'h264',
        audioCodec: 'aac',
        fileSize: 100 * 1024 * 1024,
        format: 'mp4',
        hasAudio: true,
        colorSpace: 'yuv420p',
        aspectRatio: '16:9'
      });

      const result = await processor.processVideo(inputPath, outputPath, options);

      expect(result.success).toBe(true);
      expect(result.outputPath).toBe(outputPath);
      expect(result.processingId).toBeDefined();
      expect(result.processingTime).toBeGreaterThan(0);
    });

    it('should fail with invalid input file', async () => {
      const inputPath = '/test/nonexistent.mp4';
      const outputPath = '/test/output.mp4';
      const options = {
        outputFormat: 'mp4' as const,
        quality: 'medium' as const
      };

      const result = await processor.processVideo(inputPath, outputPath, options);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Input file not found');
    });

    it('should validate processing options', async () => {
      const inputPath = '/test/input.mp4';
      const outputPath = '/test/output.mp4';
      const options = {
        outputFormat: 'invalid' as any,
        quality: 'medium' as const
      };

      // Mock file validation to pass
      jest.spyOn(processor as any, 'validateInputFile').mockResolvedValue(undefined);
      jest.spyOn(processor as any, 'getVideoMetadata').mockResolvedValue({
        duration: 60,
        width: 1920,
        height: 1080,
        frameRate: 30,
        bitrate: 5000000,
        codec: 'h264',
        audioCodec: 'aac',
        fileSize: 100 * 1024 * 1024,
        format: 'mp4',
        hasAudio: true,
        colorSpace: 'yuv420p',
        aspectRatio: '16:9'
      });

      const result = await processor.processVideo(inputPath, outputPath, options);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unsupported output format');
    });
  });

  describe('calculateOptimalBitrate', () => {
    it('should calculate appropriate bitrate for different resolutions', () => {
      const calculateOptimalBitrate = (processor as any).calculateOptimalBitrate.bind(processor);

      // 1080p medium quality
      const bitrate1080p = calculateOptimalBitrate(1920, 1080, 'medium');
      expect(bitrate1080p).toBeGreaterThan(0);

      // 720p should have lower bitrate than 1080p
      const bitrate720p = calculateOptimalBitrate(1280, 720, 'medium');
      expect(bitrate720p).toBeLessThan(bitrate1080p);

      // High quality should have higher bitrate than medium
      const bitrateHigh = calculateOptimalBitrate(1920, 1080, 'high');
      expect(bitrateHigh).toBeGreaterThan(bitrate1080p);
    });
  });

  describe('memory management', () => {
    it('should check memory requirements before processing', async () => {
      const inputPath = '/test/large-file.mp4';
      const outputPath = '/test/output.mp4';
      const options = {
        outputFormat: 'mp4' as const,
        quality: 'medium' as const
      };

      // Mock a file that exceeds memory limit
      jest.spyOn(processor as any, 'validateInputFile').mockResolvedValue(undefined);
      jest.spyOn(processor as any, 'getVideoMetadata').mockResolvedValue({
        duration: 60,
        width: 1920,
        height: 1080,
        frameRate: 30,
        bitrate: 5000000,
        codec: 'h264',
        audioCodec: 'aac',
        fileSize: 2 * 1024 * 1024 * 1024, // 2GB (exceeds 1GB limit)
        format: 'mp4',
        hasAudio: true,
        colorSpace: 'yuv420p',
        aspectRatio: '16:9'
      });

      const result = await processor.processVideo(inputPath, outputPath, options);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Insufficient memory');
    });
  });
});

describe('FileValidator', () => {
  let validator: any;

  beforeEach(() => {
    const { FileValidator } = require('../utils/fileValidator');
    validator = new FileValidator();
  });

  describe('isVideoFile', () => {
    it('should identify video files correctly', () => {
      expect(validator.isVideoFile('test.mp4')).toBe(true);
      expect(validator.isVideoFile('test.avi')).toBe(true);
      expect(validator.isVideoFile('test.mov')).toBe(true);
      expect(validator.isVideoFile('test.webm')).toBe(true);
      expect(validator.isVideoFile('test.mkv')).toBe(true);
      
      expect(validator.isVideoFile('test.txt')).toBe(false);
      expect(validator.isVideoFile('test.jpg')).toBe(false);
      expect(validator.isVideoFile('test.mp3')).toBe(false);
    });
  });

  describe('getFileFormat', () => {
    it('should extract file format correctly', () => {
      expect(validator.getFileFormat('test.mp4')).toBe('mp4');
      expect(validator.getFileFormat('path/to/video.avi')).toBe('avi');
      expect(validator.getFileFormat('VIDEO.MOV')).toBe('mov');
    });
  });

  describe('sanitizeFilePath', () => {
    it('should prevent directory traversal attacks', () => {
      expect(validator.sanitizeFilePath('../../../etc/passwd')).toBe('etc/passwd');
      expect(validator.sanitizeFilePath('..\\..\\windows\\system32')).toBe('windows/system32');
      expect(validator.sanitizeFilePath('normal/path/file.mp4')).toBe('normal/path/file.mp4');
    });
  });
});

describe('MemoryManager', () => {
  let memoryManager: any;

  beforeEach(() => {
    const { MemoryManager } = require('../utils/memoryManager');
    memoryManager = new MemoryManager(1024 * 1024 * 1024); // 1GB
  });

  describe('memory reservation', () => {
    it('should reserve and release memory correctly', () => {
      const operationId = 'test-op-1';
      const amount = 100 * 1024 * 1024; // 100MB

      memoryManager.reserveMemory(operationId, amount);
      expect(memoryManager.getCurrentUsage()).resolves.toBe(amount);

      memoryManager.releaseMemory(operationId);
      expect(memoryManager.getCurrentUsage()).resolves.toBe(0);
    });

    it('should track multiple reservations', () => {
      memoryManager.reserveMemory('op1', 100 * 1024 * 1024);
      memoryManager.reserveMemory('op2', 200 * 1024 * 1024);

      expect(memoryManager.getCurrentUsage()).resolves.toBe(300 * 1024 * 1024);
      expect(memoryManager.getUsagePercentage()).toBeCloseTo(29.3, 1);
    });
  });

  describe('memory validation', () => {
    it('should throw error when insufficient memory', async () => {
      const largeAmount = 2 * 1024 * 1024 * 1024; // 2GB (exceeds 1GB limit)

      await expect(memoryManager.checkAvailableMemory(largeAmount))
        .rejects.toThrow('Insufficient memory');
    });

    it('should allow processing when sufficient memory available', async () => {
      const smallAmount = 500 * 1024 * 1024; // 500MB

      await expect(memoryManager.checkAvailableMemory(smallAmount))
        .resolves.not.toThrow();
    });
  });
});