<template>
  <div ref="mapContainer" class="map" :class="{ 'dark-theme': theme === 'dark' }"></div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import L from 'leaflet'
  import { defaultMap } from '../constants/basemaps'
  import { center, defaultZoom } from '../constants/mapConfig'
  import { basemapsControl } from '../components/basemapsControl/basemapControl'
  import { polygon } from '../constants/layers/polygon'
  import { type Theme } from '../types/config'

  import { useStorage } from '@vueuse/core'
  import { createLeafletControl } from '@/utils/leafletControl'
  import GeocodingControl from '../components/geocodingControl/GeocodingControl.vue'

  const theme = useStorage<Theme>('theme', 'light')

  const mapContainer = ref<HTMLElement | undefined>(undefined)

  onMounted(() => {
    if (!mapContainer.value) return
    const map = L.map(mapContainer.value).setView(center, defaultZoom)

    defaultMap.addTo(map)
    L.geoJSON(polygon).addTo(map)
    //L.control.layers(baseMaps).addTo(map)

    map.addControl(
      new basemapsControl({
        position: 'bottomright',
      })
    )

    const geoControl = new (createLeafletControl('custom-control', GeocodingControl, map))({
      position: 'topright',
    })

    map.addControl(geoControl)
  })
</script>

<style scoped lang="scss">
  .map {
    height: 100%;
    width: 100%;
  }
</style>
