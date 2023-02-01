import { useQuery } from 'react-query'
import { api } from '../apiClient'

type Favoritos = {
  id: number
  sku_id: number
  usuario_id: number
  createdAt: Date
  sku_id_fk: {
    id: number
    var1_id: number
    var2_id: number
    ativo: number
    referencia: string
    preco_custo: number
    preco_venda: number
    produto_id: number
    peso: number
    gtin: null
    mpn: null
    created_at: string
    updated_at: string
    estoque: number
    foto1: string
    foto2: string
    foto3: string
    foto4: string
    foto5: string
    foto6: null
    var1fk: {
      id: number
      nome: string
      ativo: number
      pai_id: number
      foto: string

      created_at: string
      updated_at: string
    }
    var2fk: {
      id: number
      nome: string
      ativo: number
      pai_id: number
      foto: string
      created_at: string
      updated_at: string
    }
    produto: {
      id: number
      nome: string
      slug: string
      referencia: string
      ncm: string
      marca_id: number
      fornecedor_id: number
      categoria_id: number
      comprimento: string
      altura: string
      largura: string
      descricao: null
      created_at: string
      updated_at: string
      ativo: number
      tipo_produto_id: number
    }
  }
}

async function getFavoritos(): Promise<Favoritos[]> {
  const { data } = await api.get('/favoritos/todos')
  return data
}

export function useFavoritos() {
  return useQuery('favoritos', getFavoritos, {
    staleTime: 1000 * 5,
    enabled: true
  })
}
