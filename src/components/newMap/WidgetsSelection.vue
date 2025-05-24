<template>
  <v-col cols="6">
    <h3 class="mb-2">Add Widgets</h3>
    <v-chip
      v-for="widget in widgets"
      :key="widget.id"
      class="ma-1 mt-4"
      :color="isWidgetSelected(widget) ? 'primary' : 'grey lighten-2'"
      :class="{
        'text-white': isWidgetSelected(widget),
        'elevation-4': isWidgetSelected(widget),
        'elevation-2': !isWidgetSelected(widget),
        'border-selected': isWidgetSelected(widget),
        'cursor-pointer': true,
      }"
      variant="elevated"
      @click="toogleWidget(widget)"
    >
      {{ widget.name }}
    </v-chip>
  </v-col>
</template>

<script lang="ts" setup>
  import { getWidgets } from '@/services/widgets'
  import type { Widget } from '@/types/widget'
  import { useStorage } from '@vueuse/core'
  import { onMounted, ref, type Ref } from 'vue'
  import { useVModel } from '@vueuse/core'

  const props = defineProps<{
    selectedWidgets: Widget[]
  }>()

  const emit = defineEmits<{
    (e: 'update:selectedWidgets', value: Widget[]): void
  }>()

  const selectedWidgets = useVModel(props, 'selectedWidgets', emit)

  const token = useStorage('token', '')

  const widgets: Ref<Widget[]> = ref([])

  const isWidgetSelected = (widget: Widget) => {
    return selectedWidgets.value.some((w) => w.id === widget.id)
  }

  const toogleWidget = (widget: Widget) => {
    const index = selectedWidgets.value.findIndex((w) => w.id === widget.id)
    if (index === -1) {
      selectedWidgets.value.push(widget)
    } else {
      selectedWidgets.value.splice(index, 1)
    }
  }

  onMounted(async () => {
    widgets.value = await getWidgets(token.value)
  })
</script>

<style lang="scss" scoped>
  .border-selected {
    border: 2px solid var(--v-theme-secondary);
  }
</style>
