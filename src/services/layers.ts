import api from './api'
import type { Layer } from '../types/layer'

export const getLayersByUser = async (userId: string, token: string): Promise<Layer[]> => {
  return await api
    .get(`layers?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json()
}
