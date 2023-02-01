import React from 'react'

import NextLink from 'next/link'

import {
  Box,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link
} from '@chakra-ui/react'

import { BsArrowDown } from 'react-icons/bs'
import { RiAddLine } from 'react-icons/ri'

const Header = () => {
  return (
    <Box>
      <NextLink href="/admin/marcas/adicionar" passHref>
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
