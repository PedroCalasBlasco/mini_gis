<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Mini GIS</v-toolbar-title>
      <AvatarMenu class="mr-4" />
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row class="align-center mb-4" justify="space-between">
          <v-col cols="auto">
            <v-tabs v-model="tab" background-color="transparent" grow>
              <v-tab value="maps">Maps</v-tab>
              <v-tab value="layers">Layers</v-tab>
            </v-tabs>
          </v-col>
          <v-col cols="auto">
            <v-btn color="primary" @click="dialog = true">
              New {{ tab === 'maps' ? 'Map' : 'Layer' }}
            </v-btn>
          </v-col>
        </v-row>
        <v-window v-model="tab" class="mt-4">
          <v-window-item value="maps">
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

                      <div
                        v-if="isHovering"
                        class="hover-overlay d-flex align-center justify-center"
                      >
                        <v-btn color="white" variant="elevated">Ver</v-btn>
                      </div>
                    </v-img>
                    <v-card-title>{{ map.name }}</v-card-title>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </v-window-item>

          <v-window-item value="layers">
            <v-card class="pa-4">
              <h3>Capas (Layers)</h3>
              <p>Aquí se listarán las capas según el mapa seleccionado u otra lógica.</p>
            </v-card>
          </v-window-item>
        </v-window>

        <!-- Diálogo para crear -->
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h6">Crear nuevo {{ tab === 'maps' ? 'Mapa' : 'Layer' }}</span>
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="handleCreate">
                <v-text-field
                  v-model="formData.name"
                  :label="tab === 'maps' ? 'Nombre del mapa' : 'Nombre del layer'"
                  required
                />
                <v-text-field
                  v-if="tab === 'maps'"
                  v-model="formData.thumbnail"
                  label="URL de miniatura"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text @click="dialog = false">Cancelar</v-btn>
              <v-btn color="primary" @click="handleCreate">Crear</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref } from 'vue'

  import AvatarMenu from '@/components/basics/AvatarMenu/AvatarMenu.vue'

  const tab = ref('maps')
  const dialog = ref(false)

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

  const formData = ref({
    name: '',
    thumbnail: '',
  })

  function handleCreate() {
    if (!formData.value.name) return

    if (tab.value === 'maps') {
      maps.value.push({
        id: Date.now(),
        name: formData.value.name,
        thumbnail:
          formData.value.thumbnail || 'https://placehold.co/400x200/gray/white?text=Nuevo+Mapa',
      })
    } else {
      console.log('Nueva capa:', formData.value.name)
      // Aquí podrías guardar en `layers` si lo implementas
    }

    // Limpiar y cerrar
    formData.value.name = ''
    formData.value.thumbnail = ''
    dialog.value = false
  }

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
