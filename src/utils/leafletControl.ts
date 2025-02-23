import { createApp, defineComponent, h, type Component } from 'vue'
import { createVuetify } from 'vuetify'
import L from 'leaflet'
import 'vuetify/styles'

const vuetify = createVuetify()

/**
 * Crea un control de Leaflet que monta un componente Vue.
 * @param {string} className - Clase CSS para el control.
 * @param {Component} component - Componente Vue a montar.
 * @returns {L.Control} Control de Leaflet personalizado.
 */

export function createLeafletControl(className: string, component: Component, map: L.Map) {
  return L.Control.extend<any>({
    onAdd(): HTMLElement {
      const container = L.DomUtil.create('div', className)

      const app = createApp(defineComponent({ render: () => h(component, { map }) }))
      app.use(vuetify)
      app.mount(container)

      return container
    },
  })
}
