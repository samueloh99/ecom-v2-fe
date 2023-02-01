import React from 'react'

import NextLink from 'next/link'

import { Text, Stack, Icon, Button, Flex } from '@chakra-ui/react'

import { IoMdArrowRoundBack } from 'react-icons/io'

import TableContent from './TableContent'

const SkuEditar = () => {
  return (
    <Flex
      flex="1"
      borderRadius={8}
      bg="gray.800"
      p="8"
      direction="column"
      w="1000px"
    >
      <Stack direction="row" alignItems="center" marginBottom={10}>
        <NextLink href="/admin/skus">
          <Button colorScheme="pink">
            <Icon as={IoMdArrowRoundBack} />
            Voltar
          </Button>
        </NextLink>
        <Text fontWeight="bold">Produto: Editar</Text>
      </Stack>
      <TableContent />
    </Flex>
  )
}

export default SkuEditar
