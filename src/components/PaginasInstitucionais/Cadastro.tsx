import React from 'react'

import NextLink from 'next/link'

import { Text, Flex, VStack } from '@chakra-ui/react'
import Menu from './Menu'

export const Cadastro = () => {
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
          •<strong> COMO CRIAR UMA CONTA NO SITE? </strong>
          <br />
          Para se cadastrar em nosso site basta clicar
          <strong style={{ textDecoration: 'underline' }}>
            <NextLink href={'/cadastro'}> AQUI. </NextLink>
          </strong>
          Preencha todos os campos com as suas informações e seu cadastro está
          pronto!
        </Text>
        <Text>
          •<strong> COMO RECUPERAR OU ALTERAR A MINHA SENHA DE ACESSO?</strong>{' '}
          <br /> Para recuperar a sua senha clique no canto superior esquerdo no
          icone da pessoa, logo sem seguida clique em "Esqueceu a sua senha"?".
          Preencha o campo com o seu e-mail de cadastro. Logo em seguida vai
          receber um e-mail com acesso para alterar a sua senha. Caso tenha
          esquecido o seu e-mail de cadastro, entre em contato com nosso
          atendimento em <strong>contato@chaes.com.br</strong> que resolvemos o
          seu problema!
        </Text>
        <Text>
          •<strong> COMO ALTERAR O ENDEREÇO DE ENTREGA?</strong> <br />
          Clique
          <strong style={{ textDecoration: 'underline' }}>
            <NextLink href={'/userinfo/enderecos'}> AQUI. </NextLink>
          </strong>
          e altere os dados de entrega conforme desejar. Se já possui um
          cadastro, insira o seu e-mail e senha de acesso. Caso seja sua
          primeira visita, faça seu cadastro em nosso site, é rapidinho!
        </Text>
      </VStack>
    </Flex>
  )
}

export default Cadastro
