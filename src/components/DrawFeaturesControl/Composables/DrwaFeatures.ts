import { ref } from 'vue'
import L from 'leaflet'

const features: { type: string; layer: L.Layer }[] = []

export function drawingMapTools(map: L.Map) {
  const featureType = ref<number | undefined>(undefined)
  const drawingMode = ref(false)
  const deletingMode = ref(false)

  // Add a marker
  function addMarker(event?: Event) {
    deletingMode.value = false
    if (event) event.stopPropagation()
    drawingMode.value = !drawingMode.value

    if (drawingMode.value) {
      map.on('click', handleAddMarker)
    } else {
      map.off('click', handleAddMarker)
    }
  }

  function handleAddMarker(e: L.LeafletMouseEvent) {
    e.originalEvent.stopPropagation()

    if (drawingMode.value) {
      const marker = L.marker(e.latlng).addTo(map)
      features.push({ type: 'marker', layer: marker })
    }
  }

  function removeFeature(event?: Event) {
    drawingMode.value = false
    featureType.value = undefined
    if (event) event.stopPropagation() // Evita que el clic en el botón afecte al mapa

    deletingMode.value = !deletingMode.value
    console.log(`Modo eliminación: ${deletingMode.value ? 'Activado' : 'Desactivado'}`)

    if (deletingMode.value) {
      map.on('click', handleDeleteFeature)
    } else {
      map.off('click', handleDeleteFeature)
    }
  }

  function handleDeleteFeature(e: L.LeafletMouseEvent) {
    e.originalEvent.stopPropagation()

    const featureToRemove = features.find((f) => {
      // Verificar si el clic está cerca de un marcador
      if ('getLatLng' in f.layer && typeof f.layer.getLatLng === 'function') {
        return f.layer.getLatLng().distanceTo(e.latlng) < 100 // 10 metros de tolerancia
      }

      // Verificar si el clic está dentro de un polígono o línea
      if ('getBounds' in f.layer && typeof f.layer.getBounds === 'function') {
        return f.layer.getBounds().contains(e.latlng)
      }

      return false
    })

    if (featureToRemove) {
      featureToRemove.layer.remove()
      const index = features.indexOf(featureToRemove)
      if (index !== -1) features.splice(index, 1)
    }
  }

  function cancelDrawing() {
    featureType.value = undefined
    deletingMode.value = false
    drawingMode.value = false
    map.off('click', handleAddMarker)
    map.off('click', handleDeleteFeature)
  }

  return {
    featureType,
    addMarker,
    removeFeature,
    cancelDrawing,
    deletingMode,
  }
}
