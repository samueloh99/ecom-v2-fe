import React from 'react'

import { Box, Button, Icon } from '@chakra-ui/react'

import { RiAddLine } from 'react-icons/ri'

const Header = () => {
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
    </Box>
  )
}

export default Header
