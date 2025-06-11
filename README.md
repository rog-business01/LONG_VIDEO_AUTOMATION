# Professional Video Automation System

A comprehensive video automation system built with Remotion that generates high-quality quote videos with synchronized captions and TTS narration.

## Features

### Core Functionality
- **JSON-driven Configuration**: Complete video scripts with scene descriptions, timing, and styling
- **Professional Quote Display**: Elegant typography with customizable styling and animations
- **Synchronized Captions**: Perfect audio-text alignment with automated generation
- **TTS Integration**: Natural-sounding voice narration (Kokoro TTS ready)
- **Smooth Animations**: Professional transitions, fades, and micro-interactions
- **High-Quality Backgrounds**: Support for images, gradients, and overlays
- **Broadcast Quality**: Production-ready output with customizable resolution and frame rates

### Technical Specifications
- **Duration**: Configurable (default: 10 minutes)
- **Resolution**: 1920x1080 (4K ready)
- **Frame Rate**: 30 FPS (configurable)
- **Audio**: Synchronized TTS with caption timing
- **Output**: H.264 MP4 with high-quality encoding

## Project Structure

```
src/
├── types/
│   └── video.ts              # TypeScript interfaces for video configuration
├── video/
│   ├── Root.tsx              # Remotion root component
│   ├── VideoComposition.tsx  # Main video composition
│   ├── components/
│   │   ├── SceneComponent.tsx       # Individual scene renderer
│   │   ├── BackgroundComponent.tsx  # Background image/video handler
│   │   ├── QuoteComponent.tsx       # Quote text with animations
│   │   └── CaptionComponent.tsx     # Synchronized captions
│   ├── hooks/
│   │   └── useAnimationValue.ts     # Animation utilities
│   └── utils/
│       ├── ttsUtils.ts              # TTS generation utilities
│       └── scriptProcessor.ts       # Script validation and processing
└── App.tsx                   # Main application interface
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open Remotion Studio:
   ```bash
   npm run remotion:dev
   ```

### Usage

#### 1. Script Configuration
Create a JSON file with your video configuration:

```json
{
  "metadata": {
    "title": "Your Video Title",
    "duration": 600,
    "fps": 30,
    "width": 1920,
    "height": 1080
  },
  "scenes": [
    {
      "id": "scene1",
      "startTime": 0,
      "duration": 120,
      "quote": {
        "text": "Your inspirational quote here",
        "author": "Author Name",
        "attribution": "Additional context"
      },
      "background": {
        "type": "image",
        "source": "https://example.com/background.jpg"
      }
    }
  ]
}
```

#### 2. Upload and Preview
1. Use the "Upload Script" button to load your JSON configuration
2. Preview the video in real-time using the built-in player
3. Adjust settings and styling as needed

#### 3. Render Video
1. Click "Render" to generate the final video
2. Choose output settings (resolution, quality, format)
3. Download the completed video

## Customization

### Styling Options
- **Typography**: Font family, size, weight, color, alignment
- **Animations**: Fade, slide, zoom, typewriter effects with custom easing
- **Backgrounds**: Images, gradients, solid colors with overlays and blur
- **Captions**: Position, styling, timing, and synchronization
- **Colors**: Comprehensive color system with multiple themes

### Animation Types
- `fadeIn` / `fadeOut`: Opacity transitions
- `slideIn` / `slideOut`: Movement with opacity
- `zoom`: Scale animations
- `typewriter`: Character-by-character text reveal
- Custom animations with easing functions

### TTS Configuration
```json
{
  "ttsConfig": {
    "voice": "en-US-Wavenet-D",
    "speed": 0.9,
    "pitch": 0,
    "volume": 0.8,
    "pauseBetweenQuotes": 2
  }
}
```

## Advanced Features

### Automatic Caption Generation
- Text-to-speech synchronization
- Smart text chunking for optimal readability
- Configurable timing based on speech patterns
- Multiple caption styles and positions

### Professional Animations
- Smooth transitions between scenes
- Micro-interactions for enhanced engagement
- Customizable easing functions
- Synchronized audio-visual effects

### Batch Processing
- Process multiple video scripts
- Automated rendering pipeline
- Quality control and validation
- Export in multiple formats

## Development

### Adding New Animation Types
1. Define the animation in `types/video.ts`
2. Implement the animation logic in `useAnimationValue.ts`
3. Add the animation to the relevant component

### Custom TTS Integration
1. Update `ttsUtils.ts` with your TTS service
2. Configure audio file generation
3. Update timing calculations for synchronization

### Extending Background Types
1. Add new background types to the interface
2. Implement rendering logic in `BackgroundComponent.tsx`
3. Add configuration options to the script format

## Performance Optimization

- **Lazy Loading**: Background images and assets
- **Efficient Rendering**: Optimized component updates
- **Memory Management**: Proper cleanup of resources
- **Caching**: Asset caching for faster rendering

## Production Deployment

### Rendering Pipeline
```bash
# Render video with custom settings
npm run remotion:render -- --config=your-config.json

# Batch processing
npm run remotion:render -- --batch=scripts/
```

### Quality Settings
- **CRF**: 18 (high quality) to 28 (smaller file size)
- **Pixel Format**: yuv420p (maximum compatibility)
- **Codec**: H.264 (universal support)

## Troubleshooting

### Common Issues
1. **Audio Sync**: Ensure TTS timing matches caption timing
2. **Memory Usage**: Use appropriate image sizes and formats
3. **Rendering Speed**: Optimize animations and effects
4. **File Sizes**: Balance quality vs. file size requirements

### Debug Mode
Enable debug logging for detailed information:
```bash
DEBUG=remotion* npm run remotion:render
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.