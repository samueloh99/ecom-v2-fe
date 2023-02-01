import React from 'react'

import { Stack, Flex, Heading, Spinner, Text } from '@chakra-ui/react'

import SkusHeader from './Header'

import TableContent from './TableContent'

const AdminMarcas = () => {
  return (
    <Stack borderRadius={8} bg="gray.800" p="8" w="100%">
      <Flex mb="8" align="center" justifyContent="space-between">
        <Heading size="lg" fontWeight="normal">
          Marcas
        </Heading>
        <SkusHeader />
      </Flex>
      <TableContent />
    </Stack>
  )
}

export default AdminMarcas
