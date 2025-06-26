<template>
  <v-dialog v-model="mapDialog" width="800" @after-enter="resetLeafletMap">
    <v-card>
      <v-card-title>
        <span class="text-h6">Selecciona el centro del mapa</span>
      </v-card-title>
      <v-card-text>
        <div id="leaflet-map" style="height: 400px"></div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="close">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { useVModel } from '@vueuse/core'
  import { nextTick, ref, watch, type Ref } from 'vue'
  import L, { type LatLngExpression } from 'leaflet'

  import { createLeafletControl } from '@/utils/leafletControl'
  import GeocodingControl from '@/components/widgets/geocodingControl/GeocodingControl.vue'
  import GoToActualPositionButton from '@/components/widgets/goToActualPositionButton/GoToActualPositionButton.vue'
  import type { FeatureFromApi, Geometry } from '@/types/feature'
  import type { MapData } from '@/types/map'
  import DrawPolilinesControl from '../widgets/drawPolilinesControl/DrawPolilinesControl.vue'
  import DrawPolygonsControl from '../widgets/drawPolygonsControl/DrawPolygonsControl.vue'

  const props = defineProps<{
    mapDialog: boolean
    feature: FeatureFromApi
    features: FeatureFromApi[]
  }>()

  const emit = defineEmits<{
    (e: 'update:mapDialog', value: boolean): void
    (e: 'update:feature', value: FeatureFromApi): void
    (e: 'update:features', value: FeatureFromApi[]): void
  }>()

  const mapData: Ref<MapData> = ref({
    centerLat: -34.6,
    centerLng: -58.4,
    zoom: 10,
    bbox: { minLat: 0, minLng: 0, maxLat: 0, maxLng: 0 },
  })

  const mapDialog = useVModel(props, 'mapDialog', emit)
  const feature = useVModel(props, 'feature', emit)
  const features = useVModel(props, 'features', emit)

  let leafletMap: L.Map | null = null

  watch(mapDialog, async (val) => {
    if (val) {
      await nextTick()
      // Esperar un frame más para asegurar que el DOM esté listo y el diálogo esté visible
      requestAnimationFrame(() => {
        resetLeafletMap()
      })
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

    leafletMap = L.map('leaflet-map').setView(
      [mapData.value.centerLat, mapData.value.centerLng],
      mapData.value.zoom
    )

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap)

    const type = feature.value.geometry?.type

    let layer: L.Layer | null = null

    if (type === 'Point' && feature.value.geometry?.coordinates?.length === 2) {
      const [lng, lat] = feature.value.geometry.coordinates

      layer = L.marker([lat, lng], { draggable: true }).addTo(leafletMap)
    }

    if (type === 'LineString' && Array.isArray(feature.value.geometry?.coordinates)) {
      const latlngs: LatLngExpression[] = feature.value.geometry.coordinates.map(([lng, lat]) => [
        lat,
        lng,
      ])
      layer = L.polyline(latlngs, { color: 'blue' }).addTo(leafletMap)
    }

    if (type === 'Polygon' && Array.isArray(feature.value.geometry?.coordinates)) {
      const latlngs: L.LatLngTuple[] =
        feature.value.geometry.coordinates[0]?.map(([lng, lat]) => [lat, lng]) ?? []

      if (latlngs.length > 0) {
        layer = L.polygon([latlngs], { color: 'green' }).addTo(leafletMap)
      }
    }

    leafletMap.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng

      if (type === 'Point') {
        if (layer) (layer as L.Marker).setLatLng([lat, lng])
        else {
          if (leafletMap) layer = L.marker([lat, lng], { draggable: true }).addTo(leafletMap)
        }
        feature.value.geometry = {
          type: 'Point',
          coordinates: [lng, lat],
        }

        features.value = features.value.map((f) =>
          f.id === feature.value.id ? { ...feature.value } : f
        )
      }
    })

    leafletMap.on('zoomend', () => {
      mapData.value.zoom = leafletMap?.getZoom() ?? 10
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

    if (type === 'LineString') {
      const drawPolilines = new (createLeafletControl(
        'custom-control',
        DrawPolilinesControl,
        leafletMap
      ))({
        position: 'topright',
      })
      leafletMap.addControl(drawPolilines)
    } else if (type === 'Polygon') {
      const drawPolygons = new (createLeafletControl(
        'custom-control',
        DrawPolygonsControl,
        leafletMap
      ))({
        position: 'topright',
      })
      leafletMap.addControl(drawPolygons)
    }
  }

  function updateBBox() {
    const bboxFromBounds = leafletMap?.getBounds()
    if (bboxFromBounds) {
      mapData.value.bbox = {
        minLat: bboxFromBounds.getSouth(),
        minLng: bboxFromBounds.getWest(),
        maxLat: bboxFromBounds.getNorth(),
        maxLng: bboxFromBounds.getEast(),
      }
    }
  }

  function extractCoordinatesFromLayer(
    layer: L.Polyline | L.Polygon
  ): [number, number][][] | [number, number][] {
    if (layer instanceof L.Polygon) {
      const rings = layer.getLatLngs()[0] as L.LatLng[]
      return [rings.map(({ lat, lng }) => [lng, lat] as [number, number])]
    }

    if (layer instanceof L.Polyline) {
      const points = layer.getLatLngs() as L.LatLng[]
      return points.map(({ lat, lng }) => [lng, lat] as [number, number])
    }

    return []
  }

  function closeDrawingFeature() {
    if (!leafletMap) return

    const type = feature.value.geometry?.type
    let lastLayer: L.Polyline | L.Polygon | undefined

    leafletMap.eachLayer((layer) => {
      if (type === 'LineString' && layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
        lastLayer = layer
      } else if (type === 'Polygon' && layer instanceof L.Polygon) {
        lastLayer = layer
      }
    })

    feature.value.geometry = {
      type,
      coordinates: lastLayer
        ? extractCoordinatesFromLayer(lastLayer)
        : type === 'Polygon'
          ? [[]]
          : [],
    } as Geometry

    features.value = features.value.map((f) =>
      f.id === feature.value.id ? { ...feature.value } : f
    )

    leafletMap.remove()
  }

  function close() {
    if (['LineString', 'Polygon'].includes(feature.value.geometry?.type)) {
      closeDrawingFeature()
      leafletMap = null
    }
    mapDialog.value = false
  }
</script>

<style scoped>
  #leaflet-map {
    z-index: 0;
  }
</style>
