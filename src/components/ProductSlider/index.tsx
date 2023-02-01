import React, { useState, useEffect } from 'react'

import { parseCookies } from 'nookies'

import {
  Flex,
  HStack,
  Box,
  Stack,
  Img,
  Icon,
  Text,
  useBreakpointValue
} from '@chakra-ui/react'

import { Swiper, SwiperSlide } from 'swiper/react'

import { FiHeart } from 'react-icons/fi'

import { AiFillHeart } from 'react-icons/ai'

import SwiperCore, { Pagination, Navigation } from 'swiper'
import { useAuthContext } from '../../contexts/AuthContext'
import { useFavoritos } from '../../services/hooks/useFavoritos'
import { useMutation } from 'react-query'
import { api } from '../../services/apiClient'
import { queryClient } from '../../services/queryClient'

SwiperCore.use([Pagination, Navigation])

interface SkuDTO {
  produto_id: number
  sku_id: number
  nome: string
  var1: string[]
  var2: string[]
  preco_original: number
  preco_desconto: number
  total_pedidos: number
  foto1: string
  foto2: string
  created_at: Date
  updated_at: Date
}

const ProductSlider = ({ produtos }) => {
  const cookies = parseCookies()

  const [favoritoProduct, setFavoritoProduct] = useState([])

  const { userData } = useAuthContext()

  const { data } = useFavoritos()

  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })

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

  useEffect(() => {
    try {
      const filteredFavoritosProductByUserId = data.filter(
        item => item.usuario_id === userData.id
      )
      const productListFavoritos = filteredFavoritosProductByUserId.map(
        item => item.sku_id
      )
      setFavoritoProduct(productListFavoritos)
    } catch (err) {}
  }, [data, userData])

  const toogleFavoritos = async id => {
    const findFavoritoBySkuId = data.filter(item => item.sku_id === id)
    if (favoritoProduct.includes(id)) {
      await deleteFavorito.mutateAsync(findFavoritoBySkuId[0].id)
    } else {
      await createFavorito.mutateAsync(id)
    }
  }

  return (
    <Flex
      position="relative"
      justifyContent="center"
      alignItems="center"
      m="100px auto"
      maxW={{ base: '100%', lg: '1400px' }}
    >
      <Swiper
        id="swipermain"
        slidesPerView={isMobile ? 2 : 4}
        slidesPerGroup={isMobile ? 2 : 4}
        loop={true}
        loopFillGroupWithBlank={true}
        pagination={{
          clickable: true
        }}
        navigation={true}
      >
        {produtos &&
          produtos.map((item: SkuDTO, index: number) => {
            const {
              preco_original,
              produto_id,
              preco_desconto,
              foto1,
              foto2,
              var1,
              var2,
              nome
            } = item

            return (
              <SwiperSlide
                style={{ display: 'flex', justifyContent: 'center' }}
                key={index}
              >
                <Stack
                  cursor="pointer"
                  m="0"
                  position="relative"
                  border="1px solid transparent"
                  _hover={{ borderColor: '#ccc', transition: '0.4s' }}
                  w={{ base: '200px', lg: '250px' }}
                >
                  <Box
                    onClick={() => toogleFavoritos(produto_id)}
                    cursor="pointer"
                    position="absolute"
                    top="2"
                    right="2"
                  >
                    {cookies['nextauth.token'] !== undefined &&
                    favoritoProduct.includes(produto_id) ? (
                      <Icon fontSize={25} as={AiFillHeart} />
                    ) : (
                      <Icon fontSize={25} as={FiHeart} />
                    )}
                  </Box>
                  <Stack marginTop="0px !important" alignItems="center">
                    <Box>
                      <Img
                        src={foto1}
                        onMouseOver={e => (e.currentTarget.src = foto1)}
                        onMouseLeave={e => (e.currentTarget.src = foto2)}
                      />
                    </Box>
                    <Text
                      fontSize={{ base: '10px', lg: '14px' }}
                      textTransform="uppercase"
                    >
                      {nome}
                    </Text>
                    <HStack>
                      {preco_desconto === 0 ? (
                        <Text
                          fontSize={{ base: '14px', lg: '16px' }}
                          fontWeight="bold"
                        >
                          R$ {preco_original}
                        </Text>
                      ) : (
                        <>
                          <Text
                            fontSize={{ base: '14px', lg: '15px' }}
                            textDecoration="line-through"
                            color="#999"
                          >
                            R$ {preco_original}
                          </Text>
                          <Text
                            fontSize={{ base: '14px', lg: '16px' }}
                            fontWeight="bold"
                          >
                            R$ {preco_desconto}
                          </Text>
                        </>
                      )}
                    </HStack>
                    <Text fontSize={{ base: '10px', lg: '14px' }}>
                      ou 2x R${preco_original / 2}
                    </Text>
                    <HStack>
                      {var1.map((item, index) => {
                        return (
                          <Text
                            key={index}
                            fontSize={{ base: '10px', lg: '13px' }}
                            textTransform="uppercase"
                            p="1"
                          >
                            {item}
                          </Text>
                        )
                      })}
                    </HStack>
                    <HStack>
                      {var2.map((item, index) => {
                        return (
                          <Text
                            key={index}
                            fontSize={{ base: '10px', lg: '13px' }}
                            textTransform="uppercase"
                            p="1"
                            border="1px solid #ccc"
                            w={{ base: '20px', lg: '30px' }}
                            h={{ base: '20px', lg: '30px' }}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            {item}
                          </Text>
                        )
                      })}
                    </HStack>
                  </Stack>
                </Stack>
              </SwiperSlide>
            )
          })}
      </Swiper>
    </Flex>
  )
}

export default ProductSlider
