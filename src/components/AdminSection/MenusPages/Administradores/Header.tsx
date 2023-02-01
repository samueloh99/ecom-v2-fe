import React from 'react'

import NextLink from 'next/link'

import { Box, Button, Icon } from '@chakra-ui/react'

import { RiAddLine } from 'react-icons/ri'

const Header = () => {
  return (
    <Box>
      <NextLink href="/admin/clientes/adicionar" passHref>
        <Button
          as="a"
          size="sm"
          fontSize="sm"
          colorScheme="pink"
          leftIcon={<Icon as={RiAddLine} />}
          mr="5"
        >
          Adicionar
        </Button>
      </NextLink>
      <Button
        as="a"
        size="sm"
        fontSize="sm"
        colorScheme="pink"
        leftIcon={<Icon as={RiAddLine} />}
        mr="5"
      >
        Exportar
      </Button>
      <Button
        as="a"
        size="sm"
        fontSize="sm"
        colorScheme="pink"
        leftIcon={<Icon as={RiAddLine} />}
      >
        Filtrar por
      </Button>
    </Box>
  )
}

export default Header
