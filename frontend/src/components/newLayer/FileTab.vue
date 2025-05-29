<template>
  <v-row>
    <v-col cols="6" class="pt-5">
      <v-file-input
        v-model="selectedFile"
        label="Upload File (KML, GeoJSON, CSV)"
        accept=".kml,application/vnd.google-earth.kml+xml,application/json,text/csv,.geojson"
        clearable
        variant="outlined"
        hide-details="auto"
        :disabled="isDisabled"
        @change="onFileSelected"
      />
    </v-col>
    <v-col cols="6" class="d-flex align-center pt-5">
      <v-btn color="primary" :disabled="props.isDisabled" @click="getDataFromFile">get data</v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import type { LayerDataType } from '@/types/layer'
  import { useVModel } from '@vueuse/core'
  import { ref } from 'vue'

  const props = defineProps<{
    layerDataType: LayerDataType
    isDisabled: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:layerDataType', value: LayerDataType): void
  }>()

  const layerDataType = useVModel(props, 'layerDataType', emit)

  const selectedFile = ref<File | null>(null)

  function onFileSelected(file: File | null) {
    if (!file) return

    // Aquí puedes procesar el archivo, por ejemplo:
    const reader = new FileReader()

    reader.onload = (e) => {
      const content = e.target?.result
      console.log('File content:', content)
      // Aquí parsearías el contenido según el tipo (KML, GeoJSON, CSV)
    }

    reader.readAsText(file)
  }

  function getDataFromFile() {
    console.log('PEDRO')
  }
</script>
