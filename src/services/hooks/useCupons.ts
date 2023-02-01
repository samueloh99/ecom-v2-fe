import { useQuery } from 'react-query'
import { api } from '../apiClient'

type Cupom = {
  id: number
  tipo: number
  ativo: number
  data_1: Date
  data_2: Date
  nome: string
  codigo: string
  quantidade: number
  desconto_tipo: string
  desconto_valor: number
  minimo_item: number
  minimo_compra: number
  frete_gratis: number
  desconto_produto: number
  desconto_pagamento: number
  reutilizavel: number
  updated_at: Date
  created_at: Date
  total_pedidos: number
}

async function getCupons(): Promise<Cupom[]> {
  const { data } = await api.get('/cupons/todos')
  return data
}

export function useCupons() {
  return useQuery('cupons', getCupons, {
    staleTime: 1000 * 5,
    enabled: true
  })
}
