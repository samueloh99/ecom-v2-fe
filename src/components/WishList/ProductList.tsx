import React from 'react'

import NextLink from 'next/link'

import NextImage from 'next/image'

import { useMutation } from 'react-query'

import {
  Wrap,
  Text,
  Icon,
  WrapItem,
  Button,
  Box,
  Flex,
  Stack,
  Img,
  useToast
} from '@chakra-ui/react'

import { MdOutlineClose } from 'react-icons/md'
import { queryClient } from '../../services/queryClient'

import { api } from '../../services/apiClient'
import { useCartContext } from '../../contexts/CartContext'
import { useCartDrawer } from '../../contexts/CartDrawerContext'

interface IProps {
  favoritos: {
    favorito_id: number
    sku_id: number
    produto_id: number
    foto1: string
    ncm: string
    peso: number
    referencia: string
    sku_referencia: string
    nome: string
    preco: number
    var1: {
      nome: string
      foto: string
    }
    var2: string
    estoque: number
  }[]
}

interface ISendToCartProps {
  peso: number
  favorito_id: number
  sku_id: number
  ncm: string
  produto_id: number
  foto1: string
  referencia: string
  sku_referencia: string
  nome: string
  preco: number
  var1: {
    nome: string
    foto: string
  }
  var2: string
  estoque: number
}

const ProductList = ({ favoritos }: IProps) => {
  const toast = useToast()
  const { onOpen } = useCartDrawer()
  const { cart, setCart } = useCartContext()

  const deleteFavorito = useMutation(
    async (id: number) => {
      const response = await api.delete(`/favoritos/apagar/${id}`)

      return response
    },
    { onSuccess: () => queryClient.invalidateQueries('favoritos') }
  )

  const removeFavorito = async props => {
    await deleteFavorito.mutateAsync(props)
  }

  const sendToCart = async (item: ISendToCartProps) => {
    const filterSkuInCart = cart.find(sku => sku.idSku === item.sku_id)
    if (filterSkuInCart && filterSkuInCart.quantidade === item.estoque) {
      return toast({
        title: 'Não foi possível adicionar.',
        description: 'Produto já adicionado ao carrinho.',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    }

    if (item.estoque === 0) {
      await deleteFavorito.mutateAsync(item.sku_id)
      return toast({
        title: 'Não foi possível adicionar.',
        description: 'Produto sem estoque.',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    }

    const productToCart = {
      idProd: item.produto_id,
      nome: item.nome,
      referencia: item.referencia,
      sku_referencia: item.sku_referencia,
      foto: item.foto1,
      variante1: item.var1.nome,
      variante2: item.var2,
      preco: item.preco,
      quantidade: 1,
      idSku: item.sku_id,
      peso: item.peso,
      ncm: item.ncm
    }
    setCart([...cart, productToCart])
    onOpen()
  }

  return (
    <Wrap w="100%" justify="center">
      {favoritos.map((item, index) => {
        return (
          <WrapItem
            key={index}
            display="flex"
            flexDirection="column"
            border="1px solid #ccc"
            w={{ base: '130px', lg: 'auto' }}
            justifyContent="center"
            alignItems="center"
            position="relative"
            textAlign="center"
          >
            {item.estoque === 0 && (
              <Flex
                boxShadow="inset 0 0 0 1000px rgba(0,0,0,.5)"
                position="absolute"
                h="100%"
                w="100%"
                zIndex="100000"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontWeight="bold" color="white">
                  Produto Acabou Estoque
                </Text>
              </Flex>
            )}
            <Icon
              as={MdOutlineClose}
              cursor="pointer"
              top="2"
              onClick={() => removeFavorito(item.favorito_id)}
              right="2"
              position="absolute"
              zIndex={999}
              fontSize={25}
            />
            <Img w="300px" src={item.foto1} />
            <Text fontSize={{ base: '10px', lg: '14px' }}>{item.nome}</Text>
            <Text fontSize={{ base: '10px', lg: '14px' }}>R${item.preco}</Text>
            <Stack my="4" direction="row">
              {item.var1.foto ? (
                <Flex
                  justify="center"
                  align="center"
                  borderRadius="50%"
                  border="1px solid #ccc"
                  w="25px"
                  h="25px"
                >
                  <NextImage
                    src={item.var1.foto}
                    width="25px"
                    height="25px"
                    style={{ borderRadius: '50%' }}
                    alt={item.var1.nome}
                    priority
                  />
                </Flex>
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  textTransform="uppercase"
                  justifyContent="center"
                  fontSize={{ base: '9px', lg: '12px' }}
                  border="1px solid #ccc"
                  h="25px"
                  py={{ base: '1', lg: '1' }}
                  px={{ base: '1', lg: '2' }}
                >
                  {item.var1.nome}
                </Box>
              )}
              <Box
                display="flex"
                alignItems="center"
                textTransform="uppercase"
                justifyContent="center"
                w="25px"
                h="25px"
                borderRadius="50%"
                fontSize={{ base: '9px', lg: '12px' }}
                border="1px solid #ccc"
              >
                {item.var2}
              </Box>
            </Stack>

            <Flex
              p={{ bg: '0', lg: '3' }}
              mb="10px"
              w={{ base: '100%', lg: '200px' }}
              justifyContent="space-between"
              flexDirection={{ base: 'column', lg: 'row' }}
            >
              <Button
                fontSize={{ base: '5px', lg: '12px' }}
                bg="black"
                color="white"
                onClick={() => sendToCart(item)}
                h="30px"
                width={{ base: '100%', lg: '80px' }}
                borderRadius="0"
                fontWeight="bold"
                _hover={{ bg: 'black' }}
              >
                Comprar
              </Button>
              <NextLink href={`/produto/${item.produto_id}`}>
                <Flex
                  cursor="pointer"
                  fontSize={{ base: '5px', lg: '12px' }}
                  bg="black"
                  color="white"
                  borderRadius="0"
                  textAlign="center"
                  alignItems="center"
                  justifyContent="center"
                  h="30px"
                  width={{ base: '100%', lg: '100px' }}
                  fontWeight="bold"
                >
                  <Text>Ver Detalhes</Text>
                </Flex>
              </NextLink>
            </Flex>
          </WrapItem>
        )
      })}
    </Wrap>
  )
}

export default ProductList
