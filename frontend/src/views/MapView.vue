<template>
  <div ref="mapContainer" class="map"></div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import L from 'leaflet'
  import 'leaflet-draw'
  import { defaultMap } from '../constants/basemaps'

  import { polygon } from '../constants/layers/polygon'
  import { type Theme } from '../types/config'

  import { useStorage } from '@vueuse/core'
  import { createLeafletControl } from '@/utils/leafletControl'
  import { basemapsControl } from '../components/widgets/basemapsControl/basemapControl'
  import GeocodingControl from '../components/widgets/geocodingControl/GeocodingControl.vue'
  import GoToExtentButton from '@/components/widgets/goToExtentButton/GoToExtentButton.vue'
  import GoToActualPositionButton from '@/components/widgets/goToActualPositionButton/GoToActualPositionButton.vue'
  import DrawFeaturesControl from '@/components/widgets/drawFeaturesControl/DrawFeaturesControl.vue'
  import { getMapByUserAndId } from '@/services/maps'
  import { useRoute } from 'vue-router'

  const token = useStorage('token', '')
  const userId = useStorage('userId', '')

  const route = useRoute()

  const mapContainer = ref<HTMLElement | undefined>(undefined)

  onMounted(async () => {
    if (!mapContainer.value) return

    //console.log('ENMAPVIEW', theme.value)

    const mapInfo = await getMapByUserAndId(route.params.mapid as string, userId.value, token.value)

    console.log('mapInfo', mapInfo)

    const center: L.LatLngExpression = [mapInfo.centerLat, mapInfo.centerLng]

    const map = L.map(mapContainer.value).setView(center, mapInfo.zoom)

    const baseMap = L.tileLayer(
      mapInfo.baseMap ? mapInfo.baseMap.url : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    )

    baseMap.addTo(map)
    L.geoJSON(polygon).addTo(map)
    //L.control.layers(baseMaps).addTo(map)

    if (mapInfo.widgets.some((widget) => widget.name === 'basemapsselector')) {
      map.addControl(
        new basemapsControl({
          position: 'bottomright',
        })
      )
    }

    if (mapInfo.widgets.some((widget) => widget.name === 'geocoder')) {
      const geoControl = new (createLeafletControl('custom-control', GeocodingControl, map))({
        position: 'topright',
      })
      map.addControl(geoControl)
    }

    if (mapInfo.widgets.some((widget) => widget.name === 'extentposition')) {
      const goToExtentButton = new (createLeafletControl('custom-control', GoToExtentButton, map))({
        position: 'topright',
      })
      map.addControl(goToExtentButton)
    }

    if (mapInfo.widgets.some((widget) => widget.name === 'actualposition')) {
      const goToActualPosition = new (createLeafletControl(
        'custom-control',
        GoToActualPositionButton,
        map
      ))({
        position: 'topright',
      })
      map.addControl(goToActualPosition)
    }

    if (mapInfo.widgets.some((widget) => widget.name === 'drawtools')) {
      const drawFeaturesControl = new (createLeafletControl(
        'custom-control',
        DrawFeaturesControl,
        map
      ))({
        position: 'topright',
      })
      map.addControl(drawFeaturesControl)
    }
  })
</script>

<style scoped lang="scss">
  .map {
    height: 100%;
    width: 100%;
  }
</style>
