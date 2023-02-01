import React, { useEffect, useState } from 'react'

import NextImage from 'next/image'

import { useRouter } from 'next/router'

import {
  Img,
  Flex,
  VStack,
  Text,
  HStack,
  useBreakpointValue
} from '@chakra-ui/react'

import { Swiper, SwiperSlide } from 'swiper/react'

import { Pagination, Navigation } from 'swiper'
import { api } from '../../services/apiClient'
import { useParcelas } from '../../services/hooks/useConfiguracoes'

export default function CategoryProductSlider() {
  const [products, setProducts] = useState([])

  const { data: dataParcela } = useParcelas()

  const fetchBestProducts = async () => {
    const { data } = await api.get(`/skus/buscar/cat/12`)

    setProducts(data)
  }

  useEffect(() => {
    fetchBestProducts()
  }, [])

  const { push } = useRouter()

  const isMobile = useBreakpointValue({
    base: true,
    md: false
  })
  return (
    <Flex direction="column">
      <Text>OS MELHORES PRODUTOS</Text>
      <Flex w="100%" position="relative">
        <Swiper
          slidesPerView={isMobile ? 2 : 4}
          spaceBetween={10}
          navigation={isMobile ? false : true}
          modules={[Pagination, Navigation]}
        >
          {products.length > 1 &&
            products.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                  <Flex
                    direction="column"
                    cursor="pointer"
                    onClick={() =>
                      push({ pathname: `/produto/${item.produto_id}` })
                    }
                    mb="40px"
                  >
                    <Img
                      src={item.foto1}
                      onMouseOver={e => (e.currentTarget.src = item.foto2)}
                      onMouseLeave={e => (e.currentTarget.src = item.foto1)}
                    />
                    <VStack align="start" spacing={2} pl="5px" pt="5px">
                      <HStack>
                        {item.var1
                          .sort((a, b) => b.nome.localeCompare(a.nome))
                          .map((skuVar1, skuVar1Idx) => {
                            return (
                              <Flex
                                key={skuVar1Idx}
                                justify="center"
                                align="center"
                                borderRadius="5px"
                                p="2px"
                                border="1px solid #ccc"
                              >
                                {skuVar1.foto ? (
                                  <NextImage
                                    src={skuVar1.foto}
                                    width="15px"
                                    height="15px"
                                    alt={skuVar1.nome}
                                  />
                                ) : (
                                  <Text fontSize={{ base: '7px', lg: '10px' }}>
                                    {skuVar1.nome}
                                  </Text>
                                )}
                              </Flex>
                            )
                          })}
                      </HStack>
                      <HStack>
                        {item.var2
                          .sort((a, b) => b.nome.localeCompare(a.nome))
                          .map((skuVar2, skuVar2Idx) => {
                            return (
                              <Flex
                                key={skuVar2Idx}
                                w="15px"
                                h="15px"
                                justify="center"
                                align="center"
                                border="1px solid #ccc"
                              >
                                <Text fontSize="10px">{skuVar2.nome}</Text>
                              </Flex>
                            )
                          })}
                      </HStack>
                      <Text fontSize={{ base: '12px', lg: '14px' }}>
                        {item.nome}
                      </Text>
                      {item.preco_desconto === 0 ? (
                        <HStack spacing={1}>
                          <Text
                            fontSize={{ base: '13px', lg: '15px' }}
                            fontWeight="bold"
                          >
                            R${' '}
                            {item.preco_original.toFixed(2).replace('.', ',')}
                          </Text>
                          <Text
                            color="#999"
                            fontSize={{ base: '11px', lg: '13px' }}
                          >
                            {dataParcela &&
                              `${dataParcela.length}x R$${(
                                item.preco_original / dataParcela.length
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
                            R${' '}
                            {item.preco_original.toFixed(2).replace('.', ',')}
                          </Text>
                          <HStack spacing={1}>
                            <Text
                              fontSize={{ base: '13px', lg: '15px' }}
                              fontWeight="bold"
                            >
                              R${' '}
                              {item.preco_desconto.toFixed(2).replace('.', ',')}
                            </Text>
                            <Text
                              color="#999"
                              fontSize={{ base: '11px', lg: '13px' }}
                            >
                              {dataParcela &&
                                `${dataParcela.length}x R$${(
                                  item.preco_original / dataParcela.length
                                ).toFixed(2)}`}
                            </Text>
                          </HStack>
                        </>
                      )}
                    </VStack>
                  </Flex>
                </SwiperSlide>
              )
            })}
        </Swiper>
      </Flex>
    </Flex>
  )
}
