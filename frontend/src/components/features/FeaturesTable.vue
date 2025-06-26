<template>
  <v-data-table :headers="headers" :items="features" class="elevation-0" item-value="id">
    <template v-for="header in headers" :key="header.key" #[`item.${header.key}`]="{ item }">
      <div v-if="editingId === item.id && header.key !== 'actions'">
        <EditableCell
          v-if="!['geometryType', 'geometry'].includes(header.key)"
          v-model:features="features"
          :item="item"
          :key-prop="header.key"
        />
        <v-chip v-else-if="header.key === 'geometryType'" color="indigo" text-color="white" small>
          {{ item.geometry.type }}
        </v-chip>

        <span
          v-else-if="header.key === 'geometry'"
          class="text-truncate"
          style="max-width: 250px; display: inline-block"
        >
          {{ formatedCoords(item.geometry) }}
        </span>
      </div>

      <div v-else>
        <template v-if="header.key === 'geometryType'">
          <v-chip color="indigo" text-color="white" small>
            {{ item.geometry.type }}
          </v-chip>
        </template>

        <template v-else-if="header.key === 'geometry'">
          <span class="text-truncate" style="max-width: 250px; display: inline-block">
            {{ formatedCoords(item.geometry) }}
          </span>
        </template>

        <template v-else-if="header.key === 'actions'">
          <v-btn
            icon
            size="small"
            color="teal"
            variant="text"
            :disabled="editingId !== item.id"
            @click="geolocateFeature(item)"
          >
            <v-icon>mdi-crosshairs-gps</v-icon>
          </v-btn>
          <v-btn
            icon
            size="small"
            variant="text"
            @click="editingId === item.id ? saveFeature(item) : editFeature(item)"
          >
            <v-icon>{{ editingId === item.id ? 'mdi-content-save' : 'mdi-pencil' }}</v-icon>
          </v-btn>
          <v-btn icon size="small" color="red" variant="text" @click="deleteFeature(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>

        <template v-else>
          {{ getCellValue(item, header.key) }}
        </template>
      </div>
    </template>
  </v-data-table>

  <FeatureGeometryWithMapDialog
    v-if="selectedFeature"
    v-model:map-dialog="mapDialog"
    v-model:feature="selectedFeature"
    v-model:features="features"
  />
</template>

<script lang="ts" setup>
  import { useVModel } from '@vueuse/core'
  import { ref } from 'vue'
  import FeatureGeometryWithMapDialog from '@/components/features/FeatureGeometryWithMapDialog.vue'
  import type { FeatureFromApi, Geometry } from '@/types/feature'
  import { useFeaturesTable } from './composables/useFeaturesTable'

  import EditableCell from './EditableCell.vue'

  const props = defineProps<{
    editingId: string | undefined
    features: FeatureFromApi[]
  }>()

  const emit = defineEmits<{
    (e: 'update:editingId', value: number | null): void
    (e: 'update:features', value: FeatureFromApi[]): void
  }>()

  const editingId = useVModel(props, 'editingId', emit)
  const features = useVModel(props, 'features', emit)

  const { headers, getCellValue } = useFeaturesTable({
    features: features.value,
  })

  const mapDialog = ref(false)

  const selectedFeature = ref<FeatureFromApi>()

  function formatedCoords(geometry: Geometry): string {
    if (geometry.type === 'Point') {
      const [lng, lat] = geometry.coordinates as [number, number]
      return `${lng.toFixed(2)} ${lat.toFixed(2)}`
    }

    if (geometry.type === 'LineString') {
      const coords = geometry.coordinates as [number, number][]
      const shown = coords.slice(0, 3)
      const formatted = shown.map(([lng, lat]) => `(${lng.toFixed(2)}, ${lat.toFixed(2)})`)
      return formatted.join(', ') + (coords.length > 3 ? ', …' : '')
    }

    if (geometry.type === 'Polygon') {
      const rings = geometry.coordinates as [number, number][][]
      const firstRing = rings[0] ?? []
      const shown = firstRing.slice(0, 3)
      const formatted = shown.map(([lng, lat]) => `(${lng.toFixed(2)}, ${lat.toFixed(2)})`)
      return formatted.join(', ') + (firstRing.length > 3 ? ', …' : '')
    }

    return ''
  }

  const geolocateFeature = (feature: FeatureFromApi) => {
    selectedFeature.value = { ...feature }
    mapDialog.value = true
  }

  const editFeature = (item: FeatureFromApi) => {
    editingId.value = item.id
  }

  const saveFeature = (item: FeatureFromApi) => {
    try {
      if (typeof item.geometry === 'string') {
        item.geometry = JSON.parse(item.geometry)
      }
    } catch (error) {
      console.warn('Invalid geometry JSON', error)
    }
    editingId.value = undefined
  }

  const deleteFeature = (item: FeatureFromApi) => {
    features.value = features.value.filter((f) => f.id !== item.id)
  }
</script>
