import React from 'react'

import NextLink from 'next/link'

import { Flex, Img, Text } from '@chakra-ui/react'

const CartPageEmpty = () => {
  return (
    <Flex h="70vh" maxW={{ base: '100%', lg: '1400px' }} w="100%">
      <Flex direction="column" m="0 auto" justify="center" align="center">
        <Img
          w="500px"
          src="https://br.louisvuitton.com/static_lvfront/cart/empty-large.png"
        />
        <Text fontWeight="bold" fontSize={24}>
          SEU CARRINHO ESTÁ VAZIO.
        </Text>
        <Flex cursor="pointer" border="1px solid black" p="10px 40px">
          <NextLink href={'/categoria/2'}>
            <Text>Começe a comprar</Text>
          </NextLink>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default CartPageEmpty
