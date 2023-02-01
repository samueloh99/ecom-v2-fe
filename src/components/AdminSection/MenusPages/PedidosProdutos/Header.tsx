import React from 'react'

import { Box, Button, Icon, useDisclosure } from '@chakra-ui/react'

import { RiAddLine } from 'react-icons/ri'

import ProductOrderFilter from '../../FilterDrawer/ProductOrderFilter'

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
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
      <ProductOrderFilter isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
    </Box>
  )
}

export default Header
