//https://test-utils.vuejs.org/guide/essentials/easy-to-test.html

import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { useStorage } from '@vueuse/core'
import { nextTick } from 'vue'

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Configurar Vuetify para los tests
const vuetify = createVuetify({
  components,
  directives,
})

describe('App.vue - Condiciones iniciales', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    // Reiniciar el almacenamiento para evitar contaminación entre tests
    useStorage('theme', 'light')

    // Montar el componente antes de cada prueba
    wrapper = mount(App, {
      global: {
        plugins: [vuetify],
      },
    })
  })

  it('el v-select muestra el tema inicial', async () => {
    await nextTick()
    const select = wrapper.findComponent({ name: 'VSelect' })
    expect(select.exists()).toBe(true)
    expect(select.props('modelValue')).toBe('light')
  })

  it('el v-select contiene los temas "light" y "dark"', () => {
    const select = wrapper.findComponent({ name: 'VSelect' })
    expect(select.props('items')).toEqual(['light', 'dark'])
  })
})
