import { useQuery } from 'react-query'
import { api } from '../apiClient'

type Movimentacoes = {
  movimentacoes: {
    id: number
    sku_id: number
    quantidade: number
    lancamento: number
    localizacao: number
    created_at: Date
    updated_at: Date
  }[]
  pag: {
    paginas: number
    atual: number
    encontrados: number
    exibindo: number
  }
}

async function getMovimentacoes(): Promise<Movimentacoes> {
  const { data } = await api.get('/movimentacoes/todos')

  return data
}

export function useMovimentacoes() {
  return useQuery('movimentacoes', getMovimentacoes, {
    staleTime: 1000 * 5
  })
}
