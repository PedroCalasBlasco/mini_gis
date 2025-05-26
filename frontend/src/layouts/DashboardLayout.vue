<template>
  <v-app :theme="theme">
    <v-app-bar app color="primary">
      <v-toolbar-title class="pointer" @click="goToDashboard">Mini GIS</v-toolbar-title>
      <AvatarMenu />
    </v-app-bar>

    <v-main>
      <router-view v-slot="{ Component, route }">
        <transition name="slide-fade" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import AvatarMenu from '@/components/basics/AvatarMenu/AvatarMenu.vue'
  import { useStorage } from '@vueuse/core'
  import router from '@/router'

  const userId = useStorage('userId', '')

  const theme = useStorage<'light' | 'dark'>('theme', 'light')

  function goToDashboard() {
    router.push({ name: 'dashboard', params: { userId: userId.value } })
  }
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

  .pointer {
    cursor: pointer;
  }
</style>
