<template>
  <v-row>
    <v-col cols="12"><h3>Select Map Center</h3></v-col>

    <v-col cols="3">
      <v-text-field
        v-model="centerLatString"
        label="Center Latitude"
        type="number"
        required
      ></v-text-field>
    </v-col>

    <v-col cols="3">
      <v-text-field
        v-model="centerLngString"
        label="Center Longitude"
        type="number"
        required
      ></v-text-field>
    </v-col>

    <v-col cols="3">
      <v-text-field
        v-model="zoomString"
        label="Zoom"
        type="number"
        required
        :min="1"
        :max="16"
      ></v-text-field>
    </v-col>

    <v-col cols="3">
      <v-btn color="secondary" @click="mapDialog = true">Select Map Center</v-btn>
      <p class="mt-2">
        Center: {{ centerLat.toFixed(4) }}, {{ centerLng.toFixed(4) }} | Zoom: {{ zoom }}
      </p>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useVModel } from '@vueuse/core'

  const props = defineProps<{
    centerLat: number
    centerLng: number
    zoom: number
    mapDialog: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:centerLat', value: number): void
    (e: 'update:centerLng', value: number): void
    (e: 'update:zoom', value: number): void
    (e: 'update:mapDialog', value: boolean): void
  }>()

  const centerLat = useVModel(props, 'centerLat', emit)
  const centerLng = useVModel(props, 'centerLng', emit)
  const zoom = useVModel(props, 'zoom', emit)
  const mapDialog = useVModel(props, 'mapDialog', emit)

  // Computed wrappers que convierten strings del input a número
  const centerLatString = computed({
    get: () => String(centerLat.value),
    set: (val) => (centerLat.value = Number(val)),
  })

  const centerLngString = computed({
    get: () => String(centerLng.value),
    set: (val) => (centerLng.value = Number(val)),
  })

  const zoomString = computed({
    get: () => String(zoom.value),
    set: (val) => (zoom.value = Number(val)),
  })
</script>
