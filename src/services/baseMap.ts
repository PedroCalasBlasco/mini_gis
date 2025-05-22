import type { baseMap } from '@/types/baseMap'
import api from './api'

export const getBaseMaps = async (token: string): Promise<baseMap[]> => {
  return await api
    .get(`basemaps`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json()
}
