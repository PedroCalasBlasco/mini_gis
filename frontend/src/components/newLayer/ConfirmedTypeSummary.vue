<template>
  <v-row>
    <v-col cols="12">
      <h3 class="mb-4">Confirmed Data Summary</h3>

      <v-alert
        v-if="!props.layerDataType"
        type="warning"
        variant="tonal"
        color="warning"
        class="mb-4"
      >
        No data has been confirmed yet. Please confirm data from one of the tabs above.
      </v-alert>

      <v-card v-else elevation="2" class="pa-4" color="success">
        <v-card-text>
          <v-row>
            <v-col cols="3">
              <p>
                <strong>Layer Type:</strong>
                {{ props.layerDataType?.layerType }}
              </p>
            </v-col>
            <v-col cols="6">
              <p>
                <strong>Coordinate System:</strong>
                {{ props.layerDataType?.crs?.label || 'N/A' }}
              </p>
            </v-col>
            <v-col cols="3">
              <p v-if="props.layerDataType?.layerType === 'Vector'">
                <strong>Geometry Type:</strong>
                {{ props.layerDataType.geometryType }}
              </p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import type { LayerDataType } from '@/types/layer'

  const props = defineProps<{
    layerDataType: LayerDataType | undefined
  }>()
</script>
