import React from 'react'

import { Stack, Flex } from '@chakra-ui/react'

import Header from './Header'
import Form from './Form'

const AdminEditar = ({ cliente }) => {
  return (
    <Stack
      direction="column"
      spacing="10"
      width="100%"
      borderRadius={8}
      bg="gray.800"
      p="8"
    >
      <Flex direction="column">
        <Header />
        <Form cliente={cliente} />
      </Flex>
    </Stack>
  )
}

export default AdminEditar
