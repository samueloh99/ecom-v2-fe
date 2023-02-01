import React from 'react'

import { Text, Flex, VStack } from '@chakra-ui/react'
import Menu from './Menu'

export const CompraPagamento = () => {
  return (
    <Flex
      h="100%"
      direction="column"
      p="10px 0px"
      justify="start"
      align="center"
      w="100%"
      mb="300px"
    >
      <Menu />
      <VStack align="start" spacing="20px" mt="50px" direction="column" w="70%">
        <Text>
          •<strong> QUAIS AS FORMAS DE PAGAMENTO ACEITAS? </strong> <br />{' '}
          Aceitamos pagamentos no Cartão de Crédito em até 6x Sem Juros, Boleto
          e PIX.
        </Text>
        <Text>
          •<strong> QUANTO TEMPO LEVA PARA O PAGAMENTO SER COMPENSADO?</strong>{' '}
          <br /> Transações no cartão de crédito são compensadas em poucos
          minutos. Para boletos, a confirmação do pagamento é feita
          automaticamente pelos bancos em até 3 dias úteis. Caso não consiga
          efetuar o pagamento do boleto no prazo, o seu pedido será
          automaticamente cancelado e as peças voltarão ao estoque. Mas fique
          atenta! O processo de aprovação do cartão de crédito leva em conta o
          valor total da compra e não somente o valor da parcela. Esse valor
          deve estar dentro do limite disponível do seu cartão de crédito.
        </Text>
        <Text>
          •<strong> COMO UTILIZO MEUS CRÉDITOS NO SITE?</strong> <br />
          Para utilizar seu crédito disponível em conta, basta, ao finalizar a
          compra, selecionar seus créditos como forma de pagamento. Caso haja
          diferença de valores, o pagamento poderá ser realizado através de
          boleto bancário ou cartão de crédito. Se ainda ficarem créditos
          disponíveis, os mesmos poderão ser utilizados em outra compra, não
          tendo data de validade. 
        </Text>
        <Text>
          •<strong> COMO UTILIZO MEU CUPOM DE DESCONTO?</strong> <br />
          Os cupons de desconto deverão ser aplicados no carrinho de compras.
          Antes de finalizar a compra, digite o código do seu cupom no campo
          "CUPOM DE DESCONTO", e em seguida, "APLICAR".
        </Text>
      </VStack>
    </Flex>
  )
}

export default CompraPagamento
