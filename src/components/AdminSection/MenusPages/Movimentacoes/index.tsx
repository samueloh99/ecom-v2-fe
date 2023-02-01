import React from 'react'

import { Stack, Flex, Heading } from '@chakra-ui/react'

import SkusHeader from './Header'

import TableContent from './TableContent'

import AdicaoRapida from './AdicaoRapida'

const AdminMovimentacoes = () => {
  return (
    <Stack borderRadius={8} bg="gray.800" p="8" w="100%">
      <Flex mb="8" align="center" justifyContent="space-between">
        <Heading size="lg" fontWeight="normal">
          Movimentações
        </Heading>
        <SkusHeader />
      </Flex>
      <AdicaoRapida />
      <TableContent />
    </Stack>
  )
}

export default AdminMovimentacoes
