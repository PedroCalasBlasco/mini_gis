<template>
  <v-row>
    <v-col v-for="(map, index) in mapsOf" :key="map.id" cols="12" sm="6" md="4">
      <v-hover v-slot="{ isHovering, props }">
        <v-card
          v-bind="props"
          class="map-card ma-2"
          :elevation="isHovering ? 12 : 4"
          @click="selectMap(map)"
        >
          <v-img :src="maps[index].thumbnail" height="200px" class="map-img" cover>
            <template #placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey-lighten-5" />
              </v-row>
            </template>

            <div v-if="isHovering" class="hover-overlay d-flex align-center justify-center">
              <v-btn color="white" variant="elevated">Open</v-btn>
            </div>
          </v-img>

          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-body-2">{{ map.name }}</span>
            <div class="d-flex gap-1">
              <v-btn icon size="small" variant="text" @click.stop="shareMap(map)">
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
              <v-btn icon size="small" variant="text" @click.stop="editMap(map)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon variant="text" size="small" @click.stop="deleteMap(map)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-card-title>
        </v-card>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import { getMapsByUser } from '@/services/maps'
  import { useStorage } from '@vueuse/core'
  import { onMounted, ref, type Ref } from 'vue'
  import { useRoute } from 'vue-router'
  import type { Map } from '@/types/map'

  const route = useRoute()

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

  function selectMap(map: Map) {
    console.log('Seleccionado', map.name)
  }

  function shareMap(map: Map) {
    console.log('Compartir', map.name)
  }

  function editMap(map: Map) {
    console.log('Editar', map.name)
  }

  function deleteMap(map: Map) {
    console.log('Eliminar', map.name)
    maps.value = maps.value.filter((m) => m.id !== map.id)
  }

  const token = useStorage('token', '')

  const mapsOf: Ref<Map[]> = ref([])

  onMounted(async () => {
    mapsOf.value = await getMapsByUser(route.params.userId as string, token.value)
    console.log('MAPS', maps)
  })
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

  .gap-1 > * + * {
    margin-left: 4px;
  }
</style>
