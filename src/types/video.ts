export interface VideoScript {
  metadata: {
    title: string;
    duration: number;
    fps: number;
    width: number;
    height: number;
    platform?: 'youtube' | 'instagram' | 'tiktok' | 'custom';
    quality?: 'draft' | 'preview' | 'production';
  };
  scenes: Scene[];
  globalStyles: GlobalStyles;
  ttsConfig?: TTSConfig;
  branding?: BrandingConfig;
  exportSettings?: ExportSettings;
}

export interface Scene {
  id: string;
  startTime: number;
  duration: number;
  quote: Quote;
  background: Background;
  animations: Animation[];
  captions: Caption[];
  thumbnail?: ThumbnailConfig;
  audioConfig?: SceneAudioConfig;
}

export interface Quote {
  text: string;
  author: string;
  attribution?: string;
  styling: QuoteStyling;
  ssml?: string; // SSML markup for TTS
  emphasis?: EmphasisConfig[];
}

export interface Background {
  type: 'image' | 'gradient' | 'solid' | 'video';
  source?: string;
  overlay?: {
    color: string;
    opacity: number;
  };
  blur?: number;
  kenBurns?: KenBurnsEffect;
  parallax?: ParallaxConfig;
  colorGrading?: ColorGradingConfig;
}

export interface Animation {
  type: 'fadeIn' | 'fadeOut' | 'slideIn' | 'slideOut' | 'typewriter' | 'zoom' | 'kenBurns' | 'parallax' | 'morphText' | 'particleEffect';
  startTime: number;
  duration: number;
  target: 'quote' | 'author' | 'background' | 'caption';
  easing?: 'ease' | 'easeIn' | 'easeOut' | 'easeInOut' | 'linear' | 'bounce' | 'elastic';
  properties?: Record<string, any>;
  gpu?: boolean; // Enable GPU acceleration
}

export interface Caption {
  text: string;
  startTime: number;
  duration: number;
  styling: CaptionStyling;
  style?: 'netflix' | 'youtube' | 'broadcast' | 'custom';
  wordHighlight?: boolean;
  animations?: CaptionAnimation[];
}

export interface QuoteStyling {
  fontSize: number;
  fontWeight: string;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
  maxWidth: number;
  padding: number;
  background?: {
    color: string;
    opacity: number;
    blur: number;
  };
  textShadow?: TextShadowConfig;
  outline?: TextOutlineConfig;
}

export interface CaptionStyling {
  fontSize: number;
  fontWeight: string;
  color: string;
  backgroundColor: string;
  padding: number;
  borderRadius: number;
  position: 'bottom' | 'top' | 'center';
  margin: number;
  maxWidth: number;
  border?: BorderConfig;
  shadow?: ShadowConfig;
}

export interface GlobalStyles {
  fontFamily: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  transitionDuration: number;
  brandColors?: string[];
}

export interface TTSConfig {
  provider: 'gemini-2.5-flash-preview-tts' | 'google' | 'amazon' | 'elevenlabs';
  voice: string;
  speed: number;
  pitch: number;
  volume: number;
  pauseBetweenQuotes: number;
  ssmlEnabled: boolean;
  emotionalInflection?: 'neutral' | 'excited' | 'calm' | 'dramatic';
  voiceCloning?: {
    enabled: boolean;
    referenceAudio?: string;
  };
}

// New interfaces for enhanced features
export interface KenBurnsEffect {
  enabled: boolean;
  startScale: number;
  endScale: number;
  direction: 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right';
  duration: number;
}

export interface ParallaxConfig {
  enabled: boolean;
  layers: ParallaxLayer[];
}

export interface ParallaxLayer {
  source: string;
  speed: number;
  opacity: number;
  blendMode?: string;
}

export interface ColorGradingConfig {
  brightness: number;
  contrast: number;
  saturation: number;
  temperature: number;
  tint: number;
  vignette?: {
    intensity: number;
    color: string;
  };
}

export interface EmphasisConfig {
  startTime: number;
  duration: number;
  type: 'bold' | 'italic' | 'color' | 'scale' | 'glow';
  intensity: number;
}

export interface ThumbnailConfig {
  variants: ThumbnailVariant[];
  abTestEnabled: boolean;
}

export interface ThumbnailVariant {
  id: string;
  style: 'minimal' | 'bold' | 'elegant' | 'dramatic';
  textOverlay?: string;
  colorScheme: string[];
  layout: 'centered' | 'split' | 'corner';
}

export interface BrandingConfig {
  logo?: {
    source: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    size: number;
    opacity: number;
  };
  watermark?: {
    text: string;
    position: string;
    styling: TextStyling;
  };
  colorPalette: string[];
  fontPalette: string[];
}

export interface ExportSettings {
  platforms: PlatformConfig[];
  quality: QualityConfig;
  optimization: OptimizationConfig;
}

export interface PlatformConfig {
  platform: 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'twitter';
  dimensions: {
    width: number;
    height: number;
  };
  duration?: number;
  bitrate: number;
  format: 'mp4' | 'mov' | 'webm';
}

export interface QualityConfig {
  crf: number;
  preset: 'ultrafast' | 'fast' | 'medium' | 'slow' | 'veryslow';
  pixelFormat: string;
  audioQuality: number;
}

export interface OptimizationConfig {
  gpuAcceleration: boolean;
  multiThreading: boolean;
  memoryOptimization: boolean;
  progressiveRendering: boolean;
  smartCaching: boolean;
}

export interface SceneAudioConfig {
  fadeIn: number;
  fadeOut: number;
  volume: number;
  effects?: AudioEffect[];
}

export interface AudioEffect {
  type: 'reverb' | 'echo' | 'normalize' | 'compressor';
  parameters: Record<string, number>;
}

export interface CaptionAnimation {
  type: 'typewriter' | 'fadeIn' | 'slideUp' | 'bounce' | 'highlight';
  timing: 'word' | 'character' | 'line';
  duration: number;
}

export interface TextShadowConfig {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
}

export interface TextOutlineConfig {
  width: number;
  color: string;
}

export interface BorderConfig {
  width: number;
  color: string;
  style: 'solid' | 'dashed' | 'dotted';
}

export interface ShadowConfig {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
}

export interface TextStyling {
  fontSize: number;
  fontWeight: string;
  color: string;
  fontFamily?: string;
}

// Timeline and Editor interfaces
export interface TimelineItem {
  id: string;
  type: 'scene' | 'audio' | 'caption' | 'effect';
  startTime: number;
  duration: number;
  track: number;
  data: any;
}

export interface EditorState {
  currentTime: number;
  selectedItems: string[];
  zoom: number;
  tracks: Track[];
  playbackState: 'playing' | 'paused' | 'stopped';
}

export interface Track {
  id: string;
  type: 'video' | 'audio' | 'caption' | 'effect';
  name: string;
  items: TimelineItem[];
  muted: boolean;
  locked: boolean;
}

// API interfaces
export interface RenderJob {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  script: VideoScript;
  outputPath?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface WebhookConfig {
  url: string;
  events: string[];
  secret?: string;
}