<template>
  <v-col cols="6">
    <h3 class="mb-2">Add Layers</h3>
    <v-select
      v-model="selectedLayers"
      class="mt-4"
      :items="layers"
      item-title="name"
      item-value="id"
      multiple
      label="Select Layer"
      hide-details
      variant="outlined"
      return-object
    ></v-select>
    <div class="min-h-chip-zone mt-2">
      <v-chip
        v-for="layer in selectedLayers"
        :key="layer.id"
        class="ma-1"
        color="primary"
        variant="elevated"
      >
        {{ layer.name }}
      </v-chip>
    </div>
  </v-col>
</template>

<script lang="ts" setup>
  import { getLayersByUser } from '@/services/layers'
  import type { LayerFromAPI } from '@/types/layer'
  import { useStorage } from '@vueuse/core'
  import { onMounted, ref, type Ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useVModel } from '@vueuse/core'

  const props = defineProps<{
    selectedLayers?: LayerFromAPI[]
  }>()

  const emit = defineEmits<{
    (e: 'update:selectedLayers', value: LayerFromAPI[]): void
  }>()

  const selectedLayers = useVModel(props, 'selectedLayers', emit)

  const route = useRoute()

  const token = useStorage('token', '')

  const layers: Ref<LayerFromAPI[]> = ref([])

  onMounted(async () => {
    layers.value = await getLayersByUser(route.params.userId as string, token.value)
    console.log('LAYERS', layers.value)
  })
</script>

<style lang="scss" scoped>
  .min-h-chip-zone {
    min-height: 42px; /* Ajusta según el tamaño de tus chips (42px suele ser 1 línea) */
  }
</style>
