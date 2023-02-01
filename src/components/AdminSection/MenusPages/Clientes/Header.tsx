import React, { useRef } from 'react'

import NextLink from 'next/link'

import { Box, Button, Icon, useDisclosure } from '@chakra-ui/react'

import { RiAddLine } from 'react-icons/ri'

import UsersFilter from '../../FilterDrawer/UsersFilter'

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
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
        ref={btnRef}
        as="a"
        size="sm"
        fontSize="sm"
        colorScheme="pink"
        mr="5"
        onClick={onOpen}
      >
        Filtros
      </Button>
      <UsersFilter isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
    </Box>
  )
}

export default Header
