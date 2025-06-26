import type { Widget } from './widget'
import type { Layer, LayerFromAPI } from './layer'
import type { BaseMap } from './baseMap'

export interface MapData {
  centerLat: number
  centerLng: number
  zoom: number
  bbox: Bbox
}

export interface MapLayer {
  layerId: number
  mapId: number
  layer: LayerFromAPI
}

export interface Map {
  name: string
  description?: string
  isPublic: boolean
  centerLat: number
  centerLng: number
  userId: number
  zoom: number
  bbox: Bbox
  baseMapId?: number
  mapLayers: MapLayer[]
  widgets: Widget[]
  baseMap?: BaseMap
}

export interface MapFromAPI extends Map {
  id: number
  createdAt: string
  updatedAt: string
}

export interface Bbox {
  maxLat: number
  maxLng: number
  minLat: number
  minLng: number
}
