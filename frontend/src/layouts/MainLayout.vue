<template>
  <v-app :theme="theme">
    <v-app-bar>
      <v-row class="align-center">
        <v-col class="flex-grow-2">
          <h2 class="title ml-8">Mi Plantilla</h2>
        </v-col>
        <v-col cols="auto">
          <v-select
            :model-value="theme"
            hide-details
            density="compact"
            label="Theme"
            :items="avaliableThemes"
            @update:model-value="theme = $event"
          />
        </v-col>
        <v-col cols="auto" class="pr-4 mr-4">
          <AvatarMenu />
        </v-col>
      </v-row>
    </v-app-bar>

    <v-navigation-drawer :width="199">
      <v-list-item title="My Application" subtitle="Vuetify"></v-list-item>
      <v-divider></v-divider>
      <v-list-item link title="List Item 1"></v-list-item>
      <v-list-item link title="List Item 2"></v-list-item>
      <v-list-item link title="List Item 3"></v-list-item>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import { useStorage } from '@vueuse/core'
  import AvatarMenu from '@/components/basics/AvatarMenu/AvatarMenu.vue'

  const avaliableThemes = ['light', 'dark'] as const
  const theme = useStorage<'light' | 'dark'>('theme', 'light')
</script>
