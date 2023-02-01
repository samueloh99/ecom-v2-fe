import React, { useState } from 'react'

import { useRouter } from 'next/router'

import { Flex, Input, VStack, Text, Button, useToast } from '@chakra-ui/react'

import BaseTemplate from '../Base'
import { api } from '../../services/apiClient'

const ResetPasswordTemplate = () => {
  const toast = useToast()

  const router = useRouter()

  const [fields, setFields] = useState({
    senha: '',
    confirmar: '',
    error: false
  })

  const handleRedefinirSenha = async () => {
    if (
      fields.confirmar !== fields.senha ||
      fields.confirmar === '' ||
      fields.senha === ''
    ) {
      setFields({
        ...fields,
        error: true
      })
    } else {
      setFields({
        ...fields,
        error: false
      })

      console.log(router.query['token'])

      await api
        .post('/usuarios/senha/redefinir', {
          senha: fields.senha,
          senha_confirmation: fields.confirmar,
          token: router.query['token']
        })
        .then(() => {
          router.push('/login')
          toast({
            title: 'Senha redefinida.',
            description: 'Sua senha foi redefinida.',
            status: 'success',
            duration: 3000,
            isClosable: true
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
  return (
    <BaseTemplate>
      <Flex
        p="30px 10px"
        maxW="100%"
        h={{ base: '100vh', md: '70vh' }}
        justifyContent="center"
        alignItems="center"
        direction="column"
        m="auto"
      >
        <VStack h="100%" justifyContent="center">
          <Flex w="auto" direction="column" alignItems="start">
            <Text>Senha</Text>
            <Input
              value={fields.senha}
              w="300px"
              onChange={e => setFields({ ...fields, senha: e.target.value })}
            />
          </Flex>
          <Flex w="auto" direction="column" alignItems="start">
            <Text>Confirmar Senha</Text>
            <Input
              w="300px"
              value={fields.confirmar}
              onChange={e =>
                setFields({ ...fields, confirmar: e.target.value })
              }
            />
          </Flex>
          {fields.error && (
            <Text color="red" fontSize={12}>
              Campos inválidos.
            </Text>
          )}
          <Button
            color="white"
            bg="black"
            w="100%"
            onClick={handleRedefinirSenha}
          >
            REDEFINIR SENHA
          </Button>
        </VStack>
      </Flex>
    </BaseTemplate>
  )
}

export default ResetPasswordTemplate
