import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MapView from '@/views/MapView.vue'
import L from 'leaflet'
import { baseMaps, defaultMap } from '@/constants/baseMaps'
import { center, defaultZoom } from '@/constants/mapConfig'
import { polygon } from '@/constants/layers/polygon'
import { basemapsControl } from '@/components/basemapsControl/basemapControl'

vi.mock('leaflet', async (importOriginal) => {
  const actual = await importOriginal<typeof import('leaflet')>()

  return {
    ...actual,
    map: vi.fn(() => ({
      setView: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      addControl: vi.fn(),
      whenReady: vi.fn((callback) => callback()), // Simular que el mapa está listo
      getRenderer: vi.fn(), // Evitar error en getRenderer
      _leaflet_id: 1, // Evitar error de _leaflet_id
    })),
    geoJSON: vi.fn(() => ({
      addTo: vi.fn(),
    })),
    control: {
      layers: vi.fn(() => ({
        addTo: vi.fn(),
      })),
    },
    tileLayer: vi.fn(() => ({
      addTo: vi.fn(),
    })),
  }
})

describe('MapView.vue', () => {
  it('se monta el mapa correctamente', async () => {
    const wrapper = mount(MapView, { attachTo: document.body })

    await wrapper.vm.$nextTick() // Asegura que Vue actualiza el DOM
    await new Promise((resolve) => setTimeout(resolve, 100)) // Simula carga de Leaflet

    const mapElement = wrapper.find('.map') // Busca el div del mapa
    expect(mapElement.exists()).toBe(true) // Verifica que existe

    expect(L.map).toHaveBeenCalledWith(expect.anything())
  })

  // it('agrega la capa base y las capas adicionales', () => {
  //   mount(MapView)

  //   expect(L.map().setView).toHaveBeenCalledWith(center, defaultZoom) // Se posiciona el mapa
  //   expect(defaultMap.addTo).toHaveBeenCalled() // Se añade la capa base
  //   expect(L.geoJSON).toHaveBeenCalledWith(polygon) // Se añade el polígono
  //   expect(L.geoJSON().addTo).toHaveBeenCalled() // Se agrega el polígono al mapa
  // })

  // it('agrega los controles de capas y basemaps', () => {
  //   mount(MapView)

  //   expect(L.control.layers).toHaveBeenCalledWith(baseMaps) // Se agregan las capas base
  //   expect(L.control.layers().addTo).toHaveBeenCalled() // Se añaden al mapa
  //   expect(L.map().addControl).toHaveBeenCalledWith(
  //     new basemapsControl({ position: 'bottomright' })
  //   ) // Se agrega el control de basemaps
  // })
})
