import React, { useState } from 'react'

import {
  DrawerBody,
  FormLabel,
  Text,
  Stack,
  Button,
  Input
} from '@chakra-ui/react'
import { api } from '../../services/apiClient'

const ForgotPasswordContent = ({ setForgotPass, forgotPass }) => {
  const handleForgot = () => setForgotPass(!forgotPass)

  const [email, setEmail] = useState('')
  const [error, setError] = useState(false)

  const handleForgotPassword = async () => {
    if (!email.includes('@')) {
      setError(true)
    } else {
      setError(false)
      await api.post('/usuarios/senha', { email }).then(res => console.log(res))
    }
  }
  return (
    <DrawerBody>
      <Stack mt="10" direction="column" alignItems="start" spacing={5}>
        <Text fontWeight="bold">ALTERE A SUA SENHA</Text>
        <Text fontSize="15px">
          Para receber um e-mail com uma nova senha, insira seu endereço de
          e-mail no campo abaixo:
        </Text>
        <Stack>
          <FormLabel fontSize="14px">Email*</FormLabel>
          {error && (
            <Text color="red" fontSize={12}>
              Email Inválido
            </Text>
          )}
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </Stack>
        <Stack direction="row" w="100%">
          <Button
            w="100%"
            color="black"
            border="1px solid"
            bg="white"
            onClick={handleForgot}
          >
            CANCELAR
          </Button>
          <Button
            onClick={handleForgotPassword}
            w="100%"
            color="white"
            bg="black"
          >
            ENVIAR
          </Button>
        </Stack>
      </Stack>
    </DrawerBody>
  )
}

export default ForgotPasswordContent
