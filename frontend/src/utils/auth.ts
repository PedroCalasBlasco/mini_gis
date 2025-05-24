export function isTokenValid(): boolean {
  const token = localStorage.getItem('token')
  const expiresAt = localStorage.getItem('expiresAt')

  if (!token || !expiresAt) return false

  return Date.now() < Number(expiresAt)
}
