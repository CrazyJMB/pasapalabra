import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Game } from '@/types'
import { StorageManager } from '@/utils/storage'
import { createAlphabet } from '@/utils/alphabet'
import { validateGameName, validateTimeLimit } from '@/utils/validation'
import { SyncManager } from '@/utils/sync'
import { useSettingsStore } from './settingsStore'

export const useGameStore = defineStore('game', () => {
  const games = ref<Record<string, Game>>({})
  const currentGameId = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const storageManager = StorageManager.getInstance()
  const sync = SyncManager.getInstance()

  const currentGame = computed(() => 
    currentGameId.value ? games.value[currentGameId.value] : null
  )

  const activeGames = computed(() => 
    Object.values(games.value).filter(game => game.status === 'active')
  )

  function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  function createGame(name: string, timeLimit: number = 300): Game | null {
    const nameValidation = validateGameName(name)
    const timeValidation = validateTimeLimit(timeLimit)

    if (!nameValidation.isValid || !timeValidation.isValid) {
      error.value = [...nameValidation.errors, ...timeValidation.errors].join(', ')
      return null
    }

    const game: Game = {
      id: generateId(),
      name: name.trim(),
      status: 'paused',
      timeLimit,
      currentTime: timeLimit,
      alphabet: createAlphabet(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    games.value[game.id] = game
    currentGameId.value = game.id
    saveGames()
    error.value = null

    return game
  }

  function updateGame(gameId: string, updates: Partial<Game>): boolean {
    const game = games.value[gameId]
    if (!game) {
      error.value = 'Game not found'
      return false
    }

    games.value[gameId] = {
      ...game,
      ...updates,
      updatedAt: new Date()
    }

    saveGames()
    // Emit sync between tabs
    sync.emitGameUpdated(gameId, updates)
    return true
  }

  function deleteGame(gameId: string): boolean {
    if (!games.value[gameId]) {
      error.value = 'Game not found'
      return false
    }

    // Remove from local state
    delete games.value[gameId]

    if (currentGameId.value === gameId) {
      currentGameId.value = Object.keys(games.value)[0] || null
    }

    // Persist updated state in storage
    try {
      storageManager.saveData({ games: games.value })
      error.value = null
      return true
    } catch (e) {
      error.value = 'Error deleting game from storage'
      return false
    }
  }

  function setCurrentGame(gameId: string): boolean {
    if (!games.value[gameId]) {
      error.value = 'Game not found'
      return false
    }

    currentGameId.value = gameId
    return true
  }

  function updateLetterState(gameId: string, letter: string, state: 'correct' | 'incorrect' | 'pasapalabra'): boolean {
    const game = games.value[gameId]
    if (!game) {
      error.value = 'Game not found'
      return false
    }

    const letterIndex = game.alphabet.findIndex(l => l.char === letter.toUpperCase())
    if (letterIndex === -1) {
      error.value = 'Invalid letter'
      return false
    }

    game.alphabet[letterIndex].state = state
    game.updatedAt = new Date()

    // Save and emit
    saveGames()
    sync.emitLetterChanged(gameId, letter, state)
    return true
  }

  function startGame(gameId: string): boolean {
    return updateGame(gameId, { status: 'active' })
  }

  function pauseGame(gameId: string): boolean {
    return updateGame(gameId, { status: 'paused' })
  }

  function finishGame(gameId: string): boolean {
    return updateGame(gameId, { status: 'finished' })
  }

  function calculateGameScore(game: Game): number {
    const { scoring } = useSettingsStore()
    let totalScore = 0
    
    game.alphabet.forEach(letter => {
      switch (letter.state) {
        case 'correct':
          totalScore += scoring.correct
          break
        case 'incorrect':
          totalScore += scoring.incorrect
          break
        case 'pasapalabra':
          totalScore += scoring.pasapalabra
          break
        default:
          // pending letters don't add points
          break
      }
    })
    
    return totalScore
  }



  function saveGames(): void {
    try {
      storageManager.saveData({ games: games.value })
    } catch (err) {
      error.value = 'Error saving data'
    }
  }

  function loadGames(): void {
    try {
      isLoading.value = true
      const data = storageManager.loadData()
      games.value = data.games || {}
      
      if (Object.keys(games.value).length > 0 && !currentGameId.value) {
        currentGameId.value = Object.keys(games.value)[0]
      }
    } catch (err) {
      error.value = 'Error loading data'
    } finally {
      isLoading.value = false
    }
  }

  function clearError(): void {
    error.value = null
  }

  return {
    games,
    currentGameId,
    currentGame,
    activeGames,
    isLoading,
    error,
    createGame,
    updateGame,
    deleteGame,
    setCurrentGame,
    updateLetterState,
    startGame,
    pauseGame,
    finishGame,
    calculateGameScore,

    loadGames,
    clearError
  }
}) 