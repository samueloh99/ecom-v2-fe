import React from 'react'

import { Text, Flex, VStack } from '@chakra-ui/react'
import Menu from './Menu'

export const Entrega = () => {
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
          •<strong> QUAL É O PRAZO DE ENTREGA DA CHAE'S?</strong>
          <br />
          O prazo para entrega dos produtos varia de acordo com a região e a
          forma de pagamento escolhida. Caso queira calcular o valor e o prazo
          do frete, informe seu CEP no campo disponível e clique em "SIMULAR
          FRETE".
        </Text>
        <Text>
          •<strong>COMO ACOMPANHO A MINHA ENTREGA?</strong> <br /> Para Após a
          conclusão do seu pedido você receberá um código de rastreio, caso a
          opção seja entrega. Ele só ficará ativo após a baixa dos correios, o
          que pode levar até 1 dia útil. Agora, caso a opção de retirada em loja
          seja feita, o prazo é de até 2 dias úteis para o produto chegar na
          unidade desejada e você ser avisada, via email ou SMS.
        </Text>
        <Text>
          •
          <strong>
            {' '}
            POSSO ALTERAR O ENDEREÇO DA ENTREGA APÓS O FECHAMENTO DO MEU PEDIDO?
          </strong>{' '}
          <br />
          Sim, caso o pedido ainda não tenha sido enviado. Para isso, entre em
          contato com o nosso SAC por{' '}
          <a
            style={{ fontWeight: 'bold' }}
            href="https://api.whatsapp.com/send/?phone=5511911826504&text&type=phone_number&app_absent=0"
            target="_blank"
          >
            Whatsapp (11 91182-6504)
          </a>{' '}
          ou E-mail <strong>(contato@chaes.com.br)</strong> informando a
          solicitação.
        </Text>
      </VStack>
    </Flex>
  )
}

export default Entrega
