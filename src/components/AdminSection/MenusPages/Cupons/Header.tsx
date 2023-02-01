import React from 'react'

import NextLink from 'next/link'

import { Box, Button, Icon } from '@chakra-ui/react'

import { RiAddLine } from 'react-icons/ri'

const Header = () => {
  return (
    <Box>
      <NextLink href="/admin/descontos/adicionar" passHref>
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
    </Box>
  )
}

export default Header
