import React, { useState } from 'react'

import {
  DrawerBody,
  FormLabel,
  Text,
  Stack,
  Button,
  Input,
  AccordionPanel,
  Flex,
  Box,
  Icon,
  AccordionItem,
  AccordionButton
} from '@chakra-ui/react'

import { RiNumber1, RiCheckFill } from 'react-icons/ri'

import { api } from '../../../../../services/apiClient'
import { useCheckoutContext } from '../../../../../contexts/CheckoutContext'

const ForgotPasswordContent = ({ setForgotPass, forgotPass }) => {
  const { step } = useCheckoutContext()
  const handleForgot = () => setForgotPass(!forgotPass)

  const [email, setEmail] = useState('')
  const [error, setError] = useState(false)

  const handleForgotPassword = async () => {
    if (!email.includes('@')) {
      setError(true)
    } else {
      setError(false)
      await api.post('/usuarios/senha', { email })
      setForgotPass(false)
    }
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
                as={step !== 0 ? RiCheckFill : RiNumber1}
                bg={step !== 0 ? 'green' : 'black'}
                fontSize={{ base: 25, md: 30 }}
                color="white"
                borderRadius="100%"
                p={2}
                mr={3}
              />
              <Text>IDENTIFICAÇÃO</Text>
            </Box>
          </Flex>
        </AccordionButton>
      </h2>
      <AccordionPanel bg="white" pb={4}>
        <Stack direction="column" alignItems="start" spacing={5}>
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
      </AccordionPanel>
    </AccordionItem>
  )
}

export default ForgotPasswordContent
