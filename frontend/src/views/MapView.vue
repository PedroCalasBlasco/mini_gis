<template>
  <div ref="mapContainer" class="map" :class="{ 'dark-theme': theme === 'dark' }"></div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import L from 'leaflet'
  import 'leaflet-draw'
  import { defaultMap } from '../constants/basemaps'
  import { center, defaultZoom } from '../constants/mapConfig'

  import { polygon } from '../constants/layers/polygon'
  import { type Theme } from '../types/config'

  import { useStorage } from '@vueuse/core'
  import { createLeafletControl } from '@/utils/leafletControl'
  import { basemapsControl } from '../components/widgets/basemapsControl/basemapControl'
  import GeocodingControl from '../components/widgets/geocodingControl/GeocodingControl.vue'
  import GoToExtentButton from '@/components/widgets/goToExtentButton/GoToExtentButton.vue'
  import GoToActualPositionButton from '@/components/widgets/goToActualPositionButton/GoToActualPositionButton.vue'
  import DrawFeaturesControl from '@/components/widgets/drawFeaturesControl/DrawFeaturesControl.vue'

  const theme = useStorage<Theme>('theme', 'dark')

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

    const goToExtentButton = new (createLeafletControl('custom-control', GoToExtentButton, map))({
      position: 'topright',
    })
    map.addControl(goToExtentButton)

    const goToActualPosition = new (createLeafletControl(
      'custom-control',
      GoToActualPositionButton,
      map
    ))({
      position: 'topright',
    })
    map.addControl(goToActualPosition)

    const drawFeaturesControl = new (createLeafletControl(
      'custom-control',
      DrawFeaturesControl,
      map
    ))({
      position: 'topright',
    })
    map.addControl(drawFeaturesControl)
  })
</script>

<style scoped lang="scss">
  .map {
    height: 100%;
    width: 100%;
  }
</style>
