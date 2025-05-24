<template>
  <v-dialog v-model="layerDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h6">Crear nuevo Layer</span>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleCreate">
          <v-text-field v-model="formData.name" label="Nombre del layer" required />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="layerDialog = false">Cancelar</v-btn>
        <v-btn color="primary" @click="handleCreate">Crear</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { useVModel } from '@vueuse/core'
  import { ref } from 'vue'

  const props = defineProps<{
    layerDialog: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:layerDialog', value: boolean): void
  }>()

  const layerDialog = useVModel(props, 'layerDialog', emit)

  const formData = ref({
    name: '',
    thumbnail: '',
  })

  function handleCreate() {
    if (!formData.value.name) return

    console.log('Nueva capa:', formData.value.name)
    // Aquí podrías guardar en `layers` si lo implementas

    // Limpiar y cerrar
    formData.value.name = ''
    formData.value.thumbnail = ''
    layerDialog.value = false
  }
</script>
