import React from 'react'

import NextLink from 'next/link'

import { Flex, Stack, Text, Button, Icon } from '@chakra-ui/react'

import { IoMdArrowRoundBack } from 'react-icons/io'

const Header = () => {
  return (
    <Flex direction="column">
      <Stack direction="row" alignItems="center" spacing={5}>
        <NextLink href="/admin/marcas">
          <Button colorScheme="pink">
            <Icon as={IoMdArrowRoundBack} />
            Voltar
          </Button>
        </NextLink>
        <Text>Fornecedor:Adicionar</Text>
      </Stack>
    </Flex>
  )
}

export default Header
