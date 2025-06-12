import api from './api'
import type { Map, MapFromAPI } from '../types/map'

export const getMapsByUser = async (userId: string, token: string): Promise<MapFromAPI[]> => {
  return await api
    .get(`maps?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json()
}

export const getMapsSharedWithUser = async (
  userId: string,
  token: string
): Promise<MapFromAPI[]> => {
  return await api
    .get(`maps/shared?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json()
}

export const getPublicMaps = async (userId: string, token: string): Promise<MapFromAPI[]> => {
  return await api
    .get(`maps/public?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json()
}

export async function getMapByUserAndId(
  mapId: string,
  userId: string,
  token: string
): Promise<MapFromAPI> {
  try {
    const response = await api.get(`maps/${mapId}?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return await response.json()
  } catch (error) {
    console.error('❌ Error al obtener el mapa por ID y usuario:', error)
    throw error
  }
}

export async function createMap(newMap: Map, token: string) {
  try {
    const response = await api.post('maps', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      json: newMap,
    })

    return await response.json()
  } catch (error) {
    console.error('❌ Error al crear el mapa:', error)
    throw error
  }
}

export async function deleteMap(id: number, token: string) {
  try {
    const response = await api.delete(`maps/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 204) {
      return true
    }

    return response.json()
  } catch (error) {
    console.error('❌ Error al eliminar el mapa:', error)
    throw error
  }
}

export async function updateMap(id: string, updatedMap: Map, token: string) {
  try {
    const response = await api.put(`maps/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      json: updatedMap,
    })

    return await response.json()
  } catch (error) {
    console.error('❌ Error al actualizar el mapa:', error)
    throw error
  }
}
