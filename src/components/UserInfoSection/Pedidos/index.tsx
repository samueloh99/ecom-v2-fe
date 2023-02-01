import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import {
  Stack,
  Icon,
  Text,
  HStack,
  Flex,
  Img,
  WrapItem,
  Wrap,
  Spinner
} from '@chakra-ui/react'

import { IoMdArrowBack } from 'react-icons/io'
import { usePedidos } from '../../../services/hooks/usePedidos'
import { usePedidosProdutos } from '../../../services/hooks/usePedidosProdutos'
import { useAuthContext } from '../../../contexts/AuthContext'

type Pedido = {
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
}

export const UserInfoPedidos = () => {
  const { push } = useRouter()

  const { data, isSuccess } = usePedidos()

  const { data: dataPedidosProdutos, isSuccess: isSuccessPedidosProdutos } =
    usePedidosProdutos()

  const { userData } = useAuthContext()

  const [pedidos, setPedidos] = useState<Pedido[]>()

  useEffect(() => {
    if (userData && data) {
      const findPedidosByUser = data.pedidos.filter(
        item => item.usuario_id === userData.id
      )

      setPedidos(findPedidosByUser)
    }
  }, [data, isSuccess, userData])

  return (
    <Flex direction="column" h="100%" w="70%">
      <Flex alignItems="center">
        <HStack
          cursor="pointer"
          onClick={() => push({ pathname: '/userinfo' })}
        >
          <Icon as={IoMdArrowBack} fontSize={20} />
          <Text>Voltar</Text>
        </HStack>
      </Flex>

      <Flex mt="20px">
        <Flex justifyContent="space-between" alignItems="center" w="100%">
          <Text fontWeight="bold" fontSize={20}>
            Pedidos
          </Text>
        </Flex>
      </Flex>

      {pedidos === undefined ? (
        <Flex w="100%" justifyContent="center">
          <Spinner />
        </Flex>
      ) : (
        <Wrap gap={2} mt="20px">
          {pedidos.map((item, index) => {
            const productList =
              isSuccessPedidosProdutos &&
              dataPedidosProdutos.pedidosProdutos.filter(
                pedProd => pedProd.pedido_id === item.id
              )

            return (
              <WrapItem
                flexDirection="column"
                justifyContent="space-between"
                key={index}
                border="1px solid #ccc"
                borderRadius={5}
                w="100%"
              >
                <Stack
                  w="100%"
                  direction={['column', 'row']}
                  justifyContent="space-between"
                  p="20px"
                  bg="black"
                  color="white"
                >
                  <Flex alignItems="center" direction="column">
                    <Text fontWeight="bold" fontSize="15px">
                      Comprado em
                    </Text>
                    <Text fontSize="13px">
                      {new Date(item.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                      })}
                    </Text>
                  </Flex>
                  <Flex alignItems="center" direction="column">
                    <Text fontWeight="bold" fontSize="15px">
                      Código do Pedido
                    </Text>
                    <Text fontSize="13px">{item.id}</Text>
                  </Flex>
                  <Flex alignItems="center" direction="column">
                    <Text fontWeight="bold" fontSize="15px">
                      Pagamento
                    </Text>
                    <Text fontSize="13px">{item.pagamento_titulo}</Text>
                    {item.status_pagamento === 1 && (
                      <Text color="red" fontSize="13px">
                        (Registrado)
                      </Text>
                    )}
                    {item.status_pagamento === 2 && (
                      <Text color="red" fontSize="13px">
                        (Aguardando Pagamento)
                      </Text>
                    )}
                    {item.status_pagamento === 4 && (
                      <Text color="red" fontSize="13px">
                        (Em Análise)
                      </Text>
                    )}
                    {item.status_pagamento === 3 && (
                      <Text color="red" fontSize="13px">
                        (Aprovado)
                      </Text>
                    )}
                    {item.status_pagamento === 5 && (
                      <Text color="red" fontSize="13px">
                        (Cancelado)
                      </Text>
                    )}
                  </Flex>
                  <Flex alignItems="center" direction="column">
                    <Text fontWeight="bold" fontSize="15px">
                      Total
                    </Text>
                    <Text fontSize="13px">R$ {item.pedido_geral}</Text>
                  </Flex>
                </Stack>
                <Flex
                  w="100%"
                  p="20px"
                  direction={['column', 'row']}
                  justifyContent="space-between"
                >
                  <Stack direction="column" align="start">
                    {productList &&
                      productList.map((prod, index) => {
                        return (
                          <Flex key={index}>
                            <Img
                              w="100px"
                              src={prod.sku_id_fk.foto1}
                              alt="img"
                            />
                            <Flex
                              direction="column"
                              h="100%"
                              ml="5px"
                              justifyContent="space-between"
                            >
                              <Text fontSize="15px">
                                {prod.quantidade}x {prod.produto_id_fk.nome}
                              </Text>
                              <Text fontSize="12px">
                                Codigo: {prod.sku_id_fk.id} - Sku:{' '}
                                {prod.sku_id_fk.referencia.toUpperCase()}
                              </Text>
                              <Text fontSize="16px" color="green">
                                R$ {prod.preco}
                              </Text>
                              <Text fontSize="12px" color="grey">
                                Cor: {prod.sku_id_fk.var1fk.nome}
                              </Text>
                              <Text fontSize="12px" color="grey">
                                Tamanho: {prod.sku_id_fk.var2fk.nome}
                              </Text>
                            </Flex>
                          </Flex>
                        )
                      })}
                  </Stack>
                  {/* <Button bg="black" color="white" mt={['20px', '0px']}>
                    Detalhes do Pedido
                  </Button> */}
                </Flex>
              </WrapItem>
            )
          })}
        </Wrap>
      )}
    </Flex>
  )
}

export default UserInfoPedidos
