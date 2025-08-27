import type { StorageData } from '@/types'

const STORAGE_KEY = 'pasapalabra_data'
const STORAGE_VERSION = '1.0.0'

export class StorageManager {
  private static instance: StorageManager

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager()
    }
    return StorageManager.instance
  }

  private constructor() {}

  saveData(data: Partial<StorageData>): boolean {
    try {
      const existingData = this.loadData()
      const newData: StorageData = {
        version: STORAGE_VERSION,
        games: data.games !== undefined ? data.games : existingData.games,
        settings: data.settings !== undefined ? data.settings : existingData.settings
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
      return true
    } catch (error) {
      return false
    }
  }

  // Specific function to delete a game
  deleteGame(gameId: string): boolean {
    try {
      const existingData = this.loadData()
      if (existingData.games[gameId]) {
        delete existingData.games[gameId]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData))
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  loadData(): StorageData {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        return this.validateAndMigrate(parsed)
      }
    } catch (error) {
      // Silent error handling
    }
    
    return this.getDefaultData()
  }

  private validateAndMigrate(data: any): StorageData {
    try {
      const normalized: StorageData = {
        version: STORAGE_VERSION,
        games: typeof data?.games === 'object' && data.games !== null ? data.games : {},
        settings: {
          timeLimit: 300,
          scoring: {
            correct: 10,
            incorrect: -5,
            pasapalabra: 0
          }
        }
      }

      // Migrate settings if they exist
      if (data?.settings) {
        const s = data.settings
        const timeLimit = (typeof s.timeLimit === 'number')
          ? s.timeLimit
          : (typeof s.defaultTimeLimit === 'number' ? s.defaultTimeLimit : 300)

        normalized.settings.timeLimit = timeLimit

        // Scoring
        if (s.scoring && typeof s.scoring === 'object') {
          normalized.settings.scoring = {
            correct: typeof s.scoring.correct === 'number' ? s.scoring.correct : 10,
            incorrect: typeof s.scoring.incorrect === 'number' ? s.scoring.incorrect : -5,
            pasapalabra: typeof s.scoring.pasapalabra === 'number' ? s.scoring.pasapalabra : 0
          }
        }
      }

      // Ensure no obsolete keys exist (not saved again)
      return normalized
    } catch (e) {
      return this.getDefaultData()
    }
  }

  private getDefaultData(): StorageData {
    return {
      version: STORAGE_VERSION,
      games: {},
      settings: {
        timeLimit: 300,
        scoring: {
          correct: 10,
          incorrect: -5,
          pasapalabra: 0
        }
      }
    }
  }

  clearData(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEY)
      return true
    } catch (error) {
      return false
    }
  }

  exportData(): string {
    const data = this.loadData()
    return JSON.stringify(data, null, 2)
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      if (data.version && data.games !== undefined) {
        return this.saveData(data)
      }
      return false
    } catch (error) {
      return false
    }
  }
} 