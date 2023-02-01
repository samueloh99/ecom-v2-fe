import React from 'react'

import { Flex, Divider, Img, Stack, Text, Box } from '@chakra-ui/react'

import { useCartContext } from '../../../contexts/CartContext'
import CheckoutConfirmation from '../CheckoutConfirmation'

const MyCart = () => {
  const { cart } = useCartContext()

  return (
    <Flex
      w="100%"
      mx={{ base: 0, md: 0 }}
      p={{ base: 5, md: 5 }}
      mb={10}
      flexDirection="column"
      bg="white"
    >
      <Stack>
        <Text>Meu Carrinho</Text>
      </Stack>

      {cart.map((item, index) => {
        const {
          foto,
          nome,
          variante1,
          variante2,
          quantidade,
          preco,
          sku_referencia
        } = item

        return (
          <Stack key={index} flexDirection="column" mt="5" align="center">
            <Box
              position="relative"
              display="flex"
              flexDirection="row"
              w="100%"
            >
              <Img w="150px" src={foto} />
              <Stack m="0px 10px" justifyContent="space-between">
                <Text>{nome}</Text>
                <Text fontSize="12px">
                  Ref:<strong> {sku_referencia}</strong>
                </Text>
                <Text fontSize="12px">
                  Cor:<strong> {variante1}</strong>
                </Text>
                <Text fontSize="12px">
                  Tam:<strong> {variante2}</strong>
                </Text>
                <Text fontSize="12px">
                  Quantidade:<strong> {quantidade}</strong>
                </Text>
                <Text fontSize="12px">
                  Preco:
                  <strong> R${preco.toFixed(2).replaceAll(',', '.')}</strong>
                </Text>
              </Stack>
            </Box>
          </Stack>
        )
      })}
      <Divider mt={20} />
      <CheckoutConfirmation isCart={true} />
    </Flex>
  )
}

export default MyCart
