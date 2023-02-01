import { useQuery } from 'react-query'
import { api } from '../apiClient'

type PedidosProdutos = {
  pedidosProdutos: {
    id: number
    pedido_id: number
    produto_id: number
    sku_id: number
    quantidade: number
    cancelado: string
    troca: string
    pontos: string
    preco: number
    total: number
    json_pers: string
    updated_at: Date
    created_at: Date
    desconto_id_fk: {
      id: number
      produto_id: number
      desconto_tipo: number
      desconto_valor: number
      data_desconto_1: Date
      data_desconto_2: Date
      updated_at: Date
      created_at: Date
    }
    pedido_id_fk: {
      id: number
      pedido_tipo: string
      pedido_peso: string
      pedido_qtde: number
      pedido_prazo: number
      pedido_desconto: number
      pedido_carteira: number
      pedido_total: number
      pedido_geral: number
      pedido_cancelado: string
      usuario_id: number
      endereco_id: number
      frete_nome: string
      frete_titulo: string
      frete_prazo: number
      frete_valor: number
      frete_embalagem: string
      pagamento_nome: string
      pagamento_titulo: string
      pagamento_valor: string
      pagamento_link: string
      desconto_id: number
      parcela_numero: number
      parcela_valor: number
      parcela_desconto: number
      cartao_nsu: string
      cartao_bandeira: string
      created_at: Date
      updated_at: Date
      status_entrega: number
      status_pagamento: number
      utm_campaign: string
      utm_source: string
      utm_medium: string
      utm_content: string
      utm_term: string
      data_aprovado: Date
      data_entrega: Date
    }
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
      gtin: string
      mpn: string
      created_at: Date
      updated_at: Date
      estoque: number
      foto1: string
      foto2: string
      foto3: string
      foto4: string
      foto5: string
      foto6: string
      var1fk: {
        id: number
        nome: string
        ativo: number
        pai_id: number
        created_at: Date
        updated_at: Date
      }
      var2fk: {
        id: number
        nome: string
        ativo: number
        pai_id: number
        created_at: Date
        updated_at: Date
      }
    }
    produto_id_fk: {
      id: number
      nome: string
      slug: string
      referencia: string
      ncm: string
      marca_id: number
      fornecedor_id: string
      categoria_id: number
      comprimento: string
      altura: string
      largura: string
      descricao: string
      created_at: Date
      updated_at: Date
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

async function getPedidosProdutos(
  filterArray: string
): Promise<PedidosProdutos> {
  const { data } = await api.get(`/pedidosProdutos/todos?${filterArray}`)

  return data
}

export function usePedidosProdutos(filterArray?: string) {
  return useQuery(
    ['pedidos_produtos', filterArray],
    () => getPedidosProdutos(filterArray),
    {
      staleTime: 1000 * 5,
      enabled: true
    }
  )
}
