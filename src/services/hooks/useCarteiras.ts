import { useQuery } from 'react-query'
import { api } from '../apiClient'

type Carteira = {
  id: number
  movimentacao: string
  valor_carteira: number
  usuario_id: number
  usuario_id_fk: {
    nome_completo: string
  }
  pedido_id?: number
  created_at: Date
}

type CarteiraTotalPerUser = {
  usuario_id: number
  total: number
}

async function getCarteiras(): Promise<Carteira[]> {
  const { data } = await api.get('/carteiras')
  return data
}

async function getCarteiraTotalPerUser(
  id: number
): Promise<CarteiraTotalPerUser> {
  const { data } = await api.get(`/carteiras/total_usuario/${id}`)

  return data
}

export function useCarteiras() {
  return useQuery('carteiras', getCarteiras, {
    staleTime: 1000 * 5,
    enabled: true
  })
}

export function useCarteirasTotalPerUser(id: number) {
  return useQuery(
    ['carteiras_total_usuario', id],
    () => getCarteiraTotalPerUser(id),
    {
      staleTime: 1000 * 5,
      enabled: true
    }
  )
}
