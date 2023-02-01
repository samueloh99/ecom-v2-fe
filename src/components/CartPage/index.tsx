import React from 'react'

import { useRouter } from 'next/router'

import {
  Flex,
  Text,
  VStack,
  Icon,
  Center,
  Divider,
  useBreakpointValue,
  Stack
} from '@chakra-ui/react'

import { BsTruck, BsGift } from 'react-icons/bs'

import { useCartContext } from '../../contexts/CartContext'

import CartPageItem from './CartPageItem'
import CartPageEmpty from './CartPageEmpty'
import AsideSectionCart from './AsideSectionCart'

const CartPage = () => {
  const {
    cart,
    decreaseCart,
    incrementCart,
    deleteItemOnCart,
    totalQtd,
    totalCart,
    setCart
  } = useCartContext()

  const { push } = useRouter()

  const isMobile = useBreakpointValue({
    base: true,
    lg: false
  })

  if (totalQtd() === 0) {
    return <CartPageEmpty />
  }

  return (
    <Flex bg="#F6F5F3" w="100%">
      <Flex
        h="auto"
        direction={{ base: 'column', md: 'row' }}
        maxW={{ base: '100%', lg: '1400px' }}
        w="100%"
        m="50px auto"
      >
        <Flex
          p={{ base: '10px', md: '0px 60px' }}
          w={{ base: '100%', md: '70%' }}
          h="100%"
          direction="column"
        >
          <Flex
            justifyContent="space-between"
            w="100%"
            m="0 auto"
            textTransform="uppercase"
          >
            <Text fontWeight="bold" fontSize="14px">
              MEU CARRINHO ({totalQtd()})
            </Text>
            <Text
              fontSize="14px"
              textDecoration="underline"
              onClick={() => push({ pathname: '/categoria/13' })}
              cursor="pointer"
            >
              Continuar comprando
            </Text>
          </Flex>
          {cart.map((item, index) => {
            return (
              <CartPageItem
                key={index}
                index={index}
                item={item}
                cart={cart}
                setCart={setCart}
                deleteItemOnCart={deleteItemOnCart}
                incrementCart={incrementCart}
                decreaseCart={decreaseCart}
                totalCart={totalCart}
                totalQtd={totalQtd}
              />
            )
          })}
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            bg="white"
            borderRadius="5px"
            w="100%"
            p="10px"
            justify="center"
          >
            <Stack
              direction={{ base: 'column', lg: 'row' }}
              w={{ base: '100%', lg: '40%' }}
              spacing={5}
              align={{ base: 'start', lg: 'center' }}
            >
              <Icon as={BsTruck} fontSize={50} />
              <Flex direction="column" h="100%" justify="center">
                <Text fontSize="16px" fontWeight="bold">
                  FRETE GRÁTIS
                </Text>
                <Text fontSize="14px">
                  Para todo o Brasil nas compras acima de R$499,90
                </Text>
              </Flex>
            </Stack>
            <Center
              height="100%"
              my={{ base: '10px', lg: '0px' }}
              w={{ base: '100%', lg: '10%' }}
            >
              <Divider
                orientation={isMobile ? 'horizontal' : 'vertical'}
                h="80%"
              />
            </Center>
            <Stack
              direction={{ base: 'column', lg: 'row' }}
              w={{ base: '100%', lg: '40%' }}
              spacing={5}
              align={{ base: 'start', lg: 'center' }}
            >
              <Icon as={BsGift} fontSize={50} />
              <Flex direction="column" h="100%" justify="center">
                <Text fontSize="16px" fontWeight="bold">
                  PRIMEIRA COMPRA ?
                </Text>
                <Text fontSize="14px">
                  Utilize o cupom <strong>bemvinda10</strong>
                </Text>
                <Text fontSize="14px">
                  e ganhe 10% de desconto na sua primeira compra.
                </Text>
              </Flex>
            </Stack>
          </Flex>
          <VStack w="90%" my="10px" align="start">
            <Text fontSize="10px" color="gray.300">
              *O carrinho de compras armazena temporariamente uma lista dos
              produtos e não garante a disponibilidade em estoque no momento da
              compra. O preço e a disponibilidade dos produtos estão sujeitos a
              alterações.
            </Text>
            <Text fontSize="10px" color="gray.300">
              *Pedidos aprovados até 13h (horário de Brasília), serão enviados
              no mesmo dia.
            </Text>
          </VStack>
        </Flex>
        <AsideSectionCart />
      </Flex>
    </Flex>
  )
}

export default CartPage
