import React, { useRef } from 'react'

import { AccordionPanel, Flex, Text } from '@chakra-ui/react'

import { useCheckoutContext } from '../../../../../contexts/CheckoutContext'

const Pix = () => {
  const btnRef = useRef()

  const { setCheckoutPagamento, setStep } = useCheckoutContext()

  const handleNextStep = () => {
    setCheckoutPagamento({
      pagamento_nome: 'pagarme_pix',
      pagamento_titulo: 'Pix',
      pagamento_valor: '0.0',
      pagamento_link: '',
      desconto_id: null,
      parcela_numero: 0.0,
      parcela_valor: 0.0,
      parcela_desconto: 0.0,
      cartao_nsu: '583219292',
      cartao_bandeira: 'pix',
      afiliado_usuario_id: '0',
      card_id_pagarme: '',
      card_cv: ''
    })

    setStep(3)
  }

  return (
    <AccordionPanel bg="white" pb={4} px={10}>
      <Flex
        p="10px"
        borderRadius="5px"
        bg="black"
        w="300px"
        direction="column"
        color="white"
        cursor="pointer"
        onClick={() => handleNextStep()}
      >
        <Text fontWeight="bold">PIX</Text>
        <Text fontSize="12px">
          Ganhe desconto de até
          <strong> 5% OFF.</strong>
        </Text>
      </Flex>
    </AccordionPanel>
  )
}

export default Pix
