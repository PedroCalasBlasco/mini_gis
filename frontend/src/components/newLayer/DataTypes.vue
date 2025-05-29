<template>
  <v-row>
    <!-- Tipo y source -->
    <v-col cols="12" class="pt-4">
      <h3>Types And Data</h3>
    </v-col>
    <v-col cols="6" class="pb-0 pt-0">
      <v-tabs v-model="tab" background-color="transparent" grow>
        <v-tab value="manual">Manual</v-tab>
        <v-tab value="url">From URL</v-tab>
        <v-tab value="file">From File</v-tab>
      </v-tabs>
    </v-col>

    <v-col cols="12" class="pt-1" style="min-height: 100px">
      <v-window v-model="tab" class="mt-4">
        <v-window-item value="manual">
          <ManuallyTab v-model:layer-data-type="layerDataType" :is-disabled="isDisabled" />
        </v-window-item>

        <v-window-item value="url">
          <UrlTab v-model:layer-data-type="layerDataType" :is-disabled="isDisabled" />
        </v-window-item>

        <v-window-item value="file">
          <FileTab v-model:layer-data-type="layerDataType" :is-disabled="isDisabled" />
        </v-window-item>
      </v-window>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useVModel } from '@vueuse/core'
  import type { LayerDataType } from '@/types/layer'

  import ManuallyTab from '@/components/newLayer/ManuallyTab.vue'
  import UrlTab from '@/components/newLayer/UrlTab.vue'
  import FileTab from '@/components/newLayer/FileTab.vue'

  const tab = ref('manual')

  const props = defineProps<{
    layerDataType: LayerDataType
    isDisabled: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:layerDataType', value: LayerDataType): void
  }>()

  const layerDataType = useVModel(props, 'layerDataType', emit)
</script>
