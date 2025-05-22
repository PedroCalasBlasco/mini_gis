<template>
  <div class="scroll-wrapper">
    <v-container class="mt-4 bg-white">
      <v-row>
        <v-col cols="6">
          <h3 class="mb-2">Basic Information</h3>
          <v-text-field v-model="mapData.name" label="Nombre del mapa" required></v-text-field>
        </v-col>
        <v-col cols="6" class="d-flex justify-center align-center">
          <v-switch v-model="mapData.isPublic" label="¿Es público?" hide-details></v-switch>
        </v-col>
        <v-col cols="6">
          <v-textarea
            v-model="mapData.description"
            label="Descripción"
            rows="2"
            hide-details
            variant="outlined"
          ></v-textarea>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <h3>Select Base Map</h3>
          <v-slide-group show-arrows class="mt-2">
            <v-slide-group-item v-for="base in baseMaps" :key="base.id">
              <v-card
                class="ma-2 d-flex flex-column justify-end text-white transition-ease-in-out"
                width="200"
                height="120"
                :elevation="mapData.baseMapId === base.id ? 16 : 4"
                :style="{
                  backgroundImage: `url(${base.thumbnailUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  cursor: 'pointer',
                  boxShadow:
                    mapData.baseMapId === base.id
                      ? '0 2px 4px rgba(0,0,0,0.5)'
                      : '0 1px 2px rgba(0,0,0,0.2)',
                  border: mapData.baseMapId === base.id ? '2px solid #1976d2' : '2px solid white',
                  transition: 'box-shadow 0.3s, filter 0.3s',
                }"
                @click="selectBaseMap(base.id)"
                @mouseenter="hovered = base.id"
                @mouseleave="hovered = null"
              >
                <!-- Capa de oscurecimiento al hacer hover -->
                <div
                  class="pa-2"
                  :style="{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                    backdropFilter: hovered === base.id ? 'brightness(0.9)' : 'none',
                    transition: 'backdrop-filter 0.3s, background 0.3s',
                  }"
                >
                  <div class="text-subtitle-1 font-weight-medium">
                    {{ base.name }}
                  </div>
                </div>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12"><h3>Select Map Center</h3></v-col>
        <v-col cols="3">
          <v-text-field
            v-model="mapData.centerLat"
            label="Center Latitude"
            number
            required
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="mapData.centerLng"
            number
            label="Center Longitude"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="mapData.zoom" number label="Zoom" required></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-btn color="secondary" @click="mapDialog = true">Select Map Center</v-btn>
          <p class="mt-2">
            Centro: {{ mapData.centerLat.toFixed(4) }}, {{ mapData.centerLng.toFixed(4) }} | Zoom:
            {{ mapData.zoom }}
          </p>
        </v-col>
      </v-row>

      <v-row>
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
              @click="addLayer(layer)"
            >
              {{ layer.name }}
            </v-chip>
          </div>
        </v-col>

        <v-col cols="6">
          <h3 class="mb-2">Add Widgets</h3>
          <v-chip
            v-for="widget in widgets"
            :key="widget.id"
            class="ma-1 mt-4"
            :color="isWidgetSelected(widget) ? 'primary' : 'grey lighten-2'"
            :class="{
              'text-white': isWidgetSelected(widget),
              'elevation-4': isWidgetSelected(widget),
              'elevation-2': !isWidgetSelected(widget),
              'border-selected': isWidgetSelected(widget),
              'cursor-pointer': true,
            }"
            variant="elevated"
            @click="toogleWidget(widget)"
          >
            {{ widget.name }}
          </v-chip>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="d-flex align-center justify-end">
          <v-btn color="primary" :disabled="createMapIsDisabled">CREATE NEW MAP</v-btn>
        </v-col>
      </v-row>

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
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch, type Ref } from 'vue'
  import L from 'leaflet'
  import type { BaseMap } from '@/types/map'
  import { getBaseMaps } from '@/services/baseMap'
  import { useStorage } from '@vueuse/core'
  import type { Layer } from '@/types/layer'
  import type { Widget } from '@/types/widget'
  import { getLayersByUser } from '@/services/layers'
  import { useRoute } from 'vue-router'
  import { getWidgets } from '@/services/widgets'

  const route = useRoute()

  const hovered = ref<number | null>(null)

  const selectedLayers: Ref<Layer[]> = ref([])

  const availableLayers = ref([
    { id: 1, name: 'Calles' },
    { id: 2, name: 'Ríos' },
    { id: 3, name: 'Límites' },
  ])

  const selectedWidgets = ref<Widget[]>([])

  const availableWidgets = ref([
    { id: 1, name: 'Leyenda', description: 'Muestra capas activas' },
    { id: 2, name: 'Medición', description: 'Permite medir' },
    { id: 3, name: 'Búsqueda', description: 'Buscador de direcciones' },
  ])

  const isWidgetSelected = (widget: Widget) => {
    return selectedWidgets.value.some((w) => w.id === widget.id)
  }

  const mapDialog = ref(false)
  const snackbar = ref(false)
  const snackbarMessage = ref('')
  let leafletMap: L.Map | null = null

  const mapData = ref({
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  function selectBaseMap(id: number) {
    mapData.value.baseMapId = id
  }

  function addLayer(layer: Layer) {
    mapData.value.layers.push(layer)
    snackbarMessage.value = `Capa "${layer.name}" agregada`
    snackbar.value = true
  }

  const toogleWidget = (widget: Widget) => {
    const index = selectedWidgets.value.findIndex((w) => w.id === widget.id)
    if (index === -1) {
      selectedWidgets.value.push(widget)
    } else {
      selectedWidgets.value.splice(index, 1)
    }
  }

  watch(mapDialog, (val) => {
    if (val) {
      setTimeout(() => initLeafletMap(), 200)
    }
  })

  function initLeafletMap() {
    if (leafletMap) return

    leafletMap = L.map('leaflet-map').setView(
      [mapData.value.centerLat, mapData.value.centerLng],
      mapData.value.zoom
    )

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap)

    let marker = L.marker([mapData.value.centerLat, mapData.value.centerLng], {
      draggable: true,
    }).addTo(leafletMap)

    leafletMap.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      marker.setLatLng([lat, lng])
      mapData.value.centerLat = lat
      mapData.value.centerLng = lng
      mapData.value.zoom = leafletMap?.getZoom() ?? 10
      updateBBox()
    })

    leafletMap.on('zoomend', () => {
      mapData.value.zoom = leafletMap?.getZoom() ?? 10
      updateBBox()
    })

    marker.on('dragend', (e) => {
      const pos = e.target.getLatLng()
      mapData.value.centerLat = pos.lat
      mapData.value.centerLng = pos.lng
      updateBBox()
    })
  }

  function updateBBox() {
    const bbox = leafletMap?.getBounds()
    if (bbox) {
      mapData.value.bbox = {
        minLat: bbox.getSouth(),
        minLng: bbox.getWest(),
        maxLat: bbox.getNorth(),
        maxLng: bbox.getEast(),
      }
    }
  }

  const createMapIsDisabled = computed(() => {
    return (
      !mapData.value.name?.trim() ||
      mapData.value.baseMapId === null ||
      mapData.value.zoom === null ||
      mapData.value.centerLat === null ||
      mapData.value.centerLng === null
    )
  })

  const token = useStorage('token', '')

  const baseMaps: Ref<BaseMap[]> = ref([])
  const layers: Ref<Layer[]> = ref([])
  const widgets: Ref<Widget[]> = ref([])

  onMounted(async () => {
    baseMaps.value = await getBaseMaps(token.value)
    console.log('MAPS', baseMaps.value)

    layers.value = await getLayersByUser(route.params.userId as string, token.value)
    console.log('LAYERS', layers.value)

    widgets.value = await getWidgets(token.value)
    console.log('WIDGETS', widgets.value)
  })
</script>

<style scoped>
  #leaflet-map {
    z-index: 0;
  }

  .scroll-wrapper {
    height: calc(100vh - 65px);
    overflow-y: auto;
    background-color: #f5f5f5; /* opcional: para diferenciar fondo */
  }

  .min-h-chip-zone {
    min-height: 42px; /* Ajusta según el tamaño de tus chips (42px suele ser 1 línea) */
  }

  .border-selected {
    border: 2px solid var(--v-theme-secondary); /* o usa un color específico */
  }
</style>
