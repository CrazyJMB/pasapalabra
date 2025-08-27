<template>
  <div
    class="fixed inset-0 bg-background/40 overflow-y-auto h-full w-full z-50"
  >
    <Card
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mx-auto w-[600px] max-h-[80vh] overflow-y-auto"
    >
      <CardHeader>
        <CardTitle>
          <Circle class="inline w-5 h-5 mr-2" />
          {{ $t("info.title") }}
        </CardTitle>
        <CardAction>
          <Button @click="$emit('close')" variant="ghost" size="icon">✕</Button>
        </CardAction>
      </CardHeader>

      <CardContent class="space-y-6">
        <!-- Resumen general -->
        <div>
          <h3 class="text-lg font-semibold mb-3 text-primary">
            🎯 {{ $t("info.objective") }}
          </h3>
          <p class="text-muted-foreground leading-relaxed">
            {{ $t("info.objective") }}
          </p>
        </div>

        <!-- Flujo del juego -->
        <div>
          <h3 class="text-lg font-semibold mb-3 text-primary">
            🎮 {{ $t("info.gameFlow.title") }}
          </h3>
          <div class="space-y-3">
            <div class="flex items-start space-x-3">
              <div
                class="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center font-bold mt-0.5"
              >
                1
              </div>
              <div>
                <p class="font-medium">{{ $t("info.gameFlow.step1") }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ $t("info.gameFlow.step1") }}
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div
                class="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center font-bold mt-0.5"
              >
                2
              </div>
              <div>
                <p class="font-medium">{{ $t("info.gameFlow.step2") }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ $t("info.gameFlow.step2") }}
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <div
                class="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center font-bold mt-0.5"
              >
                3
              </div>
              <div>
                <p class="font-medium">{{ $t("info.gameFlow.step3") }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ $t("info.gameFlow.step3") }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Estados de letras -->
        <div>
          <h3 class="text-lg font-semibold mb-3 text-primary">
            🔤 {{ $t("info.letterStates.title") }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              class="flex items-center space-x-2 p-3 rounded-lg bg-green-50 border border-green-200"
            >
              <div class="w-4 h-4 rounded-full bg-green-500"></div>
              <span class="text-sm font-medium text-green-800">{{
                $t("info.letterStates.correct")
              }}</span>
            </div>
            <div
              class="flex items-center space-x-2 p-3 rounded-lg bg-red-50 border border-red-200"
            >
              <div class="w-4 h-4 rounded-full bg-red-500"></div>
              <span class="text-sm font-medium text-red-800">{{
                $t("info.letterStates.incorrect")
              }}</span>
            </div>
            <div
              class="flex items-center space-x-2 p-3 rounded-lg bg-blue-50 border border-blue-200"
            >
              <div class="w-4 h-4 rounded-full bg-blue-500"></div>
              <span class="text-sm font-medium text-blue-800">{{
                $t("info.letterStates.pasapalabra")
              }}</span>
            </div>
          </div>
        </div>

        <!-- Características principales -->
        <div>
          <h3 class="text-lg font-semibold mb-3 text-primary">
            ⚡ {{ $t("info.features.title") }}
          </h3>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li class="flex items-center space-x-2">
              <Plus class="w-4 h-4 text-green-500" />
              <span>{{ $t("info.features.sync") }}</span>
            </li>
            <li class="flex items-center space-x-2">
              <Plus class="w-4 h-4 text-green-500" />
              <span>{{ $t("info.features.timer") }}</span>
            </li>
            <li class="flex items-center space-x-2">
              <Plus class="w-4 h-4 text-green-500" />
              <span>{{ $t("info.features.scoring") }}</span>
            </li>
            <li class="flex items-center space-x-2">
              <Plus class="w-4 h-4 text-green-500" />
              <span>{{ $t("info.features.responsive") }}</span>
            </li>
            <li class="flex items-center space-x-2">
              <Plus class="w-4 h-4 text-green-500" />
              <span>{{ $t("info.features.persistence") }}</span>
            </li>
          </ul>
        </div>

        <!-- Consejos de uso -->
        <div>
          <h3 class="text-lg font-semibold mb-3 text-primary">
            💡 {{ $t("info.usage.title") }}
          </h3>
          <div class="space-y-2 text-sm text-muted-foreground">
            <p>
              • <strong>{{ $t("info.usage.streaming") }}</strong>
            </p>
            <p>
              • <strong>{{ $t("info.usage.sync") }}</strong>
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter class="flex justify-end">
        <Button @click="$emit('close')" variant="default">{{
          $t("common.close")
        }}</Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Circle, Plus } from "@iconoir/vue";

defineEmits<{
  close: [];
}>();
</script>

<style scoped lang="scss"></style>
