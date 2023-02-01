import React from 'react'

import { useRouter } from 'next/router'

import {
  Flex,
  Text,
  Badge,
  Button,
  Icon,
  VStack,
  Img,
  Stack,
  HStack
} from '@chakra-ui/react'

import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'

import { BsFillPersonFill } from 'react-icons/bs'

import { RiBillLine } from 'react-icons/ri'

import { usePedidos } from '../../../../services/hooks/usePedidos'

import { celularMask, translateOrderStatus } from '../../../../../utils/masks'

type OrderDetailsDTO = {
  pedido: {
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
  pedidoProduto: {
    id: number
    pedido_id: number
    pedido_id_fk: {
      pedido_qtde: number
      pedido_prazo: number
      pedido_total: number
      pedido_geral: number
    }
    produto_id: number
    produto_id_fk: {
      id: number
      nome: string
      slug: string
      referencia: string
      ncm: string
      marca_id: number
      marca: {
        nome: string
      }
      fornecedor_id: number
      fornecedor: {
        nome: string
      }
      categoria_id: number
      categoria: {
        nome: string
      }
      comprimento: string
      altura: string
      largura: string
      descricao: string
      created_at: Date
      updated_at: Date
      ativo: number
      tipo_produto_id: number
    }
    sku_id: number
    sku_id_fk: {
      id: number
      var1_id: number
      var1fk: {
        id: number
        nome: string
      }
      var2_id: number
      var2fk: {
        id: number
        nome: string
      }
      referencia: string
      preco_custo: number
      preco_venda: number
      peso: number
      foto1: string
    }
    quantidade: number
    cancelado: string
    troca: string
    pontos: string
    preco: number
    total: number
    json_pers: string
    updated_at: Date
    created_at: Date
    desconto_id: number
    desconto_id_fk: {
      id: number
      produto_id: number
      desconto_tipo: number
      desconto_valor: number
      data_desconto_1: Date
      data_desconto_2: Date
    }
  }[]
}

const OrderDetails = ({ pedido, pedidoProduto }: OrderDetailsDTO) => {
  const { data: dataPedidos, isSuccess: isSuccessPedidos } = usePedidos()

  const { back, push } = useRouter()

  const descontoCupom =
    pedido.cupom_id_fk === null
      ? 0
      : pedido.cupom_id_fk.desconto_tipo === 'P'
      ? pedido.pedido_total * (pedido.cupom_id_fk.desconto_valor / 100)
      : pedido.cupom_id_fk.desconto_valor

  const totalPriceProduct = pedidoProduto.reduce(
    (prev, after) => prev + after.total,
    0
  )

  const paymentDiscount =
    pedido.pedido_desconto === 0
      ? 0
      : (pedido.pedido_desconto - descontoCupom).toFixed(2)

  const countOrderPerUser =
    isSuccessPedidos &&
    dataPedidos.pedidos.filter(item => item.usuario_id === pedido.usuario_id)
      .length

  return (
    <VStack w="100%" alignItems="start">
      <Flex w="100%">
        <Button
          p={0}
          bg="transparent"
          _hover={{ background: 'transparent' }}
          border="none"
          onClick={() => back()}
        >
          <Icon as={AiOutlineArrowLeft} />
          Voltar
        </Button>
      </Flex>
      <Stack
        direction={{ lg: 'row', base: 'column' }}
        alignItems={{ lg: 'center', base: 'start' }}
        w="100%"
      >
        <Text fontSize={24} fontWeight="bold">
          Pedido #{pedido.id}
        </Text>
        <Badge
          variant="subtle"
          colorScheme={translateOrderStatus(pedido.status_pagamento).color}
        >
          {translateOrderStatus(pedido.status_pagamento).value}
        </Badge>

        <Text>
          {new Date(pedido.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
          })}
        </Text>
      </Stack>
      <Flex direction={{ lg: 'row', base: 'column' }} p="10px" w="100%">
        <Flex p={5} direction="column" w={{ lg: '70%', base: '100%' }}>
          <VStack
            bg="gray.800"
            boxShadow="md"
            alignItems="start"
            rounded="md"
            spacing={4}
            p={5}
          >
            <Text fontWeight="bold" color="pink">
              Produtos
            </Text>

            {pedidoProduto.map((item, index) => {
              const checkDiscount = item.desconto_id_fk !== null ? true : false
              const productPrice = checkDiscount
                ? item.desconto_id_fk.desconto_tipo === 2
                  ? item.sku_id_fk.preco_venda -
                    item.sku_id_fk.preco_venda *
                      (item.desconto_id_fk.desconto_valor / 100)
                  : item.sku_id_fk.preco_venda -
                    item.desconto_id_fk.desconto_valor
                : item.preco
              return (
                <Stack
                  direction={{ base: 'column', lg: 'row' }}
                  key={index}
                  w="100%"
                >
                  <Img src={item.sku_id_fk.foto1} w="100px" />
                  <Flex
                    direction="column"
                    alignItems="start"
                    justifyContent="space-between"
                    h="100%"
                    w="60%"
                  >
                    <VStack>
                      <Text fontWeight="bold" fontSize={14}>
                        {item.produto_id_fk.nome.toLocaleUpperCase()}
                      </Text>
                    </VStack>
                    <VStack alignItems="start">
                      <Text fontSize={13}>
                        Cor: {item.sku_id_fk.var1fk.nome}
                      </Text>
                      <Text fontSize={13}>
                        Tamanho: {item.sku_id_fk.var2fk.nome}
                      </Text>
                    </VStack>
                  </Flex>
                  <HStack
                    h="100%"
                    w="40%"
                    alignItems="start"
                    justifyContent="space-between"
                  >
                    <Text
                      fontWeight="bold"
                      color={checkDiscount === true ? 'red.100' : 'white'}
                      textDecoration={
                        checkDiscount === true ? 'line-through' : 'none'
                      }
                    >
                      R$
                      {checkDiscount === false
                        ? item.preco.toFixed(2).replace('.', ',')
                        : item.sku_id_fk.preco_venda
                            .toFixed(2)
                            .replace('.', ',')}
                    </Text>
                    {checkDiscount && (
                      <Text>R${productPrice.toFixed(2).replace('.', ',')}</Text>
                    )}
                    <Text>{item.quantidade}x</Text>
                    <Text fontWeight="bold">
                      R$
                      {item.total.toFixed(2).replace('.', ',')}
                    </Text>
                  </HStack>
                </Stack>
              )
            })}
          </VStack>
          <VStack
            bg="gray.800"
            p={5}
            boxShadow="md"
            rounded="md"
            mt="40px"
            alignItems="start"
          >
            <Text fontWeight="bold" color="pink">
              Frete
            </Text>
            <HStack w="100%" justifyContent="space-between">
              <Text>
                Código do serviço: {pedido.frete_nome.toLocaleUpperCase()}
              </Text>
              <Text>
                Nome do serviço: {pedido.frete_titulo.toLocaleUpperCase()}
              </Text>
              <Text>Valor do frete: R$ {pedido.frete_valor}</Text>
            </HStack>
          </VStack>
          <VStack
            bg="gray.800"
            p={5}
            border="5px"
            boxShadow="md"
            rounded="md"
            mt="40px"
            alignItems="start"
          >
            <Text fontWeight="bold" color="pink">
              Pagamento Resumo
            </Text>
            <HStack w="100%" justifyContent="space-between">
              <Text>Total Produtos</Text>
              <Text>R$ {totalPriceProduct.toFixed(2).replace('.', ',')}</Text>
            </HStack>
            <HStack
              fontSize={14}
              color="gray"
              w="100%"
              justifyContent="space-between"
            >
              <Text>
                Vale-desconto: {pedido.cupom_id_fk && pedido.cupom_id_fk.nome}
              </Text>
              <Text>-R$ {descontoCupom}</Text>
            </HStack>
            <HStack
              fontSize={14}
              color="gray"
              w="100%"
              justifyContent="space-between"
            >
              <Text>{pedido.pagamento_titulo}</Text>
              <Text>-R$ {paymentDiscount}</Text>
            </HStack>
            <HStack w="100%" justifyContent="space-between">
              <Text>Saldo de Descontos</Text>
              <Text>-R${pedido.pedido_desconto}</Text>
            </HStack>
            <HStack w="100%" justifyContent="space-between">
              <Text>Valor do Frete</Text>
              <Text>R$ {pedido.frete_valor}</Text>
            </HStack>
            <HStack w="100%" justifyContent="space-between">
              <Text>Saldo da Carteira</Text>
              <Text>-R$ {pedido.pedido_carteira}</Text>
            </HStack>
            <HStack color="green.100" w="100%" justifyContent="space-between">
              <Text>Total Pago</Text>
              <Text fontWeight="bold">R$ {pedido.pedido_geral}</Text>
            </HStack>
            {pedido.pagamento_titulo === 'Cartão de Crédito' && (
              <HStack w="100%" justifyContent="space-between">
                <Text>Parcelas {pedido.parcela_numero}x</Text>
                <Text>R$ {pedido.parcela_valor}</Text>
              </HStack>
            )}
          </VStack>
        </Flex>
        <VStack
          bg="gray.800"
          my={5}
          w={{ lg: '30%', base: '100%' }}
          boxShadow="md"
          rounded="md"
          spacing={5}
          alignItems="start"
          p={5}
        >
          <Text fontWeight="bold" color="pink">
            Cliente
          </Text>
          <HStack
            cursor="pointer"
            p="4px"
            onClick={() =>
              push({
                pathname: `/admin/clientes/editar/${pedido.usuario_id}`
              })
            }
            borderRadius={5}
            _hover={{ background: 'gray', transition: '0.1s' }}
            justifyContent="space-between"
            w="100%"
          >
            <Flex alignItems="center">
              <Icon mr="10px" as={BsFillPersonFill} fontSize={25} />
              <Text fontWeight="bold">
                {pedido.usuario.nome_completo.toLocaleUpperCase()}
              </Text>
            </Flex>
            <Icon as={AiOutlineArrowRight} />
          </HStack>

          <HStack
            cursor="pointer"
            p="4px"
            borderRadius={5}
            _hover={{ background: 'gray', transition: '0.1s' }}
            justifyContent="space-between"
            w="100%"
          >
            <Flex alignItems="center">
              <Icon mr="10px" as={RiBillLine} fontSize={25} />
              <Text fontWeight="bold">{countOrderPerUser} Vendas</Text>
            </Flex>
          </HStack>

          <VStack alignItems="start" justifyContent="space-between" w="100%">
            <Text fontWeight="bold" color="pink">
              Endereço de Entrega
            </Text>
            <Flex direction="column">
              <Text>{pedido.enderecoFk.estado}</Text>
              <Text>
                {pedido.enderecoFk.bairro} - {pedido.enderecoFk.cidade}
              </Text>
              <Text>{pedido.enderecoFk.cep}</Text>
              <Text>
                {pedido.enderecoFk.endereco}, {pedido.enderecoFk.numero} -{' '}
                {pedido.enderecoFk.complemento}
              </Text>
            </Flex>
          </VStack>

          <VStack alignItems="start" justifyContent="space-between" w="100%">
            <Text fontWeight="bold" color="pink">
              Informações do Cliente
            </Text>
            <Flex direction="column">
              <Text>{pedido.usuario.nome_completo.toLocaleUpperCase()}</Text>
              <a
                href={`https://api.whatsapp.com/send?phone=55${pedido.usuario.celular}`}
                target="_blank"
              >
                {celularMask(pedido.usuario.celular)}
              </a>
              <Text>{celularMask(pedido.usuario.telefone)}</Text>
              <Text>{pedido.usuario.email}</Text>
              <Text>{`${pedido.usuario.nascimento}`}</Text>
            </Flex>
          </VStack>
        </VStack>
      </Flex>
    </VStack>
  )
}

export default OrderDetails
