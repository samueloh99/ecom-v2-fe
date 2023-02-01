import React from 'react'

import NextImage from 'next/image'

import { useRouter } from 'next/router'

import {
  Img,
  Flex,
  VStack,
  Text,
  HStack,
  useBreakpointValue,
  Stack
} from '@chakra-ui/react'

import { Swiper, SwiperSlide } from 'swiper/react'
import { useParcelas } from '../../../services/hooks/useConfiguracoes'

interface SkuDTO {
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
}

export const Section2 = ({ produtos }: SkuDTO) => {
  const { push } = useRouter()

  const { data: dataParcela } = useParcelas()

  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })

  return (
    <Stack
      direction={{ base: 'column', lg: 'row' }}
      maxW={{ base: '100%', lg: '1200px' }}
      maxH="400px"
      w="100%"
      m="20px auto"
      p={{ base: '5px', lg: '0px' }}
      h="100%"
      align={{ base: 'start', lg: 'center' }}
    >
      <Flex
        justifyContent={{ base: 'start', lg: 'center' }}
        align="center"
        w="100%"
        position="relative"
      >
        {isMobile ? (
          <Text>Novidades</Text>
        ) : (
          <NextImage
            alt="selecao-novidade"
            priority
            src="https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/homepage_banner_slider.jpg"
            height="390px"
            width="250px"
          />
        )}
      </Flex>
      <Flex w={{ base: '100%', lg: '900px' }} position="relative" h="100%">
        <Swiper slidesPerView={isMobile ? 2 : 4} spaceBetween={10} loop={true}>
          {produtos.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <Flex
                  direction="column"
                  cursor="pointer"
                  onClick={() =>
                    push({ pathname: `/produto/${item.produto_id}` })
                  }
                >
                  <NextImage
                    height="300px"
                    width="240px"
                    src={item.foto1}
                    onMouseOver={e => (e.currentTarget.src = item.foto2)}
                    onMouseLeave={e => (e.currentTarget.src = item.foto1)}
                  />
                  <VStack align="start" spacing={2}>
                    <HStack mt="5px">
                      {item.cores
                        .sort((a, b) => b.nome.localeCompare(a.nome))
                        .map((skuVar1, skuVar1Idx) => {
                          return skuVar1.foto ? (
                            <Flex
                              key={skuVar1Idx}
                              justify="center"
                              align="center"
                              borderRadius="50%"
                              p="2px"
                              border="1px solid #ccc"
                            >
                              <NextImage
                                src={skuVar1.foto}
                                width="20px"
                                height="20px"
                                style={{ borderRadius: '50%' }}
                                alt={skuVar1.nome}
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
                      {item.tamanhos
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
                    <Text
                      fontSize={{ base: '12px', lg: '14px' }}
                      textTransform="uppercase"
                    >
                      {item.nome}
                    </Text>
                    {item.preco_desconto === 0 ? (
                      <Stack
                        direction={{ base: 'column', lg: 'row' }}
                        spacing={{ base: 0, lg: 2 }}
                      >
                        <Text
                          fontSize={{ base: '13px', lg: '15px' }}
                          fontWeight="bold"
                        >
                          R$ {item.preco_original.toFixed(2).replace('.', ',')}
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
                      </Stack>
                    ) : (
                      <>
                        <Text
                          fontSize={{ base: '13px', lg: '15px' }}
                          textDecoration="line-through"
                          color="#999"
                        >
                          R$ {item.preco_original.toFixed(2).replace('.', ',')}
                        </Text>
                        <Stack
                          direction={{ base: 'column', lg: 'row' }}
                          spacing={{ base: 0, lg: 2 }}
                        >
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
                        </Stack>
                      </>
                    )}
                  </VStack>
                </Flex>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </Flex>
    </Stack>
  )
}

export default Section2
