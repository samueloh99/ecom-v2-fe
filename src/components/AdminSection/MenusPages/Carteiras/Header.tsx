import React from 'react'
import { useRouter } from 'next/router'

import { Box, Button, Icon } from '@chakra-ui/react'

import { RiAddLine } from 'react-icons/ri'

const Header = () => {
  const router = useRouter()
  return (
    <Box>
      <Button
        as="a"
        size="sm"
        fontSize="sm"
        colorScheme="pink"
        leftIcon={<Icon as={RiAddLine} />}
        onClick={() => router.push('/admin/carteiras/adicionar')}
        mr="5"
      >
        Adicionar
      </Button>
    </Box>
  )
}

export default Header
