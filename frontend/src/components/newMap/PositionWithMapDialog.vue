<template>
  <v-dialog v-model="mapDialog" width="800">
    <v-card>
      <v-card-title>
        <span class="text-h6">Selecciona el centro del mapa</span>
      </v-card-title>
      <v-card-text>
        <div id="leaflet-map" style="height: 400px"></div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="mapDialog = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { useVModel } from '@vueuse/core'
  import { nextTick, watch } from 'vue'
  import L from 'leaflet'
  import type { Bbox } from '@/types/map'

  import { createLeafletControl } from '@/utils/leafletControl'
  import GeocodingControl from '@/components/widgets/geocodingControl/GeocodingControl.vue'
  import GoToActualPositionButton from '@/components/widgets/goToActualPositionButton/GoToActualPositionButton.vue'

  const props = defineProps<{
    centerLat: number
    centerLng: number
    zoom: number
    mapDialog: boolean
    bbox: Bbox
  }>()

  const emit = defineEmits<{
    (e: 'update:centerLat', value: number): void
    (e: 'update:centerLng', value: number): void
    (e: 'update:zoom', value: number): void
    (e: 'update:mapDialog', value: boolean): void
    (e: 'update:bbox', value: Bbox): void
  }>()

  const centerLat = useVModel(props, 'centerLat', emit)
  const centerLng = useVModel(props, 'centerLng', emit)
  const zoom = useVModel(props, 'zoom', emit)
  const mapDialog = useVModel(props, 'mapDialog', emit)
  const bbox = useVModel(props, 'bbox', emit)

  let leafletMap: L.Map | null = null

  watch(mapDialog, async (val) => {
    if (val) {
      await nextTick()
      setTimeout(() => {
        resetLeafletMap()
      }, 300)
    }
  })

  function resetLeafletMap() {
    // 🔄 Eliminar mapa si ya existe
    if (leafletMap) {
      leafletMap.remove()
      leafletMap = null
    }

    // 🧹 Limpiar el contenedor del mapa si quedó algo residual
    const container = document.getElementById('leaflet-map')
    if (container) {
      container.innerHTML = ''
    }

    // ⚙️ Volver a inicializar
    initLeafletMap()
  }

  function initLeafletMap() {
    if (leafletMap) return

    leafletMap = L.map('leaflet-map').setView([centerLat.value, centerLng.value], zoom.value)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap)

    let marker = L.marker([centerLat.value, centerLng.value], {
      draggable: true,
    }).addTo(leafletMap)

    leafletMap.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      marker.setLatLng([lat, lng])
      centerLat.value = lat
      centerLng.value = lng
      zoom.value = leafletMap?.getZoom() ?? 10
      updateBBox()
    })

    leafletMap.on('zoomend', () => {
      zoom.value = leafletMap?.getZoom() ?? 10
      updateBBox()
    })

    marker.on('dragend', (e) => {
      const pos = e.target.getLatLng()
      centerLat.value = pos.lat
      centerLng.value = pos.lng
      updateBBox()
    })

    const geoControl = new (createLeafletControl('custom-control', GeocodingControl, leafletMap))({
      position: 'topright',
    })
    leafletMap.addControl(geoControl)

    const goToActualPosition = new (createLeafletControl(
      'custom-control',
      GoToActualPositionButton,
      leafletMap
    ))({
      position: 'bottomright',
    })
    leafletMap.addControl(goToActualPosition)
  }

  function updateBBox() {
    const bboxFromBounds = leafletMap?.getBounds()
    if (bboxFromBounds) {
      bbox.value = {
        minLat: bboxFromBounds.getSouth(),
        minLng: bboxFromBounds.getWest(),
        maxLat: bboxFromBounds.getNorth(),
        maxLng: bboxFromBounds.getEast(),
      }
    }
  }
</script>

<style scoped>
  #leaflet-map {
    z-index: 0;
  }
</style>
