export interface GeoJsonFeature {
  type: string
  bbox: number[]
  geometry: {
    type: string
    coordinates: number[]
  }
  properties: {
    addresstype: string
    category: string
    display_name: string
    importance: number
    name: string
    osm_id: number
    osm_type: string
    place_id: number
    place_rank: number
    type: string
  }
}

export interface GeoJsonResponse {
  type: string
  features: GeoJsonFeature[]
  licence: string
}
