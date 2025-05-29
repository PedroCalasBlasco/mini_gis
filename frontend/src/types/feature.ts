import type { Layer } from './layer'

export interface Feature {
  id: number
  name?: string
  type: string
  layerId: number
  geometry: any
  layer?: Layer
}
