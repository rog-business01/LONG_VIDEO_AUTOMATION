import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Play, Settings, Download, Zap, BarChart3, 
  CheckCircle, XCircle, Clock, AlertCircle, Cpu, 
  HardDrive, Activity, FileVideo, Sparkles
} from 'lucide-react';
import { VideoProcessingService } from '../../services/videoProcessingService';
import { VideoProcessingConfig, ProcessingJob, VideoProcessingOptions } from '../../types/video-processing';

export const VideoProcessorApp: React.FC = () => {
  const [processingService, setProcessingService] = useState<VideoProcessingService | null>(null);
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);
  const [stats, setStats] = useState<any>({});
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isGeminiConnected, setIsGeminiConnected] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingOptions, setProcessingOptions] = useState<VideoProcessingOptions>({
    outputFormat: 'mp4',
    quality: 'medium',
    width: undefined,
    height: undefined,
    bitrate: undefined,
    frameRate: undefined
  });
  const [useAIAnalysis, setUseAIAnalysis] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize processing service
  useEffect(() => {
    const config: VideoProcessingConfig = {
      memoryLimit: 2 * 1024 * 1024 * 1024, // 2GB
      maxFileSize: 5 * 1024 * 1024 * 1024, // 5GB
      tempDirectory: '/tmp',
      maxConcurrentJobs: 3,
      enableGPUAcceleration: true
    };

    const service = new VideoProcessingService(config, geminiApiKey || undefined);
    
    // Set up event listeners
    service.on('jobCreated', (job) => {
      setJobs(prev => [job, ...prev]);
    });
    
    service.on('jobProgress', (job) => {
      setJobs(prev => prev.map(j => j.id === job.id ? job : j));
    });
    
    service.on('jobCompleted', (job) => {
      setJobs(prev => prev.map(j => j.id === job.id ? job : j));
      updateStats();
    });
    
    service.on('jobFailed', (job) => {
      setJobs(prev => prev.map(j => j.id === job.id ? job : j));
      updateStats();
    });

    setProcessingService(service);
    updateStats();
  }, [geminiApiKey]);

  // Test Gemini connection when API key changes
  useEffect(() => {
    if (geminiApiKey && processingService) {
      processingService.testGeminiConnection().then(setIsGeminiConnected);
    } else {
      setIsGeminiConnected(false);
    }
  }, [geminiApiKey, processingService]);

  const updateStats = async () => {
    if (processingService) {
      const newStats = await processingService.getProcessingStats();
      setStats(newStats);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleProcessVideo = async () => {
    if (!selectedFile || !processingService) return;

    setIsProcessing(true);
    
    try {
      // In a real implementation, you would upload the file to a server
      // For demo purposes, we'll use a placeholder path
      const inputPath = `/tmp/${selectedFile.name}`;
      const outputPath = `/tmp/processed_${selectedFile.name}`;
      
      await processingService.processVideo(
        inputPath,
        outputPath,
        processingOptions,
        useAIAnalysis
      );
      
    } catch (error) {
      console.error('Processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'failed':
        return <XCircle className="text-red-500" size={20} />;
      case 'processing':
        return <Activity className="text-blue-500 animate-spin" size={20} />;
      default:
        return <Clock className="text-yellow-500" size={20} />;
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
            <FileVideo className="text-blue-400" />
            <span>Professional Video Processor</span>
            {isGeminiConnected && (
              <Sparkles className="text-yellow-400" size={24} />
            )}
          </h1>
          <p className="text-gray-400 mt-2">
            Advanced video processing with AI-powered optimization
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Processing Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gemini API Configuration */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Sparkles className="text-yellow-400" />
                <span>Gemini AI Configuration</span>
                {isGeminiConnected && (
                  <span className="text-xs bg-green-600 px-2 py-1 rounded">Connected</span>
                )}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key"
                    className="w-full bg-gray-700 rounded px-3 py-2 text-white placeholder-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get your API key from Google AI Studio
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="useAI"
                    checked={useAIAnalysis}
                    onChange={(e) => setUseAIAnalysis(e.target.checked)}
                    disabled={!isGeminiConnected}
                    className="w-4 h-4"
                  />
                  <label htmlFor="useAI" className="text-sm">
                    Use AI-powered video analysis and optimization
                  </label>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Upload Video</h3>
              
              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-400">
                    {selectedFile ? selectedFile.name : 'Click to select video file'}
                  </p>
                  {selectedFile && (
                    <p className="text-sm text-gray-500 mt-2">
                      Size: {formatFileSize(selectedFile.size)}
                    </p>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Processing Options */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Processing Options</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Output Format</label>
                  <select
                    value={processingOptions.outputFormat}
                    onChange={(e) => setProcessingOptions(prev => ({
                      ...prev,
                      outputFormat: e.target.value as any
                    }))}
                    className="w-full bg-gray-700 rounded px-3 py-2"
                  >
                    <option value="mp4">MP4</option>
                    <option value="webm">WebM</option>
                    <option value="avi">AVI</option>
                    <option value="mov">MOV</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Quality</label>
                  <select
                    value={processingOptions.quality}
                    onChange={(e) => setProcessingOptions(prev => ({
                      ...prev,
                      quality: e.target.value as any
                    }))}
                    className="w-full bg-gray-700 rounded px-3 py-2"
                  >
                    <option value="low">Low (Fast)</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="ultra">Ultra (Slow)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Width (optional)</label>
                  <input
                    type="number"
                    value={processingOptions.width || ''}
                    onChange={(e) => setProcessingOptions(prev => ({
                      ...prev,
                      width: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                    placeholder="Auto"
                    className="w-full bg-gray-700 rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Height (optional)</label>
                  <input
                    type="number"
                    value={processingOptions.height || ''}
                    onChange={(e) => setProcessingOptions(prev => ({
                      ...prev,
                      height: e.target.value ? parseInt(e.target.value) : undefined
                    }))}
                    placeholder="Auto"
                    className="w-full bg-gray-700 rounded px-3 py-2"
                  />
                </div>
              </div>
              
              <button
                onClick={handleProcessVideo}
                disabled={!selectedFile || isProcessing}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Activity className="animate-spin" size={20} />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    <span>Process Video</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <BarChart3 size={20} />
                <span>Statistics</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Jobs</span>
                  <span className="text-white">{stats.totalJobs || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Completed</span>
                  <span className="text-green-400">{stats.completedJobs || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Failed</span>
                  <span className="text-red-400">{stats.failedJobs || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Success Rate</span>
                  <span className="text-blue-400">{(stats.successRate || 0).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Time</span>
                  <span className="text-white">
                    {stats.averageProcessingTime ? formatDuration(stats.averageProcessingTime) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Cpu size={20} />
                <span>System Status</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Memory Usage</span>
                  <span className="text-white">
                    {((stats.memoryUsage || 0) / (1024 * 1024 * 1024)).toFixed(1)} GB
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Processing Jobs</span>
                  <span className="text-yellow-400">{stats.processingJobs || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Gemini AI</span>
                  <span className={isGeminiConnected ? 'text-green-400' : 'text-red-400'}>
                    {isGeminiConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Job History */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Processing History</h3>
          
          <div className="space-y-3">
            {jobs.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No processing jobs yet</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(job.status)}
                      <span className="font-medium">{job.id}</span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {job.createdAt.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-2">
                    {job.inputPath} → {job.outputPath}
                  </div>
                  
                  {job.status === 'processing' && (
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  )}
                  
                  {job.error && (
                    <div className="text-red-400 text-sm mt-2 flex items-center space-x-2">
                      <AlertCircle size={16} />
                      <span>{job.error}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};