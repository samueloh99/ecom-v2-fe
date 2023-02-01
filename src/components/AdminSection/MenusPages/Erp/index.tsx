import React from 'react'

import { Stack, Flex, Heading } from '@chakra-ui/react'

import TableContent from './TableContent'

const AdminERP = () => {
  return (
    <Stack borderRadius={8} bg="gray.800" p="8" w="100%">
      <Flex mb="8" align="center" justifyContent="space-between">
        <Heading size="lg" fontWeight="normal">
          ERPs
        </Heading>
      </Flex>
      <TableContent />
    </Stack>
  )
}

export default AdminERP
