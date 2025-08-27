export type LetterState = 'pending' | 'correct' | 'incorrect' | 'pasapalabra'

export interface Letter {
  char: string
  state: LetterState
  position: number
}

export interface Game {
  id: string
  name: string
  playerName?: string
  status: 'active' | 'paused' | 'finished'
  timeLimit: number
  currentTime: number
  alphabet: Letter[]
  createdAt: Date
  updatedAt: Date
}

export interface GameSettings {
  timeLimit: number
  scoring: {
    correct: number
    incorrect: number
    pasapalabra: number
  }
} 