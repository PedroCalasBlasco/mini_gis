<template>
  <v-btn icon density="compact" :theme="theme" variant="text" @click="goToExtent">
    <v-icon>mdi-web</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
  import { VBtn, VIcon } from 'vuetify/components'
  import { useStorage } from '@vueuse/core'
  import type { Theme } from '@/types/config'
  import { defineProps } from 'vue'
  import type L from 'leaflet'
  //import { center, defaultZoom } from '@/constants/mapConfig'

  const props = defineProps<{ map: L.Map }>()

  const theme = useStorage<Theme>('theme', 'light')

  function goToExtent() {
    console.log('PEDRO')
    //props.map.flyTo(center, defaultZoom)
  }
</script>
