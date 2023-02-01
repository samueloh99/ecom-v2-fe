import { useQuery } from 'react-query'
import { api } from '../apiClient'

type Produto = {
  id: number
  nome: string
  slug: string
  referencia: string
  ncm: string
  marca_id: number
  fornecedor_id: number
  categoria_id: number
  sub_categorias_ids: number[]
  tags: number[]
  comprimento: string
  altura: string
  largura: string
  descricao: string
  created_at: Date
  updated_at: Date
  ativo: number
  tipo_produto_id: number
  estoque: number
  preco: [number]
  variantes: [
    {
      idSku: number
      preco: number
      preco_desconto: number
      var1: string
      var1Foto: string
      sku_referencia: string
      var2: string
      estoque: number
      peso: number
      fotos: string[]
    }
  ]
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
}

async function getProdutoById(id: number): Promise<Produto> {
  const { data } = await api.get(`/produtos/buscar/${id}`)

  return data
}

export function useProdutoById(id: number) {
  return useQuery(['produto_by_id', id], () => getProdutoById(id), {
    staleTime: 1000 * 5,
    enabled: true
  })
}
