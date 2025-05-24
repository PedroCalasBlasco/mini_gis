import ky from 'ky'
import { config } from '@/config'

const api = ky.create({
  prefixUrl: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
