import api from './api'
import type { Map } from '../types/map'

export const getMapsByUser = async (userId: string, token: string): Promise<Map[]> => {
  return await api
    .get(`maps?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json()
}
