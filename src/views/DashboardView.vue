<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Mini GIS</v-toolbar-title>
      <AvatarMenu />
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
            <v-btn v-if="tab === 'maps'" color="primary" @click="mapDialog = true">New Map</v-btn>
            <v-btn v-else color="primary" @click="layerDialog = true">New Layer</v-btn>
          </v-col>
        </v-row>
        <v-window v-model="tab" class="mt-4">
          <v-window-item value="maps">
            <MapsTab />
          </v-window-item>

          <v-window-item value="layers">
            <LayersTab />
          </v-window-item>
        </v-window>

        <NewMapDialog v-model:map-dialog="mapDialog" />
        <NewLayerDialog v-model:layer-dialog="layerDialog" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref } from 'vue'

  import AvatarMenu from '@/components/basics/AvatarMenu/AvatarMenu.vue'
  import MapsTab from '@/components/dashboard/MapsTab.vue'
  import LayersTab from '@/components/dashboard/LayersTab.vue'
  import NewMapDialog from '@/components/dashboard/NewMapDialog.vue'
  import NewLayerDialog from '@/components/dashboard/NewLayerDialog.vue'

  const tab = ref('maps')
  const mapDialog = ref(false)
  const layerDialog = ref(false)
</script>
