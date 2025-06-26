<template>
  <div ref="mapContainer" class="map"></div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import L from 'leaflet'
  import 'leaflet-draw'

  import { useStorage } from '@vueuse/core'
  import { createLeafletControl } from '@/utils/leafletControl'
  import { basemapsControl } from '../components/widgets/basemapsControl/basemapControl'
  import GeocodingControl from '../components/widgets/geocodingControl/GeocodingControl.vue'
  import GoToExtentButton from '@/components/widgets/goToExtentButton/GoToExtentButton.vue'
  import GoToActualPositionButton from '@/components/widgets/goToActualPositionButton/GoToActualPositionButton.vue'
  import DrawFeaturesControl from '@/components/widgets/drawFeaturesControl/DrawFeaturesControl.vue'
  import { getMapByUserAndId } from '@/services/maps'
  import { useRoute } from 'vue-router'
  import type { MapLayer } from '@/types/map'
  import type { FeatureFromApi } from '@/types/feature'
  import type { FeatureCollection, Feature as GeoJSONFeature, Geometry } from 'geojson'
  import type { Component } from 'vue'

  const token = useStorage('token', '')
  const userId = useStorage('userId', '')

  const route = useRoute()

  const mapContainer = ref<HTMLElement | undefined>(undefined)

  function addWidget(
    map: L.Map,
    name: string,
    component: Component,
    position: L.ControlPosition = 'topright'
  ) {
    const control = new (createLeafletControl('custom-control', component, map))({ position })
    map.addControl(control)
  }

  function addGeoJsonLayer(map: L.Map, mapLayer: MapLayer) {
    const { features, isVisible, opacity, style } = mapLayer.layer
    if (!features?.length) return

    const geojson: FeatureCollection = {
      type: 'FeatureCollection',
      features: features.map(
        (f: FeatureFromApi): GeoJSONFeature => ({
          type: 'Feature',
          id: f.id,
          geometry: f.geometry as Geometry,
          properties: f.properties,
        })
      ),
    }

    const geojsonLayer = L.geoJSON(geojson, {
      style: () => ({
        opacity,
        fillOpacity: opacity,
        ...(style || {}),
      }),
    })

    if (isVisible) geojsonLayer.addTo(map)
  }

  onMounted(async () => {
    if (!mapContainer.value) return

    const mapInfo = await getMapByUserAndId(route.params.mapid as string, userId.value, token.value)
    const center: L.LatLngExpression = [mapInfo.centerLat, mapInfo.centerLng]

    const map = L.map(mapContainer.value).setView(center, mapInfo.zoom)

    const baseMap = L.tileLayer(
      mapInfo.baseMap ? mapInfo.baseMap.url : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    )
    baseMap.addTo(map)

    mapInfo.mapLayers.forEach((layer) => addGeoJsonLayer(map, layer))

    const widgetMap: Record<string, { component: Component; position?: L.ControlPosition }> = {
      basemapsselector: { component: basemapsControl, position: 'bottomright' },
      geocoder: { component: GeocodingControl },
      extentposition: { component: GoToExtentButton },
      actualposition: { component: GoToActualPositionButton },
      drawtools: { component: DrawFeaturesControl },
    }

    mapInfo.widgets.forEach(({ name }: { name: string }) => {
      const widget = widgetMap[name]
      if (widget) addWidget(map, name, widget.component, widget.position)
    })
  })
</script>

<style scoped lang="scss">
  .map {
    height: 100%;
    width: 100%;
  }
</style>
