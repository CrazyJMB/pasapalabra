<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-medium">
          <Circle class="inline w-5 h-5 mr-2" />
          {{ $t("game.control.title") }}
        </h2>
        <div class="flex items-center space-x-4">
          <!-- Timer Display -->
          <div class="text-center">
            <div class="text-2xl font-bold">
              {{ formatTime(currentTime) }}
            </div>
            <div class="text-xs text-muted-foreground">
              {{ $t("game.control.timeRemaining") }}
            </div>
          </div>

          <!-- Game Status -->
          <div class="text-center">
            <div
              class="text-sm font-medium"
              :class="getStatusClass(currentGame?.status)"
            >
              {{ getStatusText(currentGame?.status) }}
            </div>
            <div class="text-xs text-muted-foreground">
              {{ $t("game.control.status") }}
            </div>
          </div>
        </div>
      </div>
    </CardHeader>

    <CardContent>
      <div v-if="!currentGame" class="text-center py-8">
        <Gamepad class="text-6xl mb-4 mx-auto text-muted-foreground" />
        <h3 class="text-lg font-medium mb-2">
          {{ $t("game.control.noGameSelected") }}
        </h3>
        <p class="text-muted-foreground">
          {{ $t("game.control.noGameSelectedSubtitle") }}
        </p>
      </div>

      <div v-else class="space-y-6">
        <!-- Layout responsive: ring to the left, panel to the right (below on mobile) -->
        <div
          class="flex flex-col lg:flex-row lg:items-start lg:space-x-8 xl:space-x-12"
        >
          <!-- Alphabet Ring -->
          <div class="flex-1 flex justify-center lg:justify-start w-full">
            <div
              class="relative w-80 h-80 sm:w-96 sm:h-96 mx-auto lg:mx-0 lg:ml-8 xl:ml-16"
            >
              <!-- Alphabet Letters -->
              <div
                v-for="(letter, index) in currentGame.alphabet"
                :key="letter.char"
                class="absolute w-10 h-10 flex items-center justify-center text-base font-bold cursor-pointer transition-all duration-200"
                :class="[
                  getLetterClass(letter),
                  index === currentLetterIndex
                    ? 'ring-2 ring-ring scale-110'
                    : 'hover:scale-110',
                ]"
                :style="getLetterPosition(index)"
                @click="setCurrentIndex(index)"
              >
                {{ letter.char }}
              </div>
            </div>
          </div>

          <!-- Letter Control Panel (right on desktop, below on mobile) -->
          <div class="mt-6 lg:mt-0 lg:w-80 xl:w-96 lg:shrink-0">
            <Separator class="mb-4 lg:hidden" />
            <h3 class="text-lg font-medium mb-4">
              <Circle class="inline w-5 h-5 mr-2" />
              {{ $t("game.control.currentLetter") }}:
              {{ currentLetter?.char || "-" }}
            </h3>

            <div class="space-y-3">
              <Button
                @click="applyState('correct')"
                variant="secondary"
                class="w-full"
              >
                <Check class="inline w-5 h-5 mr-2" />
                {{ $t("game.control.correct") }}
              </Button>

              <Button
                @click="applyState('incorrect')"
                variant="destructive"
                class="w-full"
              >
                <XSquare class="inline w-5 h-5 mr-2" />
                {{ $t("game.control.incorrect") }}
              </Button>

              <Button
                @click="applyState('pasapalabra')"
                variant="default"
                class="w-full"
              >
                <ArrowRight class="inline w-5 h-5 mr-2" />
                {{ $t("game.control.pasapalabra") }}
              </Button>
            </div>

            <div class="mt-4 text-sm text-muted-foreground">
              {{ $t("game.control.nextLetterHelp") }}
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useGameStore } from "@/stores/gameStore";
import type { Letter } from "@/types";
import { useTimer } from "@/composables/useTimer";
import { SyncManager } from "@/utils/sync";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Circle, Gamepad, Check, XSquare, ArrowRight } from "@iconoir/vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const gameStore = useGameStore();
const sync = SyncManager.getInstance();

const currentGame = computed(() => gameStore.currentGame);

// Current letter management and navigation in order
const currentLetterIndex = ref(0);
const currentLetter = computed<Letter | null>(() => {
  if (!currentGame.value) return null;
  return currentGame.value.alphabet[currentLetterIndex.value] || null;
});

function setCurrentIndex(index: number) {
  currentLetterIndex.value = index;
}

function findNextIndex(from: number): number {
  if (!currentGame.value) return from;
  const total = currentGame.value.alphabet.length;

  // First look for the next pending letter in sequential order
  for (let i = 1; i <= total; i++) {
    const idx = (from + i) % total;
    if (currentGame.value.alphabet[idx].state === "pending") {
      return idx;
    }
  }

  // If no pending, look for the next letter in "pasapalabra" state
  for (let i = 1; i <= total; i++) {
    const idx = (from + i) % total;
    if (currentGame.value.alphabet[idx].state === "pasapalabra") {
      return idx;
    }
  }

  // If no pending or pasapalabra, the game has ended
  if (currentGame.value) {
    gameStore.finishGame(currentGame.value.id);
  }

  // Stay in current position
  return from;
}

function advanceToNextLetter() {
  if (!currentGame.value) return;

  // Find the next pending letter from current position
  currentLetterIndex.value = findNextIndex(currentLetterIndex.value);
}

function applyState(state: "correct" | "incorrect" | "pasapalabra") {
  if (!currentGame.value || !currentLetter.value) return;
  gameStore.updateLetterState(
    currentGame.value.id,
    currentLetter.value.char,
    state
  );

  if (state === "pasapalabra") {
    pause();
    gameStore.pauseGame(currentGame.value.id);
    // For pasapalabra, find next pending/pasapalabra letter
    advanceToNextLetter();
  } else {
    // For correct/incorrect, find next pending/pasapalabra letter
    advanceToNextLetter();
  }
}

function getLetterPosition(index: number) {
  const totalLetters = 27;
  const radius = 160; // Back to original radius
  const angle = (index / totalLetters) * 2 * Math.PI - Math.PI / 2;

  // Dynamic center calculation based on container size
  const containerSize = window.innerWidth >= 1024 ? 192 : 160; // lg: 192px, mobile: 160px
  const x = Math.cos(angle) * radius + containerSize;
  const y = Math.sin(angle) * radius + containerSize;

  return {
    left: `${x - 20}px`,
    top: `${y - 20}px`,
  };
}

function getLetterClass(letter: Letter): string {
  const baseClasses = "rounded-full border-2 transition-all duration-200";

  switch (letter.state) {
    case "correct":
      return `${baseClasses} bg-green-100 text-green-800 border-green-300 hover:bg-green-200`;
    case "incorrect":
      return `${baseClasses} bg-red-100 text-red-800 border-red-300 hover:bg-red-200`;
    case "pasapalabra":
      return `${baseClasses} bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200`;
    default:
      return `${baseClasses} bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200`;
  }
}

function getStatusClass(status: string | undefined): string {
  switch (status) {
    case "active":
      return "text-green-600";
    case "paused":
      return "text-yellow-600";
    case "finished":
      return "text-gray-600";
    default:
      return "text-gray-600";
  }
}

function getStatusText(status: string | undefined): string {
  switch (status) {
    case "active":
      return t("game.status.active");
    case "paused":
      return t("game.status.paused");
    case "finished":
      return t("game.status.finished");
    default:
      return "Unknown";
  }
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

const currentTime = ref(300);

const { start, pause, stop, resume, isPaused, isRunning } = useTimer({
  initialTime: currentGame.value?.timeLimit || 300,
  autoStart: false,
  onTick: (t: number) => {
    currentTime.value = t;
    if (currentGame.value) {
      gameStore.updateGame(currentGame.value.id, { currentTime: t });
      sync.emitTimerTick(currentGame.value.id, t);
    }
  },
  onFinish: () => {
    if (currentGame.value) {
      gameStore.finishGame(currentGame.value.id);
    }
  },
}) as any;

function handleGameStatusSync() {
  const g = currentGame.value;
  if (!g) return;
  if (g.status === "active") {
    if (isPaused.value) {
      resume();
    } else if (!isRunning.value) {
      start();
    }
  } else if (g.status === "paused") {
    pause();
  } else if (g.status === "finished") {
    stop();
  }
}

watch(currentGame, (g) => {
  if (g) {
    currentTime.value = g.currentTime;
    // Set current letter to the first pending available
    const firstPending = g.alphabet.findIndex((l) => l.state === "pending");
    if (firstPending >= 0) currentLetterIndex.value = firstPending;
    handleGameStatusSync();
  }
});

onMounted(() => {
  if (currentGame.value) {
    currentTime.value = currentGame.value.currentTime;
    const firstPending = currentGame.value.alphabet.findIndex(
      (l) => l.state === "pending"
    );
    if (firstPending >= 0) currentLetterIndex.value = firstPending;
  }

  // Subscribe to sync events
  const unsubscribes: Array<() => void> = [];

  unsubscribes.push(
    sync.subscribe("game_updated", () => {
      if (currentGame.value?.id) {
        gameStore.setCurrentGame(currentGame.value.id);
        handleGameStatusSync();
      }
    })
  );

  unsubscribes.push(
    sync.subscribe("letter_changed", () => {
      if (currentGame.value?.id) {
        gameStore.setCurrentGame(currentGame.value.id);
      }
    })
  );

  // Cleanup on unmount
  onUnmounted(() => {
    unsubscribes.forEach((u) => u());
  });
});

onUnmounted(() => {
  stop();
});
</script>

<style scoped lang="scss"></style>
