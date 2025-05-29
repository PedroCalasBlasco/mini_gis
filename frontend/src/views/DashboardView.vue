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
        <v-btn v-else color="primary" @click="goToNewLayer">New Layer</v-btn>
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
  </v-container>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'

  const router = useRouter()
  const route = useRoute()

  import MapsTab from '@/components/dashboard/MapsTab.vue'
  import LayersTab from '@/components/dashboard/LayersTab.vue'

  const tab = ref('maps')

  const goToNewMap = () => {
    const userId = route.params.userId
    router.push(`/dashboard/${userId}/newmap`)
  }

  const goToNewLayer = () => {
    const userId = route.params.userId
    router.push(`/dashboard/${userId}/newlayer`)
  }
</script>
