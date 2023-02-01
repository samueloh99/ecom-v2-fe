import React, { useState } from 'react'

import { useRouter } from 'next/router'

import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  VStack
} from '@chakra-ui/react'

import { useForm } from 'react-hook-form'

import { RiNumber1, RiCheckFill } from 'react-icons/ri'

import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

import { useCheckoutContext } from '../../../../../contexts/CheckoutContext'

import ForgotPasswordContent from './ForgotPasswordContent'
import { useAuthContext } from '../../../../../contexts/AuthContext'
import { api } from '../../../../../services/apiClient'

type ResponseSignIn = {
  admin: number
  ativo: number
  celular: string
  cnpj: string
  cpf: string
  created_at: string
  updated_at: string
  data_acesso: string
  email: string
  estrangeiro: number
  genero: string
  id: number
  ie: string
  im: string
  nascimento: string
  newsletter: number
  nome_completo: string
  permissoes: []
  roles: []
  telefone: string
  total_pedidos: number
}

const LoginContent = ({ setLoginUser }) => {
  const toast = useToast()
  const { push } = useRouter()
  const { step, setStep, setCheckoutUsuario } = useCheckoutContext()

  const { signInCheckout, userData } = useAuthContext()

  const [show, setShow] = useState(false)
  const [forgotPass, setForgotPass] = useState(false)

  const [invalid, setInvalid] = useState(false)

  const handleClick = () => setShow(!show)
  const handleForgot = () => setForgotPass(!forgotPass)

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm()

  const onSubmit = async values => {
    const response = await signInCheckout(values)

    if (typeof response !== 'number') {
      const newClientePagarme = {
        nome: response.nome_completo,
        email: response.email,
        celular: response.celular
          .replaceAll('(', '')
          .replaceAll(')', '')
          .replaceAll('-', '')
          .replaceAll(' ', ''),
        codigo_cliente: response.id,
        documento: response.cpf.replaceAll('.', '').replace('-', ''),
        genero: response.genero,
        nascimento: response.nascimento,
        telefone: response.telefone
          .replaceAll('(', '')
          .replaceAll(')', '')
          .replaceAll('-', '')
          .replaceAll(' ', '')
      }

      const createNewUserPagarme = await api.post(
        '/checkout/users_pagarme',
        newClientePagarme
      )

      if (createNewUserPagarme.data.errors) {
        return toast({
          title: 'Erro.',
          description: createNewUserPagarme.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
      }

      push('/checkout/endereco', undefined, { shallow: true })
      setStep(1)

      setLoginUser(false)

      return setCheckoutUsuario({
        pagarmeRes: createNewUserPagarme.data,
        usuarioRes: response
      })
    }

    if (response === -1) {
      setInvalid(true)
    } else {
      setInvalid(false)
    }
  }

  if (forgotPass) {
    return (
      <ForgotPasswordContent
        forgotPass={forgotPass}
        setForgotPass={setForgotPass}
      />
    )
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
        <Text fontWeight="bold" mb="5">
          Seu CPF já tem cadastro, por favor faça o Login.
        </Text>

        <VStack
          as="form"
          align="start"
          w="100%"
          onSubmit={handleSubmit(onSubmit)}
          mt="5"
        >
          <HStack w="100%">
            <VStack align="start" w="50%">
              <FormLabel fontSize="14px">Login*</FormLabel>
              <FormControl isInvalid={!!errors.email}>
                <Input
                  id="email"
                  _focus={{ boxShadow: 'none' }}
                  borderColor={invalid === true ? 'red' : 'inherit'}
                  {...register('email', {
                    required: 'Digite seu email',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: 'Digite um email valido'
                    }
                  })}
                />
                <FormErrorMessage>
                  {errors.email && 'Digite um email válido.'}
                </FormErrorMessage>
              </FormControl>
            </VStack>

            <VStack align="start" w="50%">
              <FormLabel fontSize="14px">Senha*</FormLabel>
              <InputGroup size="md">
                <FormControl isInvalid={!!errors.senha}>
                  <Input
                    id="password"
                    _focus={{ boxShadow: 'none' }}
                    borderColor={invalid === true ? 'red' : 'inherit'}
                    {...register('senha', {
                      required: 'Digite sua senha'
                    })}
                    type={show ? 'text' : 'password'}
                  />
                  <FormErrorMessage>
                    {errors.senha && 'Campo Obrigatório'}
                  </FormErrorMessage>
                </FormControl>
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={handleClick}
                    _focus={{ boxShadow: 'none' }}
                  >
                    {show ? (
                      <Icon fontSize={18} as={AiOutlineEye} />
                    ) : (
                      <Icon fontSize={18} as={AiOutlineEyeInvisible} />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </VStack>
          </HStack>
          {invalid && (
            <Flex m="10px 0px">
              <Text fontSize="14px" color="red">
                Login ou Senha Inválidos.
              </Text>
            </Flex>
          )}

          <VStack w="100%" align="start">
            <Button
              bg="transparent"
              p="0"
              _hover={{ bg: 'transparent', textDecoration: 'underline' }}
              onClick={handleForgot}
            >
              Esqueceu a sua senha ?
            </Button>
            <Button
              type="submit"
              w="100%"
              color="white"
              bg="black"
              isLoading={isSubmitting}
            >
              ENTRAR
            </Button>
          </VStack>
        </VStack>
      </AccordionPanel>
    </AccordionItem>
  )
}

export default LoginContent
