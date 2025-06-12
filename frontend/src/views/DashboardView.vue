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

    <div class="overflow-y-auto" style="height: 78vh">
      <v-window v-model="tab">
        <v-window-item value="maps">
          <div>
            <MapsTab v-model:maps="myMaps" title="My Maps" @refresh-map="fetchMaps" />
          </div>
          <div class="mt-4">
            <MapsTab v-model:maps="sharedMaps" title="Maps Shared" @refresh-map="fetchMaps" />
          </div>
          <div class="mt-4">
            <MapsTab v-model:maps="publicMaps" title="Public Maps" @refresh-map="fetchMaps" />
          </div>
        </v-window-item>

        <v-window-item value="layers">
          <div>
            <LayersTab v-model:layers="mylayers" title="My Layers" @refresh-layer="fetchLayers" />
          </div>
          <div class="mt-4">
            <LayersTab
              v-model:layers="sharedlayers"
              title="Shared Layers"
              @refresh-layer="fetchLayers"
            />
          </div>
          <div class="mt-4">
            <LayersTab
              v-model:layers="publiclayers"
              title="Public Layers"
              @refresh-layer="fetchLayers"
            />
          </div>
        </v-window-item>
      </v-window>
    </div>
  </v-container>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useStorage } from '@vueuse/core'
  import { getMapsSharedWithUser, getPublicMaps, getMapsByUser } from '@/services/maps'
  import { getLayersByUser, getLayersSharedWithUser, getPublicLayers } from '@/services/layers'

  import MapsTab from '@/components/dashboard/MapsTab.vue'
  import LayersTab from '@/components/dashboard/LayersTab.vue'

  const router = useRouter()
  const route = useRoute()

  const token = useStorage('token', '')

  const tab = ref('maps')

  const myMaps = ref([])
  const sharedMaps = ref([])
  const publicMaps = ref([])

  const mylayers = ref([])
  const sharedlayers = ref([])
  const publiclayers = ref([])

  const goToNewMap = () => {
    const userId = route.params.userId
    router.push(`/dashboard/${userId}/newmap`)
  }

  const goToNewLayer = () => {
    const userId = route.params.userId
    router.push(`/dashboard/${userId}/newlayer`)
  }

  async function fetchMaps() {
    myMaps.value = await getMapsByUser(route.params.userId, token.value)
    publicMaps.value = await getPublicMaps(route.params.userId, token.value)
    sharedMaps.value = await getMapsSharedWithUser(route.params.userId, token.value)
  }

  async function fetchLayers() {
    mylayers.value = await getLayersByUser(route.params.userId, token.value)
    sharedlayers.value = await getLayersSharedWithUser(route.params.userId, token.value)
    publiclayers.value = await getPublicLayers(route.params.userId, token.value)
  }

  onMounted(async () => {
    await fetchMaps()
    await fetchLayers()
  })
</script>
