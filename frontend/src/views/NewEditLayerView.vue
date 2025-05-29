<template>
  <div class="scroll-wrapper">
    <v-container class="mt-4">
      <v-card elevation="2" class="pa-6">
        <v-card-title class="text-h5">
          {{ route.params.idLayer ? 'Edit Layer' : 'Create New Layer' }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <!-- Básicos -->
            <v-col cols="12">
              <h3>Layer Basic Information</h3>
            </v-col>

            <v-col cols="6">
              <v-text-field v-model="layer.name" label="Layer Name" required />
            </v-col>
            <v-col cols="6" class="d-flex justify-end align-center">
              <v-switch v-model="layer.isPublic" label="Public Layer?" />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="layer.description"
                label="Description"
                auto-grow
                rows="2"
                hide-details
                variant="outlined"
              />
            </v-col>
          </v-row>

          <DataTypes v-model:layer-data-type="layerDataType" :is-disabled="isDisabled" />

          <v-row>
            <v-col cols="12" class="d-flex justify-end">
              <v-btn
                v-if="!confirmed"
                color="primary"
                :disabled="dataTypeConfirmDisabled"
                @click="confirmTab"
              >
                Confirm
              </v-btn>
              <v-btn v-else color="secondary" @click="editTab">Edit</v-btn>
              <v-btn color="error" class="ml-2" @click="clearTab">Clear</v-btn>
            </v-col>
          </v-row>

          <ConfirmedTypeSummary :layer-data-type="confirmedLayerDataType" />

          <!-- PROPIEDADES PERSONALIZADAS -->
          <CustomPropertiesSelector
            v-model:feature-schema="featureSchema"
            v-model:confirmed-feature-schema="confirmedFeatureSchema"
          />

          <ConfirmedPropertiesSummary :feature-schema="confirmedFeatureSchema" />
        </v-card-text>

        <v-card-actions class="d-flex justify-end">
          <v-btn icon color="primary" @click="openFeaturesTable"><v-icon>mdi-table</v-icon></v-btn>
          <v-btn color="primary" :disabled="formIsInvalid" :loading="loading" @click="submitLayer">
            {{ route.params.idLayer ? 'Edit Layer' : 'Create Layer' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import type { Layer, LayerDataType, PropertyDefinition } from '@/types/layer'
  import DataTypes from '@/components/newLayer/DataTypes.vue'
  import CustomPropertiesSelector from '@/components/newLayer/CustomPropertiesSelector.vue'
  import ConfirmedTypeSummary from '@/components/newLayer/ConfirmedTypeSummary.vue'
  import ConfirmedPropertiesSummary from '@/components/newLayer/ConfirmedPropertiesSummary.vue'
  import { createLayer, getLayerById, updateLayer } from '@/services/layers'
  import { useStorage } from '@vueuse/core'
  import { useSnackbarStore } from '@/store/snackbar'
  import { useRouter, useRoute } from 'vue-router'

  const userId = useStorage('userId', '')
  const token = useStorage('token', '')

  const loading = ref(false)
  const snackbar = useSnackbarStore()

  const router = useRouter()
  const route = useRoute()

  const layer = ref<Partial<Layer>>({
    name: '',
    isPublic: false,
    isVisible: true,
    opacity: 1,
    description: '',
    ownerId: Number(userId.value),
  })

  const layerDataType = ref<LayerDataType>({
    layerType: '',
    crs: { code: '4326', name: 'WGS_1984', label: 'EPSG: 4326 - WGS_1984' },
  })

  const confirmedLayerDataType = ref<LayerDataType>()

  const featureSchema = ref<PropertyDefinition[]>([])
  const confirmedFeatureSchema = ref<PropertyDefinition[]>()

  const dataTypeConfirmDisabled = computed(() => {
    return (
      !layerDataType.value.crs ||
      !layerDataType.value.layerType ||
      (layerDataType.value.layerType === 'Vector' && !layerDataType.value.geometryType)
    )
  })

  const formIsInvalid = computed(() => {
    return !layer.value.name || !confirmedLayerDataType.value
  })

  function openFeaturesTable() {
    console.log('OOOOO')
  }

  async function submitLayer() {
    loading.value = true

    layer.value.geometryType = confirmedLayerDataType.value?.geometryType
    layer.value.crs = confirmedLayerDataType.value?.crs
    layer.value.layerType = confirmedLayerDataType.value?.layerType
    layer.value.featureSchema = confirmedFeatureSchema.value

    try {
      if (layer.value.name) {
        if (route.params.idLayer) {
          await updateLayer(route.params.idLayer as string, layer.value as Layer, token.value)
          snackbar.openSnackbar('Layer Edited Succesfully', 'success')
        } else {
          await createLayer(layer.value as Layer, token.value)
          snackbar.openSnackbar('Layer Created Succesfully', 'success')
        }
        setTimeout(() => {
          router.push({ name: 'dashboard', params: { userId: userId.value } })
        }, 500)
      }
    } catch (error) {
      console.error(error)
      if (route.params.idLayer) {
        snackbar.openSnackbar('Error Editing Layer', 'error')
      } else {
        snackbar.openSnackbar('Error Creating Layer', 'error')
      }
    } finally {
      loading.value = false
    }
  }

  const confirmed = ref(false)

  watch(confirmedLayerDataType, (newVal) => {
    confirmed.value = newVal !== undefined
  })

  const isDisabled = computed(() => {
    return confirmed.value
  })

  function confirmTab() {
    confirmed.value = true
    confirmedLayerDataType.value = layerDataType.value
  }

  function editTab() {
    confirmed.value = false
  }

  function clearTab() {
    confirmedLayerDataType.value = undefined
    layerDataType.value = {
      layerType: '',
      crs: { code: '4326', name: 'WGS_1984', label: 'EPSG: 4326 - WGS_1984' },
    }
    confirmed.value = false
  }

  onMounted(async () => {
    if (route.params.idLayer) {
      const layerFromApi = await getLayerById(route.params.idLayer as string, token.value)

      layer.value.name = layerFromApi.name
      layer.value.description = layerFromApi.description
      layer.value.isPublic = layerFromApi.isPublic

      layerDataType.value = {
        layerType: layerFromApi.layerType,
        geometryType: layerFromApi.geometryType,
        crs: layerFromApi.crs,
      }

      confirmedLayerDataType.value = {
        layerType: layerFromApi.layerType,
        geometryType: layerFromApi.geometryType,
        crs: layerFromApi.crs,
      }

      featureSchema.value = layerFromApi.featureSchema
      confirmedFeatureSchema.value = layerFromApi.featureSchema
    }
  })
</script>

<style scoped>
  .scroll-wrapper {
    height: calc(100vh - 65px);
    overflow-y: auto;
    background-color: #f5f5f5; /* opcional: para diferenciar fondo */
  }
</style>
