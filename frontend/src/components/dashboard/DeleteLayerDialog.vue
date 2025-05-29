<template>
  <v-dialog v-model="deleteDialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h6">¿Estás seguro de eliminar el layer?</v-card-title>
      <v-card-text>
        Se eliminará el layer
        <strong>{{ props.layer?.name }}</strong>
        permanentemente.
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
        <v-btn color="primary" variant="text" @click="handleDelete">Eliminar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { useStorage, useVModel } from '@vueuse/core'
  import { useSnackbarStore } from '@/store/snackbar'
  import type { LayerFromAPI } from '@/types/layer'
  import { deleteLayer } from '@/services/layers'

  const props = defineProps<{
    deleteDialog: boolean
    layer: LayerFromAPI | undefined
  }>()

  const emit = defineEmits<{
    (e: 'update:deleteDialogalog', value: boolean): void
    (e: 'refresh'): void
  }>()

  const deleteDialog = useVModel(props, 'deleteDialog', emit)

  const token = useStorage('token', '')

  const snackbar = useSnackbarStore()

  async function handleDelete() {
    try {
      if (props.layer) {
        await deleteLayer(props.layer.id, token.value)
        snackbar.openSnackbar('Layer deleted successfully', 'success')
        emit('refresh')
      }
    } catch (error) {
      console.error(error)
      snackbar.openSnackbar('Error deleting layer', 'error')
    } finally {
      deleteDialog.value = false
    }
  }
</script>
