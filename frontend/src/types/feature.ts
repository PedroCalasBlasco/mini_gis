type PointGeometry = {
  type: 'Point'
  coordinates: [number, number] // Ej: [0, 0]
}

type LineStringGeometry = {
  type: 'LineString'
  coordinates: [number, number][] // Ej: [[0,0], [1,1], [2,2]]
}

type PolygonGeometry = {
  type: 'Polygon'
  coordinates: [[number, number][]] // Ej: [[[0,0], [1,1], [2,2], [0,0]]]
}

export type Geometry = PointGeometry | LineStringGeometry | PolygonGeometry

export type PropertyValue = string | number | boolean | Date

export type CellValue = PropertyValue | number | string | Geometry['coordinates'] | undefined

export interface FeatureProperty {
  name: string
  type: string
  value: PropertyValue
}

export interface FeatureFromApi {
  id: string
  type: 'Feature'
  layerId: string
  geometry: Geometry
  properties: FeatureProperty[]
  createdAt?: string
  updatedAt?: string
}

export interface Header {
  title: string
  key: string
  sortable: boolean
  fixed?: boolean
  lastFixed?: boolean
}
