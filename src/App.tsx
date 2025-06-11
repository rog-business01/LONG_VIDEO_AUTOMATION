import React, { useState } from 'react';
import { VideoProcessorApp } from './components/VideoProcessor/VideoProcessorApp';
import { Player } from '@remotion/player';
import { VideoComposition } from './video/VideoComposition';
import { VideoScript } from './types/video';
import { 
  FileVideo, Sparkles, Settings, BarChart3, 
  Play, Upload, Download, Zap
} from 'lucide-react';

// Enhanced sample video script
const sampleScript: VideoScript = {
  metadata: {
    title: 'Professional Video Processing Demo',
    duration: 120,
    fps: 30,
    width: 1920,
    height: 1080,
    platform: 'youtube',
    quality: 'production',
  },
  scenes: [
    {
      id: 'scene1',
      startTime: 0,
      duration: 120,
      quote: {
        text: 'Transform your videos with AI-powered processing',
        author: 'Video Processing Studio',
        attribution: 'Professional Video Solutions',
        styling: {
          fontSize: 64,
          fontWeight: '600',
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.2,
          maxWidth: 1200,
          padding: 40,
          background: {
            color: '#000000',
            opacity: 0.3,
            blur: 10,
          },
        },
      },
      background: {
        type: 'image',
        source: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        overlay: {
          color: '#000000',
          opacity: 0.4,
        },
      },
      animations: [
        {
          type: 'fadeIn',
          startTime: 0,
          duration: 2,
          target: 'quote',
          easing: 'easeOut',
        },
        {
          type: 'fadeIn',
          startTime: 1,
          duration: 2,
          target: 'author',
          easing: 'easeOut',
        },
      ],
      captions: [
        {
          text: 'Transform your videos with AI-powered processing',
          startTime: 0.5,
          duration: 4,
          styling: {
            fontSize: 32,
            fontWeight: '500',
            color: '#ffffff',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 16,
            borderRadius: 8,
            position: 'bottom',
            margin: 40,
            maxWidth: 800,
          },
        },
      ],
    },
  ],
  globalStyles: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    primaryColor: '#3B82F6',
    secondaryColor: '#14B8A6',
    accentColor: '#F97316',
    backgroundColor: '#000000',
    textColor: '#ffffff',
    transitionDuration: 0.3,
  },
};

function App() {
  const [activeTab, setActiveTab] = useState<'processor' | 'automation'>('processor');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileVideo className="text-blue-400" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Professional Video Processing Suite
                </h1>
                <p className="text-gray-400 mt-1">
                  AI-powered video processing and automation platform
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('processor')}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    activeTab === 'processor' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Zap size={16} />
                  <span>Video Processor</span>
                </button>
                <button
                  onClick={() => setActiveTab('automation')}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    activeTab === 'automation' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Sparkles size={16} />
                  <span>Video Automation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {activeTab === 'processor' ? (
          <VideoProcessorApp />
        ) : (
          <div className="max-w-7xl mx-auto p-6">
            {/* Video Automation Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Preview */}
              <div className="lg:col-span-2">
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <Play size={20} />
                    <span>Video Automation Preview</span>
                  </h3>
                  
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <Player
                      component={VideoComposition}
                      inputProps={{ script: sampleScript }}
                      durationInFrames={sampleScript.metadata.duration * sampleScript.metadata.fps}
                      compositionWidth={sampleScript.metadata.width}
                      compositionHeight={sampleScript.metadata.height}
                      fps={sampleScript.metadata.fps}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      controls
                      showVolumeControls
                      clickToPlay
                    />
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Automation Features</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span>AI Script Generation</span>
                      <Sparkles className="text-yellow-400" size={20} />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span>Auto Captions</span>
                      <Settings className="text-blue-400" size={20} />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span>TTS Generation</span>
                      <Upload className="text-green-400" size={20} />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span>Batch Processing</span>
                      <BarChart3 className="text-purple-400" size={20} />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  
                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                      <Upload size={20} />
                      <span>Upload Script</span>
                    </button>
                    
                    <button className="w-full bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                      <Play size={20} />
                      <span>Generate Video</span>
                    </button>
                    
                    <button className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                      <Download size={20} />
                      <span>Export Video</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 p-6">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>Professional Video Processing Suite - Powered by AI</p>
        </div>
      </footer>
    </div>
  );
}

export default App;