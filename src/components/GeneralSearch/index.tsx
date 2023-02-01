import React, { useEffect, useState } from 'react'

import Head from 'next/head'

import { useRouter } from 'next/router'

import { Flex, useBreakpointValue } from '@chakra-ui/react'

import ProductList from './GeneralProductList'
import GeneralSearchFilters from './GeneralSearchFilters'
import GeneralSearchFiltersMobile from './GeneralSearchFiltersMobile'

interface response {
  data: {
    produtos: {
      produto_id: number
      sku_id: number
      nome: string
      var1: {
        nome: string
        foto: string
      }[]
      var2: {
        nome: string
        foto: string
      }[]
      preco_original: number
      preco_desconto: number
      total_pedidos: number
      created_at: Date
      updated_at: Date
      foto1: string
      foto2: string
      categoria: string
    }[]
    categorias: string[]
    variacoes1: string[]
    variacoes2: string[]
  }
}

interface FiltersStateDTO {
  mainFilter: string
  variacoes1: {
    name: string
    checked: boolean
  }[]
  variacoes2: {
    name: string
    checked: boolean
  }[]
  categorias: {
    name: string
    checked: boolean
  }[]
}

export default function GeneralSearch({
  data: { produtos, variacoes1, variacoes2, categorias }
}: response) {
  const { query } = useRouter()

  const querySlug = query ? query['b'] : ''

  const queryVar = query['v'] as string

  const queryCat = query['c'] as string

  const [filters, setFilters] = useState<FiltersStateDTO>({
    categorias: [{ checked: false, name: '' }],
    mainFilter: '',
    variacoes1: [{ checked: false, name: '' }],
    variacoes2: [{ checked: false, name: '' }]
  })

  useEffect(() => {
    if (categorias && variacoes1 && variacoes2 && query) {
      const variacoesQuery: string[] =
        queryVar !== undefined ? queryVar.split('.') : ['']

      const categoriasQuery: string[] =
        queryCat !== undefined ? queryCat.split('.') : ['']

      setFilters({
        categorias: categorias.map(item => {
          const queryCat = categoriasQuery.find(cat => cat === item)
          return {
            name: item,
            checked: queryCat ? true : false
          }
        }),
        mainFilter: query['o'] !== undefined ? (query['o'] as string) : '',
        variacoes1: variacoes1.map(item => {
          const queryVar1 = variacoesQuery.find(var1 => var1 === item)
          return {
            name: item,
            checked: queryVar1 ? true : false
          }
        }),
        variacoes2: variacoes2.map(item => {
          const queryVar2 = variacoesQuery.find(var1 => var1 === item)
          return {
            name: item,
            checked: queryVar2 ? true : false
          }
        })
      })
    }
  }, [categorias, variacoes1, variacoes2, query])

  const isMobile = useBreakpointValue({
    base: true,
    md: false
  })

  return (
    <Flex p="20px" direction="column">
      <Head>
        <title>{querySlug}</title>
        <meta property="og:title" content="My new title" key="title" />
      </Head>

      {isMobile === false && (
        <GeneralSearchFilters
          produtos={produtos}
          filters={filters}
          setFilters={setFilters}
        />
      )}

      {isMobile === true && (
        <GeneralSearchFiltersMobile
          produtos={produtos}
          filters={filters}
          setFilters={setFilters}
        />
      )}

      <ProductList produtos={produtos} />
    </Flex>
  )
}
