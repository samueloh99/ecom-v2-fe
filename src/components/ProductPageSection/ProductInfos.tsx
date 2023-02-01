import React, { useEffect, useRef, useState } from 'react'

import * as fbq from '../../../lib/fpixel'

import { parseCookies } from 'nookies'

import NextLink from 'next/link'

import {
  Flex,
  Button,
  Icon,
  Text,
  Divider,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  HStack,
  VStack,
  useToast,
  Img,
  Wrap
} from '@chakra-ui/react'

import { FiHeart } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { AiFillHeart } from 'react-icons/ai'

import ProductSizeGuide from './ProductSizeGuide'
import ProductShippingCalculator from './ProductShippingCalculator'

import { useProductPageInfo } from '../../contexts/ProductPageInfoContext'
import { useFavoritos } from '../../services/hooks/useFavoritos'
import { api } from '../../services/apiClient'
import { useMutation } from 'react-query'
import { queryClient } from '../../services/queryClient'
import { useAuthContext } from '../../contexts/AuthContext'
import { useParcelas } from '../../services/hooks/useConfiguracoes'
import { useCartContext } from '../../contexts/CartContext'
import { useCartDrawer } from '../../contexts/CartDrawerContext'

interface IProductDTO {
  product: {
    altura: string
    ativo: number
    categoria_id: number
    comprimento: string
    created_at: string
    descricao: null
    fornecedor_id: null
    id: number
    largura: string
    marca_id: number
    ncm: string
    nome: string
    referencia: string
    slug: string
    tipo_produto_id: number
    updated_at: string
    desconto: {
      tipo: number
      valor: number
    }
    variantes: {
      idSku: number
      sku_referencia: string
      preco: number
      preco_desconto: number
      var1: string
      var1Foto: string
      var2: string
      estoque: number
      fotos: string[]
      peso: number
    }[]
  }
}

interface ISkuSelectedDTO {
  idSku: number
  preco: number
  preco_desconto: number

  var1: string
  sku_referencia: string
  var1Foto: string
  var2: string
  estoque: number
  fotos: string[]
  peso: number
}

const ProductInfos = ({ product }: IProductDTO) => {
  const cookies = parseCookies()
  const toast = useToast()

  // useContexts
  const { setVar1, setVar2, var1, var2 } = useProductPageInfo()
  const { userData } = useAuthContext()
  const { setCart, cart } = useCartContext()
  const { onOpen } = useCartDrawer()

  // react-query
  const { data: dataFavoritos } = useFavoritos()
  const { data: dataParcela } = useParcelas()

  const [isOpen, setIsOpen] = useState(false)
  const [favorited, setFavorited] = useState(false)

  const [skuSelected, setSkuSelected] = useState<ISkuSelectedDTO>()

  const onClose = () => setIsOpen(false)
  const cancelRef = useRef()

  useEffect(() => {
    const skuToBeSelected = product.variantes.find(
      item => item.var2 === var2 && item.var1 === var1
    )

    setSkuSelected(skuToBeSelected)
  }, [var1, var2])

  const checkProductDiscount = skuSelected && skuSelected.preco_desconto > 0

  const installmentsPrice =
    skuSelected &&
    dataParcela &&
    (skuSelected.preco / dataParcela.length).toFixed(2)

  const variantes1 = product.variantes
    .map(item => item.var1)
    .filter((value, index, self) => self.indexOf(value) === index)

  const variantes2 = product.variantes
    .filter(item => item.estoque !== 0)
    .filter(item => item.var1 === var1)
    .map(item => item.var2)
    .filter((value, index, self) => self.indexOf(value) === index)

  useEffect(() => {
    try {
      const checkIfSkuExists =
        userData &&
        dataFavoritos &&
        dataFavoritos
          .filter(item => item.usuario_id === userData.id)
          .filter(item => item.sku_id === skuSelected.idSku)

      if (checkIfSkuExists.length !== 0) {
        setFavorited(true)
      } else {
        setFavorited(false)
      }
    } catch (error) {
      setFavorited(false)
    }
  }, [skuSelected, userData])

  const createFavorito = useMutation(
    async () => {
      try {
        const response = await api.post('/favoritos', {
          sku_id: skuSelected.idSku,
          usuario_id: userData.id
        })

        return response.data
      } catch (err) {}
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('favoritos')
      }
    }
  )

  const deleteFavorito = useMutation(
    async (id: number) => {
      const response = await api.delete(`/favoritos/apagar/${id}`)

      return response
    },
    { onSuccess: () => queryClient.invalidateQueries('favoritos') }
  )

  const addWishList = async () => {
    if (cookies['nextauth.token'] === undefined) {
      return setIsOpen(true)
    }

    if (favorited === true && skuSelected.idSku !== undefined) {
      const findFavoritoWithSameSkuId =
        dataFavoritos &&
        dataFavoritos.filter(item => item.sku_id === skuSelected.idSku)
      setFavorited(false)
      return await deleteFavorito.mutateAsync(findFavoritoWithSameSkuId[0].id)
    }

    try {
      skuSelected.idSku && (await createFavorito.mutateAsync())
      setFavorited(true)
    } catch (err) {
      console.log('voce deve selecionar um sku')
    }
  }

  const sendToCart = async () => {
    const findSkuOnCart = cart.find(item => item.idSku === skuSelected.idSku)

    if (findSkuOnCart && findSkuOnCart.quantidade >= skuSelected.estoque) {
      return toast({
        title: 'Produto com estoque insuficiente.',
        description: 'Produto já adicionado no carrinho.',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    }

    if (skuSelected.estoque <= 0) {
      return toast({
        title: 'Produto Indisponível.',
        description: 'Atualize a página.',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    }

    const productToCart = {
      idProd: product.id,
      nome: product.nome,
      referencia: product.referencia,
      sku_referencia: skuSelected.sku_referencia,
      foto: skuSelected.fotos[0],
      variante1: skuSelected.var1,
      variante2: skuSelected.var2,
      preco:
        skuSelected.preco_desconto === 0
          ? skuSelected.preco
          : skuSelected.preco_desconto,
      quantidade: 1,
      idSku: skuSelected.idSku,
      peso: skuSelected.peso
    }

    fbq.event('AddToCart', {
      content_type: 'product',
      content_ids: [`${productToCart.idProd}-${productToCart.idSku}`],
      value: productToCart.preco,

      currency: 'BRL'
    })

    setCart([...cart, productToCart])
    onOpen()
  }

  return (
    <Flex
      direction="column"
      w="100%"
      p={{ base: '0px', lg: '0px 0px 0px 10px' }}
      h="100%"
    >
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Chae's:
            </AlertDialogHeader>
            <AlertDialogBody display="flex">
              <Text>Login necessário. Faça o</Text>
              <NextLink href="/login">
                <Text cursor="pointer" ml="5px" textDecoration="underline">
                  Login
                </Text>
              </NextLink>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                ok
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <VStack align="start">
        <VStack spacing={0} align="start">
          <Text fontSize={{ base: '18px', lg: '20px' }}>{product.nome}</Text>
          <Text fontSize={{ base: '11px', lg: '13px' }}>
            REF: {product.referencia}
          </Text>
        </VStack>
        {checkProductDiscount ? (
          <VStack align="start">
            <HStack fontSize={{ base: '12px', lg: '14px' }}>
              <Text color="blackAlpha.800" textDecoration="line-through">
                R${' '}
                {skuSelected && skuSelected.preco.toFixed(2).replace('.', ',')}
              </Text>
              {product.desconto.tipo === 1 ? (
                <Text color="#088208">
                  {skuSelected &&
                    (
                      100 -
                      (skuSelected.preco_desconto * 100) / skuSelected.preco
                    ).toFixed(2)}
                  % OFF
                </Text>
              ) : (
                <Text color="#088208">({product.desconto.valor}% OFF)</Text>
              )}
            </HStack>
            <HStack>
              <Text fontSize={16} color="blackAlpha.800" fontWeight="bold">
                R${' '}
                {skuSelected &&
                  skuSelected.preco_desconto.toFixed(2).replace('.', ',')}
              </Text>
              <Text
                fontSize={{ base: '12px', lg: '14px' }}
                color="blackAlpha.600"
              >
                {dataParcela && dataParcela.length}x R${installmentsPrice}
              </Text>
            </HStack>
          </VStack>
        ) : (
          <VStack align="start" spacing={0}>
            <Text fontSize={18} color="blackAlpha.800" fontWeight="bold">
              R$ {skuSelected && skuSelected.preco.toFixed(2).replace('.', ',')}
            </Text>
            <Text fontSize="14px" color="blackAlpha.600">
              {dataParcela && dataParcela.length}x R${installmentsPrice}
            </Text>
          </VStack>
        )}
      </VStack>
      <VStack align="start" mt="20px" spacing={5}>
        <VStack align="start" w="100%">
          <HStack fontSize={{ base: '14px', lg: '16px' }} spacing={1}>
            <Text>Cor:</Text>
            <Text fontWeight="medium">{var1 && var1}</Text>
          </HStack>
          <Wrap w="100%">
            {var1 &&
              variantes1.map((item, index) => {
                const findPhoto = product.variantes.find(
                  value => value.var1 === item
                )

                if (findPhoto.var1Foto) {
                  return (
                    <Flex
                      key={index}
                      border={var1 === item ? '1px solid black' : 'none'}
                      maxW={{ base: '35px', lg: '44px' }}
                      maxH={{ base: '35px', lg: '44px' }}
                      w="100%"
                      p="3px"
                      h="100%"
                      justifyContent="center"
                      borderRadius="50%"
                      alignItems="center"
                      cursor="pointer"
                      onClick={() => setVar1(item)}
                    >
                      <Img
                        border="1px solid black"
                        borderRadius="50%"
                        src={findPhoto.var1Foto}
                      />
                    </Flex>
                  )
                }
                return (
                  <Flex
                    key={index}
                    border={var1 === item ? '1px solid black' : 'none'}
                    w="auto"
                    p="3px"
                    maxH="44px"
                    h="100%"
                    justifyContent="center"
                    alignItems="center"
                    fontSize={{ base: '14px', lg: '16px' }}
                    cursor="pointer"
                    onClick={() => setVar1(item)}
                  >
                    <Text>{item}</Text>
                  </Flex>
                )
              })}
          </Wrap>
        </VStack>
        <VStack align="start">
          <HStack fontSize={{ base: '14px', lg: '16px' }} spacing={1}>
            <Text>Tamanho:</Text>
            <Text fontWeight="medium">{var2 && var2}</Text>
          </HStack>
          <Wrap>
            {variantes2
              .sort((a, b) => b.localeCompare(a))
              .map((item, index) => {
                return (
                  <Flex
                    key={index}
                    border="1px solid #ccc"
                    w={{ base: '35px', lg: '44px' }}
                    h={{ base: '35px', lg: '44px' }}
                    bg={var2 === item ? 'black' : 'white'}
                    color={var2 === item ? 'white' : 'black'}
                    borderRadius="50%"
                    cursor="pointer"
                    justifyContent="center"
                    alignItems="center"
                    onClick={() => setVar2(item)}
                  >
                    <Text fontSize={{ base: '14px', lg: '16px' }}>{item}</Text>
                  </Flex>
                )
              })}
          </Wrap>
        </VStack>
        {skuSelected && (
          <Flex w="100%" direction="column" color="red">
            <Text>
              Restam Apenas <strong>{skuSelected.estoque}</strong> em estoque.
            </Text>
          </Flex>
        )}
      </VStack>

      <ProductSizeGuide />

      <ProductShippingCalculator skuSelected={skuSelected} />

      <HStack>
        <Button
          w="100%"
          color="white"
          bg="#1BA14E"
          fontSize={{ base: '14px', lg: '16px' }}
          onClick={() => sendToCart()}
        >
          Comprar
        </Button>
        <Flex p="5px" border="1px solid black" borderRadius={5}>
          <Icon
            onClick={addWishList}
            as={favorited ? AiFillHeart : FiHeart}
            cursor="pointer"
            fontSize={{ base: 20, lg: 25 }}
          />
        </Flex>
      </HStack>

      <Divider my="30px" />

      <HStack cursor="pointer">
        <Icon as={FaWhatsapp} fontSize={20} />
        <Text textDecoration="underline">
          Compartilhe este produto no WhatsApp
        </Text>
      </HStack>
    </Flex>
  )
}

export default ProductInfos
