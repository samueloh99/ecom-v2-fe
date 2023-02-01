import { useQuery } from 'react-query'
import { api } from '../apiClient'

type Endereco = {
  enderecos: {
    id: number
    usuario_id: number
    ativo: number
    cep: string
    endereco: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    estado: string
    pais: string
    lembrete: string
    destinatario: string
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

async function getEnderecos(query: string): Promise<Endereco> {
  const { data } = await api.get(`/enderecos?${query}`)
  return data
}

export function useEnderecos(query?: string) {
  return useQuery(['enderecos', query], () => getEnderecos(query), {
    staleTime: 1000 * 5,
    enabled: true
  })
}
