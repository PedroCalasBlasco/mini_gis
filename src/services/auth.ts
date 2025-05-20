import type { User } from '@/types/user.ts'
import api from './api.ts'

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  id: string
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return await api
    .post('auth/login', {
      json: payload,
    })
    .json()
}

export const signUp = async (updatedUser: Partial<User>, password: string): Promise<User> => {
  const body = {
    ...updatedUser,
    password,
  }

  return await api
    .post('auth/register', {
      json: body,
    })
    .json()
}
