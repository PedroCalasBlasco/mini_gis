import type { Widget } from '@/types/widget'
import api from './api'

export const getWidgets = async (token: string): Promise<Widget[]> => {
  return await api
    .get(`widgets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json()
}
