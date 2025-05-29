<template>
  <v-row>
    <v-col cols="6">
      <v-text-field
        v-model="sourceUrl"
        label="Source URL"
        type="url"
        class="pt-2"
        :disabled="props.isDisabled"
      />
    </v-col>
    <v-col cols="6" class="d-flex align-center pt-5">
      <v-btn color="primary" :disabled="props.isDisabled" @click="getDataFromSource">
        get data
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import type { LayerDataType } from '@/types/layer'
  import { useVModel } from '@vueuse/core'
  import { ref } from 'vue'

  const props = defineProps<{
    layerDataType: LayerDataType
    isDisabled: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:layerDataType', value: LayerDataType): void
  }>()

  const layerDataType = useVModel(props, 'layerDataType', emit)

  const sourceUrl = ref()

  function getDataFromSource() {
    console.log('PEDRO', sourceUrl.value)
  }
</script>
