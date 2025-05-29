<template>
  <v-row>
    <v-col cols="12">
      <h3 class="mb-4">Confirmed Data Summary</h3>

      <v-alert
        v-if="!props.featureSchema || props.featureSchema.length === 0"
        type="warning"
        variant="tonal"
        color="warning"
        class="mb-4"
      >
        No properties has been confirmed yet. Please confirm properties from one of the tabs above.
      </v-alert>

      <v-card v-else elevation="2" class="pa-4" color="success">
        <v-card-text>
          <v-row v-for="feature in props.featureSchema" :key="feature.name">
            <v-col cols="6">
              <p>
                <strong>Property Name:</strong>
                {{ feature.name }}
              </p>
            </v-col>
            <v-col cols="6">
              <p>
                <strong>Property Type:</strong>
                {{ feature.type }}
              </p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import type { PropertyDefinition } from '@/types/layer'

  const props = defineProps<{
    featureSchema: PropertyDefinition[] | undefined
  }>()
</script>
