import { AsciiOptions, AsciiResult } from '@/types';

export async function convertImageToAscii(
  imageUrl: string,
  options: AsciiOptions
): Promise<AsciiResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Calculate dimensions
        const aspectRatio = img.height / img.width;
        const width = options.width;
        const height = Math.floor(width * aspectRatio * 0.5); // 0.5 because characters are taller than they are wide

        canvas.width = width;
        canvas.height = height;

        // Draw image to canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Get image data
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Convert to ASCII
        const chars = options.characterSet;
        const charCount = chars.length;
        const lines: string[] = [];
        const htmlLines: string[] = [];
        const svgLines: string[] = [];

        for (let y = 0; y < height; y++) {
          let line = '';
          let htmlLine = '';
          let svgLine = '';

          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];

            if (a < 128) {
              // Transparent pixel
              line += ' ';
              htmlLine += '&nbsp;';
              svgLine += ' ';
              continue;
            }

            // Calculate brightness
            let brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

            // Apply brightness and contrast adjustments
            brightness = Math.max(0, Math.min(1, brightness + (options.brightness - 1)));
            brightness = Math.max(0, Math.min(1, (brightness - 0.5) * options.contrast + 0.5));

            // Map brightness to character
            const charIndex = Math.floor((1 - brightness) * (charCount - 1));
            const char = chars[charIndex] || ' ';

            if (options.colorMode === 'colored') {
              // Colored mode - preserve RGB
              const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
              htmlLine += `<span style="color: ${hex}">${char === ' ' ? '&nbsp;' : char}</span>`;
              svgLine += char;
              // Store color info for SVG (we'll handle this differently)
            } else {
              // Grayscale mode
              line += char;
              htmlLine += char === ' ' ? '&nbsp;' : char;
              svgLine += char;
            }
          }

          lines.push(line);
          htmlLines.push(htmlLine);
          // For SVG, we'll use text element per line
          const escapedLine = svgLine.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          svgLines.push(`<text x="0" y="${(y + 1) * 12}" font-family="monospace" font-size="10" fill="${options.colorMode === 'colored' ? 'currentColor' : '#000'}">${escapedLine}</text>`);
        }

        const text = lines.join('\n');
        const html = `<pre style="font-family: monospace; line-height: 1; margin: 0; padding: 0;">${htmlLines.join('<br>')}</pre>`;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width * 6} ${height * 12}" style="font-family: monospace; font-size: 10px;">${svgLines.join('')}</svg>`;

        resolve({ text, html, svg });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}

