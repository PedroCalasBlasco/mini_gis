import L from 'leaflet'
import { baseMaps, baseMapsThumb } from '../../../constants/basemaps'
import './styles.css'

const createElement = (tag: string, className?: string) => L.DomUtil.create(tag, className)

export const basemapsControl = L.Control.extend({
  onAdd(mapInstance: L.Map) {
    const container = createElement('div', 'custom-control')
    container.innerHTML = '<span class="icon-earth">🌍</span>'

    const menu = createElement('div', 'layer-menu')

    Object.keys(baseMaps).forEach((key) => {
      const thumb = baseMapsThumb.find((item) => item.id === key)
      if (thumb) {
        const div = createElement('div', 'map-button')
        const img = createElement('img', 'map-thumb') as HTMLImageElement
        img.src = thumb.url
        img.alt = key
        const label = createElement('div', 'map-label')
        label.textContent = key
        div.onclick = () => {
          mapInstance.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
              mapInstance.removeLayer(layer)
            }
          })
          baseMaps[key].addTo(mapInstance)
        }
        div.append(img, label)
        menu.appendChild(div)
      }
    })

    let isMenuVisible = false
    container.onclick = () => {
      isMenuVisible = !isMenuVisible
      menu.classList.toggle('visible', isMenuVisible)
      container.classList.toggle('active', isMenuVisible)
    }

    container.appendChild(menu)
    return container
  },
})
