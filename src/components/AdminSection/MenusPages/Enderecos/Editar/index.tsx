import React from 'react'

import { Stack, Flex } from '@chakra-ui/react'

import Header from './Header'
import Form from './Form'

const EnderecosAdd = ({ endereco }) => {
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
        <Form endereco={endereco} />
      </Flex>
    </Stack>
  )
}

export default EnderecosAdd