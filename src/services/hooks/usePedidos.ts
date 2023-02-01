import { useQuery } from 'react-query'

import { api } from '../apiClient'

type Pedido = {
  pedidos: {
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
    usuario: {
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
    }
    enderecoFk: {
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
    }
    cupom_id_fk: {
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
      created_at: Date
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

async function getPedidos(page: number, query: string): Promise<Pedido> {
  const { data } = await api.get(`/pedidos/todos?${query}`, {
    params: {
      atual: page
    }
  })

  return data
}

export function usePedidos(page?: number, query?: string) {
  return useQuery(['pedidos', page, query], () => getPedidos(page, query), {
    staleTime: 1000 * 5,
    enabled: true
  })
}
