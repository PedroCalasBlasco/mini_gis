import type { FeatureFromApi } from '@/types/feature'
import api from './api'

export const getFeaturesByLayer = async (
  layerId: string,
  token: string
): Promise<FeatureFromApi[]> => {
  return await api
    .get(`features?layerId=${layerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json()
}

export const createFeatures = async (data: FeatureFromApi[], token: string): Promise<void> => {
  const cleanedData = data.map(({ id: _, ...rest }) => ({
    ...rest,
    // NO convertimos properties, lo dejamos como array
  }))

  await api.post('features', {
    json: cleanedData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
