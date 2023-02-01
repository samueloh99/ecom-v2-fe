import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import * as fbq from '../../../lib/fpixel'

import {
  Flex,
  Img,
  VStack,
  Text,
  Divider,
  HStack,
  Center,
  Icon,
  Stack,
  useBreakpointValue,
  useToast,
  Spinner
} from '@chakra-ui/react'

import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import { BiTrash } from 'react-icons/bi'
import { TbAlertCircle } from 'react-icons/tb'
import { api } from '../../services/apiClient'
interface ISkuWithDiscountHook {
  id: number
  tipo: number
  valor: number
  preco_original: number
}
interface IProductSkuDTO {
  idProd: number
  nome: string
  referencia: string
  ncm: string
  variante1: string
  variante2: string
  foto: string
  sku_referencia: string
  quantidade: number
  preco: number
  idSku: number
  peso: number
}

const CartPageItem = ({
  item,
  deleteItemOnCart,
  incrementCart,
  decreaseCart,
  cart,
  setCart,
  index,
  totalQtd,
  totalCart
}) => {
  const toast = useToast()
  const { push } = useRouter()
  const {
    foto,
    idProd,
    nome,
    preco,
    quantidade,
    variante1,
    referencia,
    variante2,
    idSku
  }: IProductSkuDTO = item

  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })

  const [validation, setValidation] = useState({
    isLoading: false,
    disable: false
  })

  const [skusWithDiscount, setSkuWithDiscount] =
    useState<ISkuWithDiscountHook>()

  const getSkuIdApi = async (id: number) => {
    return await api.get(`/skus/buscar/${id}`)
  }

  useEffect(() => {
    setValidation({ ...validation, isLoading: true })
    getSkuIdApi(idSku).then(res => {
      if (res.data.preco_desconto !== 0) {
        setSkuWithDiscount({
          id: res.data.id,
          tipo: res.data.desconto.tipo,
          valor: res.data.desconto.valor,
          preco_original: res.data.preco_venda
        })
      }

      if (res.data.estoque === quantidade) {
        return setValidation({
          ...validation,
          isLoading: false,
          disable: true
        })
      }

      if (res.data.estoque < quantidade) {
        let newArr = [...cart]
        newArr[index].quantidade = res.data.estoque
        setCart(newArr)

        return setValidation({
          ...validation,
          isLoading: false,
          disable: true
        })
      }

      setValidation({ isLoading: false, disable: false })
    })
  }, [cart])

  useEffect(() => {
    console.log(totalQtd())
    fbq.event('InitiateCheckout', {
      content_type: 'product',
      value: totalCart(),
      num_items: totalQtd(),
      currency: 'BRL',
      step: '1 - Carrinho'
    })
  }, [])

  const handleDecreaseCart = async (id: number, index: number) => {
    setValidation({ ...validation, isLoading: true })
    await api
      .get(`/skus/buscar/${id}`)
      .then(res => {
        if (quantidade > res.data.estoque) {
          let newArr = [...cart]
          newArr[index].quantidade = res.data.estoque
          setCart(newArr)
          return setValidation({
            ...validation,
            isLoading: false,
            disable: true
          })
        }
        decreaseCart(index)
        return setValidation({
          ...validation,
          isLoading: false,
          disable: false
        })
      })
      .catch(err => {
        setValidation({
          ...validation,
          isLoading: false,
          disable: false
        })
        return toast({
          title: 'Erro.',
          description: 'Não foi possível adicionar.',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      })
  }

  const handleIncreaseCart = async (id: number, index: number) => {
    setValidation({ ...validation, isLoading: true })
    await api
      .get(`/skus/buscar/${id}`)
      .then(res => {
        if (quantidade + 1 === res.data.estoque) {
          incrementCart(index)

          return setValidation({
            ...validation,
            isLoading: false,
            disable: true
          })
        }
        incrementCart(index)
        return setValidation({
          ...validation,
          isLoading: false,
          disable: false
        })
      })
      .catch(err => {
        setValidation({
          ...validation,
          isLoading: false,
          disable: false
        })
        return toast({
          title: 'Erro.',
          description: 'Não foi possível adicionar.',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      })
  }

  return (
    <VStack align="start" w="100%" m="10px auto">
      {validation.disable && (
        <Flex
          justify="start"
          align="start"
          bg="#FFEAD6"
          w="100%"
          borderRadius="5px"
          p="2px 5px"
        >
          <Icon as={TbAlertCircle} fontSize="15px" color="red" />
          <Text fontSize="12px">
            Temos apenas {quantidade} unidades deste item!
          </Text>
        </Flex>
      )}
      <Stack
        direction={{ base: 'column', md: 'row' }}
        bg="white"
        p="10px"
        w="100%"
        h={{ base: '100%', lg: '170px' }}
        position="relative"
        borderRadius="5px"
      >
        {validation.isLoading && (
          <Flex
            bg="gray"
            opacity="0.5"
            w="100%"
            h="100%"
            borderRadius="5px"
            position="absolute"
            top="0"
            left="0"
            zIndex={9999}
            right="0"
            justify="center"
            align="center"
          >
            <Spinner />
          </Flex>
        )}
        <Flex w="130px" h="100%">
          <Img
            w="100%"
            h="100%"
            src={foto}
            alt={`image-${nome}`}
            cursor="pointer"
            onClick={() => push({ pathname: `/produto/${idProd}` })}
          />
        </Flex>
        <Flex
          position="absolute"
          right="5px"
          m="0 auto"
          cursor="pointer"
          onClick={() => deleteItemOnCart()}
        >
          <Icon as={BiTrash} />
        </Flex>
        <VStack w="200px" h="100%" align="start" justify="space-between">
          <Text fontSize="14px" color="gray.400">
            {referencia}
          </Text>
          <Text fontSize="16px" fontWeight="bold" textTransform="uppercase">
            {nome}
          </Text>
          <Text fontSize="14px" color="gray.400">
            Tamanho: {variante1}
          </Text>
          <Text fontSize="14px" color="gray.400">
            Cor: {variante2}
          </Text>
        </VStack>
        <Center height="100%" w={{ base: '100%', lg: '70px' }}>
          <Divider orientation={isMobile ? 'horizontal' : 'vertical'} />
        </Center>
        {skusWithDiscount ? (
          <Flex w="250px" direction="column" h="100%" justifyContent="start">
            <Text fontSize="14px">Valor Unitário</Text>
            <Text
              color="gray.300"
              textDecoration="line-through"
              fontSize="14px"
              textTransform="uppercase"
            >
              R$
              {skusWithDiscount.preco_original.toFixed(2).replaceAll('.', ',')}
            </Text>
            <Text fontSize="16px" color="#088208" fontWeight="medium">
              R$
              {preco.toFixed(2).replaceAll('.', ',')}
            </Text>
          </Flex>
        ) : (
          <Flex w="250px" direction="column" h="100%" justifyContent="start">
            <Text fontSize="14px">Valor Unitário</Text>

            <Text fontSize="16px" fontWeight="medium">
              R${preco.toFixed(2).replaceAll('.', ',')}
            </Text>
          </Flex>
        )}
        <Flex
          w="250px"
          direction="column"
          h="100%"
          justifyContent="space-between"
        >
          <Flex direction="column">
            <Text fontSize="14px">Valor Total</Text>
            <Text fontSize="16px" fontWeight="medium">
              R${(preco * quantidade).toFixed(2).replaceAll('.', ',')}
            </Text>
          </Flex>
          <HStack fontSize="10px" my={{ base: '10px', lg: '0px' }}>
            <Flex
              p="5px"
              borderRadius="50%"
              border="1px solid #ccc"
              cursor="pointer"
              onClick={() => handleDecreaseCart(idSku, index)}
            >
              <Icon as={AiOutlineMinus} fontSize="10px" />
            </Flex>
            <Text fontSize="15px">{quantidade}</Text>
            <Flex
              bg={validation.disable ? 'gray.100' : 'transparent'}
              p="5px"
              borderRadius="50%"
              border="1px solid #ccc"
              cursor={validation.disable ? 'auto' : 'pointer'}
              onClick={() =>
                validation.disable !== true && handleIncreaseCart(idSku, index)
              }
            >
              <Icon as={AiOutlinePlus} fontSize="10px" />
            </Flex>
          </HStack>
        </Flex>
      </Stack>
    </VStack>
  )
}

export default CartPageItem
