import type { Feature } from './feature'
import type { User } from './user'

export interface Layer {
  name: string
  description?: string
  users?: User[]
  features?: Feature[]
  geometryType?: string
  sourceUrl?: string
  ownerId: number
  isPublic: boolean
  featureSchema?: any
  metadata?: any
  crs: EpsgResult
  isVisible: boolean
  opacity: number
  style?: any
  layerType: string
}

export interface LayerFromAPI extends Layer {
  id: number
  createdAt: string
  updatedAt: string
}

export interface EpsgResult {
  code: string
  name: string
  label: string
}

export type LayerDataSource = 'manual' | 'url' | 'file' | ''

export type GeometryType = 'Point' | 'LineString' | 'Polygon'

export type LayerType = 'Vector' | 'Raster' | 'WMS' | 'TMS'

export interface LayerDataType {
  layerType: string
  crs: EpsgResult
  geometryType?: string
}

export interface PropertyDefinition {
  name: string
  type: 'string' | 'number' | 'boolean' | 'date'
}
