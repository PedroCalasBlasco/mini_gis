<template>
  <div class="scroll-wrapper">
    <v-container class="mt-4">
      <v-card elevation="2" class="pa-6">
        <v-card-title class="text-h5">Features Tabler</v-card-title>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
  .scroll-wrapper {
    height: calc(100vh - 65px);
    overflow-y: auto;
    background-color: #f5f5f5; /* opcional: para diferenciar fondo */
  }
</style>
