<template>
  <v-snackbar
    v-model="snackbar"
    :color="props.type === 'success' ? 'success' : 'error'"
    timeout="2000"
    bottom
    center
  >
    {{ props.message }}

    <template #actions>
      <v-btn color="white" variant="text" icon @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
  import { useVModel } from '@vueuse/core'

  const props = defineProps<{
    type: 'success' | 'error' | 'info' | 'warning'
    message: string
    snackbar: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:snackbar', value: boolean): void
  }>()

  const snackbar = useVModel(props, 'snackbar', emit)
</script>
