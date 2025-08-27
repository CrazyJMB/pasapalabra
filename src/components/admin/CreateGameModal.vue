<template>
  <div
    class="fixed inset-0 bg-background/40 overflow-y-auto h-full w-full z-50"
  >
    <Card
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mx-auto w-96"
    >
      <CardHeader>
        <CardTitle>
          <Gamepad class="inline w-5 h-5 mr-2" />
          {{ $t("modal.createGame.title") }}
        </CardTitle>
        <CardAction>
          <Button @click="$emit('close')" variant="ghost" size="icon">✕</Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="createGame" class="space-y-4">
          <div>
            <label for="gameName" class="block text-sm font-medium mb-1">
              {{ $t("modal.createGame.name") }}
            </label>
            <Input
              id="gameName"
              v-model="gameName"
              type="text"
              :placeholder="$t('modal.createGame.namePlaceholder')"
            />
            <p v-if="nameError" class="mt-1 text-sm text-destructive">
              {{ nameError }}
            </p>
          </div>

          <div>
            <label for="timeLimit" class="block text-sm font-medium mb-1">
              {{ $t("modal.createGame.timeLimit") }}
            </label>
            <Input
              id="timeLimit"
              v-model.number="timeLimit"
              type="number"
              min="60"
              max="3600"
              :placeholder="$t('modal.createGame.timeLimitPlaceholder')"
            />
            <p v-if="timeError" class="mt-1 text-sm text-destructive">
              {{ timeError }}
            </p>
            <p class="mt-1 text-xs text-muted-foreground">
              {{ $t("modal.createGame.timeLimitHelp") }}
            </p>
          </div>

          <div class="border-t pt-4">
            <h4 class="text-sm font-medium mb-3">
              {{ $t("modal.createGame.scoringSystem") }}
            </h4>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-xs text-muted-foreground mb-1">{{
                  $t("modal.createGame.correct")
                }}</label>
                <Input v-model.number="scoring.correct" type="number" />
              </div>
              <div>
                <label class="block text-xs text-muted-foreground mb-1">{{
                  $t("modal.createGame.incorrect")
                }}</label>
                <Input v-model.number="scoring.incorrect" type="number" />
              </div>
              <div>
                <label class="block text-xs text-muted-foreground mb-1">{{
                  $t("modal.createGame.pasapalabra")
                }}</label>
                <Input v-model.number="scoring.pasapalabra" type="number" />
              </div>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter>
        <div class="flex justify-end space-x-3 w-full">
          <Button @click="$emit('close')" variant="outline">{{
            $t("common.cancel")
          }}</Button>
          <Button @click="createGame" :disabled="!isValid || isSubmitting">
            {{
              isSubmitting
                ? $t("modal.createGame.creating")
                : $t("modal.createGame.create")
            }}
          </Button>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useGameStore } from "@/stores/gameStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { validateGameName, validateTimeLimit } from "@/utils/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";

import { Gamepad } from "@iconoir/vue";

const emit = defineEmits<{
  close: [];
  "game-created": [];
}>();

const gameStore = useGameStore();
const settingsStore = useSettingsStore();

const gameName = ref("");
const timeLimit = ref(300);
const scoring = ref({
  correct: 10,
  incorrect: -5,
  pasapalabra: 0,
});

const isSubmitting = ref(false);
const nameError = ref("");
const timeError = ref("");

const isValid = computed(() => {
  return (
    gameName.value.trim().length > 0 &&
    timeLimit.value >= 60 &&
    timeLimit.value <= 3600
  );
});

async function createGame() {
  if (!isValid.value) {
    validateForm();
    return;
  }

  isSubmitting.value = true;
  nameError.value = "";
  timeError.value = "";

  try {
    const game = gameStore.createGame(gameName.value.trim(), timeLimit.value);

    if (game) {
      await settingsStore.updateSettings({
        timeLimit: timeLimit.value,
        scoring: scoring.value,
      });

      emit("game-created");
      resetForm();
    }
  } catch (error) {
    // Silent error handling
  } finally {
    isSubmitting.value = false;
  }
}

function validateForm() {
  const nameValidation = validateGameName(gameName.value);
  const timeValidation = validateTimeLimit(timeLimit.value);

  nameError.value = nameValidation.errors.join(", ") || "";
  timeError.value = timeValidation.errors.join(", ") || "";
}

function resetForm() {
  gameName.value = "";
  timeLimit.value = 300;
  scoring.value = {
    correct: 10,
    incorrect: -5,
    pasapalabra: 0,
  };
  nameError.value = "";
  timeError.value = "";
}
</script>

<style scoped lang="scss">
// Specific styles if needed
</style>
