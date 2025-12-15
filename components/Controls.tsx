'use client';

import { AsciiOptions } from '@/types';
import { characterSets } from '@/lib/characterSets';

interface ControlsProps {
  options: AsciiOptions;
  onOptionsChange: (options: AsciiOptions) => void;
}

export default function Controls({ options, onOptionsChange }: ControlsProps) {
  const updateOption = <K extends keyof AsciiOptions>(
    key: K,
    value: AsciiOptions[K]
  ) => {
    onOptionsChange({ ...options, [key]: value });
  };

  return (
    <div className="w-full space-y-6 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Settings
      </h2>

      {/* Width Slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Width: {options.width} characters
        </label>
        <input
          type="range"
          min="50"
          max="200"
          value={options.width}
          onChange={(e) => updateOption('width', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>50</span>
          <span>200</span>
        </div>
      </div>

      {/* Character Set Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Character Set
        </label>
        <select
          value={characterSets.find((cs) => cs.characters === options.characterSet)?.id || 'medium'}
          onChange={(e) => {
            const selected = characterSets.find((cs) => cs.id === e.target.value);
            if (selected) {
              updateOption('characterSet', selected.characters);
            }
          }}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {characterSets.map((cs) => (
            <option key={cs.id} value={cs.id}>
              {cs.name} ({cs.characters.slice(0, 20)}...)
            </option>
          ))}
        </select>
      </div>

      {/* Color Mode Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Color Mode
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => updateOption('colorMode', 'grayscale')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${options.colorMode === 'grayscale'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            Grayscale
          </button>
          <button
            onClick={() => updateOption('colorMode', 'colored')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${options.colorMode === 'colored'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            Colored
          </button>
        </div>
      </div>

      {/* Contrast Slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Contrast: {options.contrast.toFixed(1)}
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={options.contrast}
          onChange={(e) => updateOption('contrast', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>0.5</span>
          <span>2.0</span>
        </div>
      </div>

      {/* Brightness Slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Brightness: {options.brightness.toFixed(1)}
        </label>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.1"
          value={options.brightness}
          onChange={(e) => updateOption('brightness', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>0.5</span>
          <span>1.5</span>
        </div>
      </div>
    </div>
  );
}

