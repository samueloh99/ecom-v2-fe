import React from 'react'

import { Accordion, Flex } from '@chakra-ui/react'

import MetodoPagamento from './AccordionCheckout/Pagamentos'
import MyCart from './MyCart'
import Identificacao from '../CheckoutContent/AccordionCheckout/Identificacao'
import InfoEntrega from './AccordionCheckout/Endereco'

import { useCheckoutContext } from '../../../contexts/CheckoutContext'
import CheckoutConfirmation from '../CheckoutConfirmation'

const CheckoutContent = () => {
  const { step } = useCheckoutContext()

  return (
    <Flex
      p={{ base: '20px 10px', md: '0px 120px' }}
      mt="10"
      w="100%"
      bg="#f6f5f3"
      flexDirection={{ base: 'column', md: 'row' }}
    >
      <Accordion index={step} w={{ base: '100%', md: '70%' }}>
        <Identificacao />

        <InfoEntrega />

        <MetodoPagamento />
        <CheckoutConfirmation isCart={false} />
      </Accordion>
      <Flex
        flexDirection="column"
        p={{ base: '0', md: '0px 0px 0px 10px' }}
        w={{ base: '100%', md: '40%' }}
      >
        <MyCart />
      </Flex>
    </Flex>
  )
}

export default CheckoutContent
