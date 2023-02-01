import { useQuery } from 'react-query'
import { api } from '../apiClient'

type Fornecedor = {
  id: number
  nome: string
  site: string
  email: string
  telefone: string
  ativo: number
  observacoes: string
  updated_at: Date
}

async function getFornecedores(): Promise<Fornecedor[]> {
  const { data } = await api.get('/fornecedores/todos')
  return data
}

export function useFornecedores() {
  return useQuery('fornecedores', getFornecedores, {
    staleTime: 1000 * 5,
    enabled: true
  })
}
