import { useQuery } from 'react-query'
import { api } from '../apiClient'

type Usuario = {
  usuarios: {
    id: number
    tipo: number
    ativo: number
    nome_completo: string
    email: string
    celular: string
    telefone: string
    cpf: string
    nascimento: Date
    genero: string
    created_at: Date
    updated_at: Date
    ie: string
    im: string
    cnpj: string
    newsletter: number
    data_acesso: Date
    total_pedidos: number
    estrangeiro: number
    permissoes: {
      id: string
      nome: string
      descricao: string
      created_at: Date
    }[]
    roles: {
      id: number
      nome: string
      descricao: string
      created_at: Date
    }[]
  }[]
  pag: {
    paginas: number
    atual: number
    encontrados: number
    exibindo: number
  }
}

async function getClientes(query: string): Promise<Usuario> {
  const { data } = await api.get(`/usuarios?${query}`)
  return data
}

export function useClientes(query?: string) {
  return useQuery(['clientes', query], () => getClientes(query), {
    staleTime: 1000 * 5,
    enabled: true
  })
}
