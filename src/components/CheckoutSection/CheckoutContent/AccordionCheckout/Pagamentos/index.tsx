import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import {
  AccordionItem,
  AccordionButton,
  Icon,
  Text,
  Box,
  Flex,
  VStack,
  AccordionPanel
} from '@chakra-ui/react'

import { RiNumber3, RiCheckFill } from 'react-icons/ri'

import Credito from './Credito'
import Pix from './Pix'
import Boleto from './Boleto'
import Carteira from './Carteira'

import { useCheckoutContext } from '../../../../../contexts/CheckoutContext'
import { useAuthContext } from '../../../../../contexts/AuthContext'
import { useCarteirasTotalPerUser } from '../../../../../services/hooks/useCarteiras'

const MetodoPagamento = () => {
  const { push } = useRouter()
  const { step, setStep, checkoutPagamento, checkoutEntrega } =
    useCheckoutContext()
  const { userData } = useAuthContext()

  const { data } = useCarteirasTotalPerUser(userData ? userData.id : 0)

  const [valorCarteira, setValorCarteira] = useState({
    usuario_id: 0,
    total: 0
  })

  useEffect(() => {
    setValorCarteira({
      ...valorCarteira,
      total: 0
    })
    if (userData) {
      setValorCarteira(data)
    }
  }, [userData, step])

  const handleClickEditar = () => {
    push('/checkout/indentificacao', undefined, { shallow: true })
    setStep(2)
  }

  return (
    <AccordionItem mb="10" border="none">
      <h2>
        <AccordionButton
          bg="white"
          p={10}
          _focus={{ border: 'none' }}
          _hover={{ bg: 'white' }}
          flexDirection="column"
          alignItems="start"
        >
          <Flex direction="row" w="100%" justifyContent="space-between">
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              textAlign="left"
              fontWeight="bold"
              fontSize={{ base: '17px', md: '20px' }}
              letterSpacing={{ base: '1px', md: '5px' }}
            >
              <Icon
                as={step > 2 ? RiCheckFill : RiNumber3}
                bg={step > 2 ? 'green' : 'black'}
                fontSize={{ base: 25, md: 30 }}
                color="white"
                borderRadius="100%"
                p={2}
                mr={3}
              />

              <Text>MÉTODOS DE PAGAMENTO</Text>
            </Box>

            {step > 2 && (
              <Box
                textDecoration="underline"
                onClick={() => handleClickEditar()}
              >
                editar
              </Box>
            )}
          </Flex>
          {step > 0 && checkoutPagamento && (
            <VStack mt="50px" align="start" spacing={5} fontSize={13}>
              <Text>
                <strong>Forma de Pagamento: </strong>
                {checkoutPagamento.pagamento_titulo}
              </Text>
            </VStack>
          )}
        </AccordionButton>
      </h2>
      <AccordionPanel bg="white" pb={4} px={10}>
        <Text>Selecione uma forma de pagamento para finalizar seu pedido:</Text>
      </AccordionPanel>
      {valorCarteira && valorCarteira.total !== 0 && step === 2 && (
        <Carteira valorCarteira={valorCarteira} />
      )}
      <Credito />
      <Boleto />
      <Pix />
    </AccordionItem>
  )
}

export default MetodoPagamento
