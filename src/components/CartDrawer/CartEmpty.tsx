import React from 'react'

import NextLink from 'next/link'

import { Stack, Text, Icon, Button, DrawerBody } from '@chakra-ui/react'

import { BsBagDashFill } from 'react-icons/bs'

const CartEmpty = () => {
  return (
    <DrawerBody overflow="hidden">
      <Stack flexDirection="column" mt="10" align="center" spacing="10">
        <Icon as={BsBagDashFill} />
        <Text>O seu carrinho esta vazio</Text>
        <NextLink href="/category">
          <Button color="black">Comprar mais</Button>
        </NextLink>
      </Stack>
    </DrawerBody>
  )
}

export default CartEmpty
