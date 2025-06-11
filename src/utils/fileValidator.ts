import * as fs from 'fs';
import * as path from 'path';

/**
 * File validation utility for video processing
 */
export class FileValidator {
  private readonly supportedVideoExtensions = ['.mp4', '.avi', '.mov', '.webm', '.mkv'];
  private readonly videoMimeTypes = [
    'video/mp4',
    'video/avi',
    'video/quicktime',
    'video/webm',
    'video/x-matroska'
  ];

  /**
   * Check if file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file size in bytes
   */
  async getFileSize(filePath: string): Promise<number> {
    try {
      const stats = await fs.promises.stat(filePath);
      return stats.size;
    } catch (error) {
      throw new Error(`Failed to get file size: ${error.message}`);
    }
  }

  /**
   * Get file format from extension
   */
  getFileFormat(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    return ext.substring(1); // Remove the dot
  }

  /**
   * Validate if file is a supported video format
   */
  isVideoFile(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    return this.supportedVideoExtensions.includes(ext);
  }

  /**
   * Validate video file integrity (basic check)
   */
  async validateVideoFile(filePath: string): Promise<boolean> {
    try {
      // Check if it's a video file by extension
      if (!this.isVideoFile(filePath)) {
        return false;
      }

      // Check file size (must be > 0)
      const size = await this.getFileSize(filePath);
      if (size === 0) {
        return false;
      }

      // Basic file header validation
      const isValidHeader = await this.validateFileHeader(filePath);
      return isValidHeader;

    } catch {
      return false;
    }
  }

  /**
   * Validate file header to ensure it's a valid video file
   */
  private async validateFileHeader(filePath: string): Promise<boolean> {
    try {
      const buffer = Buffer.alloc(12);
      const fd = await fs.promises.open(filePath, 'r');
      
      try {
        await fd.read(buffer, 0, 12, 0);
        
        // Check for common video file signatures
        const header = buffer.toString('hex');
        
        // MP4 signature
        if (header.includes('667479706d703432') || header.includes('667479706d703431')) {
          return true;
        }
        
        // AVI signature
        if (header.includes('52494646') && header.includes('41564920')) {
          return true;
        }
        
        // MOV signature
        if (header.includes('667479707174') || header.includes('6d6f6f76')) {
          return true;
        }
        
        // WebM signature
        if (header.includes('1a45dfa3')) {
          return true;
        }
        
        return false;
        
      } finally {
        await fd.close();
      }
      
    } catch {
      return false;
    }
  }

  /**
   * Validate file path and permissions
   */
  async validateFilePath(filePath: string, checkWrite: boolean = false): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: []
    };

    // Check if path is valid
    if (!filePath || filePath.trim() === '') {
      result.isValid = false;
      result.errors.push('File path is empty');
      return result;
    }

    // Check if file exists
    if (!await this.fileExists(filePath)) {
      result.isValid = false;
      result.errors.push('File does not exist');
      return result;
    }

    // Check read permissions
    try {
      await fs.promises.access(filePath, fs.constants.R_OK);
    } catch {
      result.isValid = false;
      result.errors.push('No read permission for file');
    }

    // Check write permissions if required
    if (checkWrite) {
      try {
        await fs.promises.access(path.dirname(filePath), fs.constants.W_OK);
      } catch {
        result.isValid = false;
        result.errors.push('No write permission for directory');
      }
    }

    return result;
  }

  /**
   * Sanitize file path to prevent directory traversal
   */
  sanitizeFilePath(filePath: string): string {
    // Remove any path traversal attempts
    const sanitized = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
    
    // Ensure the path doesn't start with a slash (absolute path)
    return sanitized.startsWith('/') ? sanitized.substring(1) : sanitized;
  }

  /**
   * Generate safe output filename
   */
  generateSafeOutputPath(inputPath: string, outputFormat: string, suffix?: string): string {
    const dir = path.dirname(inputPath);
    const name = path.basename(inputPath, path.extname(inputPath));
    const safeSuffix = suffix ? `_${suffix}` : '_processed';
    
    return path.join(dir, `${name}${safeSuffix}.${outputFormat}`);
  }
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}