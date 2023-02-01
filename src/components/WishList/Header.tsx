import React from 'react'

import {
  Flex,
  Text,
  Icon,
  Button,
  Box,
  useBreakpointValue
} from '@chakra-ui/react'

import { FiShare } from 'react-icons/fi'

interface IProps {
  productsQty: number
}

const Header = ({ productsQty }: IProps) => {
  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })

  return (
    <Flex
      w="100%"
      py="20px"
      justifyContent="center"
      align="center"
      direction="column"
    >
      <Text fontWeight="bold" fontSize={{ base: '20px', lg: '25px' }}>
        MEUS DESEJOS
      </Text>
      <Text fontSize={{ base: '12px', lg: '14px' }}>
        Os produtos que você mais quer
      </Text>
    </Flex>
  )
}

export default Header
