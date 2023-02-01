import React, { useState, useEffect } from 'react'

import NextImage from 'next/image'

import { useRouter } from 'next/router'

import { FiHeart } from 'react-icons/fi'

import { AiFillHeart } from 'react-icons/ai'

import InfiniteScroll from 'react-infinite-scroll-component'

import {
  Box,
  Text,
  Grid,
  HStack,
  Icon,
  Flex,
  VStack,
  Img,
  Spinner
} from '@chakra-ui/react'

import { parseCookies } from 'nookies'
import { useAuthContext } from '../../contexts/AuthContext'
import { useFavoritos } from '../../services/hooks/useFavoritos'
import { useMutation } from 'react-query'
import { api } from '../../services/apiClient'
import { queryClient } from '../../services/queryClient'
import { useParcelas } from '../../services/hooks/useConfiguracoes'

interface SkuDTO {
  setCatProducts: (props) => void
  setPerPage: (props: number) => void
  perPage: number
  produtos: {
    produto_id: number
    sku_id: number
    sku_referencia: string
    produto_referencia: string
    nome: string
    tags: number[]
    cores: {
      nome: string
      foto: string
    }[]
    tamanhos: {
      nome: string
      foto: string
    }[]
    preco_original: number
    preco_desconto: number
    total_pedidos: number
    foto1: string
    foto2: string
    created_at: Date
    updated_at: Date
  }[]
  pages: {
    paginas: number
    atual: number
    encontrados: number
    exibindo: number
  }
  isLoading: boolean
}

export default function CategoryProductList({
  produtos,
  setPerPage,
  perPage,
  pages
}: SkuDTO) {
  const cookies = parseCookies()

  const { push } = useRouter()

  const [favoritoProduct, setFavoritoProduct] = useState([])

  const [favoritoValid, setFavoritoValid] = useState(false)

  const { data: dataParcela } = useParcelas()

  const { userData } = useAuthContext()

  const { data } = useFavoritos()

  useEffect(() => {
    if (cookies['nextauth.token'] !== undefined) {
      setFavoritoValid(true)
    }
    try {
      const filteredFavoritosProductByUserId = data.filter(
        item => item.usuario_id === userData.id
      )
      const productListFavoritos = filteredFavoritosProductByUserId.map(
        item => item.sku_id
      )
      setFavoritoProduct(productListFavoritos)
    } catch (err) {}
  }, [data, userData, cookies['nextauth.token']])

  const createFavorito = useMutation(
    async id => {
      try {
        const response = await api.post('/favoritos', {
          sku_id: id,
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

  const toogleFavoritos = async id => {
    const findFavoritoBySkuId = data.filter(item => item.sku_id === id)
    if (favoritoProduct.includes(id)) {
      await deleteFavorito.mutateAsync(findFavoritoBySkuId[0].id)
    } else {
      await createFavorito.mutateAsync(id)
    }
  }

  const fetchMoreData = () => {
    setPerPage(perPage + 12)
  }
  return (
    <Flex direction="column" align="center" position="relative">
      <InfiniteScroll
        dataLength={produtos.length}
        next={fetchMoreData}
        hasMore={pages && pages.encontrados >= pages.exibindo}
        loader={<Spinner />}
      >
        <Grid
          m="10px 0px"
          templateColumns={[
            'repeat(2, 1fr)',
            'repeat(3, 1fr)',
            'repeat(4, 1fr)'
          ]}
          gap={[2, 4]}
        >
          {produtos.map((item, index) => {
            const {
              foto2,
              foto1,
              preco_original,
              preco_desconto,
              produto_id,
              sku_id,
              cores,
              nome,
              tamanhos
            } = item

            return (
              <Box
                key={index}
                position="relative"
                border={{
                  base: '1px solid #ccc',
                  lg: '1px solid transparent'
                }}
                _hover={{ borderColor: '#ccc', transition: '0.4s' }}
              >
                {favoritoValid && (
                  <Box
                    cursor="pointer"
                    onClick={() => toogleFavoritos(sku_id)}
                    position="absolute"
                    right="2"
                    top="2"
                  >
                    <Icon
                      as={
                        favoritoProduct.includes(sku_id) ? AiFillHeart : FiHeart
                      }
                      fontSize={{ base: '20', lg: '25' }}
                    />
                  </Box>
                )}
                <Flex
                  cursor="pointer"
                  onClick={() => push(`/produto/${produto_id}`)}
                  direction="column"
                >
                  <Img
                    alt={nome}
                    src={foto1}
                    onMouseOver={e => (e.currentTarget.src = foto2)}
                    onMouseLeave={e => (e.currentTarget.src = foto1)}
                  />
                  <VStack alignItems="start" pl="5px" pt="5px">
                    <HStack>
                      {cores
                        .sort((a, b) => b.nome.localeCompare(a.nome))
                        .map((skuVar1, skuVar1Idx) => {
                          return skuVar1.foto ? (
                            <Flex
                              key={skuVar1Idx}
                              justify="center"
                              align="center"
                              borderRadius="50%"
                              border="1px solid #ccc"
                            >
                              <NextImage
                                src={skuVar1.foto}
                                width="20px"
                                height="20px"
                                style={{ borderRadius: '50%' }}
                                alt={skuVar1.nome}
                                priority
                              />
                            </Flex>
                          ) : (
                            <Flex
                              key={skuVar1Idx}
                              justify="center"
                              align="center"
                              p="2px"
                              border="1px solid #ccc"
                            >
                              <Text fontSize={{ base: '7px', lg: '10px' }}>
                                {skuVar1.nome}
                              </Text>
                            </Flex>
                          )
                        })}
                    </HStack>
                    <HStack>
                      {tamanhos
                        .sort((a, b) => b.nome.localeCompare(a.nome))
                        .map((skuVar2, skuVar2Idx) => {
                          return (
                            <Flex
                              key={skuVar2Idx}
                              w="20px"
                              h="20px"
                              justify="center"
                              align="center"
                              borderRadius="50%"
                              p="8px"
                              border="1px solid #ccc"
                            >
                              <Text fontSize="10px">{skuVar2.nome}</Text>
                            </Flex>
                          )
                        })}
                    </HStack>
                    <Text fontSize={{ base: '12px', lg: '14px' }}>{nome}</Text>
                    <VStack align="start">
                      {preco_desconto === 0 ? (
                        <HStack spacing={1}>
                          <Text
                            fontSize={{ base: '13px', lg: '15px' }}
                            fontWeight="bold"
                          >
                            R$ {preco_original.toFixed(2).replace('.', ',')}
                          </Text>
                          <Text
                            color="#999"
                            fontSize={{ base: '11px', lg: '13px' }}
                          >
                            {dataParcela &&
                              `${dataParcela.length}x R$${(
                                preco_original / dataParcela.length
                              ).toFixed(2)}`}
                          </Text>
                        </HStack>
                      ) : (
                        <>
                          <Text
                            fontSize={{ base: '13px', lg: '15px' }}
                            textDecoration="line-through"
                            color="#999"
                          >
                            R$ {preco_original.toFixed(2).replace('.', ',')}
                          </Text>
                          <HStack spacing={1}>
                            <Text
                              fontSize={{ base: '13px', lg: '15px' }}
                              fontWeight="bold"
                            >
                              R$ {preco_desconto.toFixed(2).replace('.', ',')}
                            </Text>
                            <Text
                              color="#999"
                              fontSize={{ base: '11px', lg: '13px' }}
                            >
                              {dataParcela &&
                                `${dataParcela.length}x R$${(
                                  preco_original / dataParcela.length
                                ).toFixed(2)}`}
                            </Text>
                          </HStack>
                        </>
                      )}
                    </VStack>
                  </VStack>
                </Flex>
              </Box>
            )
          })}
        </Grid>
      </InfiniteScroll>
    </Flex>
  )
}
