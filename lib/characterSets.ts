import { CharacterSet } from '@/types';

export const characterSets: CharacterSet[] = [
  {
    id: 'dense',
    name: 'Dense',
    characters: '@%#*+=-:. ',
  },
  {
    id: 'medium',
    name: 'Medium',
    characters: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^\'`',
  },
  {
    id: 'sparse',
    name: 'Sparse',
    characters: ' .:-=+*#%@',
  },
  {
    id: 'blocks',
    name: 'Blocks',
    characters: '█▓▒░ ',
  },
  {
    id: 'simple',
    name: 'Simple',
    characters: '.# ',
  },
];

export function getCharacterSet(id: string): CharacterSet | undefined {
  return characterSets.find((set) => set.id === id);
}

export function getDefaultCharacterSet(): CharacterSet {
  return characterSets[1]; // Medium
}

