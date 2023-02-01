import React from 'react'

import { Flex, Text } from '@chakra-ui/react'

import { useCheckoutContext } from '../../../contexts/CheckoutContext'

const CartaoPurchase = () => {
  const { checkoutPedido } = useCheckoutContext()

  return (
    <Flex
      mt="10px"
      w="100%"
      p="20px 10px 20px 10px"
      direction="column"
      border="1px solid #ccc"
      alignItems="center"
      borderRadius={5}
    >
      <Text fontWeight="bold">
        Valor total: R${checkoutPedido.pedido_geral}
      </Text>
      <Text>
        Pedido criado:{' '}
        {new Date(checkoutPedido.created_at).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        })}
      </Text>
    </Flex>
  )
}

export default CartaoPurchase
