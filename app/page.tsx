'use client';

import { useState, useCallback, useEffect } from 'react';
import ImageUploader from '@/components/ImageUploader';
import AsciiPreview from '@/components/AsciiPreview';
import Controls from '@/components/Controls';
import ExportButtons from '@/components/ExportButtons';
import { convertImageToAscii } from '@/lib/asciiConverter';
import { AsciiOptions, AsciiResult } from '@/types';
import { getDefaultCharacterSet } from '@/lib/characterSets';

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [asciiResult, setAsciiResult] = useState<AsciiResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const defaultCharSet = getDefaultCharacterSet();
  const [options, setOptions] = useState<AsciiOptions>({
    width: 100,
    characterSet: defaultCharSet.characters,
    colorMode: 'grayscale',
    contrast: 1.0,
    brightness: 1.0,
  });

  const generateAscii = useCallback(async () => {
    if (!imageUrl) {
      setError('Please upload an image first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await convertImageToAscii(imageUrl, options);
      setAsciiResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
      setAsciiResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [imageUrl, options]);

  // Auto-generate when image or options change (with debounce)
  useEffect(() => {
    if (!imageUrl) {
      setAsciiResult(null);
      return;
    }

    const timer = setTimeout(() => {
      generateAscii();
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [imageUrl, options, generateAscii]);

  // Keyboard shortcut: Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && asciiResult) {
        e.preventDefault();
        // Trigger download TXT
        const blob = new Blob([asciiResult.text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ascii-art-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [asciiResult]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            ASCII Art Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Convert images to ASCII art with customizable settings
          </p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Upload & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Upload Image
              </h2>
              <ImageUploader onImageLoad={setImageUrl} />
            </div>

            <Controls options={options} onOptionsChange={setOptions} />

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <ExportButtons result={asciiResult} disabled={isLoading || !asciiResult} />
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-2">
            <AsciiPreview
              asciiText={asciiResult?.text || ''}
              asciiHtml={asciiResult?.html || ''}
              colorMode={options.colorMode}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Built with Next.js • Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded">Ctrl+S</kbd> to save
          </p>
        </footer>
      </div>
    </div>
  );
}
