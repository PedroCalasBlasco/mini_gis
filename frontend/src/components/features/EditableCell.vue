<template>
  <component :is="inputComponent" v-model="modelValue" v-bind="inputProps" />
</template>

<script lang="ts" setup>
  import { computed, defineProps } from 'vue'
  import type { FeatureFromApi, FeatureProperty } from '@/types/feature'
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

  // Modelo editable
  const modelValue = computed({
    get() {
      return getCellModel(props.item, props.keyProp).value
    },
    set(val) {
      getCellModel(props.item, props.keyProp).value = val
    },
  })

  // Buscar el tipo desde el property
  const propertyType = computed(() => {
    const prop: FeatureProperty | undefined = props.item.properties?.find(
      (p) => p.name === props.keyProp
    )
    return prop?.type ?? 'string'
  })

  // Determinar componente por tipo
  const inputComponent = computed(() => {
    switch (propertyType.value) {
      case 'boolean':
        return 'v-switch'
      case 'date':
      case 'number':
      case 'string':
      default:
        return 'v-text-field'
    }
  })

  // Props específicas por tipo
  const inputProps = computed(() => {
    switch (propertyType.value) {
      case 'boolean':
        return {
          inset: true,
          color: 'primary',
          hideDetails: true,
        }
      case 'number':
        return {
          type: 'number',
          density: 'compact',
          hideDetails: true,
        }
      case 'date':
        return {
          type: 'date',
          density: 'compact',
          hideDetails: true,
        }
      case 'string':
      default:
        return {
          type: 'text',
          density: 'compact',
          hideDetails: true,
        }
    }
  })
</script>
