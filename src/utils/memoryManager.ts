/**
 * Memory management utility for video processing operations
 */
export class MemoryManager {
  private memoryLimit: number;
  private currentUsage: number = 0;
  private reservedMemory: Map<string, number> = new Map();

  constructor(memoryLimit: number) {
    this.memoryLimit = memoryLimit;
  }

  /**
   * Check if enough memory is available for processing
   */
  async checkAvailableMemory(requiredMemory: number): Promise<void> {
    const availableMemory = this.memoryLimit - this.currentUsage;
    
    if (requiredMemory > availableMemory) {
      throw new Error(
        `Insufficient memory: required ${this.formatBytes(requiredMemory)}, ` +
        `available ${this.formatBytes(availableMemory)}`
      );
    }
  }

  /**
   * Reserve memory for a processing operation
   */
  reserveMemory(operationId: string, amount: number): void {
    this.reservedMemory.set(operationId, amount);
    this.currentUsage += amount;
  }

  /**
   * Release reserved memory
   */
  releaseMemory(operationId: string): void {
    const amount = this.reservedMemory.get(operationId);
    if (amount) {
      this.currentUsage -= amount;
      this.reservedMemory.delete(operationId);
    }
  }

  /**
   * Get current memory usage
   */
  async getCurrentUsage(): Promise<number> {
    return this.currentUsage;
  }

  /**
   * Get memory usage percentage
   */
  getUsagePercentage(): number {
    return (this.currentUsage / this.memoryLimit) * 100;
  }

  /**
   * Cleanup all reserved memory
   */
  async cleanup(): Promise<void> {
    this.reservedMemory.clear();
    this.currentUsage = 0;
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
  }

  /**
   * Format bytes to human readable format
   */
  private formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Get memory statistics
   */
  getMemoryStats(): MemoryStats {
    return {
      total: this.memoryLimit,
      used: this.currentUsage,
      available: this.memoryLimit - this.currentUsage,
      usagePercentage: this.getUsagePercentage(),
      reservedOperations: this.reservedMemory.size
    };
  }
}

export interface MemoryStats {
  total: number;
  used: number;
  available: number;
  usagePercentage: number;
  reservedOperations: number;
}