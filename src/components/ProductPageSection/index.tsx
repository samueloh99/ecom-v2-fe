import React, { useEffect } from 'react'

import { Flex, useBreakpointValue } from '@chakra-ui/react'

import { useProductPageInfo } from '../../contexts/ProductPageInfoContext'

import ProductPhotosDesktop from './ProductPhotosDesktop'
import ProductInfos from './ProductInfos'
import ProductPhotosMobile from './ProductPhotosMobile'
import ProductDetails from './ProductDetails'

interface IProductDTO {
  product: {
    altura: string
    ativo: number
    categoria: {
      nome: string
    }
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

const ProductPageSection = ({ product }: IProductDTO) => {
  const { setProduct } = useProductPageInfo()

  useEffect(() => {
    setProduct(product)
  }, [product])

  const isMobile = useBreakpointValue({
    base: true,
    md: false
  })

  return (
    <Flex
      maxW={{ lg: '1200px', base: '1200px' }}
      w="100%"
      h="100%"
      direction="column"
      m="20px auto"
      justify="center"
    >
      <Flex
        w="100%"
        direction={{ base: 'column', lg: 'row' }}
        px={{ base: '10px', lg: '0px' }}
      >
        {isMobile ? (
          <ProductPhotosMobile product={product} />
        ) : (
          <ProductPhotosDesktop product={product} />
        )}
        <ProductInfos product={product} />
      </Flex>
      <ProductDetails product={product} />
    </Flex>
  )
}

export default ProductPageSection
