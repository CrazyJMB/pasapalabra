<template>
  <div class="alphabet-ring-container">
    <div class="relative w-96 h-96 mx-auto">
      <!-- Center Progress Circle -->
      <div
        class="center-circle absolute inset-0 flex items-center justify-center"
      >
        <div
          class="progress-ring w-32 h-32 bg-black bg-opacity-70 rounded-full flex items-center justify-center border-4 border-yellow-400"
        ></div>
      </div>

      <!-- Alphabet Letters Ring -->
      <div
        v-for="letter in visibleLetters"
        :key="letter.char"
        class="letter-item absolute w-16 h-16 flex items-center justify-center text-xl font-bold cursor-pointer transition-all duration-300 hover:scale-110"
        :class="getLetterClass(letter)"
        :style="getLetterPosition(letter.position)"
        @click="handleLetterClick(letter)"
      >
        <div class="letter-content relative">
          {{ letter.char }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import type { Letter } from "@/types";

interface Props {
  alphabet: Letter[];
  onLetterClick?: (letter: Letter) => void;
}

const props = withDefaults(defineProps<Props>(), {
  onLetterClick: undefined,
});

const isVisible = ref(false);
const animationFrame = ref<number>();

const visibleLetters = computed(() => {
  // Only show letters when component is visible (lazy loading)
  if (!isVisible.value) return [];
  return props.alphabet;
});

// Memoized letter classes to avoid recalculations
const letterClassCache = new Map<string, string>();

function getLetterClass(letter: Letter): string {
  const cacheKey = `${letter.char}-${letter.state}`;

  if (letterClassCache.has(cacheKey)) {
    return letterClassCache.get(cacheKey)!;
  }

  const baseClasses =
    "rounded-full border-2 transition-all duration-300 shadow-lg";
  let classes = "";

  switch (letter.state) {
    case "correct":
      classes = `${baseClasses} bg-green-500 text-white border-green-400 shadow-green-500/50`;
      break;
    case "incorrect":
      classes = `${baseClasses} bg-red-500 text-white border-red-400 shadow-red-500/50`;
      break;
    case "pasapalabra":
      classes = `${baseClasses} bg-blue-500 text-white border-blue-400 shadow-blue-500/50`;
      break;
    default:
      classes = `${baseClasses} bg-gray-600 text-white border-gray-500 shadow-gray-500/50 hover:bg-gray-500`;
  }

  letterClassCache.set(cacheKey, classes);
  return classes;
}

// Memoized position calculations
const positionCache = new Map<number, { left: string; top: string }>();

function getLetterPosition(position: number) {
  if (positionCache.has(position)) {
    return positionCache.get(position)!;
  }

  const totalLetters = 27;
  const radius = 180;
  const angle = (position / totalLetters) * 2 * Math.PI - Math.PI / 2;

  const x = Math.cos(angle) * radius + 256; // 256 = 512/2 (centro del contenedor)
  const y = Math.sin(angle) * radius + 256;

  const pos = {
    left: `${x - 32}px`, // 32 = 64/2 (centro de la letra)
    top: `${y - 32}px`,
  };

  positionCache.set(position, pos);
  return pos;
}

function handleLetterClick(letter: Letter) {
  if (props.onLetterClick) {
    props.onLetterClick(letter);
  }
}

// Intersection Observer for lazy loading
function setupIntersectionObserver() {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true;
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    const container = document.querySelector(".alphabet-ring-container");
    if (container) {
      observer.observe(container);
    }
  } else {
    // Fallback for older browsers
    isVisible.value = true;
  }
}

onMounted(() => {
  setupIntersectionObserver();
});

onUnmounted(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
  }

  // Clear caches
  letterClassCache.clear();
  positionCache.clear();
});
</script>

<style scoped lang="scss">
.alphabet-ring-container {
  will-change: transform;
  contain: layout style paint;
}

.letter-item {
  will-change: transform;
  contain: layout style paint;
}

.progress-ring {
  will-change: transform;
  contain: layout style paint;
}

// Optimized animations
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.letter-item {
  animation: fadeIn 0.3s ease-out;
  animation-fill-mode: both;
}

// Stagger animation for letters
.letter-item:nth-child(1) {
  animation-delay: 0ms;
}
.letter-item:nth-child(2) {
  animation-delay: 20ms;
}
.letter-item:nth-child(3) {
  animation-delay: 40ms;
}
.letter-item:nth-child(4) {
  animation-delay: 60ms;
}
.letter-item:nth-child(5) {
  animation-delay: 80ms;
}
.letter-item:nth-child(6) {
  animation-delay: 100ms;
}
.letter-item:nth-child(7) {
  animation-delay: 120ms;
}
.letter-item:nth-child(8) {
  animation-delay: 140ms;
}
.letter-item:nth-child(9) {
  animation-delay: 160ms;
}
.letter-item:nth-child(10) {
  animation-delay: 180ms;
}
.letter-item:nth-child(11) {
  animation-delay: 200ms;
}
.letter-item:nth-child(12) {
  animation-delay: 220ms;
}
.letter-item:nth-child(13) {
  animation-delay: 240ms;
}
.letter-item:nth-child(14) {
  animation-delay: 260ms;
}
.letter-item:nth-child(15) {
  animation-delay: 280ms;
}
.letter-item:nth-child(16) {
  animation-delay: 300ms;
}
.letter-item:nth-child(17) {
  animation-delay: 320ms;
}
.letter-item:nth-child(18) {
  animation-delay: 340ms;
}
.letter-item:nth-child(19) {
  animation-delay: 360ms;
}
.letter-item:nth-child(20) {
  animation-delay: 380ms;
}
.letter-item:nth-child(21) {
  animation-delay: 400ms;
}
.letter-item:nth-child(22) {
  animation-delay: 420ms;
}
.letter-item:nth-child(23) {
  animation-delay: 440ms;
}
.letter-item:nth-child(24) {
  animation-delay: 460ms;
}
.letter-item:nth-child(25) {
  animation-delay: 480ms;
}
.letter-item:nth-child(26) {
  animation-delay: 500ms;
}
.letter-item:nth-child(27) {
  animation-delay: 520ms;
}

// Responsive optimizations
@media (max-width: 768px) {
  .alphabet-ring-container {
    transform: scale(0.8);
  }
}

@media (max-width: 480px) {
  .alphabet-ring-container {
    transform: scale(0.6);
  }
}
</style>
