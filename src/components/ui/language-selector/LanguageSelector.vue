<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="sm" class="gap-2">
        <Globe class="w-4 h-4" />
        {{ locale === "es-ES" ? "ES" : "EN" }}
        <NavArrowDown class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        @click="setLanguage('es-ES')"
        :class="{ 'bg-accent': locale === 'es-ES' }"
      >
        <Circle class="w-4 h-4 mr-2" />
        Español
      </DropdownMenuItem>
      <DropdownMenuItem
        @click="setLanguage('en-US')"
        :class="{ 'bg-accent': locale === 'en-US' }"
      >
        <Circle class="w-4 h-4 mr-2" />
        English
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, NavArrowDown, Circle } from "@iconoir/vue";

import { useI18n } from "vue-i18n";
const { locale } = useI18n();

function setLanguage(lang: string) {
  locale.value = lang;
}
</script>
