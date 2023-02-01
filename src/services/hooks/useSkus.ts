import { useQuery } from 'react-query'
import { api } from '../apiClient'

type Sku = {
  skus: {
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
      created_at: string
      updated_at: string
    }
    var2fk: {
      id: number
      nome: string
      ativo: number
      pai_id: number
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
  }[]
  pag: {
    paginas: number
    atual: number
    encontrados: number
    exibindo: number
  }
}

async function getSkus(
  query: string,
  page: number,
  perPage: number
): Promise<Sku> {
  const { data } = await api.get(
    `/skus/todos?${query}&atual=${page}&mostrar=${perPage}`
  )

  return data
}

export function useSkus(query?: string, page?: number, perPage?: number) {
  return useQuery(
    ['skus', query, page, perPage],
    () => getSkus(query, page, perPage),
    {
      staleTime: 1000 * 5
    }
  )
}
