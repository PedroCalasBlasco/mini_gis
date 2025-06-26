<template>
  <v-card class="pa-4">
    <v-card-title>{{ props.title }}</v-card-title>
    <v-card-text>
      <v-list v-if="layers.length" class="pa-0">
        <v-list-item
          v-for="layer in layers"
          :key="layer.id"
          class="layer-item"
          :class="`layer-type-${layer.layerType?.toLowerCase()}`"
          rounded="lg"
          elevation="1"
        >
          <template #prepend>
            <v-avatar class="me-3" :color="getAvatarColor(layer)">
              <v-icon color="white">{{ getIcon(layer) }}</v-icon>
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-medium">
            {{ layer.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{
              `Layer Type:${layer.layerType}  - Geometry Type:${layer.geometryType}  - CRS:${layer.crs.code}`
            }}
          </v-list-item-subtitle>

          <template #append>
            <v-btn icon variant="text" color="primary" @click="viewStyleLayer(layer.id)">
              <v-icon v-if="layer.style">mdi-palette</v-icon>
              <v-badge v-else color="error" dot>
                <v-icon>mdi-palette</v-icon>
              </v-badge>
            </v-btn>
            <v-btn icon variant="text" color="primary" @click="viewTable(layer.id)">
              <v-icon v-if="layer.features && layer.features?.length > 0">mdi-table</v-icon>
              <v-badge v-else color="error" dot>
                <v-icon>mdi-table</v-icon>
              </v-badge>
            </v-btn>
            <v-btn icon variant="text" color="teal" @click="shareLayer(layer.id)">
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
            <v-btn icon variant="text" color="orange" @click="editLayer(layer.id)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon variant="text" color="red" @click="openDeleteDialog(layer)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>

      <v-alert v-else type="info" variant="tonal">No layers to show.</v-alert>
    </v-card-text>
  </v-card>

  <DeleteLayerDialog
    v-model:delete-dialog="deleteDialog"
    :layer="layerToDelete"
    @refresh="refresh"
  />
</template>

<script lang="ts" setup>
  import type { LayerFromAPI } from '@/types/layer'
  import { useVModel } from '@vueuse/core'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  import DeleteLayerDialog from '@/components/dashboard/DeleteLayerDialog.vue'

  const props = defineProps<{
    title: string
    layers: LayerFromAPI[]
  }>()

  const emit = defineEmits<{
    (e: 'update:layers', value: LayerFromAPI[]): void
    (e: 'refreshLayer'): void
  }>()

  const layers = useVModel(props, 'layers', emit)

  const router = useRouter()

  const deleteDialog = ref(false)
  const layerToDelete = ref<LayerFromAPI | undefined>(undefined)

  function openDeleteDialog(layer: LayerFromAPI) {
    layerToDelete.value = layer
    deleteDialog.value = true
  }

  function getIcon(layer: LayerFromAPI) {
    switch (layer.geometryType) {
      case 'Point':
        return 'mdi-vector-point'
      case 'LineString':
        return 'mdi-vector-line'
      case 'Polygon':
        return 'mdi-vector-polygon'
      default:
        return 'mdi-layers'
    }
  }

  function getAvatarColor(layer: LayerFromAPI) {
    switch (layer.layerType) {
      case 'Vector':
        return 'indigo-darken-4'
      case 'Raster':
        return 'success'
      case 'WMS':
        return 'secondary'
      case 'TMS':
        return 'info'
      default:
        return 'success'
    }
  }

  function viewStyleLayer(id: number) {
    router.push({ name: 'layerstyles', params: { idLayer: id } })
  }

  function viewTable(id: number) {
    router.push({ name: 'featurestable', params: { idLayer: id } })
  }

  function editLayer(id: number) {
    router.push({ name: 'editlayer', params: { idLayer: id } })
  }

  function shareLayer(id: number) {
    console.log('Compartir capa con id:', id)
  }

  async function refresh() {
    emit('refreshLayer')
  }
</script>

<style scoped>
  .layer-item {
    margin-bottom: 12px;
    padding: 12px;
    transition: all 0.2s ease-in-out;
    border: 1px solid #e0e0e0;
  }

  /* Hover genérico */
  .layer-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  /* Colores según tipo */
  .layer-type-vector {
    background-color: #e3f2fd;
  }
  .layer-type-vector:hover {
    background-color: #bbdefb;
  }

  .layer-type-raster {
    background-color: #fce4ec;
  }
  .layer-type-raster:hover {
    background-color: #f8bbd0;
  }

  .layer-type-wms {
    background-color: #e8f5e9;
  }
  .layer-type-wms:hover {
    background-color: #c8e6c9;
  }

  .layer-type-tms {
    background-color: #fff8e1;
  }
  .layer-type-tms:hover {
    background-color: #ffecb3;
  }
</style>
