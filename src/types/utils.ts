export interface StorageData {
  version: string
  games: Record<string, any>
  settings: any
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export type EventCallback<T = any> = (data: T) => void

export interface GameEvent {
  type: 'letter_changed' | 'player_added' | 'game_updated' | 'timer_tick'
  gameId: string
  data: any
  timestamp: number
} 