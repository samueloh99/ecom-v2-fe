import React, { useEffect, useState } from 'react'

import NextImage from 'next/image'

import { Flex, Img } from '@chakra-ui/react'
import { Swiper, SwiperSlide } from 'swiper/react'

import { Pagination, Navigation } from 'swiper'

import { useProductPageInfo } from '../../contexts/ProductPageInfoContext'

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
    variantes: {
      idSku: number
      preco: number
      preco_desconto: number
      var1: string
      sku_referencia: string
      var2: string
      estoque: number
      fotos: string[]
      peso: number
    }[]
  }
}

const ProductPhotosMobile = ({ product }: IProductDTO) => {
  const { var1, var2 } = useProductPageInfo()

  const [photos, setPhotos] = useState<string[]>()

  useEffect(() => {
    if (var1 && var2) {
      const var2Selected = var2
        ? var2
        : product.variantes.map(item => item.var2)[0]

      const colorFilter1 = product.variantes.filter(item => item.var1 === var1)
      const colorFilter2 = colorFilter1.filter(
        item => item.var2 === var2Selected
      )

      const filterOnlyExists = colorFilter2[0].fotos.filter(
        item => item !== null && item !== ''
      )

      setPhotos(filterOnlyExists)
    }
  }, [var1])

  return (
    <Flex position="relative" mb="20px">
      <Swiper
        pagination={{
          clickable: true
        }}
        modules={[Pagination, Navigation]}
      >
        {photos &&
          photos.map((item, index) => {
            return (
              item &&
              item.includes('http') && (
                <SwiperSlide key={index}>
                  <Flex w="100%" justifyContent="center">
                    <Img src={item} />
                  </Flex>
                </SwiperSlide>
              )
            )
          })}
      </Swiper>
    </Flex>
  )
}

export default ProductPhotosMobile
