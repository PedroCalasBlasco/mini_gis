<template>
  <v-col cols="12">
    <h3>Select Base Map</h3>
    <v-slide-group show-arrows class="mt-2">
      <v-slide-group-item v-for="base in baseMaps" :key="base.id">
        <v-card
          class="ma-2 d-flex flex-column justify-end text-white transition-ease-in-out"
          width="200"
          height="120"
          :elevation="baseMapId === base.id ? 8 : 4"
          :style="{
            backgroundImage: `url(${base.thumbnailUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            cursor: 'pointer',
            boxShadow:
              baseMapId === base.id ? '0 2px 4px rgba(0,0,0,0.5)' : '0 1px 2px rgba(0,0,0,0.2)',
            border: baseMapId === base.id ? '2px solid #1976d2' : '2px solid white',
            transition: 'box-shadow 0.3s, filter 0.3s',
          }"
          @click="selectBaseMap(base.id)"
          @mouseenter="hovered = base.id"
          @mouseleave="hovered = null"
        >
          <!-- Capa de oscurecimiento al hacer hover -->
          <div
            class="pa-2"
            :style="{
              background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
              backdropFilter: hovered === base.id ? 'brightness(0.9)' : 'none',
              transition: 'backdrop-filter 0.3s, background 0.3s',
            }"
          >
            <div class="text-subtitle-1 font-weight-medium">
              {{ base.name }}
            </div>
          </div>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-col>
</template>

<script lang="ts" setup>
  import { getBaseMaps } from '@/services/baseMap'
  import type { BaseMap } from '@/types/baseMap'
  import { useStorage } from '@vueuse/core'
  import { onMounted, ref, type Ref } from 'vue'
  import { useVModel } from '@vueuse/core'

  const props = defineProps<{
    baseMapId: number | undefined
  }>()

  const emit = defineEmits<{
    (e: 'update:baseMapId', value: number): void
  }>()

  const baseMapId = useVModel(props, 'baseMapId', emit)

  const token = useStorage('token', '')

  const baseMaps: Ref<BaseMap[]> = ref([])
  const hovered = ref<number | null>(null)

  function selectBaseMap(id: number) {
    baseMapId.value = id
  }

  onMounted(async () => {
    baseMaps.value = await getBaseMaps(token.value)
    console.log('MAPS', baseMaps.value)
  })
</script>
