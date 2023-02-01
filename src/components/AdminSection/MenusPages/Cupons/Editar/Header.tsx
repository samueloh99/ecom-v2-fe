import React from 'react'

import { useRouter } from 'next/router'

import { Flex, Stack, Text, Button, Icon } from '@chakra-ui/react'

import { IoMdArrowRoundBack } from 'react-icons/io'

const Header = () => {
  const { back } = useRouter()
  return (
    <Flex direction="column">
      <Stack direction="row" alignItems="center" spacing={5}>
        <Button colorScheme="pink" onClick={() => back()}>
          <Icon as={IoMdArrowRoundBack} />
          Voltar
        </Button>
        <Text>Cupons: Editar</Text>
      </Stack>
    </Flex>
  )
}

export default Header
