import { useQuery } from 'react-query'
import { api } from '../apiClient'

type Categoria = {
  id: number
  nome: string
  pai_id: number
  slug: string
  ativo: number
  updated_at: Date
}

async function getCategorias(): Promise<Categoria[]> {
  const { data } = await api.get('/categorias/todos')
  return data
}

export function useCategorias() {
  return useQuery('categorias', getCategorias, {
    staleTime: 1000 * 5,
    enabled: true
  })
}
