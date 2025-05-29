<template>
  <v-row>
    <v-col cols="4" class="pt-5">
      <v-select
        v-model="layerDataType.layerType"
        :disabled="props.isDisabled"
        variant="outlined"
        hide-details
        :items="layerTypes"
        label="Layer Type"
        required
      />
    </v-col>
    <v-col cols="4" class="pt-5">
      <v-autocomplete
        v-model="layerDataType.crs"
        v-model:search="searchQuery"
        :disabled="props.isDisabled"
        :items="epsgOptions"
        :item-title="(crs) => crs.label"
        :item-value="(crs) => crs.code"
        label="Coordinate System (CRS)"
        placeholder="Search EPSG code..."
        clearable
        :loading="loadingEpsg"
        variant="outlined"
        return-object
        hide-details
        @update:model-value="clearSearch"
      />
    </v-col>
    <v-col v-if="layerDataType.layerType === 'Vector'" cols="4" class="pt-5">
      <v-select
        v-model="layerDataType.geometryType"
        :disabled="props.isDisabled"
        hide-details
        variant="outlined"
        :items="['Point', 'Line', 'Polygon']"
        label="Geometry Type"
        required
      />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import { getEpsgOptions } from '@/services/layerOptions'
  import type { EpsgResult, LayerDataType } from '@/types/layer'
  import { asyncComputed, debouncedRef, useVModel } from '@vueuse/core'
  import { ref } from 'vue'

  const props = defineProps<{
    layerDataType: LayerDataType
    isDisabled: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:layerDataType', value: LayerDataType): void
  }>()

  const layerDataType = useVModel(props, 'layerDataType', emit)

  const layerTypes = ['Vector', 'Raster', 'WMS', 'TMS']

  const searchQuery = ref('')

  const loadingEpsg = ref(true)
  const debouncedQuery = debouncedRef(searchQuery, 300) // debounce de 300ms

  const epsgOptions = asyncComputed<EpsgResult[]>(
    async () => {
      if (!debouncedQuery.value || debouncedQuery.value.length < 1) {
        return []
      }
      return await getEpsgOptions(debouncedQuery.value)
    },
    [], // valor inicial
    { evaluating: loadingEpsg } // opcional, para manejar loading si lo deseas
  )

  function clearSearch() {
    searchQuery.value = ''
  }
</script>
