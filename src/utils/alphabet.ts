import type { Letter, LetterState } from '@/types'

export const SPANISH_ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
]

export function createAlphabet(): Letter[] {
  return SPANISH_ALPHABET.map((char, index) => ({
    char,
    state: 'pending' as LetterState,
    position: index
  }))
}

export function getLetterPosition(char: string): number {
  return SPANISH_ALPHABET.indexOf(char.toUpperCase())
}

export function isValidLetter(char: string): boolean {
  return SPANISH_ALPHABET.includes(char.toUpperCase())
}

export function getLetterStateColor(state: LetterState): string {
  switch (state) {
    case 'correct':
      return 'text-green-600 bg-green-100 border-green-300'
    case 'incorrect':
      return 'text-red-600 bg-red-100 border-red-300'
    case 'pasapalabra':
      return 'text-blue-600 bg-blue-100 border-blue-300'
    default:
      return 'text-gray-600 bg-gray-100 border-gray-300'
  }
}

export function calculateScore(letters: Record<string, LetterState>): number {
  let score = 0
  
  Object.values(letters).forEach(state => {
    switch (state) {
      case 'correct':
        score += 10
        break
      case 'incorrect':
        score -= 5
        break
      case 'pasapalabra':
        score += 0
        break
    }
  })
  
  return score
} 