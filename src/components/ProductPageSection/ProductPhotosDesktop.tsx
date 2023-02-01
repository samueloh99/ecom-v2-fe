import React, { useEffect, useState } from 'react'

import NextImage from 'next/image'

import { Flex, Img, VStack, Box, HStack, Text } from '@chakra-ui/react'

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
      sku_referencia: string
      var1: string
      var2: string
      estoque: number
      fotos: string[]
      peso: number
    }[]
  }
}

const ProductPhotosDesktop = ({ product }: IProductDTO) => {
  const { var1, var2 } = useProductPageInfo()

  const [photos, setPhotos] = useState<string[]>()
  const [selectedPhoto, setSelectedPhoto] = useState<string>('')

  useEffect(() => {
    if (var1 && var2) {
      const var2Selected = var2
        ? var2
        : product.variantes.map(item => item.var2)[0]

      const colorFilter1 = product.variantes.filter(item => item.var1 === var1)
      const colorFilter2 = colorFilter1.filter(
        item => item.var2 === var2Selected
      )

      setPhotos(colorFilter2[0].fotos)
      setSelectedPhoto(colorFilter2[0].fotos[0])
    }
  }, [var1])

  return (
    <HStack
      w={{ base: '100%', lg: '570px' }}
      h="100%"
      justify="center"
      align="start"
    >
      <VStack justify="space-between" w="70px" spacing={2}>
        {photos &&
          photos.map((item, index) => {
            return (
              item &&
              item.includes('http') && (
                <Box w="70px" key={index} cursor="pointer">
                  <NextImage
                    alt={`produto-${item}`}
                    width="70px"
                    height="90px"
                    src={item}
                    onClick={() => setSelectedPhoto(item)}
                  />
                </Box>
              )
            )
          })}
      </VStack>
      <Flex w="500px" justify="center">
        {selectedPhoto ? (
          selectedPhoto.includes('http') && (
            <Img alt="imagem-produto" src={selectedPhoto} w="100%" h="100%" />
          )
        ) : (
          <Text>Sem foto</Text>
        )}
      </Flex>
    </HStack>
  )
}

export default ProductPhotosDesktop
