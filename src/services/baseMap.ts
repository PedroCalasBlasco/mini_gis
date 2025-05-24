import type { BaseMap } from '@/types/baseMap'
import api from './api'

export const getBaseMaps = async (token: string): Promise<BaseMap[]> => {
  return await api
    .get(`basemaps`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json()
}
