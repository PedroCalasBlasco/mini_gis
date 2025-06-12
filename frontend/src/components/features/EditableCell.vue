<template>
  <v-text-field v-model="modelValue" density="compact" hide-details />
</template>

<script lang="ts" setup>
  import { computed, defineProps } from 'vue'
  import type { FeatureFromApi } from '@/types/feature'
  import { useFeaturesTable } from './composables/useFeaturesTable'
  import { useVModel } from '@vueuse/core'

  const props = defineProps<{
    item: FeatureFromApi
    keyProp: string
    features: FeatureFromApi[]
  }>()

  const emit = defineEmits<{
    (e: 'update:features', value: FeatureFromApi[]): void
  }>()

  const features = useVModel(props, 'features', emit)

  const { getCellModel } = useFeaturesTable({
    features: features.value,
  })

  const modelValue = computed({
    get() {
      return getCellModel(props.item, props.keyProp).value
    },
    set(val) {
      getCellModel(props.item, props.keyProp).value = val
    },
  })
</script>
