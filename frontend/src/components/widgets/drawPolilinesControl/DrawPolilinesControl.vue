<template>
  <div class="d-flex justify-space-around">
    <v-btn-toggle
      v-model="featureType"
      divided
      density="compact"
      variant="outlined"
      :theme="theme"
      @update:model-value="handleFeatureTypeChange"
    >
      <v-btn :value="0" density="compact" variant="text" icon @click.stop>
        <v-icon size="small">mdi-vector-line</v-icon>
      </v-btn>
      <v-btn density="compact" variant="text" icon :active="editingMode" @click.stop="toggleEdit">
        <v-icon size="small">mdi-pencil</v-icon>
      </v-btn>
    </v-btn-toggle>
    <div
      class="d-flex align-center gap-2 ml-4"
      divided
      density="compact"
      variant="outlined"
      :theme="theme"
    >
      <v-btn
        density="compact"
        variant="text"
        icon
        :active="deletingMode"
        @click="cancelTemporaryPolyline"
      >
        <v-icon size="small" color="error">mdi-delete</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { VBtn, VIcon, VBtnToggle } from 'vuetify/components'
  import { useStorage } from '@vueuse/core'
  import type { Theme } from '@/types/config'
  import { defineProps, ref } from 'vue'
  import L from 'leaflet'
  import { drawingPolilinesTools } from '@/components/widgets/drawPolilinesControl/Composables/DrawPolilines'

  const props = defineProps<{ map: L.Map }>()

  const featureType = ref<number | undefined>(undefined)

  const {
    startDrawing,
    stopDrawing,
    startEditing,
    stopEditing,
    cancelTemporaryPolyline,
    deletingMode,
    drawingMode,
    editingMode,
  } = drawingPolilinesTools(props.map, featureType)

  function handleFeatureTypeChange(val: number | undefined) {
    if (val === 0) {
      startDrawing()
    } else {
      stopDrawing()
    }
  }

  function toggleEdit() {
    if (editingMode.value) {
      stopEditing()
      featureType.value = undefined
    } else {
      stopDrawing()
      featureType.value = undefined
      startEditing()
    }
  }

  const theme = useStorage<Theme>('theme', 'light')
</script>
