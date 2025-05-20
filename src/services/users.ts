import type { User } from '@/types/user'
import api from './api'

export const getUserById = async (id: string, token: string): Promise<User> => {
  return await api
    .get(`users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .json()
}

export const editUser = async (
  id: string,
  token: string,
  updatedUser: Partial<User>
): Promise<User> => {
  return await api
    .put(`users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      json: updatedUser,
    })
    .json()
}
