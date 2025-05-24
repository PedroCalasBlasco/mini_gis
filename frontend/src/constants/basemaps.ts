// baseMaps Repository https://leaflet-extras.github.io/leaflet-providers/preview/
import L from 'leaflet'

const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
})

const satellite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  }
)

// const night = L.tileLayer(
//   'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}',
//   {
//     attribution:
//       'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
//     bounds: [
//       [-85.0511287776, -179.999999975],
//       [85.0511287776, 179.999999975],
//     ],
//     minZoom: 1,
//     maxZoom: 8,
//     time: '',
//   }
// )

const openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution:
    'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
})

export const baseMaps: { [key: string]: L.TileLayer } = {
  OpenStreetMap: osm,
  Satellite: satellite,
  // NightVision: night,
  OpenTopoMap: openTopoMap,
}

export const defaultMap = osm

export const baseMapsThumb = [
  {
    id: 'OpenStreetMap',
    url: '/src/assets/img/openstreet.png',
  },
  {
    id: 'Satellite',
    url: '/src/assets/img/satellite.png',
  },
  {
    id: 'OpenTopoMap',
    url: '/src/assets/img/topo.png',
  },
]
