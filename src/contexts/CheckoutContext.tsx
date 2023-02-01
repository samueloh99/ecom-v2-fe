import { parseCookies } from 'nookies'

import { useRouter } from 'next/router'

import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useEffect
} from 'react'

// PEDIDO

type IPagarmeCartaoResponse = {
  id: string
  code: string
  amount: number
  currency: string
  closed: true
  items: [
    {
      id: string
      description: string
      amount: number
      quantity: number
      status: string
      created_at: string
      updated_at: string
    }
  ]
  customer: {
    id: string
    name: string
    email: string
    document: string
    type: string
    delinquent: false
    created_at: string
    updated_at: string
    phones: {}
  }
  shipping: {
    amount: number
    description: string
    recipient_name: string
    recipient_phone: string
    address: {
      city: string
      state: string
      country: string
      zip_code: string
      line_1: string
    }
  }
  status: string
  created_at: string
  updated_at: string
  closed_at: string
  ip: string
  session_id: string
  device: {
    platform: string
  }
  location: {
    latitude: string
    longitude: string
  }
  charges: [
    {
      id: string
      code: string
      gateway_id: string
      amount: number
      status: string
      currency: string
      payment_method: string
      created_at: string
      updated_at: string
      customer: {
        id: string
        name: string
        email: string
        document: string
        type: string
        delinquent: false
        created_at: string
        updated_at: string
        phones: {}
      }
      last_transaction: {
        id: string
        transaction_type: string
        gateway_id: string
        amount: boolean
        status: string
        success: boolean
        installments: number
        statement_descriptor: string
        acquirer_tid: string
        acquirer_nsu: string
        acquirer_auth_code: string
        acquirer_message: string
        acquirer_return_code: string
        operation_type: string
        created_at: Date
        updated_at: Date
        gateway_response: {
          code: string
          errors: []
        }
      }
    }
  ]
  checkouts: []
}

type IPagarmePixResponse = {
  id: string
  code: string
  amount: number
  currency: string
  closed: true
  items: [
    {
      id: string
      description: string
      amount: number
      quantity: number
      status: string
      created_at: string
      updated_at: string
    }
  ]
  customer: {
    id: string
    name: string
    email: string
    document: string
    type: string
    delinquent: false
    created_at: string
    updated_at: string
    phones: {}
  }
  shipping: {
    amount: number
    description: string
    recipient_name: string
    recipient_phone: string
    address: {
      city: string
      state: string
      country: string
      zip_code: string
      line_1: string
    }
  }
  status: string
  created_at: string
  updated_at: string
  closed_at: string
  ip: string
  session_id: string
  device: {
    platform: string
  }
  location: {
    latitude: string
    longitude: string
  }
  charges: [
    {
      id: string
      code: string
      gateway_id: string
      amount: number
      status: string
      currency: string
      payment_method: string
      created_at: string
      updated_at: string
      customer: {
        id: string
        name: string
        email: string
        document: string
        type: string
        delinquent: false
        created_at: string
        updated_at: string
        phones: {}
      }
      last_transaction: {
        id: string
        transaction_type: string
        gateway_id: string
        amount: number
        status: string
        success: true
        qr_code: string
        qr_code_url: string
        additional_information: [
          {
            name: string
            value: string
          }
        ]
        expires_at: string
        created_at: string
        updated_at: string
        gateway_response: {}
        antifraud_response: {}
        metadata: {}
      }
    }
  ]
  checkouts: []
}

type IPagarmeBoletoResponse = {
  id: string
  code: string
  amount: number
  currency: string
  closed: true
  items: [
    {
      id: string
      description: string
      amount: number
      quantity: number
      status: string
      created_at: string
      updated_at: string
    }
  ]
  customer: {
    id: string
    name: string
    email: string
    document: string
    type: string
    delinquent: false
    created_at: string
    updated_at: string
    phones: {}
  }
  shipping: {
    amount: number
    description: string
    recipient_name: string
    recipient_phone: string
    address: {
      city: string
      state: string
      country: string
      zip_code: string
      line_1: string
    }
  }
  status: string
  created_at: string
  updated_at: string
  closed_at: string
  ip: string
  session_id: string
  device: {
    platform: string
  }
  location: {
    latitude: string
    longitude: string
  }
  charges: [
    {
      id: string
      code: string
      gateway_id: string
      amount: number
      status: string
      currency: string
      payment_method: string
      created_at: string
      updated_at: string
      customer: {
        id: string
        name: string
        email: string
        document: string
        type: string
        delinquent: false
        created_at: string
        updated_at: string
        phones: {}
      }
      last_transaction: {
        id: string
        transaction_type: string
        gateway_id: string
        amount: 3090
        status: string
        success: true
        url: string
        pdf: string
        line: string
        barcode: string
        qr_code: string
        nosso_numero: string
        type: string
        document_number: string
        instructions: string
        due_at: string
        created_at: string
        updated_at: string
        gateway_response: {
          code: string
        }
        antifraud_response: {}
      }
    }
  ]
  checkouts: []
}

type PedidoResponseData = {
  id: number
  pedido_tipo: string
  pedido_peso: string
  pedido_qtde: number
  created_at: Date
  updated_at: Date
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
  desconto_id: string
  desconto_nome: string
  desconto_codigo: string
  desconto_valor: number
  parcela_numero: number
  parcela_valor: number
  parcela_desconto: number
  cartao_nsu: string
  cartao_bandeira: string
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
    tipo: number
    ativo: number
    nome_completo: string
    email: string
    senha: string
    celular: number
    telefone: number
    cpf: number
    nascimento: Date
    genero: string
    ie: string
    im: string
    cnpj: string
    newsletter: number
    estrangeiro: number
  }
  enderecoFk: {
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
  }
}

// USUARIO

type CreateUsuarioResponse = {
  pagarmeRes: {
    error?: boolean
    id: string
    name: string
    email: string
    code: string
    document: string
    document_type: string
    type: string
    gender: string
    delinquent: boolean
    address: {
      id: string
      line_1: string
      line_2: string
      zip_code: string
      city: string
      state: string
      country: string
      status: string
      created_at: Date
      updated_at: Date
    }
    created_at: Date
    updated_at: Date
    birthdate: Date
    phones: {
      home_phone: {
        country_code: string
        number: string
        area_code: string
      }
      mobile_phone: {
        country_code: string
        number: string
        area_code: string
      }
    }
    metadata: {
      id: string
      company: string
    }
  }
  usuarioRes: {
    celular: string
    cnpj: string
    cpf: string
    created_at: Date
    email: string
    estrangeiro: number
    genero: string
    id: number
    ie: string
    im: string
    nome_completo: string
    nascimento: string
    newsletter: number
    telefone: string
    tipo: number
    updated_at: Date
  }
}

// ENDERECO

type EnderecoResponseData = {
  bairro: string
  cep: string
  cidade: string
  complemento: string
  created_at: Date
  destinatario: string
  endereco: string
  estado: string
  id: number
  lembrete: string
  numero: string
  pais: string
  updated_at: Date
  usuario_id: number
}

type IPagarmeEnderecoResponse = {
  id: string
  line_1: string
  line_2: string
  zip_code: string
  city: string
  state: string
  country: string
  status: string
  created_at: Date
  updated_at: Date
  customer: {
    id: string
    name: string
    email: string
    document: string
    type: string
    delinquent: boolean
    created_at: Date
    updated_at: Date
    metadata: {
      id: string
    }
  }
  metadata: {
    id: string
  }
}

type CreateEnderecoResponse = {
  pagarmeRes?: {
    error: boolean
    enderecoResponse?: IPagarmeEnderecoResponse
    id: string
    line_1: string
    line_2: string
    zip_code: string
    city: string
    state: string
    country: string
    status: string
    created_at: Date
    updated_at: Date
    customer: {
      id: string
      name: string
      email: string
      document: string
      type: string
      delinquent: boolean
      created_at: Date
      updated_at: Date
      metadata: {
        id: string
      }
    }
    metadata: {
      id: string
    }
  }
  enderecoRes: EnderecoResponseData
  checkoutDataEnderecoDTO: {
    entrega_nome: string
    entrega_cep: string
    entrega_endereco: string
    entrega_numero: string
    entrega_complemento: string
    entrega_bairro: string
    entrega_cidade: string
    entrega_estado: string
    entrega_pais: string
    entrega_lembrete: string
    frete_titulo: string
    frete_nome: string
    frete_prazo: number
    frete_valor: number
    frete_embalagem: string
    endereco_id: string
    endereco_id_pagarme: string
  }
}

// PAGAMENTO

type CheckoutDataPagamentoDTO = {
  pagamento_nome: string
  pagamento_titulo: string
  pagamento_valor: string
  pagamento_link: string
  parcela_numero: number
  parcela_valor: number
  parcela_desconto: number
  cartao_nsu: string
  cartao_bandeira: string
  afiliado_usuario_id: string
  card_id_pagarme: string
  desconto_id: number
  card_cv: string
}

type CupomValidate = {
  cupomName: string
  cupom: number
  valor: number
  desconto_valor: string
}

type CheckoutContextData = {
  step: number
  setStep: (index: number) => void
  checkoutOrderCartaoPagarme: IPagarmeCartaoResponse
  setCheckoutOrderCartaoPagarme: (data: IPagarmeCartaoResponse) => void
  checkoutOrderBoletoPagarme: IPagarmeBoletoResponse
  setCheckoutOrderBoletoPagarme: (data: IPagarmeBoletoResponse) => void
  checkoutPedido: PedidoResponseData
  setCheckoutPedido: (data: PedidoResponseData) => void
  checkoutOrderPixPagarme: IPagarmePixResponse
  setCheckoutOrderPixPagarme: (data: IPagarmePixResponse) => void
  checkoutUsuario: CreateUsuarioResponse
  setCheckoutUsuario: (data: CreateUsuarioResponse) => void
  checkoutPagamento: CheckoutDataPagamentoDTO
  setCheckoutPagamento: (data: CheckoutDataPagamentoDTO) => void
  checkoutEntrega: CreateEnderecoResponse
  setCheckoutEntrega: (data: CreateEnderecoResponse) => void
  useWalletValue: number
  setUseWalletValue: (data: number) => void
}

type CheckoutProviderProps = {
  children: ReactNode
}

export const CheckoutContext = createContext({} as CheckoutContextData)

export function CheckoutProvider({ children }: CheckoutProviderProps) {
  const cookies = parseCookies()
  const { push } = useRouter()

  const [step, setStep] = useState<number>(0)

  const [checkoutPedido, setCheckoutPedido] = useState<PedidoResponseData>()

  const [checkoutOrderCartaoPagarme, setCheckoutOrderCartaoPagarme] =
    useState<IPagarmeCartaoResponse>()

  const [checkoutOrderPixPagarme, setCheckoutOrderPixPagarme] =
    useState<IPagarmePixResponse>()

  const [checkoutOrderBoletoPagarme, setCheckoutOrderBoletoPagarme] =
    useState<IPagarmeBoletoResponse>()

  const [useWalletValue, setUseWalletValue] = useState(0)

  const [checkoutEntrega, setCheckoutEntrega] =
    useState<CreateEnderecoResponse>()

  const [checkoutPagamento, setCheckoutPagamento] =
    useState<CheckoutDataPagamentoDTO>()

  const [checkoutUsuario, setCheckoutUsuario] =
    useState<CreateUsuarioResponse>()

  useEffect(() => {
    if (JSON.parse(cookies['cart']).length === 0) {
      push({
        pathname: '/carrinho'
      })
    }
  }, [])

  return (
    <CheckoutContext.Provider
      value={{
        checkoutOrderCartaoPagarme,
        setCheckoutOrderCartaoPagarme,
        checkoutOrderBoletoPagarme,
        setCheckoutOrderBoletoPagarme,
        setUseWalletValue,
        checkoutOrderPixPagarme,
        setCheckoutOrderPixPagarme,
        useWalletValue,
        step,
        setStep,
        checkoutPedido,
        setCheckoutPedido,
        checkoutUsuario,
        setCheckoutUsuario,
        checkoutPagamento,
        setCheckoutPagamento,
        checkoutEntrega,
        setCheckoutEntrega
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}

export const useCheckoutContext = () => useContext(CheckoutContext)
