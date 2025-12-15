'use client';

import { AsciiResult } from '@/types';

interface ExportButtonsProps {
  result: AsciiResult | null;
  disabled?: boolean;
}

export default function ExportButtons({ result, disabled = false }: ExportButtonsProps) {
  const downloadTxt = () => {
    if (!result) return;

    const blob = new Blob([result.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascii-art-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadHtml = () => {
    if (!result) return;

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ASCII Art</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background: #f9fafb;
      font-family: monospace;
    }
    pre {
      margin: 0;
      padding: 0;
      line-height: 1;
    }
  </style>
</head>
<body>
  ${result.html}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascii-art-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadSvg = () => {
    if (!result) return;

    const blob = new Blob([result.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascii-art-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result.text);
      // You could add a toast notification here
      alert('ASCII art copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  if (!result || disabled) {
    return (
      <div className="w-full p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Generate ASCII art first to export
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Export & Download
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={downloadTxt}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          📄 Download TXT
        </button>
        <button
          onClick={downloadHtml}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          🌐 Download HTML
        </button>
        <button
          onClick={downloadSvg}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          🎨 Download SVG
        </button>
        <button
          onClick={copyToClipboard}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          📋 Copy Text
        </button>
      </div>
    </div>
  );
}

