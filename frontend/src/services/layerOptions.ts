import api from './api'
import type { EpsgResult } from '@/types/layer'

export async function getEpsgOptions(query: string): Promise<EpsgResult[]> {
  if (!query || query.length < 2) return []

  try {
    const response = await api
      .get('crs', {
        searchParams: { q: query },
      })
      .json<EpsgResult[]>()

    return response
  } catch (error) {
    console.error('Error fetching local EPSG options:', error)
    return []
  }
}
