import { ThumbnailConfig, ThumbnailVariant, Scene } from '../types/video';
import { fabric } from 'fabric';

export class ThumbnailService {
  async generateThumbnails(scene: Scene, config: ThumbnailConfig): Promise<string[]> {
    const thumbnails: string[] = [];
    
    for (const variant of config.variants) {
      try {
        const thumbnailPath = await this.generateThumbnailVariant(scene, variant);
        thumbnails.push(thumbnailPath);
      } catch (error) {
        console.error('Error generating thumbnail variant:', variant.id, error);
      }
    }
    
    return thumbnails;
  }

  private async generateThumbnailVariant(scene: Scene, variant: ThumbnailVariant): Promise<string> {
    const canvas = new fabric.Canvas(null, {
      width: 1280,
      height: 720,
    });

    // Add background
    if (scene.background.source) {
      const backgroundImage = await this.loadImage(scene.background.source);
      canvas.setBackgroundImage(backgroundImage, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width! / backgroundImage.width!,
        scaleY: canvas.height! / backgroundImage.height!,
      });
    }

    // Apply color grading based on variant
    await this.applyColorScheme(canvas, variant.colorScheme);

    // Add text overlay
    if (variant.textOverlay) {
      await this.addTextOverlay(canvas, variant.textOverlay, variant);
    } else {
      // Use quote text
      await this.addQuoteText(canvas, scene.quote, variant);
    }

    // Add visual elements based on style
    await this.addStyleElements(canvas, variant);

    // Export thumbnail
    const thumbnailData = canvas.toDataURL({
      format: 'jpeg',
      quality: 0.9,
      multiplier: 1,
    });

    const thumbnailPath = `/tmp/thumbnail_${variant.id}_${Date.now()}.jpg`;
    
    // In a real implementation, save the thumbnail data to file
    // For now, return the path
    return thumbnailPath;
  }

  private async loadImage(src: string): Promise<fabric.Image> {
    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(src, (img) => {
        if (img) {
          resolve(img);
        } else {
          reject(new Error('Failed to load image'));
        }
      });
    });
  }

  private async applyColorScheme(canvas: fabric.Canvas, colorScheme: string[]): Promise<void> {
    // Apply color overlay based on scheme
    const overlay = new fabric.Rect({
      left: 0,
      top: 0,
      width: canvas.width,
      height: canvas.height,
      fill: colorScheme[0] || '#000000',
      opacity: 0.3,
    });
    
    canvas.add(overlay);
  }

  private async addTextOverlay(canvas: fabric.Canvas, text: string, variant: ThumbnailVariant): Promise<void> {
    const textStyle = this.getTextStyleForVariant(variant);
    
    const textObject = new fabric.Text(text, {
      ...textStyle,
      ...this.getTextPositionForLayout(variant.layout, canvas),
    });
    
    canvas.add(textObject);
  }

  private async addQuoteText(canvas: fabric.Canvas, quote: any, variant: ThumbnailVariant): Promise<void> {
    const maxLength = 60; // Maximum characters for thumbnail
    const displayText = quote.text.length > maxLength 
      ? quote.text.substring(0, maxLength) + '...'
      : quote.text;
    
    await this.addTextOverlay(canvas, `"${displayText}"`, variant);
    
    // Add author text
    const authorStyle = this.getAuthorStyleForVariant(variant);
    const authorText = new fabric.Text(`— ${quote.author}`, {
      ...authorStyle,
      ...this.getAuthorPositionForLayout(variant.layout, canvas),
    });
    
    canvas.add(authorText);
  }

  private async addStyleElements(canvas: fabric.Canvas, variant: ThumbnailVariant): Promise<void> {
    switch (variant.style) {
      case 'minimal':
        // Add subtle geometric shapes
        await this.addMinimalElements(canvas, variant.colorScheme);
        break;
      
      case 'bold':
        // Add bold graphic elements
        await this.addBoldElements(canvas, variant.colorScheme);
        break;
      
      case 'elegant':
        // Add elegant decorative elements
        await this.addElegantElements(canvas, variant.colorScheme);
        break;
      
      case 'dramatic':
        // Add dramatic lighting effects
        await this.addDramaticElements(canvas, variant.colorScheme);
        break;
    }
  }

  private getTextStyleForVariant(variant: ThumbnailVariant): any {
    const baseStyle = {
      fontFamily: 'Inter, Arial, sans-serif',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
    };

    switch (variant.style) {
      case 'minimal':
        return {
          ...baseStyle,
          fontSize: 48,
          fontWeight: '300',
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 1,
        };
      
      case 'bold':
        return {
          ...baseStyle,
          fontSize: 56,
          fontWeight: '900',
          fill: variant.colorScheme[1] || '#ffffff',
          stroke: '#000000',
          strokeWidth: 3,
          shadow: 'rgba(0,0,0,0.8) 4px 4px 8px',
        };
      
      case 'elegant':
        return {
          ...baseStyle,
          fontSize: 44,
          fontWeight: '400',
          fill: '#ffffff',
          fontFamily: 'Georgia, serif',
          shadow: 'rgba(0,0,0,0.5) 2px 2px 4px',
        };
      
      case 'dramatic':
        return {
          ...baseStyle,
          fontSize: 52,
          fontWeight: '700',
          fill: '#ffffff',
          stroke: variant.colorScheme[0] || '#ff0000',
          strokeWidth: 2,
          shadow: 'rgba(255,0,0,0.8) 0px 0px 20px',
        };
      
      default:
        return baseStyle;
    }
  }

  private getAuthorStyleForVariant(variant: ThumbnailVariant): any {
    const textStyle = this.getTextStyleForVariant(variant);
    return {
      ...textStyle,
      fontSize: textStyle.fontSize * 0.6,
      fontWeight: '400',
      opacity: 0.9,
    };
  }

  private getTextPositionForLayout(layout: string, canvas: fabric.Canvas): any {
    const centerX = canvas.width! / 2;
    const centerY = canvas.height! / 2;

    switch (layout) {
      case 'centered':
        return { left: centerX, top: centerY };
      
      case 'split':
        return { left: centerX, top: centerY - 50 };
      
      case 'corner':
        return { left: centerX, top: centerY + 100 };
      
      default:
        return { left: centerX, top: centerY };
    }
  }

  private getAuthorPositionForLayout(layout: string, canvas: fabric.Canvas): any {
    const centerX = canvas.width! / 2;
    const centerY = canvas.height! / 2;

    switch (layout) {
      case 'centered':
        return { left: centerX, top: centerY + 80 };
      
      case 'split':
        return { left: centerX, top: centerY + 50 };
      
      case 'corner':
        return { left: centerX, top: centerY + 180 };
      
      default:
        return { left: centerX, top: centerY + 80 };
    }
  }

  private async addMinimalElements(canvas: fabric.Canvas, colorScheme: string[]): Promise<void> {
    // Add subtle line elements
    const line1 = new fabric.Line([100, 100, 300, 100], {
      stroke: colorScheme[1] || '#ffffff',
      strokeWidth: 2,
      opacity: 0.6,
    });
    
    const line2 = new fabric.Line([canvas.width! - 300, canvas.height! - 100, canvas.width! - 100, canvas.height! - 100], {
      stroke: colorScheme[1] || '#ffffff',
      strokeWidth: 2,
      opacity: 0.6,
    });
    
    canvas.add(line1, line2);
  }

  private async addBoldElements(canvas: fabric.Canvas, colorScheme: string[]): Promise<void> {
    // Add bold geometric shapes
    const circle = new fabric.Circle({
      left: 50,
      top: 50,
      radius: 30,
      fill: colorScheme[1] || '#ff0000',
      opacity: 0.8,
    });
    
    const triangle = new fabric.Triangle({
      left: canvas.width! - 100,
      top: canvas.height! - 100,
      width: 60,
      height: 60,
      fill: colorScheme[2] || '#00ff00',
      opacity: 0.8,
    });
    
    canvas.add(circle, triangle);
  }

  private async addElegantElements(canvas: fabric.Canvas, colorScheme: string[]): Promise<void> {
    // Add elegant decorative elements
    const rect = new fabric.Rect({
      left: canvas.width! / 2 - 200,
      top: 50,
      width: 400,
      height: 2,
      fill: colorScheme[1] || '#ffffff',
      opacity: 0.7,
    });
    
    canvas.add(rect);
  }

  private async addDramaticElements(canvas: fabric.Canvas, colorScheme: string[]): Promise<void> {
    // Add dramatic lighting effects
    const gradient = new fabric.Gradient({
      type: 'radial',
      coords: {
        x1: canvas.width! / 2,
        y1: canvas.height! / 2,
        x2: canvas.width! / 2,
        y2: canvas.height! / 2,
        r1: 0,
        r2: canvas.width! / 2,
      },
      colorStops: [
        { offset: 0, color: 'rgba(255,255,255,0.3)' },
        { offset: 1, color: 'rgba(0,0,0,0.8)' },
      ],
    });
    
    const overlay = new fabric.Rect({
      left: 0,
      top: 0,
      width: canvas.width,
      height: canvas.height,
      fill: gradient,
    });
    
    canvas.add(overlay);
  }

  async generateABTestVariants(scene: Scene, baseConfig: ThumbnailConfig): Promise<ThumbnailConfig> {
    const variants: ThumbnailVariant[] = [];
    
    // Generate different style variants
    const styles: Array<'minimal' | 'bold' | 'elegant' | 'dramatic'> = ['minimal', 'bold', 'elegant', 'dramatic'];
    const layouts: Array<'centered' | 'split' | 'corner'> = ['centered', 'split', 'corner'];
    
    let variantId = 1;
    
    for (const style of styles) {
      for (const layout of layouts) {
        variants.push({
          id: `variant_${variantId++}`,
          style,
          layout,
          colorScheme: this.generateColorScheme(style),
          textOverlay: this.generateTextOverlay(scene.quote, style),
        });
      }
    }
    
    return {
      variants: variants.slice(0, 6), // Limit to 6 variants for A/B testing
      abTestEnabled: true,
    };
  }

  private generateColorScheme(style: string): string[] {
    switch (style) {
      case 'minimal':
        return ['#000000', '#ffffff', '#cccccc'];
      case 'bold':
        return ['#ff0000', '#ffffff', '#ffff00'];
      case 'elegant':
        return ['#2c3e50', '#ecf0f1', '#3498db'];
      case 'dramatic':
        return ['#8b0000', '#ffffff', '#ffd700'];
      default:
        return ['#000000', '#ffffff', '#cccccc'];
    }
  }

  private generateTextOverlay(quote: any, style: string): string {
    const maxLength = style === 'minimal' ? 40 : 60;
    return quote.text.length > maxLength 
      ? quote.text.substring(0, maxLength) + '...'
      : quote.text;
  }
}