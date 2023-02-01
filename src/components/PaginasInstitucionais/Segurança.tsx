import React from 'react'

import { Text, Flex, VStack } from '@chakra-ui/react'
import Menu from './Menu'

export const Seguranca = () => {
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
          •
          <strong>
            MINHA PRIMEIRA VEZ COMPRANDO NA CHAE’S. POSSO CONFIAR?
          </strong>
          <br />
          <strong>Com certeza!</strong> A privacidade e a segurança das clientes
          e dos dados de navegação na plataforma são prioridade para nós. Dados
          bancários nunca são retidos e também nunca solicitaremos acesso a
          Senhas e nenhuma informação privada!
        </Text>
        <Text>
          •<strong>MEUS REGISTROS ESTÃO SEGUROS?</strong> <br /> Quando você faz
          um pedido, nós coletamos os dados necessários para processar e
          completar sua compra e permitir o envio de atualizações, como a
          confirmação de entrega. Sua conta é protegida por senha pessoal que
          pode ser alterada diretamente na página Minha Conta. Fale com nosso
          SAC em caso de qualquer dúvida sobre segurança.
        </Text>
      </VStack>
    </Flex>
  )
}

export default Seguranca
