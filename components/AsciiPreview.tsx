'use client';

import { useState } from 'react';

interface AsciiPreviewProps {
  asciiText: string;
  asciiHtml: string;
  colorMode: 'grayscale' | 'colored';
  isLoading?: boolean;
}

export default function AsciiPreview({
  asciiText,
  asciiHtml,
  colorMode,
  isLoading = false,
}: AsciiPreviewProps) {
  const [fontSize, setFontSize] = useState(8); // Default 8px

  const handleZoomIn = () => {
    setFontSize((prev) => Math.min(prev + 2, 24));
  };

  const handleZoomOut = () => {
    setFontSize((prev) => Math.max(prev - 2, 4));
  };

  const handleReset = () => {
    setFontSize(8);
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Processing image...</span>
        </div>
      </div>
    );
  }

  if (!asciiText) {
    return (
      <div className="w-full p-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>Upload an image to see ASCII art preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Preview ASCII Art
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Size: {fontSize}px
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                title="Zoom Out"
              >
                −
              </button>
              <button
                onClick={handleReset}
                className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                title="Reset"
              >
                Reset
              </button>
              <button
                onClick={handleZoomIn}
                className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                title="Zoom In"
              >
                +
              </button>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              step="1"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-20 sm:w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              title="Font size slider"
            />
          </div>
        </div>
      </div>
      <div className="p-4 overflow-auto max-h-[600px] bg-gray-50 dark:bg-gray-950">
        {colorMode === 'colored' ? (
          <div
            dangerouslySetInnerHTML={{ __html: asciiHtml }}
            className="font-mono leading-tight whitespace-pre"
            style={{
              fontFamily: 'monospace',
              lineHeight: 1,
              fontSize: `${fontSize}px`
            }}
          />
        ) : (
          <pre
            className="font-mono leading-tight whitespace-pre text-gray-900 dark:text-gray-100"
            style={{ fontSize: `${fontSize}px` }}
          >
            {asciiText}
          </pre>
        )}
      </div>
    </div>
  );
}

