import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameSettings } from '@/types'
import { StorageManager } from '@/utils/storage'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<GameSettings>({
    timeLimit: 300,
    scoring: {
      correct: 10,
      incorrect: -5,
      pasapalabra: 0
    }
  })

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const storageManager = StorageManager.getInstance()

  const defaultTimeLimit = computed(() => settings.value.timeLimit)
  const scoring = computed(() => settings.value.scoring)

  function updateSettings(newSettings: Partial<GameSettings>): boolean {
    try {
      settings.value = {
        ...settings.value,
        ...newSettings
      }

      saveSettings()
      error.value = null
      return true
    } catch (err) {
      error.value = 'Error updating configuration'
      return false
    }
  }

  function updateScoring(newScoring: Partial<GameSettings['scoring']>): boolean {
    try {
      settings.value.scoring = {
        ...settings.value.scoring,
        ...newScoring
      }

      saveSettings()
      error.value = null
      return true
    } catch (err) {
      error.value = 'Error updating scoring system'
      return false
    }
  }

  function resetToDefaults(): boolean {
    try {
      settings.value = {
        timeLimit: 300,
        scoring: {
          correct: 10,
          incorrect: -5,
          pasapalabra: 0
        }
      }

      saveSettings()
      error.value = null
      return true
    } catch (err) {
      error.value = 'Error restoring default configuration'
      return false
    }
  }

  function saveSettings(): void {
    try {
      storageManager.saveData({ settings: settings.value })
    } catch (err) {
      error.value = 'Error saving configuration'
    }
  }

  function loadSettings(): void {
    try {
      isLoading.value = true
      const data = storageManager.loadData()
      
      if (data.settings) {
        settings.value = {
          ...settings.value,
          ...data.settings
        }
      }
    } catch (err) {
      error.value = 'Error loading configuration'
    } finally {
      isLoading.value = false
    }
  }

  function clearError(): void {
    error.value = null
  }

  return {
    settings,
    isLoading,
    error,
    defaultTimeLimit,
    scoring,
    updateSettings,
    updateScoring,
    resetToDefaults,
    loadSettings,
    clearError
  }
}) 