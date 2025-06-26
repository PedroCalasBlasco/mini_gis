import { ref, type Ref } from 'vue'
import L from 'leaflet'

const features: { type: string; layer: L.Polyline }[] = []

export function drawingPolilinesTools(map: L.Map, featureType: Ref<number | undefined>) {
  const drawingMode = ref(false)
  const editingMode = ref(false)
  const deletingMode = ref(false)

  let currentPolyline: L.Polyline | null = null
  let previewLine: L.Polyline | null = null
  let editableMarkers: L.Marker[] = []
  let polylinePoints: L.LatLng[] = []

  function startDrawing() {
    stopEditing()
    cancelTemporaryPolyline()

    drawingMode.value = true
    polylinePoints = []

    map.getContainer().classList.add('drawing-cursor')

    map.on('click', handleAddPolylinePoint)
    map.on('mousemove', handleMouseMove)
    map.on('dblclick', finalizePolyline)
  }

  function stopDrawing() {
    map.off('click', handleAddPolylinePoint)
    map.off('mousemove', handleMouseMove)
    map.off('dblclick', finalizePolyline)

    map.getContainer().classList.remove('drawing-cursor')
    drawingMode.value = false
  }

  function handleAddPolylinePoint(e: L.LeafletMouseEvent) {
    if (!drawingMode.value) return
    e.originalEvent.stopPropagation()

    polylinePoints.push(e.latlng)

    if (!currentPolyline) {
      currentPolyline = L.polyline([e.latlng], {
        color: 'blue',
      }).addTo(map)
    } else {
      currentPolyline.addLatLng(e.latlng)
    }

    if (!previewLine) {
      previewLine = L.polyline([e.latlng, e.latlng], {
        color: 'blue',
        dashArray: '5, 10',
      }).addTo(map)
    }
  }

  function handleMouseMove(e: L.LeafletMouseEvent) {
    if (!drawingMode.value || polylinePoints.length === 0 || !previewLine) return
    const lastFixed = polylinePoints[polylinePoints.length - 1]
    previewLine.setLatLngs([lastFixed, e.latlng])
  }

  function finalizePolyline(e: L.LeafletMouseEvent) {
    if (!drawingMode.value) return
    e.originalEvent.stopPropagation()

    if (currentPolyline && polylinePoints.length > 1) {
      features.push({ type: 'polyline', layer: currentPolyline })
    } else if (currentPolyline) {
      currentPolyline.remove()
      currentPolyline = null
    }

    if (previewLine) {
      previewLine.remove()
      previewLine = null
    }

    polylinePoints = []
    stopDrawing()
    featureType.value = undefined
  }

  function startEditing() {
    stopDrawing()

    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
        currentPolyline = layer
      }
    })

    if (!currentPolyline) return
    editingMode.value = true

    console.log('currentPolyline', currentPolyline)

    const latlngs = currentPolyline.getLatLngs() as L.LatLng[]
    editableMarkers = latlngs.map((point, idx) => {
      const marker = L.marker(point, {
        draggable: true,
        icon: L.divIcon({
          className: 'leaflet-div-icon',
          html: '<div style="width:10px;height:10px;background:red;border-radius:50%;"></div>',
        }),
      }).addTo(map)

      marker.on('drag', () => {
        latlngs[idx] = marker.getLatLng()
        currentPolyline!.setLatLngs(latlngs)
        if (previewLine) previewLine.setLatLngs(latlngs)
      })

      return marker
    })

    if (!previewLine) {
      previewLine = L.polyline(latlngs, {
        color: 'blue',
        dashArray: '5, 10',
      }).addTo(map)
    }
  }

  function stopEditing() {
    editingMode.value = false
    editableMarkers.forEach((m) => m.remove())
    editableMarkers = []
    if (previewLine) {
      previewLine.remove()
      previewLine = null
    }
  }

  function cancelTemporaryPolyline() {
    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
        currentPolyline = layer
      }
    })

    if (currentPolyline) {
      currentPolyline.remove()
      currentPolyline = null
    }
    if (previewLine) {
      previewLine.remove()
      previewLine = null
    }
    polylinePoints = []
  }

  return {
    startDrawing,
    stopDrawing,
    startEditing,
    stopEditing,
    cancelTemporaryPolyline,
    deletingMode,
    drawingMode,
    editingMode,
  }
}
