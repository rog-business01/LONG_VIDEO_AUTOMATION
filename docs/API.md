# Video Processing API Documentation

## Overview

The Video Processing API provides comprehensive video processing capabilities with AI-powered optimization. This document covers all available endpoints, request/response formats, and usage examples.

## Base URL

```
http://localhost:3001/api
```

## Authentication

Currently, the API uses API key authentication for Gemini AI features. Include your Gemini API key in the service configuration.

## Endpoints

### Video Processing

#### POST /process

Process a video file with specified options.

**Request:**
```typescript
{
  inputPath: string;
  outputPath: string;
  options: {
    outputFormat: 'mp4' | 'webm' | 'avi' | 'mov';
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
  };
  useAIAnalysis?: boolean;
}
```

**Response:**
```typescript
{
  success: boolean;
  processingId: string;
  outputPath?: string;
  metadata?: VideoMetadata;
  processingTime: number;
  compressionRatio?: number;
  qualityScore?: number;
  error?: string;
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/process \
  -H "Content-Type: application/json" \
  -d '{
    "inputPath": "/uploads/video.mp4",
    "outputPath": "/outputs/processed_video.mp4",
    "options": {
      "outputFormat": "mp4",
      "quality": "high",
      "width": 1920,
      "height": 1080
    },
    "useAIAnalysis": true
  }'
```

#### GET /process/:jobId

Get the status of a processing job.

**Response:**
```typescript
{
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
```

#### GET /process

Get all processing jobs.

**Response:**
```typescript
ProcessingJob[]
```

#### DELETE /process/:jobId

Cancel a processing job.

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

### AI Analysis

#### POST /analyze

Analyze video content using Gemini AI.

**Request:**
```typescript
{
  videoPath: string;
  metadata: VideoMetadata;
}
```

**Response:**
```typescript
{
  contentType: string;
  duration: number;
  qualityAssessment: {
    videoQuality: number;
    audioQuality: number;
    overallScore: number;
  };
  recommendations: {
    suggestedFormat: string;
    suggestedQuality: string;
    optimizations: string[];
  };
  metadata: {
    scenes: number;
    motionLevel: 'low' | 'medium' | 'high';
    complexity: number;
  };
}
```

### Statistics

#### GET /stats

Get processing statistics and system information.

**Response:**
```typescript
{
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  processingJobs: number;
  successRate: number;
  averageProcessingTime: number;
  memoryUsage: number;
  supportedFormats: string[];
}
```

### Health Check

#### GET /health

Check API health status.

**Response:**
```typescript
{
  status: 'ok' | 'error';
  timestamp: string;
  version: string;
  uptime: number;
}
```

## WebSocket Events

The API supports real-time updates via WebSocket connections.

### Connection

```javascript
const ws = new WebSocket('ws://localhost:3001');
```

### Events

#### job_created
Emitted when a new processing job is created.

```typescript
{
  type: 'job_created';
  job: ProcessingJob;
}
```

#### job_progress
Emitted during job processing with progress updates.

```typescript
{
  type: 'job_progress';
  jobId: string;
  progress: number;
}
```

#### job_completed
Emitted when a job completes successfully.

```typescript
{
  type: 'job_completed';
  jobId: string;
  result: ProcessingResult;
}
```

#### job_failed
Emitted when a job fails.

```typescript
{
  type: 'job_failed';
  jobId: string;
  error: string;
}
```

## Error Handling

### Error Response Format

```typescript
{
  error: string;
  code: string;
  details?: any;
  timestamp: string;
}
```

### Common Error Codes

- `INVALID_INPUT`: Invalid input parameters
- `FILE_NOT_FOUND`: Input file not found
- `UNSUPPORTED_FORMAT`: Unsupported video format
- `INSUFFICIENT_MEMORY`: Not enough memory for processing
- `PROCESSING_FAILED`: Video processing failed
- `AI_ANALYSIS_FAILED`: Gemini AI analysis failed
- `RATE_LIMIT_EXCEEDED`: API rate limit exceeded

### HTTP Status Codes

- `200`: Success
- `400`: Bad Request
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error
- `503`: Service Unavailable

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Processing Jobs**: 10 concurrent jobs per client
- **AI Analysis**: 100 requests per hour
- **General API**: 1000 requests per hour

## File Upload

### POST /upload

Upload video files for processing.

**Request:**
- Content-Type: `multipart/form-data`
- Max file size: 5GB (configurable)

**Response:**
```typescript
{
  success: boolean;
  filePath: string;
  fileSize: number;
  metadata: VideoMetadata;
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "video=@/path/to/video.mp4"
```

## Batch Processing

### POST /batch

Process multiple videos in batch.

**Request:**
```typescript
{
  jobs: Array<{
    inputPath: string;
    outputPath: string;
    options: VideoProcessingOptions;
  }>;
  useAIAnalysis?: boolean;
}
```

**Response:**
```typescript
{
  batchId: string;
  jobs: string[]; // Array of job IDs
}
```

## Configuration

### GET /config

Get current API configuration.

**Response:**
```typescript
{
  maxFileSize: number;
  memoryLimit: number;
  maxConcurrentJobs: number;
  supportedFormats: string[];
  enableGPUAcceleration: boolean;
  geminiEnabled: boolean;
}
```

### PUT /config

Update API configuration (admin only).

**Request:**
```typescript
{
  maxFileSize?: number;
  memoryLimit?: number;
  maxConcurrentJobs?: number;
  enableGPUAcceleration?: boolean;
}
```

## SDK Usage Examples

### JavaScript/TypeScript

```typescript
import { VideoProcessingClient } from './client';

const client = new VideoProcessingClient('http://localhost:3001');

// Process video
const result = await client.processVideo({
  inputPath: '/uploads/video.mp4',
  outputPath: '/outputs/processed.mp4',
  options: {
    outputFormat: 'mp4',
    quality: 'high'
  },
  useAIAnalysis: true
});

// Monitor progress
client.on('progress', (jobId, progress) => {
  console.log(`Job ${jobId}: ${progress}%`);
});

// Get job status
const job = await client.getJob(result.processingId);
```

### Python

```python
import requests
import json

# Process video
response = requests.post('http://localhost:3001/api/process', 
  json={
    'inputPath': '/uploads/video.mp4',
    'outputPath': '/outputs/processed.mp4',
    'options': {
      'outputFormat': 'mp4',
      'quality': 'high'
    },
    'useAIAnalysis': True
  }
)

result = response.json()
job_id = result['processingId']

# Check status
status_response = requests.get(f'http://localhost:3001/api/process/{job_id}')
job_status = status_response.json()
```

### cURL Examples

```bash
# Process video
curl -X POST http://localhost:3001/api/process \
  -H "Content-Type: application/json" \
  -d '{
    "inputPath": "/uploads/video.mp4",
    "outputPath": "/outputs/processed.mp4",
    "options": {
      "outputFormat": "mp4",
      "quality": "high",
      "width": 1920,
      "height": 1080
    }
  }'

# Get job status
curl http://localhost:3001/api/process/job_123456

# Get statistics
curl http://localhost:3001/api/stats

# Upload file
curl -X POST http://localhost:3001/api/upload \
  -F "video=@video.mp4"
```

## Performance Considerations

### Optimization Tips

1. **Use appropriate quality settings**: Higher quality = longer processing time
2. **Enable GPU acceleration**: Significantly faster processing
3. **Batch processing**: More efficient for multiple files
4. **AI analysis**: Adds processing time but improves results

### Resource Usage

- **Memory**: ~2-4x input file size during processing
- **CPU**: High usage during processing
- **GPU**: Utilized when acceleration is enabled
- **Disk**: Temporary files created during processing

### Scaling

For high-volume processing:

1. Increase `maxConcurrentJobs` based on system resources
2. Use multiple API instances with load balancing
3. Implement job queuing for better resource management
4. Monitor system resources and adjust limits accordingly

## Security

### Best Practices

1. **Validate all inputs**: File types, sizes, and parameters
2. **Sanitize file paths**: Prevent directory traversal
3. **Rate limiting**: Prevent abuse
4. **API key protection**: Secure Gemini API keys
5. **File cleanup**: Remove temporary files after processing

### CORS Configuration

```typescript
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
}));
```

## Monitoring

### Metrics

The API exposes metrics for monitoring:

- Processing job counts and success rates
- Average processing times
- Memory and CPU usage
- Error rates and types
- API request rates

### Logging

Comprehensive logging is available:

```typescript
// Log levels: debug, info, warn, error
logger.info('Processing started', { jobId, options });
logger.error('Processing failed', { jobId, error });
```

## Support

For API support:

1. Check error messages and codes
2. Review request/response formats
3. Monitor system resources
4. Check API logs for detailed information