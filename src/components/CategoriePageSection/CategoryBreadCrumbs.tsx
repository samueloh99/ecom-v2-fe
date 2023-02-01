import React, { useEffect, useState } from 'react'

import Head from 'next/head'

import { useRouter } from 'next/router'

import { HStack, Spinner, Text, VStack } from '@chakra-ui/react'

import Breadcrumbs from '../Breadcrumbs'

import { useCategorias } from '../../services/hooks/useCategorias'

const CategoryBreadCrumbs = ({ isLoading }) => {
  const { query, asPath } = useRouter()

  const { data: dataCategorias } = useCategorias()

  const [breadcrumbsList, setBreadcrumbsList] = useState<string[]>()

  const queryCategoryId = parseInt(query['pid'] as string)

  useEffect(() => {
    if (dataCategorias) {
      const breadcrumbsList = []
      const findCategoryBreadcrumb = (data, idx) => {
        const category = data.find(item => item.id === idx)

        if (category.pai_id === 0) {
          return breadcrumbsList.push(category.nome)
        }

        breadcrumbsList.push(category.nome)
        findCategoryBreadcrumb(data, category.pai_id)
      }
      findCategoryBreadcrumb(dataCategorias, queryCategoryId)

      setBreadcrumbsList(breadcrumbsList.reverse())
    }
  }, [dataCategorias, asPath])
  return (
    <VStack align="start" mb="20px">
      <Head>
        <title>{breadcrumbsList && breadcrumbsList[0]}</title>
        <meta property="og:title" content="My new title" key="title" />
      </Head>
      {breadcrumbsList && <Breadcrumbs slug={breadcrumbsList} />}
      <HStack align="center">
        <Text textTransform="uppercase">
          {dataCategorias &&
            dataCategorias.find(
              item => item.id === parseInt(query['pid'] as string)
            ).nome}
        </Text>
        {isLoading && <Spinner mt="100px" h="20px" w="20px" />}
      </HStack>
    </VStack>
  )
}

export default CategoryBreadCrumbs
