<script setup lang="ts">
import { IconoirProvider } from "@iconoir/vue";
</script>

<template>
  <div>
    <IconoirProvider>
      <router-view />
    </IconoirProvider>
  </div>
</template>

<style scoped lang="scss"></style>
