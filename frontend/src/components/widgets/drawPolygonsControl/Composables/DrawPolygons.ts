import { ref, type Ref } from 'vue'
import L from 'leaflet'

const features: { type: string; layer: L.Polygon }[] = []

export function drawingPolygonTools(map: L.Map, featureType: Ref<number | undefined>) {
  const drawingMode = ref(false)
  const editingMode = ref(false)
  const deletingMode = ref(false)

  let currentPolygon: L.Polygon | null = null
  let previewLine: L.Polyline | null = null
  let editableMarkers: L.Marker[] = []
  let polygonPoints: L.LatLng[] = []

  function startDrawing() {
    stopEditing()
    cancelTemporaryPolygon()

    drawingMode.value = true
    polygonPoints = []

    map.getContainer().classList.add('drawing-cursor')

    map.on('click', handleAddPolygonPoint)
    map.on('mousemove', handleMouseMove)
    map.on('dblclick', finalizePolygon)
  }

  function stopDrawing() {
    map.off('click', handleAddPolygonPoint)
    map.off('mousemove', handleMouseMove)
    map.off('dblclick', finalizePolygon)

    map.getContainer().classList.remove('drawing-cursor')
    drawingMode.value = false
  }

  function handleAddPolygonPoint(e: L.LeafletMouseEvent) {
    if (!drawingMode.value) return
    e.originalEvent.stopPropagation()

    polygonPoints.push(e.latlng)

    if (!currentPolygon) {
      currentPolygon = L.polygon([polygonPoints], {
        color: 'green',
      }).addTo(map)
    } else {
      currentPolygon.setLatLngs([polygonPoints])
    }

    if (!previewLine) {
      previewLine = L.polyline([e.latlng, e.latlng], {
        color: 'gray',
        dashArray: '5, 10',
      }).addTo(map)
    }
  }

  function handleMouseMove(e: L.LeafletMouseEvent) {
    if (!drawingMode.value || polygonPoints.length === 0 || !previewLine) return
    const last = polygonPoints[polygonPoints.length - 1]
    previewLine.setLatLngs([last, e.latlng])
  }

  function finalizePolygon(e: L.LeafletMouseEvent) {
    if (!drawingMode.value) return
    e.originalEvent.stopPropagation()

    if (currentPolygon && polygonPoints.length >= 3) {
      features.push({ type: 'polygon', layer: currentPolygon })
    } else {
      currentPolygon?.remove()
    }

    currentPolygon = null
    previewLine?.remove()
    previewLine = null
    polygonPoints = []

    stopDrawing()
    featureType.value = undefined
  }

  function startEditing() {
    stopDrawing()

    map.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        currentPolygon = layer
      }
    })

    if (!currentPolygon) return
    editingMode.value = true

    const latlngs = currentPolygon.getLatLngs()[0] as L.LatLng[]

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
        currentPolygon!.setLatLngs([latlngs])
      })

      return marker
    })
  }

  function stopEditing() {
    editingMode.value = false
    editableMarkers.forEach((m) => m.remove())
    editableMarkers = []
  }

  function cancelTemporaryPolygon() {
    currentPolygon?.remove()
    currentPolygon = null

    previewLine?.remove()
    previewLine = null

    polygonPoints = []
  }

  return {
    startDrawing,
    stopDrawing,
    startEditing,
    stopEditing,
    cancelTemporaryPolygon,
    drawingMode,
    editingMode,
    deletingMode,
  }
}
