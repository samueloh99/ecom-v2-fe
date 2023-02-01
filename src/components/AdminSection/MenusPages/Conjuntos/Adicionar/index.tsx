import React from 'react'

import { Stack, Flex } from '@chakra-ui/react'

import Header from './Header'
import Form from './Form'

const ConjuntoAdd = () => {
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
        <Form />
      </Flex>
    </Stack>
  )
}

export default ConjuntoAdd
