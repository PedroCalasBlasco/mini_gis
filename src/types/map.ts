import type { Widget } from './widget'
import type { Layer } from './layer'

export interface Map {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  isPublic: boolean
  centerLat: number
  centerLng: number
  bbox: Bbox
  baseMapId: number
  layers: Layer[]
  widgets: Widget[]
  baseMap: BaseMap
}

export interface Bbox {
  maxLat: number
  maxLng: number
  minLat: number
  minLng: number
}

export interface BaseMap {
  id: number
  name: string
  url: string
}
