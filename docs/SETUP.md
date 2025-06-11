# Video Processing Application Setup Guide

## Overview

This is a comprehensive video processing application with AI-powered optimization using Google's Gemini API. The application provides professional-grade video processing capabilities with intelligent analysis and recommendations.

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Google Gemini API key (for AI features)
- Sufficient system memory (recommended: 8GB+ RAM)
- Storage space for video processing

## Installation

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install

# Install additional video processing dependencies (if needed)
npm install ffmpeg-static sharp
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Video Processing Configuration
VITE_MAX_FILE_SIZE=5368709120
VITE_MEMORY_LIMIT=2147483648
VITE_TEMP_DIRECTORY=/tmp
VITE_MAX_CONCURRENT_JOBS=3
VITE_ENABLE_GPU_ACCELERATION=true

# API Configuration
VITE_API_BASE_URL=http://localhost:3001
```

### 3. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key to your `.env` file

### 4. Start the Application

```bash
# Start the development server
npm run dev

# Start the API server (in another terminal)
npm run api
```

The application will be available at `http://localhost:5173`

## Configuration Options

### Video Processing Settings

```typescript
const config: VideoProcessingConfig = {
  memoryLimit: 2 * 1024 * 1024 * 1024, // 2GB
  maxFileSize: 5 * 1024 * 1024 * 1024, // 5GB
  tempDirectory: '/tmp',
  maxConcurrentJobs: 3,
  enableGPUAcceleration: true
};
```

### Supported Formats

**Input Formats:**
- MP4 (.mp4)
- AVI (.avi)
- MOV (.mov)
- WebM (.webm)
- MKV (.mkv)

**Output Formats:**
- MP4 (recommended for compatibility)
- WebM (recommended for web)
- AVI (legacy support)
- MOV (Apple ecosystem)

### Quality Settings

- **Low**: Fast processing, smaller file size, lower quality
- **Medium**: Balanced processing time and quality
- **High**: Slower processing, better quality
- **Ultra**: Highest quality, longest processing time

## Usage

### Basic Video Processing

1. **Upload Video**: Click the upload area and select your video file
2. **Configure Options**: Set output format, quality, and resolution
3. **Process**: Click "Process Video" to start

### AI-Powered Processing

1. **Configure Gemini**: Enter your API key in the Gemini AI section
2. **Enable AI Analysis**: Check "Use AI-powered video analysis"
3. **Process**: The AI will analyze your video and optimize settings automatically

### API Usage

```typescript
import { VideoProcessingService } from './services/videoProcessingService';

const service = new VideoProcessingService(config, geminiApiKey);

// Process video with AI analysis
const result = await service.processVideo(
  '/path/to/input.mp4',
  '/path/to/output.mp4',
  {
    outputFormat: 'mp4',
    quality: 'high',
    width: 1920,
    height: 1080
  },
  true // Enable AI analysis
);
```

## Performance Optimization

### Memory Management

The application includes sophisticated memory management:

```typescript
// Check available memory before processing
await memoryManager.checkAvailableMemory(requiredMemory);

// Reserve memory for operation
memoryManager.reserveMemory(operationId, memoryAmount);

// Release memory after completion
memoryManager.releaseMemory(operationId);
```

### GPU Acceleration

Enable GPU acceleration for faster processing:

```typescript
const config = {
  enableGPUAcceleration: true,
  // ... other options
};
```

### Concurrent Processing

Control concurrent jobs to balance performance and resource usage:

```typescript
const config = {
  maxConcurrentJobs: 3, // Adjust based on system capabilities
  // ... other options
};
```

## Monitoring and Debugging

### Logging

The application provides comprehensive logging:

```typescript
// Set log level
logger.setLogLevel('debug'); // debug, info, warn, error

// Log with context
logger.info('Processing started', { jobId, options });
```

### Performance Metrics

Monitor processing performance:

- Processing time per job
- Memory usage
- Success/failure rates
- Average compression ratios

### Error Handling

Common error scenarios and solutions:

1. **Insufficient Memory**: Reduce concurrent jobs or increase system memory
2. **Unsupported Format**: Check supported format list
3. **File Too Large**: Increase `maxFileSize` or compress input file
4. **Gemini API Errors**: Check API key and network connectivity

## Production Deployment

### Environment Variables

Set production environment variables:

```env
NODE_ENV=production
VITE_GEMINI_API_KEY=your_production_api_key
VITE_MAX_FILE_SIZE=10737418240
VITE_MEMORY_LIMIT=4294967296
```

### Performance Tuning

1. **Memory Allocation**: Allocate sufficient memory based on expected file sizes
2. **Concurrent Jobs**: Tune based on CPU cores and memory
3. **GPU Acceleration**: Enable for significant performance improvements
4. **Caching**: Implement caching for frequently processed content

### Security Considerations

1. **API Key Security**: Store Gemini API key securely
2. **File Validation**: Validate all input files thoroughly
3. **Path Sanitization**: Prevent directory traversal attacks
4. **Resource Limits**: Set appropriate limits to prevent abuse

## Troubleshooting

### Common Issues

1. **"Command not found: vite"**
   ```bash
   npm install -g vite
   # or use npx
   npx vite
   ```

2. **Memory errors during processing**
   - Increase `memoryLimit` in configuration
   - Reduce `maxConcurrentJobs`
   - Process smaller files

3. **Gemini API connection issues**
   - Verify API key is correct
   - Check network connectivity
   - Ensure API quotas are not exceeded

4. **Slow processing**
   - Enable GPU acceleration
   - Reduce quality settings for faster processing
   - Use appropriate output format

### Debug Mode

Enable debug logging for detailed information:

```typescript
const logger = new Logger('VideoProcessor', 'debug');
```

### Performance Profiling

Monitor system resources during processing:

```bash
# Monitor memory usage
top -p $(pgrep node)

# Monitor disk I/O
iotop

# Monitor GPU usage (if available)
nvidia-smi
```

## API Reference

### VideoProcessingService

Main service for video processing operations.

#### Methods

- `processVideo(inputPath, outputPath, options, useAI)`: Process video file
- `getJob(jobId)`: Get job status
- `getAllJobs()`: Get all processing jobs
- `cancelJob(jobId)`: Cancel processing job
- `getProcessingStats()`: Get performance statistics

### GeminiVideoAnalyzer

AI-powered video analysis service.

#### Methods

- `analyzeVideo(videoPath, metadata)`: Analyze video content
- `testConnection()`: Test API connectivity

### VideoProcessor

Core video processing engine.

#### Methods

- `processVideo(inputPath, outputPath, options)`: Process video
- `getProcessingStats()`: Get processing statistics

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review error logs
3. Verify configuration settings
4. Test with smaller files first

## License

This project is licensed under the MIT License.