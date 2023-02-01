import React, { useEffect, useState } from 'react'

import NextImage from 'next/image'

import { useRouter } from 'next/router'

import { Flex, useBreakpointValue, useMediaQuery } from '@chakra-ui/react'

import ProductList from './CategoryProductList'

import { api } from '../../services/apiClient'

import CategoryFilters from './CategoryFilters'
import CategoryFiltersMobile from './CategoryFiltersMobile'
import CategoryBreadCrumbs from './CategoryBreadCrumbs'

interface FilterCategoryDTO {
  filter2: string[]
  filter1: string
  setFilter2: (string) => void
  setFilter1: (string) => void
  produtos: {
    skus: {
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

    pag: {
      paginas: number
      atual: number
      encontrados: number
      exibindo: number
    }
  }
  variantes: {
    cores: string[]
    tamanhos: string[]
  }
}

const CategoryPage = ({
  produtos,
  filter2,
  setFilter2,
  setFilter1,
  filter1,
  variantes
}: FilterCategoryDTO) => {
  const { query, asPath } = useRouter()

  const [catProducts, setCatProducts] = useState<
    FilterCategoryDTO['produtos']['skus']
  >([])

  const [isLoading, setIsLoading] = useState(true)

  const [perPage, setPerPage] = useState(12)
  const [pages, setPages] = useState<FilterCategoryDTO['produtos']['pag']>()

  useEffect(() => {
    if (produtos) {
      setCatProducts(produtos.skus)
      setPages(produtos.pag)
    }
  }, [])

  const fetchProducts = async (var1, var2, perPage) => {
    setIsLoading(true)
    await api
      .get(
        `/skus/buscar/cat/${query['pid']}?o=${var1}&v=${var2}&mostrar=${perPage}`
      )
      .then(res => {
        if (res.data) {
          setCatProducts(res.data.skus)
          setPages(res.data.pag)
          setIsLoading(false)
        }
      })
      .catch(err => {
        setCatProducts(produtos.skus)
      })
  }

  useEffect(() => {
    const { o, pid, v } = query

    let filter1 = o === undefined ? '' : o
    let filter2 = v === undefined ? '' : v

    if (filter1 && filter2 && perPage === 12) {
      return
    }

    fetchProducts(filter1, filter2, perPage)
  }, [asPath, perPage, query])

  const isMobile = useBreakpointValue({
    base: true,
    md: false
  })

  const [isMobileImageCat] = useMediaQuery('(max-width: 650px)')

  return (
    <Flex p="20px" direction="column">
      {/* <CategoryProductSlider /> */}
      {query['pid'] === '13' && (
        <Flex w="100%" h="100%" position="relative" mb="10px">
          {isMobileImageCat ? (
            <NextImage
              src="https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/categoria_banner_black_mobile.gif"
              draggable={false}
              height="300px"
              width="640px"
            />
          ) : (
            <NextImage
              src="https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/categoria_banner_black.gif"
              width="1920px"
              height="200px"
            />
          )}
        </Flex>
      )}

      <CategoryBreadCrumbs isLoading={isLoading} />

      {isMobile === false && (
        <CategoryFilters
          produtos={!pages ? produtos.pag.encontrados : pages.encontrados}
          variantes={variantes}
          filter2={filter2}
          setFilter2={setFilter2}
          setFilter1={setFilter1}
          filter1={filter1}
        />
      )}

      {isMobile === true && (
        <CategoryFiltersMobile
          produtos={!pages ? produtos.pag.encontrados : pages.encontrados}
          variantes={variantes}
          filter2={filter2}
          setFilter2={setFilter2}
          setFilter1={setFilter1}
          filter1={filter1}
        />
      )}

      <ProductList
        produtos={catProducts}
        setCatProducts={setCatProducts}
        setPerPage={setPerPage}
        perPage={perPage}
        pages={pages}
        isLoading={isLoading}
      />
    </Flex>
  )
}

export default CategoryPage
