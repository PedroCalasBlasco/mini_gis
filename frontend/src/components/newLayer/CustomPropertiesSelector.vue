<template>
  <v-row>
    <v-col cols="12" class="mt-4">
      <v-row>
        <v-col cols="12">
          <h3>Custom Properties</h3>
        </v-col>
        <v-col cols="6">
          <v-btn variant="outlined" :disabled="isDisabled" @click="addProperty">
            <v-icon left>mdi-plus</v-icon>
            Add Property
          </v-btn>
        </v-col>
        <v-col cols="6" class="text-end">
          <v-btn
            v-if="!confirmed"
            color="primary"
            :disabled="confirmButtonIsDisabled"
            @click="confirmCustom"
          >
            Confirm
          </v-btn>
          <v-btn v-else color="secondary" @click="editCustom">Edit</v-btn>
          <v-btn color="error" class="ml-2" @click="clearCustom">Clear All</v-btn>
        </v-col>
      </v-row>
      <v-row v-for="(prop, index) in featureSchema" :key="index" class="mb-2">
        <v-col cols="5">
          <v-text-field
            v-model="prop.name"
            hide-details="auto"
            density="compact"
            label="Property Name"
            :disabled="isDisabled"
            :rules="[(v) => !!v || 'Required']"
          />
        </v-col>
        <v-col cols="5">
          <v-select
            v-model="prop.type"
            hide-details="auto"
            variant="outlined"
            density="compact"
            :items="['string', 'number', 'boolean', 'date']"
            label="Type"
            :disabled="isDisabled"
            :rules="[(v) => !!v || 'Required']"
          />
        </v-col>
        <v-col cols="2" class="d-flex align-center">
          <v-btn
            class="ml-2"
            icon
            color="error"
            variant="text"
            density="compact"
            :disabled="isDisabled"
            @click="removeProperty(index)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import { useVModel } from '@vueuse/core'
  import { computed, ref, watch } from 'vue'
  import type { PropertyDefinition } from '@/types/layer'

  const props = defineProps<{
    featureSchema: PropertyDefinition[]
    confirmedFeatureSchema: PropertyDefinition[] | undefined
  }>()

  const emit = defineEmits<{
    (e: 'update:featureSchema', value: PropertyDefinition[]): void
    (e: 'update:confirmedFeatureSchema', value: PropertyDefinition[] | undefined): void
  }>()

  const featureSchema = useVModel(props, 'featureSchema', emit)
  const confirmedFeatureSchema = useVModel(props, 'confirmedFeatureSchema', emit)

  const confirmed = ref(false)

  watch(confirmedFeatureSchema, (newVal) => {
    confirmed.value = newVal !== undefined
  })

  const confirmButtonIsDisabled = computed(() => {
    return (
      featureSchema.value.length === 0 ||
      featureSchema.value.some((prop) => !prop.name || !prop.type)
    )
  })

  const isDisabled = computed(() => confirmed.value)

  function confirmCustom() {
    confirmed.value = true
    confirmedFeatureSchema.value = featureSchema.value
  }

  function editCustom() {
    confirmed.value = false
  }

  function clearCustom() {
    confirmed.value = false
    featureSchema.value = []
    confirmedFeatureSchema.value = []
  }

  function addProperty() {
    featureSchema.value.push({ name: '', type: 'string' })
  }

  function removeProperty(index: number) {
    featureSchema.value.splice(index, 1)
  }
</script>
