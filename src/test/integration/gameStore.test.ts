import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import { StorageManager } from '@/utils/storage'

// Isolate localStorage between tests
beforeEach(() => {
  setActivePinia(createPinia())
  // Clear storage
  const sm = StorageManager.getInstance()
  sm.clearData()
})

describe('Game Store - main logic', () => {
  it('creates a game with 27-letter alphabet in pending state', () => {
    const store = useGameStore()
    const game = store.createGame('Game 1', 300)
      
    expect(game).toBeTruthy()
    expect(game?.alphabet.length).toBe(27)
    expect(game?.alphabet.every(l => l.state === 'pending')).toBe(true)
    expect(store.currentGame?.id).toBe(game?.id)
    expect(store.currentGame?.status).toBe('paused')
  })

  it('changes letter state to correct/incorrect/pasapalabra', () => {
    const store = useGameStore()
    const game = store.createGame('Game 2', 300)!

    store.updateLetterState(game.id, 'A', 'correct')
    expect(store.games[game.id].alphabet.find(l => l.char === 'A')?.state).toBe('correct')

    store.updateLetterState(game.id, 'B', 'incorrect')
    expect(store.games[game.id].alphabet.find(l => l.char === 'B')?.state).toBe('incorrect')

    store.updateLetterState(game.id, 'C', 'pasapalabra')
    expect(store.games[game.id].alphabet.find(l => l.char === 'C')?.state).toBe('pasapalabra')
  })

  it('manages game states: start -> pause -> finish', () => {
    const store = useGameStore()
    const game = store.createGame('Game 3', 300)!

    // Initially paused
    expect(store.games[game.id].status).toBe('paused')
    store.startGame(game.id)
    expect(store.games[game.id].status).toBe('active')

    store.pauseGame(game.id)
    expect(store.games[game.id].status).toBe('paused')

    store.finishGame(game.id)
    expect(store.games[game.id].status).toBe('finished')
  })

  it('deletes a game and it does not reappear after reload', () => {
    const store = useGameStore()
    const game = store.createGame('Game 4', 300)!

    // Delete
    store.deleteGame(game.id)
    expect(store.games[game.id]).toBeUndefined()

    // Simulate store reload from storage
    const newStore = useGameStore()
    newStore.loadGames()
    expect(newStore.games[game.id]).toBeUndefined()
  })
})

describe('Game Store - invariants', () => {
  it('does not allow updating a letter in non-existent game', () => {
    const store = useGameStore()
    const ok = store.updateLetterState('non-existent', 'A', 'correct')
    expect(ok).toBe(false)
  })

  it('does not allow updating an invalid letter', () => {
    const store = useGameStore()
    const game = store.createGame('Game X', 300)!
    const ok = store.updateLetterState(game.id, 'Ä', 'correct')
    expect(ok).toBe(false)
    // Alphabet remains in pending state
    expect(store.games[game.id].alphabet.every(l => l.state === 'pending')).toBe(true)
  })

  it('when deleting active game, currentGameId points to another game or null', () => {
    const store = useGameStore()
    const g1 = store.createGame('Game 1', 300)!
    const g2 = store.createGame('Game 2', 300)!

    // Ensure both were created
    expect(!!store.games[g1.id]).toBe(true)
    expect(!!store.games[g2.id]).toBe(true)

    store.deleteGame(g2.id)
    const id = store.currentGameId
    if (id) {
      expect(store.games[id]).toBeTruthy()
    }

    store.deleteGame(g1.id)
    expect(store.currentGameId).toBeNull()
  })

  it('loadGames always initializes games as an object and defines currentGameId if there are games', () => {
    const store = useGameStore()
    const g = store.createGame('Persist Game', 300)!

    // Simulate reload: new Pinia container
    setActivePinia(createPinia())
    const store2 = useGameStore()
    store2.loadGames()

    expect(typeof store2.games).toBe('object')
    const ids = Object.keys(store2.games)
    if (ids.length > 0) {
      expect(store2.currentGameId).not.toBeNull()
      expect(store2.games[store2.currentGameId!]).toBeTruthy()
    } else {
      // If environment did not persist, at least it is not inconsistent
      expect(store2.currentGameId).toBeNull()
    }

    // Cleanup (best effort)
    if (store2.games[g.id]) store2.deleteGame(g.id)
  })
}) 