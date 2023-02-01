import { useQuery } from 'react-query'
import { api } from '../apiClient'

type Variacoes = {
  id: number
  nome: string
  ativo: number
  pai_id: number
  foto: string
  cor_fundo: string
  created_at: Date
  updated_at: Date
}

async function getVariacoes(): Promise<Variacoes[]> {
  const { data } = await api.get('/variacoes')

  return data
}

export function useVariacoes() {
  return useQuery('variacoes', getVariacoes, {
    staleTime: 1000 * 5
  })
}
