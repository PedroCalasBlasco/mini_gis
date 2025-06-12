<template>
  <v-card class="pa-4 pt-0">
    <v-card-title>{{ props.title }}</v-card-title>
    <v-card-text>
      <v-row v-if="maps && maps.length" class="maps-container">
        <v-col v-for="map in maps" :key="map.id" cols="12" sm="6" md="3">
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              class="map-card ma-2"
              :elevation="isHovering ? 12 : 4"
              @click="selectMap(map)"
            >
              <v-img
                :src="`https://placehold.co/400x200/orange/white?text=${map.name}`"
                height="200px"
                class="map-img"
                cover
              >
                <template #placeholder>
                  <v-row class="fill-height ma-0 align-center justify-center">
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
                  <v-btn icon variant="text" size="small" @click.stop="openDeleteDialog(map)">
                    <v-icon color="red">mdi-delete</v-icon>
                  </v-btn>
                </div>
              </v-card-title>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>

      <v-alert v-else type="info" variant="tonal">No maps to show.</v-alert>
    </v-card-text>
  </v-card>

  <DeleteMapDialog v-model:delete-dialog="deleteDialog" :map="mapToDelete" @refresh="refresh" />
</template>

<script lang="ts" setup>
  import { useStorage } from '@vueuse/core'
  import { ref } from 'vue'
  import type { MapFromAPI } from '@/types/map'
  import { useVModel } from '@vueuse/core'

  import DeleteMapDialog from '@/components/dashboard/DeleteMapDialog.vue'
  import router from '@/router'

  const props = defineProps<{
    title: string
    maps: MapFromAPI[]
  }>()

  const emit = defineEmits<{
    (e: 'update:maps', value: MapFromAPI[]): void
    (e: 'refreshMap'): void
  }>()

  const maps = useVModel(props, 'maps', emit)

  const userId = useStorage('userId', '')

  const deleteDialog = ref(false)
  const mapToDelete = ref<MapFromAPI | undefined>(undefined)

  function openDeleteDialog(map: MapFromAPI) {
    mapToDelete.value = map
    deleteDialog.value = true
  }

  function selectMap(map: MapFromAPI) {
    router.push({ name: 'map', params: { userid: userId.value, mapid: map.id } })
  }

  function shareMap(map: MapFromAPI) {
    console.log('Compartir', map.name)
  }

  function editMap(map: MapFromAPI) {
    router.push({ name: 'editmap', params: { idMap: map.id } })
  }

  async function refresh() {
    emit('refreshMap')
  }
</script>

<style scoped>
  .maps-container {
    max-height: calc(100vh - 165px); /* altura máxima: ajusta 100px según header/footer */
    overflow-y: auto; /* scroll vertical si hace falta */
  }

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
