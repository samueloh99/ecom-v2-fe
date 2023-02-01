import { useQuery } from 'react-query'
import { api } from '../apiClient'

type Marca = {
  id: number
  nome: string
  ativo: number
  updated_at: Date
}

async function getMarcas(): Promise<Marca[]> {
  const { data } = await api.get('/marcas/todos')

  return data
}

export function useMarcas() {
  return useQuery('marcas', getMarcas, {
    staleTime: 1000 * 5,
    enabled: true
  })
}
