import React, { useRef } from 'react'

import { AccordionPanel, Flex, Text } from '@chakra-ui/react'

import { useCheckoutContext } from '../../../../../contexts/CheckoutContext'

const Boleto = () => {
  const btnRef = useRef()

  const { setCheckoutPagamento, setStep } = useCheckoutContext()

  const handleNextStep = () => {
    setCheckoutPagamento({
      pagamento_nome: 'pagarme_boleto',
      pagamento_titulo: 'Boleto Bancário',
      pagamento_valor: '0.00',
      pagamento_link: '',
      desconto_id: null,
      parcela_numero: 0.0,
      parcela_valor: 0.0,
      parcela_desconto: 0.0,
      cartao_nsu: '572478496',
      cartao_bandeira: 'boleto',
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
        <Text fontWeight="bold">Boleto</Text>
        <Text fontSize="12px">Até 7 dias úteis para constar o pagamento.</Text>
      </Flex>
    </AccordionPanel>
  )
}

export default Boleto
