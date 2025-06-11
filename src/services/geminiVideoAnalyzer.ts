import { GeminiAnalysisResult, VideoMetadata } from '../types/video-processing';
import { Logger } from '../utils/logger';

/**
 * Gemini AI Video Analyzer Service
 * Integrates with Google's Gemini API for intelligent video analysis
 */
export class GeminiVideoAnalyzer {
  private apiKey: string;
  private logger: Logger;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    
    this.apiKey = apiKey;
    this.logger = new Logger('GeminiVideoAnalyzer');
  }

  /**
   * Analyze video content using Gemini AI
   */
  async analyzeVideo(
    videoPath: string,
    metadata: VideoMetadata
  ): Promise<GeminiAnalysisResult> {
    try {
      this.logger.info('Starting Gemini video analysis', { videoPath, metadata });

      // Step 1: Extract video frames for analysis
      const frames = await this.extractKeyFrames(videoPath, metadata);
      
      // Step 2: Analyze content with Gemini
      const contentAnalysis = await this.analyzeContentWithGemini(frames, metadata);
      
      // Step 3: Generate optimization recommendations
      const recommendations = this.generateOptimizationRecommendations(
        contentAnalysis,
        metadata
      );
      
      const result: GeminiAnalysisResult = {
        contentType: contentAnalysis.contentType,
        duration: metadata.duration,
        qualityAssessment: contentAnalysis.qualityAssessment,
        recommendations,
        metadata: contentAnalysis.sceneMetadata
      };

      this.logger.info('Gemini analysis completed', { result });
      return result;

    } catch (error) {
      this.logger.error('Gemini analysis failed', { error: error.message });
      throw new Error(`Video analysis failed: ${error.message}`);
    }
  }

  /**
   * Extract key frames from video for analysis
   */
  private async extractKeyFrames(
    videoPath: string,
    metadata: VideoMetadata
  ): Promise<string[]> {
    // In a real implementation, this would use FFmpeg to extract frames
    // For demo purposes, we'll simulate frame extraction
    
    const frameCount = Math.min(10, Math.floor(metadata.duration / 10)); // Max 10 frames
    const frames: string[] = [];
    
    for (let i = 0; i < frameCount; i++) {
      const timestamp = (metadata.duration / frameCount) * i;
      const frameData = await this.simulateFrameExtraction(videoPath, timestamp);
      frames.push(frameData);
    }
    
    this.logger.debug('Key frames extracted', { frameCount, videoPath });
    return frames;
  }

  /**
   * Simulate frame extraction (in real implementation, use FFmpeg)
   */
  private async simulateFrameExtraction(videoPath: string, timestamp: number): Promise<string> {
    // This would return base64 encoded frame data
    // For demo, return a placeholder
    return `frame_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Analyze video content using Gemini API
   */
  private async analyzeContentWithGemini(
    frames: string[],
    metadata: VideoMetadata
  ): Promise<ContentAnalysis> {
    try {
      const prompt = this.buildAnalysisPrompt(metadata);
      
      const response = await fetch(`${this.baseUrl}/models/gemini-1.5-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: prompt
              },
              // In real implementation, include frame data here
              ...frames.map(frame => ({
                inline_data: {
                  mime_type: "image/jpeg",
                  data: frame // base64 encoded frame
                }
              }))
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]) {
        throw new Error('No analysis results from Gemini API');
      }

      const analysisText = data.candidates[0].content.parts[0].text;
      return this.parseGeminiResponse(analysisText, metadata);

    } catch (error) {
      this.logger.error('Gemini API call failed', { error: error.message });
      
      // Fallback to basic analysis if Gemini fails
      return this.generateFallbackAnalysis(metadata);
    }
  }

  /**
   * Build analysis prompt for Gemini
   */
  private buildAnalysisPrompt(metadata: VideoMetadata): string {
    return `
Analyze this video content and provide a detailed assessment. The video has the following technical specifications:
- Duration: ${metadata.duration} seconds
- Resolution: ${metadata.width}x${metadata.height}
- Frame Rate: ${metadata.frameRate} fps
- Bitrate: ${metadata.bitrate} bps
- Codec: ${metadata.codec}
- File Size: ${metadata.fileSize} bytes

Please analyze the provided video frames and provide:

1. Content Type Classification:
   - Determine if this is: documentary, entertainment, educational, promotional, artistic, or other
   - Identify the primary subject matter

2. Quality Assessment (score 0-100):
   - Video quality (sharpness, color accuracy, lighting)
   - Audio quality (if present)
   - Overall production value

3. Scene Analysis:
   - Number of distinct scenes or segments
   - Motion level (low/medium/high)
   - Visual complexity score (0-100)

4. Optimization Recommendations:
   - Suggested output format for best compatibility
   - Recommended quality settings
   - Specific optimizations for this content type

Please format your response as JSON with the following structure:
{
  "contentType": "string",
  "qualityAssessment": {
    "videoQuality": number,
    "audioQuality": number,
    "overallScore": number
  },
  "sceneAnalysis": {
    "sceneCount": number,
    "motionLevel": "low|medium|high",
    "complexityScore": number
  },
  "recommendations": {
    "suggestedFormat": "string",
    "suggestedQuality": "string",
    "optimizations": ["string"]
  }
}
`;
  }

  /**
   * Parse Gemini response into structured data
   */
  private parseGeminiResponse(responseText: string, metadata: VideoMetadata): ContentAnalysis {
    try {
      // Extract JSON from response text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in Gemini response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        contentType: parsed.contentType || 'unknown',
        qualityAssessment: {
          videoQuality: parsed.qualityAssessment?.videoQuality || 75,
          audioQuality: parsed.qualityAssessment?.audioQuality || 75,
          overallScore: parsed.qualityAssessment?.overallScore || 75
        },
        sceneMetadata: {
          scenes: parsed.sceneAnalysis?.sceneCount || 1,
          motionLevel: parsed.sceneAnalysis?.motionLevel || 'medium',
          complexity: parsed.sceneAnalysis?.complexityScore || 50
        },
        rawRecommendations: parsed.recommendations || {}
      };

    } catch (error) {
      this.logger.warn('Failed to parse Gemini response, using fallback', { error: error.message });
      return this.generateFallbackAnalysis(metadata);
    }
  }

  /**
   * Generate fallback analysis if Gemini fails
   */
  private generateFallbackAnalysis(metadata: VideoMetadata): ContentAnalysis {
    return {
      contentType: 'unknown',
      qualityAssessment: {
        videoQuality: this.estimateVideoQuality(metadata),
        audioQuality: metadata.hasAudio ? 75 : 0,
        overallScore: 70
      },
      sceneMetadata: {
        scenes: Math.max(1, Math.floor(metadata.duration / 30)), // Estimate 1 scene per 30 seconds
        motionLevel: 'medium',
        complexity: 50
      },
      rawRecommendations: {}
    };
  }

  /**
   * Estimate video quality based on technical parameters
   */
  private estimateVideoQuality(metadata: VideoMetadata): number {
    let score = 50; // Base score
    
    // Resolution scoring
    const pixelCount = metadata.width * metadata.height;
    if (pixelCount >= 1920 * 1080) score += 20; // HD+
    else if (pixelCount >= 1280 * 720) score += 10; // HD
    
    // Bitrate scoring
    const bitratePerPixel = metadata.bitrate / pixelCount;
    if (bitratePerPixel > 0.1) score += 15;
    else if (bitratePerPixel > 0.05) score += 10;
    else if (bitratePerPixel > 0.02) score += 5;
    
    // Frame rate scoring
    if (metadata.frameRate >= 60) score += 10;
    else if (metadata.frameRate >= 30) score += 5;
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Generate optimization recommendations based on analysis
   */
  private generateOptimizationRecommendations(
    analysis: ContentAnalysis,
    metadata: VideoMetadata
  ): GeminiAnalysisResult['recommendations'] {
    const recommendations: string[] = [];
    
    // Format recommendations
    let suggestedFormat = 'mp4'; // Default
    if (analysis.contentType === 'web' || analysis.contentType === 'streaming') {
      suggestedFormat = 'webm';
    }
    
    // Quality recommendations
    let suggestedQuality = 'medium';
    if (analysis.qualityAssessment.overallScore > 85) {
      suggestedQuality = 'high';
    } else if (analysis.qualityAssessment.overallScore < 60) {
      suggestedQuality = 'low';
    }
    
    // Generate specific optimizations
    if (analysis.sceneMetadata.motionLevel === 'high') {
      recommendations.push('Use higher bitrate for motion-heavy content');
      recommendations.push('Consider 60fps for smooth motion');
    }
    
    if (analysis.sceneMetadata.complexity > 70) {
      recommendations.push('Use advanced encoding settings for complex scenes');
      recommendations.push('Consider two-pass encoding for better quality');
    }
    
    if (metadata.fileSize > 1024 * 1024 * 1024) { // > 1GB
      recommendations.push('Apply compression to reduce file size');
      recommendations.push('Consider segmented encoding for large files');
    }
    
    if (analysis.qualityAssessment.videoQuality < 70) {
      recommendations.push('Apply noise reduction filters');
      recommendations.push('Use sharpening filters to improve clarity');
    }
    
    return {
      suggestedFormat: suggestedFormat as any,
      suggestedQuality,
      optimizations: recommendations
    };
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models?key=${this.apiKey}`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

interface ContentAnalysis {
  contentType: string;
  qualityAssessment: {
    videoQuality: number;
    audioQuality: number;
    overallScore: number;
  };
  sceneMetadata: {
    scenes: number;
    motionLevel: 'low' | 'medium' | 'high';
    complexity: number;
  };
  rawRecommendations: any;
}