import React from 'react'

import NextLink from 'next/link'

import { Flex, Text, Stack, Icon, HStack } from '@chakra-ui/react'

import PixPurchase from './PixPurchase'
import CartaoPurchase from './CartaoPurchase'
import BoletoPurchase from './BoletoPurchase'

import { useCheckoutContext } from '../../../contexts/CheckoutContext'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { AiOutlineUser } from 'react-icons/ai'

const CheckoutAfterPurchase = () => {
  const { checkoutPedido } = useCheckoutContext()

  return (
    <Flex
      bg="white"
      direction="column"
      w={{ base: '100%', md: '60%' }}
      p="10px 20px 10px 20px"
      alignItems="center"
    >
      <Flex direction="column">
        <Text fontWeight="bold" fontSize="27px">
          Registramos o seu pedido
        </Text>
        <HStack alignItems="center">
          <Text>Número:</Text>
          <Text fontWeight="bold" fontSize="24px">
            {checkoutPedido.id}
          </Text>
        </HStack>
      </Flex>

      <Flex
        mt="10px"
        p="20px 10px 20px 10px"
        direction="column"
        border="1px solid #ccc"
        borderRadius={5}
      >
        <Text>
          Em breve você receberá um e-mail com todas as informação da sua
          compra.
        </Text>
        <Text>
          Caso não receba em alguns minutos, verifique na sua caixa de SPAM e
          salve o email: contato@chaes.com.br em seus contatos para manter uma
          comunicação sempre ativa.
        </Text>
      </Flex>

      {checkoutPedido && checkoutPedido.pagamento_titulo === 'Pix' && (
        <PixPurchase />
      )}
      {checkoutPedido &&
        checkoutPedido.pagamento_titulo === 'Boleto Bancário' && (
          <BoletoPurchase />
        )}
      {checkoutPedido &&
        checkoutPedido.pagamento_titulo === 'Cartão de Crédito' && (
          <CartaoPurchase />
        )}

      <Stack mt="10px" direction="column">
        <HStack alignItems="center">
          <Icon as={AiOutlineShoppingCart} fontSize={40} cursor="pointer" />
          <Flex direction="column">
            <Text fontSize={14} fontWeight="bold">
              Como acompanhar meu pedido ?
            </Text>
            <Text fontSize={14}>
              A qualquer momento você poderá acompanhar o seu pedido clicando na
              opção:
              <strong>
                <NextLink href={'/userinfo/pedidos'}> Meus Pedidos</NextLink>
              </strong>
            </Text>
          </Flex>
        </HStack>

        <HStack alignItems="center">
          <Icon as={AiOutlineUser} fontSize={40} cursor="pointer" />
          <Flex direction="column">
            <Text fontSize={14} fontWeight="bold">
              Como acessar a minha conta ?
            </Text>
            <Text fontSize={14}>
              Após sua primeira compra, os dados de acesso serão encaminhados
              para seu email cadastrado. Edite ou vizualize suas informações na
              opção:
              <strong>
                <NextLink href={'/userinfo'}> Minha Conta</NextLink>
              </strong>
            </Text>
          </Flex>
        </HStack>
      </Stack>

      <Flex
        mt="50px"
        p="20px 10px 20px 10px"
        direction="column"
        alignItems="center"
        border="1px solid #ccc"
        fontWeight="bold"
        w="100%"
        borderRadius={5}
      >
        <NextLink href={'/'}>Continuar comprando</NextLink>
      </Flex>
    </Flex>
  )
}

export default CheckoutAfterPurchase
