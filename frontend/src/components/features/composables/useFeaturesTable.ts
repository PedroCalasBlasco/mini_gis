import { computed, ref } from 'vue'
import type {
  FeatureFromApi,
  PropertyValue,
  Header,
  CellValue,
  Geometry,
  FeatureProperty,
} from '@/types/feature'

export function useFeaturesTable(props: { features: FeatureFromApi[] }) {
  const { features: featuresProp } = props

  const features = ref(featuresProp)

  const baseHeaders = ref<Header[]>([
    { title: 'Geometry Type', key: 'geometryType', sortable: false },
    { title: 'Geometry', key: 'geometry', sortable: false },
    {
      title: 'Actions',
      key: 'actions',
      sortable: false,
      fixed: true,
      lastFixed: true,
    },
  ])

  // Generar headers combinados
  const headers = computed(() => {
    if (!features.value.length) return baseHeaders.value

    console.log('properties', features.value[0].properties)

    const properties = features.value[0].properties
    if (!properties) return baseHeaders.value

    const propertyHeaders = properties.map((prop: FeatureProperty) => ({
      title: prop.name.charAt(0).toUpperCase() + prop.name.slice(1),
      key: prop.name,
      sortable: false,
    }))

    // Evitar duplicados y mantener orden
    return [
      ...propertyHeaders,
      ...baseHeaders.value.filter((h) => !propertyHeaders.some((ph) => ph.key === h.key)),
    ]
  })

  // Helpers

  const isPropertyKey = (key: string): boolean => {
    return features.value?.[0]?.properties?.some((p) => p.name === key) ?? false
  }

  const getCellValue = (item: FeatureFromApi, key: string): CellValue => {
    if (isPropertyKey(key)) {
      const prop = item.properties?.find((p) => p.name === key)
      return prop?.value
    }

    switch (key) {
      case 'id':
        return item.id
      case 'geometryType':
        return item.geometry.type
      case 'geometry':
        return item.geometry.coordinates
      default:
        return undefined
    }
  }

  const getCellModel = (item: FeatureFromApi, key: string) =>
    computed<CellValue>({
      get: () => {
        if (isPropertyKey(key)) {
          const prop = item.properties?.find((p) => p.name === key)
          return prop?.value
        }
        switch (key) {
          case 'id':
            return item.id
          case 'geometryType':
            return item.geometry.type
          case 'geometry':
            return item.geometry.coordinates
          default:
            return undefined
        }
      },
      set: (val) => {
        if (isPropertyKey(key)) {
          const prop = item.properties?.find((p) => p.name === key)
          if (prop) prop.value = val as PropertyValue
        } else {
          switch (key) {
            case 'geometryType':
              item.geometry.type = val as Geometry['type']
              break
            case 'geometry':
              item.geometry.coordinates = val as Geometry['coordinates']
              break
          }
        }
      },
    })

  return {
    features,
    headers,
    getCellValue,
    getCellModel,
  }
}
