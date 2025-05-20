<template>
  <v-dialog v-model="mapDialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h6">Crear nuevo Mapa</span>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleCreate">
          <v-text-field v-model="formData.name" label="Nombre del mapa" required />
          <v-text-field v-model="formData.thumbnail" label="URL de miniatura" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text">Cancelar</v-btn>
        <v-btn color="primary" @click="handleCreate">Crear</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { useVModel } from '@vueuse/core'
  import { ref } from 'vue'

  const props = defineProps<{
    mapDialog: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:mapDialog', value: boolean): void
  }>()

  const mapDialog = useVModel(props, 'mapDialog', emit)

  const formData = ref({
    name: '',
    thumbnail: '',
  })

  function handleCreate() {
    if (!formData.value.name) return

    console.log('PEDRO')

    // Limpiar y cerrar
    formData.value.name = ''
    formData.value.thumbnail = ''
    mapDialog.value = false
  }
</script>
