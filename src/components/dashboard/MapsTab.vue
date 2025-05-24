<template>
  <v-row>
    <v-col v-for="map in maps" :key="map.id" cols="12" sm="6" md="4">
      <v-hover v-slot="{ isHovering, props }">
        <v-card
          v-bind="props"
          class="map-card"
          :elevation="isHovering ? 12 : 4"
          @click="selectMap(map)"
        >
          <v-img :src="map.thumbnail" height="200px" class="map-img" cover>
            <template #placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey-lighten-5" />
              </v-row>
            </template>

            <div v-if="isHovering" class="hover-overlay d-flex align-center justify-center">
              <v-btn color="white" variant="elevated">Ver</v-btn>
            </div>
          </v-img>
          <v-card-title>{{ map.name }}</v-card-title>
        </v-card>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const maps = ref([
    {
      id: 1,
      name: 'Mapa de incendios',
      thumbnail: 'https://placehold.co/400x200/orange/white?text=Incendios',
    },
    {
      id: 2,
      name: 'Zonas protegidas',
      thumbnail: 'https://placehold.co/400x200/green/white?text=Protegidas',
    },
    {
      id: 3,
      name: 'Cobertura forestal',
      thumbnail: 'https://placehold.co/400x200/forestgreen/white?text=Bosque',
    },
  ])

  function selectMap(map) {
    console.log('Seleccionado', map.name)
  }
</script>

<style scoped>
  .map-card {
    transition: transform 0.2s ease;
    cursor: pointer;
  }
  .map-card:hover {
    transform: scale(1.03);
  }

  .hover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
  }
</style>
