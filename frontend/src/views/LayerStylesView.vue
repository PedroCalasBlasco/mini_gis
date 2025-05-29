<template>
  <div class="scroll-wrapper">
    <v-container class="mt-4">
      <v-card elevation="2" class="pa-6">
        <v-card-title class="text-h5">Features Tabler</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <h3 class="mb-2">Visibility</h3>
              <v-switch v-model="layer.isVisible" label="Visible by Default" />
            </v-col>
            <v-col cols="6">
              <v-slider
                v-model="layer.opacity"
                label="Opacity"
                min="0"
                max="1"
                step="0.1"
                thumb-label
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
  import type { Layer } from '@/types/layer'
  import { useVModel } from '@vueuse/core'

  const props = defineProps<{
    layer: Layer
  }>()

  const emit = defineEmits<{
    (e: 'update:layer', value: Layer): void
  }>()

  const layer = useVModel(props, 'layer', emit)
</script>
