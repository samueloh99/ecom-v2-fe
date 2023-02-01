import React, { useRef } from 'react'

import { Box, Button, Icon, useDisclosure } from '@chakra-ui/react'

import { RiAddLine } from 'react-icons/ri'

import AddressFilter from '../../FilterDrawer/AddressFilter'

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  return (
    <Box>
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
      <AddressFilter isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
    </Box>
  )
}

export default Header
