import React, { useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import { VideoComposition } from './video/VideoComposition';
import { VideoScript, EditorState, Track, TimelineItem } from './types/video';
import { TimelineEditor } from './components/Timeline/TimelineEditor';
import { 
  Upload, Play, Settings, Download, Palette, Wand2, 
  Image, Layers, Zap, Database, Webhook, BarChart3,
  FileText, Sparkles, Volume2, Eye
} from 'lucide-react';

// Enhanced sample video script with new features
const enhancedSampleScript: VideoScript = {
  metadata: {
    title: 'Enhanced Inspirational Quotes Collection',
    duration: 240,
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
        text: 'The only way to do great work is to love what you do.',
        author: 'Steve Jobs',
        attribution: 'Apple Co-founder',
        ssml: '<speak><prosody rate="0.9" pitch="+2%">The only way to do <emphasis level="strong">great work</emphasis> is to love what you do.</prosody></speak>',
        emphasis: [
          {
            startTime: 2,
            duration: 1.5,
            type: 'bold',
            intensity: 1,
          },
          {
            startTime: 6,
            duration: 1,
            type: 'glow',
            intensity: 0.8,
          },
        ],
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
          textShadow: {
            offsetX: 2,
            offsetY: 2,
            blur: 8,
            color: 'rgba(0, 0, 0, 0.8)',
          },
          outline: {
            width: 1,
            color: '#ffffff',
          },
        },
      },
      background: {
        type: 'image',
        source: 'https://images.pexels.com/photos/2182863/pexels-photo-2182863.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
        overlay: {
          color: '#000000',
          opacity: 0.4,
        },
        kenBurns: {
          enabled: true,
          startScale: 1,
          endScale: 1.1,
          direction: 'zoom-in',
          duration: 120,
        },
        colorGrading: {
          brightness: 10,
          contrast: 15,
          saturation: 20,
          temperature: 5,
          tint: 0,
          vignette: {
            intensity: 0.3,
            color: '#000000',
          },
        },
      },
      animations: [
        {
          type: 'fadeIn',
          startTime: 0,
          duration: 2,
          target: 'quote',
          easing: 'easeOut',
          gpu: true,
        },
        {
          type: 'fadeIn',
          startTime: 1,
          duration: 2,
          target: 'author',
          easing: 'easeOut',
        },
        {
          type: 'particleEffect',
          startTime: 5,
          duration: 10,
          target: 'quote',
          easing: 'ease',
        },
      ],
      captions: [
        {
          text: 'The only way to do great work',
          startTime: 0.5,
          duration: 3,
          style: 'netflix',
          wordHighlight: true,
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
            shadow: {
              offsetX: 0,
              offsetY: 4,
              blur: 8,
              spread: 0,
              color: 'rgba(0, 0, 0, 0.5)',
            },
          },
          animations: [
            {
              type: 'slideUp',
              timing: 'line',
              duration: 0.3,
            },
          ],
        },
        {
          text: 'is to love what you do.',
          startTime: 3.5,
          duration: 3,
          style: 'netflix',
          wordHighlight: true,
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
            shadow: {
              offsetX: 0,
              offsetY: 4,
              blur: 8,
              spread: 0,
              color: 'rgba(0, 0, 0, 0.5)',
            },
          },
          animations: [
            {
              type: 'slideUp',
              timing: 'line',
              duration: 0.3,
            },
          ],
        },
      ],
      thumbnail: {
        variants: [
          {
            id: 'minimal',
            style: 'minimal',
            layout: 'centered',
            colorScheme: ['#000000', '#ffffff', '#cccccc'],
          },
          {
            id: 'bold',
            style: 'bold',
            layout: 'split',
            colorScheme: ['#ff0000', '#ffffff', '#ffff00'],
          },
        ],
        abTestEnabled: true,
      },
      audioConfig: {
        fadeIn: 1,
        fadeOut: 1,
        volume: 0.8,
        effects: [
          {
            type: 'normalize',
            parameters: { level: -3 },
          },
        ],
      },
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
    brandColors: ['#3B82F6', '#14B8A6', '#F97316', '#EF4444', '#8B5CF6'],
  },
  ttsConfig: {
    provider: 'gemini-2.5-flash-preview-tts',
    voice: 'en-US-Wavenet-D',
    speed: 0.9,
    pitch: 2,
    volume: 0.8,
    pauseBetweenQuotes: 2,
    ssmlEnabled: true,
    emotionalInflection: 'calm',
    voiceCloning: {
      enabled: false,
    },
  },
  branding: {
    logo: {
      source: '/logo.png',
      position: 'bottom-right',
      size: 64,
      opacity: 0.8,
    },
    colorPalette: ['#3B82F6', '#14B8A6', '#F97316', '#EF4444', '#8B5CF6'],
    fontPalette: ['Inter', 'Roboto', 'Open Sans', 'Lato'],
  },
  exportSettings: {
    platforms: [
      {
        platform: 'youtube',
        dimensions: { width: 1920, height: 1080 },
        bitrate: 8000,
        format: 'mp4',
      },
      {
        platform: 'instagram',
        dimensions: { width: 1080, height: 1080 },
        bitrate: 6000,
        format: 'mp4',
      },
      {
        platform: 'tiktok',
        dimensions: { width: 1080, height: 1920 },
        bitrate: 5000,
        format: 'mp4',
      },
    ],
    quality: {
      crf: 18,
      preset: 'medium',
      pixelFormat: 'yuv420p',
      audioQuality: 192,
    },
    optimization: {
      gpuAcceleration: true,
      multiThreading: true,
      memoryOptimization: true,
      progressiveRendering: true,
      smartCaching: true,
    },
  },
};

function App() {
  const [currentScript, setCurrentScript] = useState<VideoScript>(enhancedSampleScript);
  const [activeTab, setActiveTab] = useState<'preview' | 'timeline' | 'settings'>('preview');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [renderJobs, setRenderJobs] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});

  // Timeline editor state
  const [editorState, setEditorState] = useState<EditorState>({
    currentTime: 0,
    selectedItems: [],
    zoom: 1,
    tracks: [
      {
        id: 'video-1',
        type: 'video',
        name: 'Video Track',
        items: [
          {
            id: 'scene-1',
            type: 'scene',
            startTime: 0,
            duration: 120,
            track: 0,
            data: currentScript.scenes[0],
          },
        ],
        muted: false,
        locked: false,
      },
      {
        id: 'audio-1',
        type: 'audio',
        name: 'Audio Track',
        items: [
          {
            id: 'audio-1',
            type: 'audio',
            startTime: 0,
            duration: 120,
            track: 1,
            data: { source: '/audio/scene1.wav' },
          },
        ],
        muted: false,
        locked: false,
      },
      {
        id: 'caption-1',
        type: 'caption',
        name: 'Captions',
        items: currentScript.scenes[0].captions.map((caption, index) => ({
          id: `caption-${index}`,
          type: 'caption',
          startTime: caption.startTime,
          duration: caption.duration,
          track: 2,
          data: caption,
        })),
        muted: false,
        locked: false,
      },
    ],
    playbackState: 'stopped',
  });

  useEffect(() => {
    // Load initial data
    fetchRenderJobs();
    fetchTemplates();
    fetchAnalytics();
  }, []);

  const fetchRenderJobs = async () => {
    try {
      const response = await fetch('/api/render');
      const jobs = await response.json();
      setRenderJobs(jobs);
    } catch (error) {
      console.error('Failed to fetch render jobs:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const templateList = await response.json();
      setTemplates(templateList);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const script = JSON.parse(e.target?.result as string);
          setCurrentScript(script);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleRender = async () => {
    try {
      const response = await fetch('/api/render', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script: currentScript }),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(`Render job started: ${result.jobId}`);
        fetchRenderJobs(); // Refresh job list
      } else {
        alert(`Render failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Render error:', error);
      alert('Failed to start render job');
    }
  };

  const handleGenerateThumbnails = async () => {
    try {
      const response = await fetch('/api/thumbnails/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          scene: currentScript.scenes[0],
          config: currentScript.scenes[0].thumbnail 
        }),
      });

      const result = await response.json();
      alert(`Thumbnail generation started: ${result.thumbnailId}`);
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      alert('Failed to generate thumbnails');
    }
  };

  const handleGenerateTTS = async () => {
    try {
      const response = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: currentScript.scenes[0].quote.text,
          config: currentScript.ttsConfig 
        }),
      });

      const result = await response.json();
      alert(`TTS generation started: ${result.audioId}`);
    } catch (error) {
      console.error('TTS generation error:', error);
      alert('Failed to generate TTS');
    }
  };

  const handleSaveTemplate = async () => {
    try {
      const templateName = prompt('Enter template name:');
      if (!templateName) return;

      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: templateName,
          template: currentScript,
          description: 'Custom template created from current script'
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(`Template saved: ${result.name}`);
        fetchTemplates();
      } else {
        alert(`Failed to save template: ${result.error}`);
      }
    } catch (error) {
      console.error('Template save error:', error);
      alert('Failed to save template');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'preview':
        return (
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <Player
              component={VideoComposition}
              inputProps={{ script: currentScript }}
              durationInFrames={currentScript.metadata.duration * currentScript.metadata.fps}
              compositionWidth={currentScript.metadata.width}
              compositionHeight={currentScript.metadata.height}
              fps={currentScript.metadata.fps}
              style={{
                width: '100%',
                height: '100%',
              }}
              controls
              showVolumeControls
              clickToPlay
            />
          </div>
        );

      case 'timeline':
        return (
          <div className="h-96 bg-gray-900 rounded-lg overflow-hidden">
            <TimelineEditor
              editorState={editorState}
              onStateChange={setEditorState}
              duration={currentScript.metadata.duration}
            />
          </div>
        );

      case 'settings':
        return (
          <div className="bg-gray-800 rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-semibold">Advanced Settings</h3>
            
            {/* TTS Configuration */}
            <div className="space-y-4">
              <h4 className="font-medium">TTS Configuration</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Provider</label>
                  <select className="w-full bg-gray-700 rounded px-3 py-2">
                    <option value="gemini-2.5-flash-preview-tts">Gemini 2.5 Flash Preview TTS</option>
                    <option value="google">Google Cloud TTS</option>
                    <option value="amazon">Amazon Polly</option>
                    <option value="elevenlabs">ElevenLabs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Voice</label>
                  <select className="w-full bg-gray-700 rounded px-3 py-2">
                    <option value="en-US-Wavenet-D">English (US) - Wavenet D</option>
                    <option value="en-US-Wavenet-A">English (US) - Wavenet A</option>
                    <option value="en-GB-Wavenet-A">English (UK) - Wavenet A</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Speed</label>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="2" 
                    step="0.1" 
                    defaultValue="0.9"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Pitch</label>
                  <input 
                    type="range" 
                    min="-20" 
                    max="20" 
                    step="1" 
                    defaultValue="2"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Volume</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    defaultValue="0.8"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Export Settings */}
            <div className="space-y-4">
              <h4 className="font-medium">Export Settings</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Platform</label>
                  <select className="w-full bg-gray-700 rounded px-3 py-2">
                    <option value="youtube">YouTube (1920x1080)</option>
                    <option value="instagram">Instagram (1080x1080)</option>
                    <option value="tiktok">TikTok (1080x1920)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Quality</label>
                  <select className="w-full bg-gray-700 rounded px-3 py-2">
                    <option value="draft">Draft (Fast)</option>
                    <option value="preview">Preview (Medium)</option>
                    <option value="production">Production (High)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">GPU Acceleration</label>
                  <input 
                    type="checkbox" 
                    defaultChecked
                    className="w-4 h-4 mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center space-x-2">
              <Sparkles className="text-blue-400" />
              <span>Enhanced Video Automation Studio</span>
            </h1>
            <p className="text-gray-400 mt-1">Professional video generation with AI-powered features</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg cursor-pointer transition-colors">
              <Upload size={20} />
              <span>Upload Script</span>
              <input 
                type="file" 
                accept=".json" 
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            
            <button
              onClick={handleSaveTemplate}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
            >
              <FileText size={20} />
              <span>Save Template</span>
            </button>
            
            <button
              onClick={handleRender}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Download size={20} />
              <span>Render</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-gray-800 rounded-lg p-1 flex space-x-1">
              {[
                { id: 'preview', label: 'Preview', icon: Eye },
                { id: 'timeline', label: 'Timeline', icon: Layers },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-gray-800 rounded-lg p-6">
              {renderTabContent()}
            </div>

            {/* Enhanced Tools */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">AI-Powered Tools</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={handleGenerateTTS}
                  className="flex flex-col items-center space-y-2 bg-blue-600 hover:bg-blue-700 p-4 rounded-lg transition-colors"
                >
                  <Volume2 size={24} />
                  <span className="text-sm">Generate TTS</span>
                </button>
                
                <button
                  onClick={handleGenerateThumbnails}
                  className="flex flex-col items-center space-y-2 bg-purple-600 hover:bg-purple-700 p-4 rounded-lg transition-colors"
                >
                  <Image size={24} />
                  <span className="text-sm">A/B Thumbnails</span>
                </button>
                
                <button className="flex flex-col items-center space-y-2 bg-orange-600 hover:bg-orange-700 p-4 rounded-lg transition-colors">
                  <Palette size={24} />
                  <span className="text-sm">Color Grading</span>
                </button>
                
                <button className="flex flex-col items-center space-y-2 bg-green-600 hover:bg-green-700 p-4 rounded-lg transition-colors">
                  <Zap size={24} />
                  <span className="text-sm">Auto Captions</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Script Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Project Info</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400">Title</label>
                  <p className="text-white">{currentScript.metadata.title}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Duration</label>
                  <p className="text-white">{Math.floor(currentScript.metadata.duration / 60)}:{(currentScript.metadata.duration % 60).toString().padStart(2, '0')}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Platform</label>
                  <p className="text-white capitalize">{currentScript.metadata.platform}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Quality</label>
                  <p className="text-white capitalize">{currentScript.metadata.quality}</p>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <BarChart3 size={20} />
                <span>Analytics</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Jobs</span>
                  <span className="text-white">{analytics.totalJobs || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Completed</span>
                  <span className="text-green-400">{analytics.completedJobs || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Processing</span>
                  <span className="text-yellow-400">{analytics.processingJobs || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Templates</span>
                  <span className="text-blue-400">{analytics.totalTemplates || 0}</span>
                </div>
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Jobs</h3>
              <div className="space-y-3">
                {renderJobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate">{job.id.substring(0, 8)}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        job.status === 'completed' ? 'bg-green-600' :
                        job.status === 'processing' ? 'bg-yellow-600' :
                        job.status === 'failed' ? 'bg-red-600' : 'bg-gray-600'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    {job.status === 'processing' && (
                      <div className="w-full bg-gray-600 rounded-full h-1">
                        <div 
                          className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${job.progress || 0}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Templates */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Templates</h3>
              <div className="space-y-2">
                {templates.slice(0, 3).map((template) => (
                  <button
                    key={template.id}
                    className="w-full text-left bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition-colors"
                    onClick={() => {
                      // Load template
                      console.log('Load template:', template.id);
                    }}
                  >
                    <div className="font-medium truncate">{template.name}</div>
                    <div className="text-sm text-gray-400 truncate">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;