<template>
  <div class="scroll-wrapper">
    <v-container class="mt-4">
      <v-card elevation="2" class="pa-0">
        <!-- Header -->
        <v-card-title class="text-h5 px-6 py-4 d-flex align-center">
          Features Table
          {{ layerFromApi?.name }}
          <v-spacer />
          <v-btn class="me-2" icon variant="text" @click="add">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn
            class="me-2"
            color="primary"
            :disabled="confirmDisabled"
            :loading="loading"
            @click="confirmChanges"
          >
            Confirm Changes
          </v-btn>
        </v-card-title>

        <!-- Table -->
        <v-card-text>
          <FeaturesTable
            v-if="features && features.length > 0"
            v-model:features="features"
            v-model:editing-id="editingId"
          />
          <v-alert v-else type="info" variant="tonal">No features to show.</v-alert>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref, type Ref } from 'vue'
  import FeaturesTable from '@/components/features/FeaturesTable.vue'
  import { createFeatures, getFeaturesByLayer } from '@/services/features'
  import { useStorage } from '@vueuse/core'
  import { useRoute } from 'vue-router'
  import type { FeatureFromApi, Geometry } from '@/types/feature'
  import { cloneDeep, isEqual } from 'lodash'
  import { v4 as uuidv4 } from 'uuid'
  import { getLayerById } from '@/services/layers'
  import type { GeometryType, LayerFromAPI } from '@/types/layer'
  import { useSnackbarStore } from '@/store/snackbar'

  const token = useStorage('token', '')
  const route = useRoute()

  const snackbar = useSnackbarStore()

  const editingId = ref<string>()

  const features = ref<FeatureFromApi[]>()

  const originalFeatures = ref<FeatureFromApi[]>()

  function createEmptyGeometry(type: GeometryType): Geometry {
    switch (type) {
      case 'Point':
        return { type, coordinates: [0, 0] }
      case 'LineString':
        return { type, coordinates: [] }
      case 'Polygon':
        return { type, coordinates: [[]] }
      default:
        throw new Error(`Unsupported geometry type: ${type}`)
    }
  }

  // Actions
  function add() {
    if (features.value) {
      const newId = uuidv4()

      const propertiesTemplate = layerFromApi.value?.featureSchema ?? []

      // 🔥 Aquí está el arreglo: clonar el array de objetos
      const clonedProperties = propertiesTemplate.map((p: any) => ({ ...p }))

      if (!layerFromApi.value?.geometryType) {
        throw new Error('geometryType is undefined')
      }

      const newFeature: FeatureFromApi = {
        id: newId,
        properties: clonedProperties,
        layerId: route.params.idLayer as string,
        type: 'Feature',
        geometry: createEmptyGeometry(layerFromApi.value?.geometryType),
      }

      features.value.push(newFeature)
      editingId.value = newId
    }
  }

  const confirmDisabled = computed(() => {
    const noChanges = isEqual(features.value, originalFeatures.value)
    const isEditing = editingId.value !== undefined
    return noChanges || isEditing
  })

  const loading = ref(false)

  async function confirmChanges() {
    loading.value = true
    try {
      if (features.value && layerFromApi.value) {
        await createFeatures(features.value, token.value, layerFromApi.value.id)
        snackbar.openSnackbar('Features Changed Succesfully', 'success')
        originalFeatures.value = cloneDeep(features.value)
      }
    } catch (error) {
      console.error(error)
      snackbar.openSnackbar('Error changing Features', 'error')
    } finally {
      loading.value = false
    }
  }

  const layerFromApi: Ref<LayerFromAPI | undefined> = ref()

  onMounted(async () => {
    features.value = await getFeaturesByLayer(route.params.idLayer as string, token.value)

    const layer = await getLayerById(route.params.idLayer as string, token.value)
    layerFromApi.value = layer

    originalFeatures.value = cloneDeep(features.value)
  })
</script>

<style scoped>
  .scroll-wrapper {
    height: calc(100vh - 65px);
    overflow-y: auto;
    background-color: #f5f5f5;
  }
</style>
