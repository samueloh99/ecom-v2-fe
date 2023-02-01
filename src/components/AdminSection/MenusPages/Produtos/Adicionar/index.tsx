import React from 'react'

import { Stack } from '@chakra-ui/react'

import Header from './Header'
import Form from './Form'

const ProdutoAdd = () => {
  return (
    <Stack
      direction="column"
      spacing="10"
      width="100%"
      borderRadius={8}
      bg="gray.800"
      p="8"
    >
      <Header>
        <Form />
      </Header>
    </Stack>
  )
}

export default ProdutoAdd
