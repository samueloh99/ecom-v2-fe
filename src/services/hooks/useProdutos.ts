import { useQuery } from 'react-query'
import { api } from '../apiClient'

type ProdutoToAdmin = {
  produtos: {
    id: number
    nome: string
    slug: string
    referencia: string
    ncm: string
    marca_id: number
    fornecedor_id: number
    categoria_id: number
    sub_categorias_ids: number[]
    comprimento: string
    altura: string
    largura: string
    tags: number[]
    descricao: string
    created_at: Date
    updated_at: Date
    ativo: number
    tipo_produto_id: number
    estoque: number
    preco: [number]
    fornecedor: {
      id: number
      nome: string
      site: string
      email: string
      telefone: string
      ativo: number
      observacoes: string
      updated_at: Date
    }
    marca: {
      id: number
      nome: string
      ativo: number
      updated_at: Date
    }
    categoria: {
      id: number
      nome: string
      pai_id: number
      slug: string
      ativo: number
      updated_at: Date
    }
  }[]
  pag: {
    paginas: number
    atual: number
    encontrados: number
    exibindo: number
  }
}

async function getProdutos(
  query: string,
  page: number,
  perPage: number
): Promise<ProdutoToAdmin> {
  const { data } = await api.get(
    `/produtos/todos?${query}&atual=${page}&mostrar=${perPage}`
  )

  return data
}

export function useProdutos(query?: string, page?: number, perPage?: number) {
  return useQuery(
    ['produtos', query, page, perPage],
    () => getProdutos(query, page, perPage),
    {
      staleTime: 1000 * 5,
      enabled: true
    }
  )
}
