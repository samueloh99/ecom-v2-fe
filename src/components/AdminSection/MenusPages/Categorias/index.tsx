import React from 'react'

import { useRouter } from 'next/router'

import { Stack, Flex, Heading } from '@chakra-ui/react'

import Header from './Header'

import { useCategorias } from '../../../../services/hooks/useCategorias'

import TableContent from './TableContent'
import TableContentSubCategories from './TableContentSubCategories'

const AdminCategorias = () => {
  const { data, isSuccess } = useCategorias()

  const router = useRouter()

  const idParent = router.query['parentCategory']

  const nameSubCategory =
    isSuccess && data.find(item => String(item.id) === idParent)

  return (
    <Stack borderRadius={8} bg="gray.800" p="8" w="100%">
      <Flex mb="8" align="center" justifyContent="space-between">
        <Heading size="lg" fontWeight="normal">
          Categorias{' '}
          {nameSubCategory === undefined ? '' : `:${nameSubCategory.nome}`}
        </Heading>
        <Header />
      </Flex>
      {router.query['parentCategory'] !== undefined ? (
        <TableContentSubCategories />
      ) : (
        <TableContent />
      )}
    </Stack>
  )
}

export default AdminCategorias
