import { useQuery } from 'react-query'
import { api } from '../apiClient'

type Desconto = {
  id: number
  produto_id: number
  desconto_tipo: number
  desconto_valor: number
  data_desconto_1: Date
  data_desconto_2: Date
  updated_at: Date
  created_at: Date
}

async function getDescontos(): Promise<Desconto[]> {
  const { data } = await api.get('/descontos/todos')
  return data
}

export function useDescontos() {
  return useQuery('descontos', getDescontos, {
    staleTime: 1000 * 5,
    enabled: true
  })
}
