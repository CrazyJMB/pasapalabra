import type { GameEvent, EventCallback } from '@/types'

export class SyncManager {
  private static instance: SyncManager
  private listeners: Map<string, EventCallback[]> = new Map()
  private storageKey = 'pasapalabra_sync'

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager()
    }
    return SyncManager.instance
  }

  private constructor() {
    this.setupStorageListener()
  }

  private setupStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === this.storageKey) {
        this.handleStorageChange(event)
      }
    })
  }

  private handleStorageChange(event: StorageEvent): void {
    try {
      if (event.newValue) {
        const gameEvent: GameEvent = JSON.parse(event.newValue)
        this.notifyListeners(gameEvent.type, gameEvent)
      }
    } catch (error) {
      console.error('Error handling storage change:', error)
    }
  }

  subscribe(eventType: string, callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }

    this.listeners.get(eventType)!.push(callback)

    return () => {
      const callbacks = this.listeners.get(eventType)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  private notifyListeners(eventType: string, data: any): void {
    const callbacks = this.listeners.get(eventType)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('Error in sync callback:', error)
        }
      })
    }
  }

  emit(event: GameEvent): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(event))
      this.notifyListeners(event.type, event)
    } catch (error) {
      console.error('Error emitting event:', error)
    }
  }

  emitLetterChanged(gameId: string, letter: string, state: string): void {
    this.emit({
      type: 'letter_changed',
      gameId,
      data: { letter, state },
      timestamp: Date.now()
    })
  }

  emitPlayerAdded(gameId: string, player: any): void {
    this.emit({
      type: 'player_added',
      gameId,
      data: { player },
      timestamp: Date.now()
    })
  }

  emitGameUpdated(gameId: string, updates: any): void {
    this.emit({
      type: 'game_updated',
      gameId,
      data: { updates },
      timestamp: Date.now()
    })
  }

  emitTimerTick(gameId: string, currentTime: number): void {
    this.emit({
      type: 'timer_tick',
      gameId,
      data: { currentTime },
      timestamp: Date.now()
    })
  }

  getLastEvent(): GameEvent | null {
    try {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error getting last event:', error)
      return null
    }
  }

  clearEvents(): void {
    try {
      localStorage.removeItem(this.storageKey)
    } catch (error) {
      console.error('Error clearing events:', error)
    }
  }
} 