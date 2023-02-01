import React, { useEffect, useState } from 'react'

import { Text, Flex, VStack, Checkbox } from '@chakra-ui/react'

import { useCheckoutContext } from '../../../../../contexts/CheckoutContext'

type ICarteiraDTO = {
  valorCarteira: {
    usuario_id: number
    total: number
  }
}

const Carteira = ({ valorCarteira }: ICarteiraDTO) => {
  const { setUseWalletValue } = useCheckoutContext()

  const [useValue, setUseValue] = useState(false)

  useEffect(() => {
    if (useValue) {
      setUseWalletValue(valorCarteira.total)
    } else {
      setUseWalletValue(0)
    }
  }, [useValue])

  return (
    <Flex bg="white" pb={4} px={10} direction="column">
      <Text fontWeight="bold">Você tem dinheiro na sua conta.</Text>
      <VStack align="start">
        <Text>
          Disponível <strong>R${valorCarteira.total} </strong>
          de saldo.
        </Text>
        <Checkbox
          isChecked={useValue}
          onChange={e => setUseValue(e.target.checked)}
        >
          Utilizar o saldo para essa compra.
        </Checkbox>
      </VStack>
    </Flex>
  )
}

export default Carteira
