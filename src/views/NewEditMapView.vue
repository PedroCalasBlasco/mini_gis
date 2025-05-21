<template>
  <v-container>
    <h2>Edit Map: {{ mapId }}</h2>

    <v-slide-group show-arrows class="mt-6">
      <v-slide-group-item v-for="base in baseMaps" :key="base.id">
        <v-card class="ma-2" width="200" @click="selectBaseMap(base.id)">
          <v-card-title>{{ base.name }}</v-card-title>
          <v-card-subtitle>{{ base.description }}</v-card-subtitle>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-container>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const mapId = route.params.mapId ?? 'new'

  const baseMaps = ref([
    { id: 1, name: 'OSM', description: 'OpenStreetMap' },
    { id: 2, name: 'Satellite', description: 'High res imagery' },
    { id: 3, name: 'Dark Mode', description: 'Dark theme' },
  ])

  const selectBaseMap = (id: number) => {
    console.log('Selected base map', id)
  }
</script>
