<template>
  <v-card :theme="theme" width="300">
    <v-card-text class="pa-2">
      <v-autocomplete
        v-model="selected"
        v-model:search="searchInput"
        label="Enter Direction"
        density="compact"
        hide-details
        variant="outlined"
        :items="locations"
        prepend-inner-icon="mdi-magnify"
        item-value="properties.osm_id"
        item-title="properties.display_name"
        return-object
        @input="searchLocations(searchInput)"
      ></v-autocomplete>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { VCard, VCardText, VAutocomplete } from 'vuetify/components'
  import { useStorage } from '@vueuse/core'
  import type { Theme } from '@/types/config'
  import { ref, watch, defineProps } from 'vue'
  import { searchLocationFromNominatim } from '@/services/geocoding'
  import { debounce } from 'lodash'
  import type L from 'leaflet'

  const props = defineProps<{ map: L.Map }>()

  const theme = useStorage<Theme>('theme', 'light')

  const searchInput = ref('')
  const selected = ref()
  const locations = ref()

  const searchLocations = debounce(async function (search: string) {
    const locationsResponse = await searchLocationFromNominatim(search)
    console.log('locationsResponse', locationsResponse)
    locations.value = locationsResponse.features
  }, 500)

  watch(selected, (newValue) => {
    props.map.flyTo([newValue.geometry.coordinates[1], newValue.geometry.coordinates[0]], 15)
  })
</script>
