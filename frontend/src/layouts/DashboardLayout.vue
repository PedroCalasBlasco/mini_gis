<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Mini GIS</v-toolbar-title>
      <AvatarMenu />
    </v-app-bar>

    <v-main>
      <transition name="slide-fade" mode="out-in">
        <router-view />
      </transition>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import AvatarMenu from '@/components/basics/AvatarMenu/AvatarMenu.vue'
</script>

<style scoped>
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.4s ease;
  }
  .slide-fade-enter-from {
    opacity: 0;
    transform: translateX(100%);
  }
  .slide-fade-leave-to {
    opacity: 0;
    transform: translateX(-50%);
  }
</style>
