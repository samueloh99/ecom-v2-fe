import React from 'react'

import { useRouter } from 'next/router'

import {
  Flex,
  Drawer,
  DrawerOverlay,
  Text,
  Icon,
  Box,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  Divider
} from '@chakra-ui/react'

import { MdOutlineShoppingBag } from 'react-icons/md'

import CartWithItem from './CartWithItem'
import CartEmpty from './CartEmpty'

import { useCartContext } from '../../contexts/CartContext'
import { useCartDrawer } from '../../contexts/CartDrawerContext'

const CartDrawer = () => {
  const { push } = useRouter()
  const { isOpen, onOpen, onClose } = useCartDrawer()

  const { cart, totalQtd } = useCartContext()

  return (
    <Flex position="relative">
      <Icon
        as={MdOutlineShoppingBag}
        fontSize={25}
        onClick={onOpen}
        cursor="pointer"
      />
      <Box
        display="flex"
        bg="black"
        w="14px"
        h="14px"
        color="white"
        borderRadius="100%"
        alignItems="center"
        justifyContent="center"
        position="absolute"
        left="5"
        bottom="3"
      >
        <Text fontSize="10px">{totalQtd()}</Text>
      </Box>
      <Drawer size="sm" isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent overflow="hidden">
          <DrawerCloseButton />
          <DrawerHeader
            cursor="pointer"
            onClick={() => push({ pathname: '/carrinho' })}
          >
            Carrinho ({totalQtd()})
          </DrawerHeader>
          <Divider />

          {cart.length === 0 ? <CartEmpty /> : <CartWithItem />}
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}

export default CartDrawer
