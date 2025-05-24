// Descargar geojson https://geojson.io/

import { GeoJSON } from 'leaflet'

export const polygon = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'pruena2',
      },
      geometry: {
        coordinates: [
          [
            [-0.12052301041521218, 51.4460852199193],
            [-0.12052301041521218, 51.46896267935915],
            [-0.13071325245300613, 51.46896267935915],
            [-0.13071325245300613, 51.4460852199193],
            [-0.12052301041521218, 51.4460852199193],
          ],
        ],
        type: 'Polygon',
      },
      id: 0,
    },
  ],
} as GeoJSON.GeoJsonObject
