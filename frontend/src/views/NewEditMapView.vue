<template>
  <div class="scroll-wrapper">
    <v-container class="mt-4 bg-white">
      <v-row>
        <v-col cols="6">
          <h3 class="mb-2">Basic Information</h3>
          <v-text-field v-model="mapData.name" label="Map Name" required></v-text-field>
        </v-col>
        <v-col cols="6" class="d-flex justify-center align-center">
          <v-switch v-model="mapData.isPublic" label="Is Públic?" hide-details></v-switch>
        </v-col>
        <v-col cols="6">
          <v-textarea
            v-model="mapData.description"
            label="Description"
            rows="2"
            hide-details
            variant="outlined"
          ></v-textarea>
        </v-col>
      </v-row>

      <BaseMapSelectionSlide v-model:base-map-id="baseMapId" />

      <CenterPositionSelection
        v-model:center-lat="mapData.centerLat"
        v-model:center-lng="mapData.centerLng"
        v-model:zoom="mapData.zoom"
        v-model:map-dialog="mapDialog"
      />

      <v-row>
        <LayersSelection v-model:selected-layers="selectedLayers" />
        <WidgetsSelection v-model:selected-widgets="selectedWidgets" />
      </v-row>

      <v-row>
        <v-col cols="12" class="d-flex align-center justify-end">
          <v-btn
            color="primary"
            :disabled="createMapIsDisabled"
            :loading="loading"
            @click="createOrEditMap"
          >
            {{ route.params.idMap ? 'EDIT MAP' : 'CREATE NEW MAP' }}
          </v-btn>
        </v-col>
      </v-row>

      <PositionWithMapDialog
        v-model:map-dialog="mapDialog"
        v-model:center-lat="mapData.centerLat"
        v-model:center-lng="mapData.centerLng"
        v-model:zoom="mapData.zoom"
        v-model:bbox="mapData.bbox"
      />
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, type Ref } from 'vue'

  import type { Layer } from '@/types/layer'
  import type { Widget } from '@/types/widget'
  import type { Map } from '@/types/map'

  import { useStorage } from '@vueuse/core'
  import { createMap, getMapByUserAndId, updateMap } from '@/services/maps'
  import { useRoute, useRouter } from 'vue-router'

  import BaseMapSelectionSlide from '@/components/newMap/BaseMapSelectionSlide.vue'
  import CenterPositionSelection from '@/components/newMap/CenterPositionSelection.vue'
  import LayersSelection from '@/components/newMap/LayersSelection.vue'
  import WidgetsSelection from '@/components/newMap/WidgetsSelection.vue'
  import PositionWithMapDialog from '@/components/newMap/PositionWithMapDialog.vue'

  import { useSnackbarStore } from '@/store/snackbar'

  const route = useRoute()

  const snackbar = useSnackbarStore()

  const router = useRouter()

  const userId = useStorage('userId', '')
  const token = useStorage('token', '')

  const selectedLayers: Ref<Layer[]> = ref([])
  const selectedWidgets = ref<Widget[]>([])
  const baseMapId: Ref<number | undefined> = ref()

  const loading = ref(false)

  const mapDialog = ref(false)

  const mapData: Ref<Map> = ref({
    name: '',
    description: '',
    isPublic: false,
    centerLat: -34.6,
    centerLng: -58.4,
    zoom: 10,
    bbox: { minLat: 0, minLng: 0, maxLat: 0, maxLng: 0 },
    baseMapId: undefined,
    layers: [] as Layer[],
    widgets: [] as Widget[],
    userId: Number(userId.value),
  })

  const createMapIsDisabled = computed(() => {
    return (
      !mapData.value.name?.trim() ||
      !baseMapId.value ||
      !mapData.value.zoom ||
      !mapData.value.centerLat ||
      !mapData.value.centerLng
    )
  })

  async function createOrEditMap() {
    loading.value = true
    mapData.value.layers = selectedLayers.value
    mapData.value.widgets = selectedWidgets.value
    mapData.value.baseMapId = baseMapId.value
    try {
      if (route.params.idMap) {
        await updateMap(route.params.idMap as string, mapData.value, token.value)
        snackbar.openSnackbar('Map Edited Succesfully', 'success')
      } else {
        await createMap(mapData.value, token.value)
        snackbar.openSnackbar('Map Saved Succesfully', 'success')
      }
      setTimeout(() => {
        router.push({ name: 'dashboard', params: { userId: userId.value } })
      }, 500)
    } catch (error) {
      console.error(error)
      if (route.params.idMap) {
        snackbar.openSnackbar('Error Editing Map', 'error')
      } else {
        snackbar.openSnackbar('Error Saving Map', 'error')
      }
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    if (route.params.idMap) {
      const mapInfo = await getMapByUserAndId(
        route.params.idMap as string,
        userId.value,
        token.value
      )

      mapData.value.name = mapInfo.name
      mapData.value.description = mapInfo.description
      mapData.value.isPublic = mapInfo.isPublic

      mapData.value.centerLat = mapInfo.centerLat
      mapData.value.centerLng = mapInfo.centerLng
      mapData.value.bbox = mapInfo.bbox

      baseMapId.value = mapInfo.baseMapId
      selectedLayers.value = mapInfo.layers
      selectedWidgets.value = mapInfo.widgets
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
