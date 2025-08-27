<template>
  <div
    class="w-full h-full min-h-screen relative bg-transparent flex items-center justify-center"
  >
    <div class="w-full h-full flex items-center justify-center">
      <div
        class="w-full h-full flex items-center justify-center p-2 sm:p-4 lg:p-6 xl:p-8"
      >
        <div
          class="relative w-full max-w-[700px] h-auto aspect-square flex items-center justify-center"
        >
          <div
            v-for="(letter, index) in currentGame?.alphabet || []"
            :key="letter.char"
            class="letter-item absolute w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center text-base sm:text-lg lg:text-xl font-bold cursor-pointer transition-all duration-300 hover:scale-110"
            :class="getLetterClass(letter)"
            :style="getLetterPosition(index)"
          >
            <div class="letter-content relative">
              {{ letter.char }}
            </div>
          </div>

          <div class="timer-circle">
            {{ formatTime(currentTime) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useGameStore } from "@/stores/gameStore";
import type { Letter } from "@/types";
import { SyncManager } from "@/utils/sync";

const gameStore = useGameStore();
const sync = SyncManager.getInstance();

const currentTime = ref(300);
const currentGame = computed(() => gameStore.currentGame);
const isTimerPaused = ref(false); // Only for the timer

function getLetterPosition(index: number) {
  const totalLetters = 27;
  const radius = 330;
  const angle = (index / totalLetters) * 2 * Math.PI - Math.PI / 2;
  const center = 350;
  const x = Math.cos(angle) * radius + center;
  const y = Math.sin(angle) * radius + center;
  return { left: `${x - 32}px`, top: `${y - 32}px` };
}

function getLetterClass(letter: Letter): string {
  const baseClasses =
    "rounded-full border-2 transition-all duration-300 shadow-lg";

  // No more current letter indicator, only colors by state

  switch (letter.state) {
    case "correct":
      return `${baseClasses} bg-green-500 text-white border-white shadow-green-500/50`;
    case "incorrect":
      return `${baseClasses} bg-red-500 text-white border-white shadow-red-500/50`;
    case "pasapalabra":
      return `${baseClasses} bg-blue-500 text-white border-white shadow-blue-500/50`;
    default:
      return `${baseClasses} bg-blue-400 text-white border-white shadow-blue-400/50 hover:bg-blue-300`;
  }
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

let unsubscribes: Array<() => void> = [];

onMounted(() => {
  if (currentGame.value) {
    currentTime.value = currentGame.value.currentTime;
    // No need to find the first pending letter for the indicator
    // Timer doesn't pause automatically
  }
  if (!currentGame.value) gameStore.loadGames();

  unsubscribes.push(
    sync.subscribe("timer_tick", (evt: any) => {
      if (evt?.gameId === currentGame.value?.id) {
        // Only update time if timer is not paused
        if (!isTimerPaused.value) {
          currentTime.value = evt.data.currentTime;
        }
      }
    })
  );
  unsubscribes.push(
    sync.subscribe("game_updated", () => {
      if (currentGame.value?.id) {
        gameStore.loadGames();
        gameStore.setCurrentGame(currentGame.value.id);
        // No need to update current letter index
        // Timer doesn't pause automatically
      }
    })
  );
  unsubscribes.push(
    sync.subscribe("letter_changed", () => {
      if (currentGame.value?.id) {
        gameStore.loadGames();
        gameStore.setCurrentGame(currentGame.value.id);
        // No need to update current letter index
        // Timer doesn't pause automatically
      }
    })
  );
});

// Watch for changes in current game
watch(currentGame, (newGame) => {
  if (newGame) {
    currentTime.value = newGame.currentTime;
    // No need to update current letter index
    // Timer doesn't pause automatically
  }
});

onUnmounted(() => {
  unsubscribes.forEach((u) => u());
  unsubscribes = [];
});
</script>

<style scoped lang="scss">
.letter-item {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

/* Circular timer to the left bottom of the ring (double circle) */
.timer-circle {
  position: absolute;
  width: clamp(80px, 8vw, 120px);
  height: clamp(80px, 8vw, 120px);
  left: -80px;
  bottom: 0;
  border-radius: 9999px;
  border: 4px solid #9ca3af; /* gray-400 - inner ring */
  background: #4b5563; /* gray-600 */
  color: #fff;
  font-weight: 700;
  font-size: clamp(16px, 2vw, 24px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}

.timer-circle::before {
  content: "";
  position: absolute;
  inset: -12px; /* creates outer ring */
  border-radius: 9999px;
  border: 3px solid #d1d5db; /* gray-300 - outer ring */
}
</style>
