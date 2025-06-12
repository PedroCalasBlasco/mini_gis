import api from './api'
import type { Layer, LayerFromAPI } from '../types/layer'

export const getLayersByUser = async (userId: string, token: string): Promise<LayerFromAPI[]> => {
  return await api
    .get(`layers?ownerId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json()
}

export const getLayersSharedWithUser = async (
  userId: string,
  token: string
): Promise<LayerFromAPI[]> => {
  return await api
    .get(`layers/shared?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json()
}

export const getPublicLayers = async (userId: string, token: string): Promise<LayerFromAPI[]> => {
  return await api
    .get(`layers/public?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json()
}

export const getLayerById = async (layerId: string, token: string): Promise<LayerFromAPI> => {
  return await api
    .get(`layers/${layerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json()
}

export async function createLayer(newLayer: Layer, token: string) {
  try {
    const response = await api.post('layers', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      json: newLayer,
    })

    return await response.json()
  } catch (error) {
    console.error('❌ Error al crear el mapa:', error)
    throw error
  }
}

export const deleteLayer = async (layerId: number, token: string): Promise<{ message: string }> => {
  return await api
    .delete(`layers/${layerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json()
}

export async function updateLayer(id: string, updatedLayer: Layer, token: string) {
  try {
    const response = await api.put(`layers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      json: updatedLayer,
    })

    return await response.json()
  } catch (error) {
    console.error('❌ Error al actualizar el layer:', error)
    throw error
  }
}
