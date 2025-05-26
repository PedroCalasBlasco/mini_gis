<template>
  <v-btn icon density="compact" :theme="theme" variant="text" @click="goTo">
    <v-icon>mdi-crosshairs-gps</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
  import { VBtn, VIcon } from 'vuetify/components'
  import { useStorage } from '@vueuse/core'
  import type { Theme } from '@/types/config'
  import { defineProps } from 'vue'
  import type L from 'leaflet'

  const props = defineProps<{ map: L.Map }>()

  const theme = useStorage<Theme>('theme', 'light')

  function goTo() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          props.map.flyTo([latitude, longitude], 10)
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser')
    }
  }
</script>
