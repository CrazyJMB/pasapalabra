import { ref, computed, onMounted, onUnmounted, watch, readonly } from 'vue'

interface TimerOptions {
  initialTime: number
  onTick?: (currentTime: number) => void
  onFinish?: () => void
  autoStart?: boolean
}

export function useTimer(options: TimerOptions) {
  const {
    initialTime,
    onTick,
    onFinish,
    autoStart = false
  } = options

  const currentTime = ref(initialTime)
  const isRunning = ref(false)
  const isPaused = ref(false)

  // Countdown base for each execution cycle
  const startTime = ref<number | null>(null)
  const baseRemaining = ref<number>(initialTime)

  let timerInterval: NodeJS.Timeout | null = null
  let lastTickTime = 0

  // Computed properties
  const formattedTime = computed(() => {
    const minutes = Math.floor(currentTime.value / 60)
    const seconds = currentTime.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  const timePercentage = computed(() => {
    return Math.round((currentTime.value / initialTime) * 100)
  })

  const isLowTime = computed(() => {
    return currentTime.value <= 30
  })

  const isCriticalTime = computed(() => {
    return currentTime.value <= 10
  })

  // Timer functions
  function start() {
    if (isRunning.value && !isPaused.value) return
    // Restart cycle from current remaining time
    baseRemaining.value = currentTime.value
    startTime.value = Date.now()
    isRunning.value = true
    isPaused.value = false
    startTimer()
  }

  function pause() {
    if (!isRunning.value || isPaused.value) return
    isPaused.value = true
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  function resume() {
    // Resume equals starting a new cycle from currentTime
    if (!isRunning.value) {
      start()
      return
    }
    if (isPaused.value) {
      start()
    }
  }

  function stop() {
    isRunning.value = false
    isPaused.value = false
    startTime.value = null
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  function reset() {
    stop()
    currentTime.value = initialTime
    baseRemaining.value = initialTime
  }

  function setTime(time: number) {
    currentTime.value = Math.max(0, Math.min(time, initialTime))
    // If not running, also update baseRemaining for next start
    if (!isRunning.value) {
      baseRemaining.value = currentTime.value
    }
  }

  function addTime(seconds: number) {
    setTime(currentTime.value + seconds)
  }

  function subtractTime(seconds: number) {
    setTime(currentTime.value - seconds)
  }

  // Internal timer logic
  function startTimer() {
    if (timerInterval) {
      clearInterval(timerInterval)
    }

    timerInterval = setInterval(() => {
      if (isPaused.value) return

      const now = Date.now()
      const elapsed = Math.floor((now - (startTime.value || 0)) / 1000)

      const newTime = Math.max(0, baseRemaining.value - elapsed)

      if (newTime !== currentTime.value) {
        currentTime.value = newTime

        // Call onTick callback with throttling
        if (onTick && now - lastTickTime >= 100) {
          onTick(currentTime.value)
          lastTickTime = now
        }

        // Check if timer finished
        if (newTime === 0) {
          stop()
          if (onFinish) {
            onFinish()
          }
        }
      }
    }, 100) // Update every 100ms for smooth countdown
  }

  // Watch for changes in initialTime
  watch(() => options.initialTime, (newTime) => {
    if (!isRunning.value) {
      currentTime.value = newTime
      baseRemaining.value = newTime
    }
  })

  // Auto-start if requested
  onMounted(() => {
    if (autoStart) {
      start()
    }
  })

  // Cleanup on unmount
  onUnmounted(() => {
    if (timerInterval) {
      clearInterval(timerInterval)
    }
  })

  return {
    // State
    currentTime: readonly(currentTime),
    isRunning: readonly(isRunning),
    isPaused: readonly(isPaused),

    // Computed
    formattedTime: readonly(formattedTime),
    timePercentage: readonly(timePercentage),
    isLowTime: readonly(isLowTime),
    isCriticalTime: readonly(isCriticalTime),

    // Methods
    start,
    pause,
    resume,
    stop,
    reset,
    setTime,
    addTime,
    subtractTime
  }
} 