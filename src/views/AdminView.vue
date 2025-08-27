<template>
  <div class="min-h-screen p-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold">
              <Circle class="inline w-8 h-8 mr-3" />
              {{ $t("admin.title") }}
            </h1>
            <p class="text-muted-foreground mt-2">{{ $t("admin.subtitle") }}</p>
          </div>
          <div class="flex items-center gap-2">
            <LanguageSelector />
            <Button
              @click="showInfoModal = true"
              variant="outline"
              size="sm"
              class="gap-2"
              :title="$t('admin.howItWorks')"
            >
              <Circle class="w-4 h-4" />
              {{ $t("admin.howItWorks") }}
            </Button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{{ $t("admin.games") }}</CardTitle>
              <CardAction>
                <div class="flex items-center space-x-2">
                  <Button
                    @click="showCreateGameModal = true"
                    variant="default"
                    class="gap-2"
                  >
                    <Plus class="w-4 h-4" />
                    {{ $t("admin.newGame") }}
                  </Button>
                </div>
              </CardAction>
            </CardHeader>

            <CardContent>
              <div v-if="isLoading" class="text-center py-8">
                <div
                  class="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto"
                ></div>
                <p class="mt-2 text-muted-foreground">
                  {{ $t("admin.loadingGames") }}
                </p>
              </div>

              <div
                v-else-if="Object.keys(games).length === 0"
                class="text-center py-8"
              >
                <Circle class="text-6xl mb-4 mx-auto text-muted-foreground" />
                <h3 class="text-lg font-medium mb-2">
                  {{ $t("admin.noGames") }}
                </h3>
                <p class="text-muted-foreground">
                  {{ $t("admin.noGamesSubtitle") }}
                </p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="game in Object.values(games)"
                  :key="game.id"
                  class="border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  :class="{ 'ring-2 ring-ring': currentGameId === game.id }"
                  @click="selectGame(game.id)"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <h3 class="text-lg font-medium">
                        {{ game.name }}
                      </h3>
                      <div
                        class="flex items-center mt-2 space-x-4 text-sm text-muted-foreground"
                      >
                        <span class="flex items-center">
                          <Clock class="w-4 h-4 mr-1" />
                          {{ game.timeLimit }}s
                        </span>
                        <span
                          v-if="game.status === 'finished'"
                          class="flex items-center text-primary font-medium"
                        >
                          <Trophy class="w-4 h-4 mr-1" />
                          Score: {{ calculateGameScore(game) }}
                        </span>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <Badge
                        :variant="getStatusBadgeVariant(game.status)"
                        class="text-xs"
                      >
                        {{ getStatusText(game.status) }}
                      </Badge>

                      <Button
                        @click.stop="openVisualizadorFromGame()"
                        variant="outline"
                        size="sm"
                        class="px-3"
                        :title="$t('admin.openVisualizer')"
                      >
                        <Tv class="w-4 h-4" />
                      </Button>

                      <Button
                        @click.stop="deleteGame(game.id)"
                        variant="outline"
                        size="sm"
                        class="px-3"
                      >
                        <Trash class="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div class="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{{ $t("admin.currentGame") }}</CardTitle>
            </CardHeader>

            <CardContent>
              <div v-if="!currentGame" class="text-center py-8">
                <Gamepad class="text-6xl mb-4 mx-auto text-muted-foreground" />
                <h3 class="text-lg font-medium mb-2">
                  {{ $t("admin.noGameSelected") }}
                </h3>
                <p class="text-muted-foreground">
                  {{ $t("admin.noGameSelectedSubtitle") }}
                </p>
              </div>

              <div v-else>
                <h3 class="text-xl font-bold mb-4">
                  {{ currentGame.name }}
                </h3>
                <div class="space-y-3 mb-6">
                  <Button
                    v-if="currentGame.status === 'active'"
                    @click="pauseGame(currentGame.id)"
                    variant="outline"
                    class="w-full"
                  >
                    <Pause class="w-4 h-4 mr-2" />
                    {{ $t("game.actions.pause") }}
                  </Button>
                  <Button
                    v-else-if="currentGame.status === 'paused'"
                    @click="startGame(currentGame.id)"
                    variant="default"
                    class="w-full"
                  >
                    <Play class="w-4 h-4 mr-2" />
                    {{ $t("game.actions.continue") }}
                  </Button>
                  <Button
                    @click="finishGame(currentGame.id)"
                    variant="destructive"
                    class="w-full"
                  >
                    <Square class="w-4 h-4 mr-2" />
                    {{ $t("game.actions.finish") }}
                  </Button>

                  <Button
                    @click="openVisualizador"
                    variant="default"
                    class="w-full gap-2"
                  >
                    <Tv class="w-4 h-4" />
                    {{ $t("game.actions.openVisualizer") }}
                  </Button>
                </div>

                <div class="space-y-3">
                  <div class="flex justify-between text-sm">
                    <span class="text-muted-foreground"
                      >{{ $t("game.info.status") }}:</span
                    >
                    <Badge :variant="getStatusBadgeVariant(currentGame.status)">
                      {{ getStatusText(currentGame.status) }}
                    </Badge>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-muted-foreground"
                      >{{ $t("game.info.time") }}:</span
                    >
                    <span class="font-medium"
                      >{{ currentGame.currentTime }}s</span
                    >
                  </div>
                  <div
                    v-if="currentGame.status === 'finished'"
                    class="flex justify-between text-sm"
                  >
                    <span class="text-muted-foreground"
                      >{{ $t("game.info.finalScore") }}:</span
                    >
                    <span class="font-bold text-lg text-primary">{{
                      calculateGameScore(currentGame)
                    }}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div v-if="currentGame" class="mt-8">
        <GameControlPanel />
      </div>

      <!-- Footer -->
      <footer class="mt-16 pt-8 border-t border-border">
        <div class="text-center text-sm text-muted-foreground">
          <p class="mb-2">
            {{ $t("footer.madeWith") }}
            <a
              href="https://crazyjmb.com"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary hover:underline font-medium"
            >
              CrazyJMB
            </a>
          </p>
          <p>
            {{ $t("footer.bugOrSuggestion") }}
            <a
              href="https://github.com/CrazyJMB/pasapalabra/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary hover:underline font-medium"
            >
              {{ $t("footer.reportOnGitHub") }}
            </a>
          </p>
          <p class="mt-2 text-xs">
            {{ $t("footer.personalProject") }}
          </p>
        </div>
      </footer>
    </div>

    <CreateGameModal
      v-if="showCreateGameModal"
      @close="showCreateGameModal = false"
      @game-created="onGameCreated"
    />

    <InfoModal v-if="showInfoModal" @close="showInfoModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useGameStore } from "@/stores/gameStore";
import type { Game } from "@/types";
import CreateGameModal from "@/components/admin/CreateGameModal.vue";
import GameControlPanel from "@/components/admin/GameControlPanel.vue";
import InfoModal from "@/components/admin/InfoModal.vue";
import LanguageSelector from "@/components/ui/language-selector/LanguageSelector.vue";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Circle,
  Gamepad,
  Clock,
  Tv,
  Trash,
  Plus,
  Play,
  Square,
  Pause,
  Trophy,
} from "@iconoir/vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const gameStore = useGameStore();
const showCreateGameModal = ref(false);
const showInfoModal = ref(false);

const games = computed(() => gameStore.games);
const currentGameId = computed(() => gameStore.currentGameId);
const currentGame = computed(() => gameStore.currentGame);
const isLoading = computed(() => gameStore.isLoading);

function selectGame(gameId: string) {
  gameStore.setCurrentGame(gameId);
}

function deleteGame(gameId: string) {
  if (confirm(t("common.confirm"))) {
    gameStore.deleteGame(gameId);
  }
}

function startGame(gameId: string) {
  gameStore.startGame(gameId);
}
function pauseGame(gameId: string) {
  gameStore.pauseGame(gameId);
}
function finishGame(gameId: string) {
  gameStore.finishGame(gameId);
}

function calculateGameScore(game: Game): number {
  return gameStore.calculateGameScore(game);
}

function getStatusText(status: string): string {
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

function onGameCreated() {
  showCreateGameModal.value = false;
}

function openVisualizador() {
  // Open visualizer in a new tab
  const visualizadorUrl = `${window.location.origin}/visualizador`;
  window.open(visualizadorUrl, "_blank");
}

function openVisualizadorFromGame() {
  // Open visualizer in a new tab for a specific game
  const visualizadorUrl = `${window.location.origin}/visualizador`;
  window.open(visualizadorUrl, "_blank");
}

function getStatusBadgeVariant(
  status: string
): "default" | "secondary" | "outline" {
  switch (status) {
    case "active":
      return "default";
    case "paused":
      return "secondary";
    case "finished":
      return "outline";
    default:
      return "outline";
  }
}

onMounted(() => {
  gameStore.loadGames();
});
</script>

<style scoped lang="scss"></style>
