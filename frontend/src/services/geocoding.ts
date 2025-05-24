import ky from 'ky'
import { type GeoJsonResponse } from '@/types/location'

export const searchLocationFromNominatim = async (query: string): Promise<GeoJsonResponse> => {
  const BASE_URL = 'https://nominatim.openstreetmap.org/search'
  try {
    const response = await ky
      .get(BASE_URL, {
        searchParams: {
          q: query,
          format: 'geojson',
        },
      })
      .json<GeoJsonResponse>()

    return response
  } catch (error) {
    console.error('Error fetching location data:', error)
    throw error
  }
}
