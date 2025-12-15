export interface AsciiOptions {
  width: number;
  characterSet: string;
  colorMode: 'grayscale' | 'colored';
  contrast: number;
  brightness: number;
}

export interface AsciiResult {
  text: string;
  html: string;
  svg: string;
}

export interface CharacterSet {
  id: string;
  name: string;
  characters: string;
}

