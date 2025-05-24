<template>
  <div class="d-flex justify-space-around">
    <v-btn-toggle v-model="featureType" divided density="compact" variant="outlined" :theme="theme">
      <v-btn density="compact" variant="text" icon @click="addMarker">
        <v-icon size="small">mdi-map-marker</v-icon>
      </v-btn>
      <v-btn density="compact" variant="text" icon>
        <v-icon size="small">mdi-vector-point</v-icon>
      </v-btn>
      <v-btn density="compact" variant="text" icon>
        <v-icon size="small">mdi-vector-line</v-icon>
      </v-btn>
      <v-btn density="compact" variant="text" icon>
        <v-icon size="small">mdi-vector-polygon-variant</v-icon>
      </v-btn>
      <v-btn density="compact" variant="text" icon>
        <v-icon size="small">mdi-vector-circle</v-icon>
      </v-btn>
    </v-btn-toggle>
    <div
      class="d-flex align-center gap-2 ml-4"
      divided
      density="compact"
      variant="outlined"
      :theme="theme"
    >
      <v-btn density="compact" variant="text" icon>
        <v-icon size="small">mdi-information-box</v-icon>
      </v-btn>
      <v-btn density="compact" variant="text" icon>
        <v-icon size="small">mdi-pencil-box</v-icon>
      </v-btn>
      <v-btn density="compact" variant="text" icon :active="deletingMode" @click="removeFeature">
        <v-icon size="small">mdi-delete</v-icon>
      </v-btn>
      <v-btn density="compact" variant="text" icon @click="cancelDrawing">
        <v-icon size="small">mdi-close</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { VBtn, VIcon, VBtnToggle } from 'vuetify/components'
  import { useStorage } from '@vueuse/core'
  import type { Theme } from '@/types/config'
  import { defineProps } from 'vue'
  import L from 'leaflet'
  import { drawingMapTools } from '@/components/widgets/drawFeaturesControl/Composables/DrwaFeatures'

  const props = defineProps<{ map: L.Map }>()

  const { featureType, addMarker, removeFeature, cancelDrawing, deletingMode } = drawingMapTools(
    props.map
  )

  const theme = useStorage<Theme>('theme', 'light')
</script>
