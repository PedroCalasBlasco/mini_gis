<template>
  <v-container>
    <v-row class="align-center mb-4" justify="space-between">
      <v-col cols="auto">
        <v-tabs v-model="tab" background-color="transparent" grow>
          <v-tab value="maps">Maps</v-tab>
          <v-tab value="layers">Layers</v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="auto">
        <v-btn v-if="tab === 'maps'" color="primary" @click="goToNewMap">New Map</v-btn>
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

    <NewLayerDialog v-model:layer-dialog="layerDialog" />
  </v-container>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'

  const router = useRouter()
  const route = useRoute()

  import MapsTab from '@/components/dashboard/MapsTab.vue'
  import LayersTab from '@/components/dashboard/LayersTab.vue'
  import NewLayerDialog from '@/components/dashboard/NewLayerDialog.vue'

  const tab = ref('maps')
  const layerDialog = ref(false)

  const goToNewMap = () => {
    const userId = route.params.userId
    router.push(`/dashboard/${userId}/newMap`)
  }
</script>
